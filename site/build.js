const fs = require('fs');
const path = require('path');

const { loadEnv } = require('./lib/env');
loadEnv();

const DIST = path.join(__dirname, 'dist');

const home = require('./pages/home');
const quemSomos = require('./pages/quemSomos');
const areasIndex = require('./pages/areasIndex');
const areaDetail = require('./pages/areaDetail');
const sociosIndex = require('./pages/sociosIndex');
const socioDetail = require('./pages/socioDetail');
const experiencia = require('./pages/experiencia');
const clientesPage = require('./pages/clientes');
const insightsIndex = require('./pages/insightsIndex');
const insightDetail = require('./pages/insightDetail');
const contato = require('./pages/contato');

const areas = require('./content/areas');
const socios = require('./content/socios');
const insightsHistoricos = require('./content/insights');
const { fetchPublishedNews } = require('./lib/fetchPublishedNews');

function emptyDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function writePage(routePath, html) {
  const dir = path.join(DIST, routePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function dirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSize(p);
    else total += fs.statSync(p).size;
  }
  return total;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function countHtmlFiles(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countHtmlFiles(p);
    else if (entry.name.endsWith('.html')) count += 1;
  }
  return count;
}

function writeAdminEnv() {
  const adminSrc = path.join(__dirname, 'admin');
  if (!fs.existsSync(adminSrc)) return;

  copyDir(adminSrc, path.join(DIST, 'admin'));

  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  };
  const js = `window.__SUPABASE_ENV__ = ${JSON.stringify(env)};\n`;
  fs.mkdirSync(path.join(DIST, 'admin', 'js'), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'admin', 'js', 'env.js'), js, 'utf8');

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.warn('[build] SUPABASE_URL/SUPABASE_ANON_KEY não configuradas — /admin foi publicado mas não vai conseguir logar.');
  }
}

async function main() {
  console.log('Limpando dist/...');
  emptyDir(DIST);

  console.log('Buscando notícias publicadas no Supabase...');
  const insightsRecentes = await fetchPublishedNews();

  // Notícias vindas do CMS entram por slug; se algum slug histórico colidir,
  // a versão recente (CMS) vence e a histórica é descartada pra evitar duplicar rota.
  const slugsRecentes = new Set(insightsRecentes.map((i) => i.slug));
  const historicos = insightsHistoricos.filter((i) => !slugsRecentes.has(i.slug));
  const todosInsights = [...insightsRecentes, ...historicos];

  console.log('Gerando páginas...');
  writePage('', home({ recentesCarrossel: insightsRecentes.slice(0, 5) }));
  writePage('quem-somos', quemSomos());
  writePage('areas-de-atuacao', areasIndex());
  for (const area of areas) {
    writePage(`areas-de-atuacao/${area.slug}`, areaDetail(area));
  }
  writePage('socios', sociosIndex());
  for (const socio of socios) {
    writePage(`socios/${socio.slug}`, socioDetail(socio));
  }
  writePage('experiencia', experiencia());
  writePage('clientes', clientesPage());
  writePage('insights', insightsIndex({ recentes: insightsRecentes, historicos }));
  for (const insight of todosInsights) {
    writePage(`insights/${insight.slug}`, insightDetail(insight));
  }
  writePage('contato', contato());

  console.log('Copiando assets estáticos...');
  copyDir(path.join(__dirname, 'css'), path.join(DIST, 'css'));
  copyDir(path.join(__dirname, 'js'), path.join(DIST, 'js'));
  copyDir(path.join(__dirname, 'img'), path.join(DIST, 'img'));
  copyDir(path.join(__dirname, 'fonts'), path.join(DIST, 'fonts'));

  console.log('Publicando painel /admin...');
  writeAdminEnv();

  const size = dirSize(DIST);
  console.log(`\nBuild concluído: ${DIST}`);
  console.log(`Páginas geradas: ${countHtmlFiles(DIST)}`);
  console.log(`Notícias do CMS publicadas: ${insightsRecentes.length}`);
  console.log(`Notícias históricas: ${historicos.length}`);
  console.log(`Tamanho total: ${formatBytes(size)}`);
}

main().catch((err) => {
  console.error('Build falhou:', err);
  process.exit(1);
});
