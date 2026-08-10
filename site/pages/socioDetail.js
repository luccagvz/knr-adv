const layout = require('../components/layout');
const breadcrumb = require('../components/breadcrumb');
const ctaBand = require('../components/ctaBand');
const { initials } = require('../components/partnerSpotlight');

module.exports = function socioDetail(socio) {
  const content = `
  <section class="page-intro">
    <div class="container">
      ${breadcrumb([
        { label: 'Home', href: '/' },
        { label: 'Sócios', href: '/socios/' },
        { label: socio.nome },
      ])}
      <div style="display:flex; gap: var(--size-8); flex-wrap: wrap; align-items:center">
        <div class="partner-spotlight__mark" style="width:180px;height:225px;flex-shrink:0" aria-hidden="true">${initials(socio.nome)}</div>
        <div style="flex:1; min-width:280px">
          <span class="eyebrow">${socio.cargo}</span>
          <h1>${socio.nome}</h1>
          <div style="color:#cdd5e8; font-size:0.95rem">Áreas de atuação: ${socio.areas.join(', ')}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div style="max-width:680px" class="reveal">
        <p style="font-size:1.05rem">${socio.bio}</p>
        <h3>Formação</h3>
        <ul style="line-height:1.9">
          ${socio.formacao.map((f) => `<li>${f}</li>`).join('\n')}
        </ul>
      </div>
    </div>
  </section>

  ${ctaBand({ titulo: `Fale com ${socio.nome.split(' ')[0]} e a equipe da KNR.` })}
  `;

  return layout({
    title: socio.nome,
    description: `${socio.cargo} da KNR Advogados. ${socio.bio}`.slice(0, 160),
    path: `/socios/${socio.slug}/`,
    content,
  });
};
