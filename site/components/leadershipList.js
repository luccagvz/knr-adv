const { initials } = require('./partnerSpotlight');

module.exports = function leadershipList(socios) {
  const rows = socios
    .map(
      (s) => `
    <a class="leadership-row reveal" href="/socios/${s.slug}/">
      <span style="display:flex;align-items:center;gap:var(--size-4)">
        ${s.foto
          ? `<img class="partner-avatar-sm" src="${s.foto}" alt="" width="72" height="72">`
          : `<span class="partner-avatar-sm" aria-hidden="true">${initials(s.nome)}</span>`}
        <span>
          <span class="leadership-row__name">${s.nome}</span><br>
          <span class="leadership-row__cargo">${s.cargo}</span>
        </span>
      </span>
      <span class="leadership-row__areas">${s.areas.join(' · ')}</span>
      <span class="leadership-row__arrow">→</span>
    </a>`
    )
    .join('\n');
  return `<div class="leadership-list">${rows}</div>`;
};
