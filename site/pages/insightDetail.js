const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const ctaBand = require('../components/ctaBand');
const { formatDate } = require('../components/articleCard');

module.exports = function insightDetail(insight) {
  const content = `
  ${pageIntro({
    trail: [
      { label: 'Home', href: '/' },
      { label: 'Insights', href: '/insights/' },
      { label: insight.titulo },
    ],
    eyebrow: `${insight.categoria} · ${formatDate(insight.data)}`,
    title: insight.titulo,
  })}

  <section class="section">
    <div class="container">
      <div style="max-width: 680px" class="reveal">
        ${insight.imagem ? `<img src="${insight.imagem}" alt="${insight.titulo}" style="width:100%;margin-bottom:var(--size-6);border:1px solid var(--color-border)">` : ''}
        <p style="font-size:1.05rem">${insight.resumo}</p>
      </div>
    </div>
  </section>

  ${ctaBand()}
  `;

  return layout({
    title: insight.titulo,
    description: insight.resumo,
    path: `/insights/${insight.slug}/`,
    content,
  });
};
