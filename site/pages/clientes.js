const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const testimonialLarge = require('../components/testimonialLarge');
const ctaBand = require('../components/ctaBand');
const clientes = require('../content/clientes');

module.exports = function clientesPage() {
  const content = `
  ${pageIntro({
    trail: [{ label: 'Home', href: '/' }, { label: 'Clientes' }],
    eyebrow: 'Clientes',
    title: 'Empresas que confiaram em nossa atuação',
  })}

  <section class="section">
    <div class="container">
      <div class="client-wall reveal">
        ${clientes.lista.map((n, i) => `<span class="client-wall__item ${i % 6 === 0 ? 'client-wall__item--lg' : i % 3 === 0 ? 'client-wall__item--sm' : 'client-wall__item--md'}">${n}</span>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section--dark" style="padding: var(--size-9) 0">
    <div class="container">
      <span class="eyebrow">Depoimentos</span>
      ${clientes.depoimentos.map((d) => testimonialLarge(d)).join('\n')}
    </div>
  </section>

  ${ctaBand()}
  `;

  return layout({
    title: 'Clientes',
    description: 'Empresas nacionais e estrangeiras que confiaram na atuação da KNR Advogados.',
    path: '/clientes/',
    content,
  });
};
