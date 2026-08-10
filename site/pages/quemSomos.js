const layout = require('../components/layout');
const pageIntro = require('../components/pageIntro');
const ctaBand = require('../components/ctaBand');
const empresa = require('../content/empresa');

module.exports = function quemSomos() {
  const [premioRecente, ...outrosPremios] = empresa.premios;

  const content = `
  ${pageIntro({
    trail: [{ label: 'Home', href: '/' }, { label: 'O Escritório' }],
    eyebrow: 'O Escritório',
    title: 'Quem somos',
  })}

  <section class="section">
    <div class="container">
      <div style="max-width: 720px" class="reveal">
        ${empresa.quemSomos.map((p) => `<p style="font-size:1.05rem">${p}</p>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section section--tight section--alt">
    <div class="container reveal">
      <span class="eyebrow">Equipe</span>
      <h2 style="margin-bottom:var(--size-6)">A equipe por trás da atuação</h2>
      <img src="/img/office/equipe-recepcao.webp" alt="Equipe da KNR na recepção do escritório, em Salvador" style="width:100%;max-width:820px;border:1px solid var(--color-border)">
    </div>
  </section>

  <section class="section--dark" style="padding: var(--size-9) 0">
    <div class="container">
      <div class="grid grid--2" style="align-items:center">
        <div class="reveal">
          <span class="eyebrow">Valores</span>
          <h2>O que nos identifica</h2>
        </div>
        <ul class="values-list reveal">
          ${empresa.valores.map((v) => `<li>${v}</li>`).join('\n')}
        </ul>
      </div>
    </div>
  </section>

  <div class="image-breaker image-breaker--focus-right" style="background-image:url('/img/office/banner-1-46e9.webp')"></div>

  <section class="section">
    <div class="container">
      <div class="grid grid--2 reveal">
        <div>
          <span class="eyebrow">Rede</span>
          <h2>Correspondentes e escritórios associados</h2>
        </div>
        <p style="font-size:1.05rem">${empresa.redeInternacional}</p>
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <div class="section-header reveal">
        <span class="eyebrow">Reconhecimento</span>
        <h2>Prêmios e citações institucionais</h2>
      </div>
      <div class="grid grid--2 reveal" style="align-items:center; margin-bottom: var(--size-8)">
        <img src="${premioRecente.imagem}" alt="${premioRecente.titulo}" style="width:100%;border:1px solid var(--color-border)">
        <div>
          <span class="eyebrow" style="margin-bottom:var(--size-2)">${premioRecente.ano}</span>
          <h3>${premioRecente.titulo}</h3>
          <p>${premioRecente.detalhe}</p>
          <p style="font-size:0.85rem;color:var(--color-text-muted)">${premioRecente.fonte} — ${premioRecente.local}. <a class="link-animated" href="${premioRecente.fonteUrl}" target="_blank" rel="noopener">Ver matéria completa</a></p>
        </div>
      </div>
      ${outrosPremios
        .map(
          (p) => `
      <div class="reveal" style="border-top:1px solid var(--color-border); padding-top: var(--size-5)">
        <h3>${p.titulo}</h3>
        <p>Citação em publicação da ${p.fonte}, em ${p.ano}.</p>
      </div>`
        )
        .join('\n')}
    </div>
  </section>

  ${ctaBand({ titulo: 'Quer entender como a KNR pode apoiar sua operação?' })}
  `;

  return layout({
    title: 'O Escritório',
    description: empresa.posicionamento,
    path: '/quem-somos/',
    content,
  });
};
