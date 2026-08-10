const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const ctaBand = require('../components/ctaBand');
const areas = require('../content/areas');

module.exports = function areaDetail(area) {
  const outras = areas.filter((a) => a.slug !== area.slug).slice(0, 4);

  const content = `
  ${pageIntro({
    trail: [
      { label: 'Home', href: '/' },
      { label: 'Áreas de Atuação', href: '/areas-de-atuacao/' },
      { label: area.nome },
    ],
    eyebrow: 'Área de Atuação',
    title: area.nome,
    lede: area.resumo,
  })}

  <section class="section">
    <div class="container">
      <div style="max-width: 720px" class="reveal">
        <h3>Serviços</h3>
        <ul style="font-size:1.02rem; line-height:1.9">
          ${area.servicos.map((s) => `<li>${s}</li>`).join('\n')}
        </ul>
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container reveal">
      <span class="eyebrow">Outras áreas</span>
      <h2>Veja também</h2>
      <div class="area-list" style="margin-top:var(--size-6)">
        ${outras
          .map(
            (a) => `
        <a class="area-row" href="/areas-de-atuacao/${a.slug}/">
          <span></span>
          <span class="area-row__name">${a.nome}</span>
          <span class="area-row__arrow">→</span>
        </a>`
          )
          .join('\n')}
      </div>
    </div>
  </section>

  ${ctaBand({ titulo: `Precisa de assessoria em ${area.nome.toLowerCase()}? Fale com a nossa equipe.` })}
  `;

  return layout({
    title: area.nome,
    description: area.resumo,
    path: `/areas-de-atuacao/${area.slug}/`,
    content,
  });
};
