import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { renderMarkdown } from './render.mjs';

test('Markdown links resolve to published pages or repository source, preserving fragments', () => {
  const routes = new Map([
    ['/repo/mapping/2.5.1.md', '/2.5.1'],
    ['/repo/meta/methodology.md', '/meta/methodology'],
  ]);
  const { content } = renderMarkdown(
    '[article](./2.5.1.md#절차) [method](../meta/methodology.md) [source](../README.md) [external](https://example.org/a.md)',
    '/repo/mapping/MATRIX.md', routes, '/repo',
  );
  assert.match(decodeURI(content), /href="\/2\.5\.1#절차"/);
  assert.match(content, /href="\/meta\/methodology"/);
  assert.match(content, /href="https:\/\/github.com\/yanghoeg\/itgc-to-isms-p\/blob\/main\/README.md"/);
  assert.match(content, /href="https:\/\/example.org\/a.md"/);
});

test('The table of contents targets unique rendered headings and wide tables have their own scroll region', () => {
  const { content, toc } = renderMarkdown(
    '# Title\n\n## 감사 절차\n\n### 점검\n\n## 감사 절차\n\n| A | B |\n|---|---|\n| 1 | 2 |',
    '/repo/example.md', new Map(), '/repo',
  );
  for (const id of ['감사-절차', '점검', '감사-절차-1']) {
    assert.ok(content.includes(`id="${id}"`));
    assert.ok(toc.includes(`href="#${id}"`));
  }
  assert.match(content, /class="table-scroll"[^>]*tabindex="0"[^>]*><table>/);
});

const dist = new URL('./dist/', import.meta.url).pathname;
const pages = readdirSync(dist, { recursive: true }).filter(path => path.endsWith('.html'));

test('Every generated page has its own canonical URL and all local page links resolve', () => {
  assert.ok(pages.length > 14, 'Build the guide before running the publication checks');
  for (const path of pages) {
    const html = readFileSync(join(dist, path), 'utf8');
    assert.doesNotMatch(html, /\{\{[A-Z_]+\}\}/, path);
    if (path !== '404.html') {
      const slug = path === 'index.html' ? '' : dirname(path);
      const url = `https://guide.propsol.co.kr/${slug}`;
      assert.ok(html.includes(`<link rel="canonical" href="${url}"`), path);
      assert.ok(html.includes(`<meta property="og:url" content="${url}"`), path);
    }
    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
      assert.ok(!href.endsWith('.md'), `${path}: ${href}`);
      assert.ok(existsSync(join(dist, href)) || existsSync(join(dist, href, 'index.html')), `${path}: ${href}`);
    }
  }
});

test('Home and matrix both publish every built criterion and the same live count', () => {
  const criterionPages = pages.filter(path => /^\d+\.\d+\.\d+\/index.html$/.test(path));
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  const matrix = readFileSync(join(dist, 'matrix/index.html'), 'utf8');
  for (const path of criterionPages) {
    const href = `href="/${dirname(path)}"`;
    assert.ok(home.includes(href), path);
    assert.ok(matrix.includes(href), path);
  }
  assert.ok(home.includes(`${criterionPages.length}개 공개`));
  assert.ok(matrix.includes(`${criterionPages.length} / 101개 공개`));
});
