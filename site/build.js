const fs = require('fs');
const path = require('path');

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
const insights = require('./content/insights');

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

console.log('Limpando dist/...');
emptyDir(DIST);

console.log('Gerando páginas...');
writePage('', home());
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
writePage('insights', insightsIndex());
for (const insight of insights) {
  writePage(`insights/${insight.slug}`, insightDetail(insight));
}
writePage('contato', contato());

console.log('Copiando assets estáticos...');
copyDir(path.join(__dirname, 'css'), path.join(DIST, 'css'));
copyDir(path.join(__dirname, 'js'), path.join(DIST, 'js'));
copyDir(path.join(__dirname, 'img'), path.join(DIST, 'img'));
copyDir(path.join(__dirname, 'fonts'), path.join(DIST, 'fonts'));

function countHtmlFiles(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countHtmlFiles(p);
    else if (entry.name.endsWith('.html')) count += 1;
  }
  return count;
}

const size = dirSize(DIST);
console.log(`\nBuild concluído: ${DIST}`);
console.log(`Páginas geradas: ${countHtmlFiles(DIST)}`);
console.log(`Tamanho total: ${formatBytes(size)}`);
