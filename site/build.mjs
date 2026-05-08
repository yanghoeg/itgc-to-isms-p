import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, cpSync } from 'fs';
import { join, dirname, basename } from 'path';
import { marked } from 'marked';

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const MAPPING_DIR = join(ROOT, '01-itgc-mapping');
const META_DIR = join(ROOT, '00-meta');
const DIST = join(ROOT, 'site', 'dist');
const TEMPLATE = readFileSync(join(ROOT, 'site', 'template.html'), 'utf-8');
const INDEX_TEMPLATE = readFileSync(join(ROOT, 'site', 'index-template.html'), 'utf-8');

marked.setOptions({ gfm: true, breaks: false });

// --- Parse MATRIX.md for 101 criteria metadata ---

function parseMatrix() {
  const text = readFileSync(join(MAPPING_DIR, 'MATRIX.md'), 'utf-8');
  const criteria = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^\|\s*(\d+\.\d+\.\d+)\s*\|\s*(.+?)\s*\|\s*(직접|간접|기타)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/);
    if (!m) continue;
    const [, num, title, classification, domain, subdomain, page] = m;
    criteria.push({
      num: num.trim(),
      title: title.trim(),
      classification: classification.trim(),
      domain: domain.trim(),
      subdomain: subdomain.trim(),
      written: page.includes('→'),
    });
  }
  return criteria;
}

// --- Find content markdown files ---

function findContentFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findContentFiles(full));
    } else if (entry.endsWith('.md') && entry !== 'README.md' && entry !== 'MATRIX.md') {
      files.push(full);
    }
  }
  return files;
}

// --- Extract criterion number from filename ---

function extractNum(filepath) {
  const name = basename(filepath, '.md');
  const m = name.match(/^(\d+\.\d+\.\d+)/);
  return m ? m[1] : null;
}

// --- Determine domain from file path ---

function extractDomain(filepath) {
  if (filepath.includes('/1-direct/apd/')) return 'APD';
  if (filepath.includes('/1-direct/pc/')) return 'PC';
  if (filepath.includes('/1-direct/co/')) return 'CO';
  if (filepath.includes('/1-direct/pd/')) return 'PD';
  if (filepath.includes('/2-indirect/')) return 'ELC';
  if (filepath.includes('/3-other/')) return '참고';
  return '';
}

// --- Domain tag color class ---

function domainClass(domain) {
  const map = { APD: 'tag-apd', PC: 'tag-pc', CO: 'tag-co', PD: 'tag-pd', ELC: 'tag-elc' };
  return map[domain] || 'tag-other';
}

// --- Classification badge ---

function classificationLabel(c) {
  if (c === '직접') return '1-direct';
  if (c === '간접') return '2-indirect';
  return '3-other';
}

// --- Build a single criterion page ---

function buildPage(filepath, meta, allCriteria) {
  const md = readFileSync(filepath, 'utf-8');
  const content = marked.parse(md);
  const num = meta.num;
  const domain = extractDomain(filepath);

  const writtenList = allCriteria.filter(c => c.written).sort((a, b) => a.num.localeCompare(b.num, undefined, { numeric: true }));
  const idx = writtenList.findIndex(c => c.num === num);
  const prev = idx > 0 ? writtenList[idx - 1] : null;
  const next = idx < writtenList.length - 1 ? writtenList[idx + 1] : null;

  const navPrev = prev ? `<a href="/${prev.num}" class="nav-link nav-prev">&larr; ${prev.num} ${prev.title}</a>` : '';
  const navNext = next ? `<a href="/${next.num}" class="nav-link nav-next">${next.num} ${next.title} &rarr;</a>` : '';

  const githubPath = filepath.replace(ROOT + '/', '');

  let html = TEMPLATE
    .replace(/\{\{TITLE\}\}/g, `${num} ${meta.title}`)
    .replace(/\{\{CRITERION_NUM\}\}/g, num)
    .replace(/\{\{DOMAIN_TAG\}\}/g, domain)
    .replace(/\{\{DOMAIN_CLASS\}\}/g, domainClass(domain))
    .replace(/\{\{CLASSIFICATION\}\}/g, classificationLabel(meta.classification))
    .replace(/\{\{CONTENT\}\}/g, content)
    .replace(/\{\{NAV_PREV\}\}/g, navPrev)
    .replace(/\{\{NAV_NEXT\}\}/g, navNext)
    .replace(/\{\{GITHUB_PATH\}\}/g, githubPath)
    .replace(/\{\{SLUG\}\}/g, num);

  const outDir = join(DIST, num);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  ${num} ${meta.title}`);
}

// --- Build meta pages (methodology, etc.) ---

function buildMetaPage(filepath) {
  const md = readFileSync(filepath, 'utf-8');
  const content = marked.parse(md);
  const name = basename(filepath, '.md');
  const titleLine = md.split('\n')[0].replace(/^#\s*/, '');

  let html = TEMPLATE
    .replace(/\{\{TITLE\}\}/g, titleLine)
    .replace(/\{\{CRITERION_NUM\}\}/g, '')
    .replace(/\{\{DOMAIN_TAG\}\}/g, '')
    .replace(/\{\{DOMAIN_CLASS\}\}/g, '')
    .replace(/\{\{CLASSIFICATION\}\}/g, '')
    .replace(/\{\{CONTENT\}\}/g, content)
    .replace(/\{\{NAV_PREV\}\}/g, '')
    .replace(/\{\{NAV_NEXT\}\}/g, '')
    .replace(/\{\{GITHUB_PATH\}\}/g, `00-meta/${name}.md`)
    .replace(/\{\{SLUG\}\}/g, '');

  const outDir = join(DIST, 'meta', name);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  meta/${name}`);
}

