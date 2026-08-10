function initials(nome) {
  return nome
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

module.exports = function partnerSpotlight(socio) {
  return `
  <div class="partner-spotlight reveal">
    <div class="partner-spotlight__mark" aria-hidden="true">${initials(socio.nome)}</div>
    <div>
      <div class="partner-spotlight__cargo">${socio.cargo}</div>
      <h2>${socio.nome}</h2>
      <div class="partner-spotlight__areas">Áreas de atuação: ${socio.areas.join(', ')}</div>
      <p>${socio.bio}</p>
      <a class="link-arrow" href="/socios/${socio.slug}/" style="color:var(--on-dark)">Ver perfil completo <span class="link-arrow__arrow">→</span></a>
    </div>
  </div>`;
};

module.exports.initials = initials;
