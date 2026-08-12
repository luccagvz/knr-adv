const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const leadershipList = require('../components/leadershipList');
const ctaBand = require('../components/ctaBand');
const socios = require('../content/socios');

module.exports = function sociosIndex() {
  const content = `
  ${pageIntro({
    trail: [{ label: 'Home', href: '/' }, { label: 'Sócios' }],
    eyebrow: 'Sócios',
    title: 'Apresentação do nosso quadro de sócios',
  })}

  <section class="section">
    <div class="container">
      ${leadershipList(socios)}
    </div>
  </section>

  ${ctaBand()}
  `;

  return layout({
    title: 'Sócios',
    description: 'Conheça os sócios da KNR Advogados: Marcelo Kruschewsky, Diego Ribeiro, Sérgio Nunes, Juliana Andrade Gavazza e Carmen Dolores Bittencourt.',
    path: '/socios/',
    content,
  });
};
