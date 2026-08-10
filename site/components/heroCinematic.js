module.exports = function heroCinematic({ eyebrow, titleLines, lede, ctaPrimario, ctaSecundario, backgroundImage = '/img/hero-skyline.webp' }) {
  const heading = titleLines.map((l) => `${l}<br>`).join('\n');
  return `
  <section class="hero-cinematic" style="background-image: url('${backgroundImage}')">
    <div class="hero-cinematic__content">
      <div class="hero-cinematic__eyebrow">${eyebrow}</div>
      <h1>${heading}</h1>
      <p class="lede">${lede}</p>
      <div class="hero-cinematic__actions">
        <a class="btn btn--primary" href="${ctaPrimario.href}">${ctaPrimario.texto} <span class="btn__arrow">→</span></a>
        <a class="btn btn--outline-light" href="${ctaSecundario.href}">${ctaSecundario.texto}</a>
      </div>
    </div>
    <span class="hero-cinematic__scroll">Role para explorar</span>
  </section>`;
};
