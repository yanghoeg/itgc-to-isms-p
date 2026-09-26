import { dirname, relative, resolve } from 'node:path';
import { marked, Renderer } from 'marked';

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function renderMarkdown(markdown, filepath, routes, root) {
  const tokens = marked.lexer(markdown, { gfm: true });
  marked.walkTokens(tokens, token => {
    if (token.type !== 'link' || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(token.href)) return;
    const [target, fragment] = token.href.split('#', 2);
    if (!target.endsWith('.md')) return;
    const absolute = resolve(dirname(filepath), decodeURIComponent(target));
    const route = routes.get(absolute);
    const repositoryPath = relative(root, absolute);
    if (repositoryPath.startsWith('..')) throw new Error(`Markdown link leaves the repository: ${token.href}`);
    token.href = (route || `https://github.com/yanghoeg/itgc-to-isms-p/blob/main/${repositoryPath.split('/').map(encodeURIComponent).join('/')}`)
      + (fragment ? `#${fragment}` : '');
  });

  const headings = [];
  const usedIds = new Map();
  const renderer = new Renderer();
  const renderTable = renderer.table.bind(renderer);
  renderer.table = token => `<div class="table-scroll" tabindex="0" role="region" aria-label="표: 가로로 스크롤할 수 있습니다">${renderTable(token)}</div>`;
  renderer.heading = function ({ tokens, depth }) {
    const content = this.parser.parseInline(tokens);
    const label = content.replace(/<[^>]*>/g, '');
    const slug = label.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
    const occurrence = usedIds.get(slug) || 0;
    usedIds.set(slug, occurrence + 1);
    const id = occurrence ? `${slug}-${occurrence}` : slug;
    if (depth === 2 || depth === 3) headings.push({ id, label, depth });
    return `<h${depth} id="${escapeHtml(id)}">${content}</h${depth}>\n`;
  };
  const content = marked.parser(tokens, { renderer });
  const toc = headings.length ? `<details class="toc"><summary>이 페이지의 내용</summary><nav aria-label="본문 목차"><ol>${headings.map(({ id, label, depth }) => `<li class="toc-level-${depth}"><a href="#${escapeHtml(id)}">${label}</a></li>`).join('')}</ol></nav></details>` : '';
  return { content, toc };
}
