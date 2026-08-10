const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const areaListEditorial = require('../components/areaListEditorial');
const ctaBand = require('../components/ctaBand');
const areas = require('../content/areas');

module.exports = function areasIndex() {
  const content = `
  ${pageIntro({
    trail: [{ label: 'Home', href: '/' }, { label: 'Áreas de Atuação' }],
    eyebrow: 'Áreas de Atuação',
    title: '15 áreas. Uma visão integrada.',
    lede: 'Atuação multidisciplinar, com atenção especial às áreas mais relacionadas às operações empresariais e complexas atendidas pelo escritório.',
  })}

  <section class="section">
    <div class="container">
      ${areaListEditorial(areas)}
    </div>
  </section>

  ${ctaBand({ titulo: 'Não encontrou a área que procura? Fale com a nossa equipe.' })}
  `;

  return layout({
    title: 'Áreas de Atuação',
    description: 'As 15 áreas de atuação da KNR Advogados: societário, comercial, imobiliário, tributário, investimentos estrangeiros e mais.',
    path: '/areas-de-atuacao/',
    content,
  });
};
