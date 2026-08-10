const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const partnerSpotlight = require('../components/partnerSpotlight');
const leadershipList = require('../components/leadershipList');
const ctaBand = require('../components/ctaBand');
const socios = require('../content/socios');

module.exports = function sociosIndex() {
  const founder = socios[0];
  const others = socios.slice(1);

  const content = `
  ${pageIntro({
    trail: [{ label: 'Home', href: '/' }, { label: 'Sócios' }],
    eyebrow: 'Sócios',
    title: 'Apresentação do nosso quadro de sócios',
  })}

  <section class="section">
    <div class="container">
      ${partnerSpotlight(founder)}
      ${leadershipList(others)}
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
