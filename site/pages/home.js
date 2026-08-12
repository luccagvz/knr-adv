const layout = require('../components/layout');
const heroCinematic = require('../components/heroCinematic');
const areaListEditorial = require('../components/areaListEditorial');
const leadershipList = require('../components/leadershipList');
const testimonialLarge = require('../components/testimonialLarge');
const articleCard = require('../components/articleCard');
const newsCarousel = require('../components/newsCarousel');
const ctaBand = require('../components/ctaBand');

const empresa = require('../content/empresa');
const areas = require('../content/areas');
const socios = require('../content/socios');
const clientes = require('../content/clientes');
const insights = require('../content/insights');

module.exports = function home({ recentesCarrossel = [] } = {}) {
  const destaqueAreas = areas.filter((a) => a.destaque);
  const recentInsights = insights.slice(0, 3);

  const content = `
  ${heroCinematic({
    eyebrow: 'KNR — Kruschewsky e Nunes Ribeiro Advogados',
    titleLines: ['Experiência jurídica', 'para decisões que', 'exigem segurança.'],
    lede: empresa.hero.subtitulo,
    ctaPrimario: empresa.hero.ctaPrimario,
    ctaSecundario: empresa.hero.ctaSecundario,
    backgroundImage: '/img/office/recepcao-panoramica.webp',
  })}

  <section class="section--dark" style="padding: var(--size-10) 0">
    <div class="container">
      <div class="grid grid--2" style="align-items:start; gap: var(--size-9)">
        <div class="reveal">
          <span class="eyebrow">Posicionamento</span>
          <h2>Uma banca jurídica construída para a complexidade.</h2>
        </div>
        <div class="reveal">
          <p style="font-size:1.1rem; max-width:52ch">${empresa.posicionamento}</p>
          <ul class="values-list" style="margin-top: var(--size-6)">
            ${empresa.valores.map((v) => `<li>${v}</li>`).join('\n')}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-header reveal">
        <span class="eyebrow">Áreas de Atuação</span>
        <h2>15 áreas. Uma visão integrada.</h2>
        <p>Atuação multidisciplinar para empresas, investidores e operações que exigem visão jurídica de conjunto.</p>
      </div>
      ${areaListEditorial(destaqueAreas.slice(0, 6))}
      <p style="margin-top: var(--size-6)"><a class="link-arrow" href="/areas-de-atuacao/">Ver todas as áreas <span class="link-arrow__arrow">→</span></a></p>
    </div>
  </section>

  <div class="image-breaker" style="background-image:url('/img/panorama-caminho-arvores.webp')"></div>

  ${newsCarousel(recentesCarrossel)}

  <section class="section section--alt">
    <div class="container">
      <div class="section-header reveal">
        <span class="eyebrow">Clientes</span>
        <h2>Empresas que confiaram em nossa atuação</h2>
      </div>
      <div class="client-wall reveal">
        ${clientes.lista.slice(0, 16).map((n, i) => `<span class="client-wall__item ${i % 5 === 0 ? 'client-wall__item--lg' : i % 3 === 0 ? 'client-wall__item--sm' : 'client-wall__item--md'}">${n}</span>`).join('\n')}
      </div>
      <p style="margin-top: var(--size-7)"><a class="link-arrow" href="/clientes/">Ver todos os clientes <span class="link-arrow__arrow">→</span></a></p>
    </div>
  </section>

  <section class="section--dark" style="padding: var(--size-9) 0">
    <div class="container">
      <span class="eyebrow">Depoimentos</span>
      ${clientes.depoimentos.map((d) => testimonialLarge(d)).join('\n')}
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-header reveal">
        <span class="eyebrow">Sócios</span>
        <h2>Quem conduz a atuação da KNR</h2>
      </div>
      ${leadershipList(socios)}
    </div>
  </section>

  <section class="section--dark section--dark-image" style="background-image:url('/img/hero-skyline.webp'); padding: var(--size-10) 0">
    <div class="container">
      <div class="grid grid--2" style="align-items:center; gap: var(--size-9)">
        <div class="reveal">
          <span class="eyebrow">Atuação Internacional</span>
          <h2>Brasil, com perspectiva internacional.</h2>
          <p>${empresa.redeInternacional}</p>
        </div>
        <div class="reveal">
          <p style="color:#cdd5e8">Estrutura preparada para atendimento a clientes e investidores estrangeiros em:</p>
          <div class="lang-chips">
            ${empresa.idiomas.map((l) => `<span class="lang-chip">${l}</span>`).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <div class="section-header reveal">
        <span class="eyebrow">Insights</span>
        <h2>Perspectivas sobre negócios, direito e mercado</h2>
      </div>
      <div class="grid grid--3">
        ${recentInsights.map((i) => articleCard(i)).join('\n')}
      </div>
      <p style="margin-top: var(--size-6)"><a class="link-arrow" href="/insights/">Ver todos <span class="link-arrow__arrow">→</span></a></p>
    </div>
  </section>

  ${ctaBand()}
  `;

  return layout({
    title: null,
    description: empresa.posicionamento,
    path: '/',
    transparentHeader: true,
    content,
  });
};
