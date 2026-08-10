const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const articleCard = require('../components/articleCard');
const ctaBand = require('../components/ctaBand');
const insights = require('../content/insights');

module.exports = function insightsIndex() {
  const content = `
  ${pageIntro({
    trail: [{ label: 'Home', href: '/' }, { label: 'Insights' }],
    eyebrow: 'Insights',
    title: 'Perspectivas sobre negócios, direito e mercado',
  })}

  <section class="section">
    <div class="container">
      <div class="grid grid--3">
        ${insights.map((i) => articleCard(i)).join('\n')}
      </div>
      <p class="insights-archive-note">Registro histórico da trajetória institucional da KNR — não é um feed de notícias recentes.</p>
    </div>
  </section>

  ${ctaBand()}
  `;

  return layout({
    title: 'Insights',
    description: 'Histórico institucional da KNR Advogados: reconhecimentos, nomeações e marcos da trajetória do escritório.',
    path: '/insights/',
    content,
  });
};