// --- Build MATRIX page ---

function buildMatrixPage() {
  const md = readFileSync(join(MAPPING_DIR, 'MATRIX.md'), 'utf-8');
  const content = marked.parse(md);

  let html = TEMPLATE
    .replace(/\{\{TITLE\}\}/g, 'ISMS-P × ITGC 매핑 매트릭스')
    .replace(/\{\{CRITERION_NUM\}\}/g, '')
    .replace(/\{\{DOMAIN_TAG\}\}/g, '')
    .replace(/\{\{DOMAIN_CLASS\}\}/g, '')
    .replace(/\{\{CLASSIFICATION\}\}/g, '')
    .replace(/\{\{CONTENT\}\}/g, content)
    .replace(/\{\{NAV_PREV\}\}/g, '')
    .replace(/\{\{NAV_NEXT\}\}/g, '')
    .replace(/\{\{GITHUB_PATH\}\}/g, '01-itgc-mapping/MATRIX.md')
    .replace(/\{\{SLUG\}\}/g, '');

  const outDir = join(DIST, 'matrix');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log('  matrix');
}

// --- Build index page ---

function buildIndex(criteria) {
  const domains = [
    { key: 'APD', label: 'APD — Access to Programs & Data' },
    { key: 'PC', label: 'PC — Program Changes' },
    { key: 'CO', label: 'CO — Computer Operations' },
    { key: 'PD', label: 'PD — Program Development' },
    { key: 'ELC', label: 'ELC — Entity-Level Controls' },
    { key: '(참고)', label: '개인정보 처리단계 (참고)' },
  ];

  let listHtml = '';
  for (const d of domains) {
    const items = criteria.filter(c => c.domain === d.key || (d.key === '(참고)' && c.classification === '기타'));
    if (items.length === 0) continue;
    const written = items.filter(i => i.written).length;

    listHtml += `<div class="domain-group">`;
    listHtml += `<h3 class="domain-title"><span class="domain-tag ${domainClass(d.key)}">${d.key === '(참고)' ? '참고' : d.key}</span> ${d.label} <small>${written} / ${items.length}</small></h3>`;
    listHtml += `<ul class="criteria-list">`;
    for (const item of items) {
      if (item.written) {
        listHtml += `<li class="written"><a href="/${item.num}">${item.num} ${item.title}</a></li>`;
      } else {
        listHtml += `<li class="pending"><span>${item.num} ${item.title}</span></li>`;
      }
    }
    listHtml += `</ul></div>`;
  }

  const total = criteria.length;
  const writtenCount = criteria.filter(c => c.written).length;

  let html = INDEX_TEMPLATE
    .replace(/\{\{CRITERIA_LIST\}\}/g, listHtml)
    .replace(/\{\{TOTAL\}\}/g, String(total))
    .replace(/\{\{WRITTEN\}\}/g, String(writtenCount));

  writeFileSync(join(DIST, 'index.html'), html);
  console.log(`  index (${writtenCount}/${total} written)`);
}

// --- Build sitemap.xml ---

function buildSitemap(criteria) {
  const base = 'https://guide.propsol.co.kr';
  const today = new Date().toISOString().slice(0, 10);
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url><loc>${base}/</loc><lastmod>${today}</lastmod></url>\n`;
  xml += `  <url><loc>${base}/matrix</loc><lastmod>${today}</lastmod></url>\n`;
  for (const c of criteria.filter(c => c.written)) {
    xml += `  <url><loc>${base}/${c.num}</loc><lastmod>${today}</lastmod></url>\n`;
  }
  xml += `</urlset>\n`;
  writeFileSync(join(DIST, 'sitemap.xml'), xml);

  writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
  console.log('  sitemap.xml + robots.txt');
}

// --- Main ---

console.log('Building ITGC Guide...\n');

mkdirSync(DIST, { recursive: true });

const criteria = parseMatrix();
console.log(`Parsed ${criteria.length} criteria from MATRIX.md\n`);

const contentFiles = findContentFiles(MAPPING_DIR);
console.log(`Found ${contentFiles.length} content files\n`);

console.log('Building pages:');
for (const filepath of contentFiles) {
  const num = extractNum(filepath);
  if (!num) continue;
  const meta = criteria.find(c => c.num === num);
  if (!meta) {
    console.warn(`  WARN: ${num} not found in MATRIX.md, skipping`);
    continue;
  }
  buildPage(filepath, meta, criteria);
}

console.log('\nBuilding meta pages:');
const metaFiles = ['methodology.md', 'reading-order.md', 'why-this-repo.md'];
for (const name of metaFiles) {
  const path = join(META_DIR, name);
  if (existsSync(path)) buildMetaPage(path);
}

console.log('\nBuilding matrix:');
buildMatrixPage();

console.log('\nBuilding index:');
buildIndex(criteria);

console.log('\nBuilding sitemap:');
buildSitemap(criteria);

if (existsSync(join(ROOT, 'site', 'assets'))) {
  cpSync(join(ROOT, 'site', 'assets'), join(DIST, 'assets'), { recursive: true });
}

console.log('\nDone!');
