const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const articleCard = require('../components/articleCard');
const ctaBand = require('../components/ctaBand');

module.exports = function insightsIndex({ recentes = [], historicos = [] } = {}) {
  const secaoRecentes = recentes.length
    ? `
  <section class="section">
    <div class="container">
      <h2 style="margin-bottom:var(--size-5)">Notícias recentes</h2>
      <div class="grid grid--3">
        ${recentes.map((i) => articleCard(i)).join('\n')}
      </div>
    </div>
  </section>`
    : '';

  const secaoHistorico = `
  <section class="section">
    <div class="container">
      ${recentes.length ? '<h2 style="margin-bottom:var(--size-5)">Histórico institucional</h2>' : ''}
      <div class="grid grid--3">
        ${historicos.map((i) => articleCard(i)).join('\n')}
      </div>
      <p class="insights-archive-note">Registro histórico da trajetória institucional da KNR — não é um feed de notícias recentes.</p>
    </div>
  </section>`;

  const content = `
  ${pageIntro({
    trail: [{ label: 'Home', href: '/' }, { label: 'Insights' }],
    eyebrow: 'Insights',
    title: 'Perspectivas sobre negócios, direito e mercado',
  })}

  ${secaoRecentes}
  ${secaoHistorico}

  ${ctaBand()}
  `;

  return layout({
    title: 'Insights',
    description: 'Notícias e histórico institucional da KNR Advogados: reconhecimentos, nomeações e marcos da trajetória do escritório.',
    path: '/insights/',
    content,
  });
};
