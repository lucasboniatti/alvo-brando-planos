/**
 * Carrega posts do blog a partir de arquivos .md em src/posts/
 * Usa import.meta.glob para carregar em runtime — posts novos no GitHub
 * aparecem sem rebuild.
 *
 * Frontmatter obrigatório:
 *   title, slug, excerpt, date, readTime, category, coverColor
 */

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    val = val.replace(/^["']|["']$/g, '');
    fm[key] = val;
  }
  return fm;
}

function parseBody(raw) {
  return raw.replace(/^---[\s\S]*?---\r?\n/, '');
}

function parsePost(raw, filename) {
  const fm = parseFrontmatter(raw);
  const slug = filename.replace('.md', '');
  return {
    slug,
    title:      fm.title      || '',
    excerpt:    fm.excerpt    || '',
    date:       fm.date       || '',
    readTime:   fm.readTime   || '',
    category:   fm.category   || '',
    coverColor: fm.coverColor || '#F3F0E8',
    content:    parseBody(raw).trim(),
  };
}

// Glob em runtime — carrega todos os .md conforme forem acessados
const postModules = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: false,
});

export async function getAllPosts() {
  const entries = await Promise.all(
    Object.entries(postModules).map(async ([path, loader]) => {
      const raw = await loader();
      const filename = path.split('/').pop();
      return parsePost(raw, filename);
    })
  );
  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getPostBySlug(slug) {
  const key = `../posts/${slug}.md`;
  const loader = postModules[key];
  if (!loader) return null;
  const raw = await loader();
  return parsePost(raw, `${slug}.md`);
}

// Para o BlogIndex — acesso síncrono aos metadados dos posts
// Pré-carrega todos os módulos para listagem sem loading state
const rawModules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' });

export async function getAllPostMetadata() {
  const entries = await Promise.all(
    Object.entries(rawModules).map(async ([path, loader]) => {
      const raw = await loader();
      const filename = path.split('/').pop();
      const fm = parseFrontmatter(raw);
      const slug = filename.replace('.md', '');
      return {
        slug,
        title:      fm.title      || '',
        excerpt:    fm.excerpt    || '',
        date:       fm.date       || '',
        readTime:   fm.readTime   || '',
        category:   fm.category   || '',
        coverColor: fm.coverColor || '#F3F0E8',
      };
    })
  );
  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
}