module.exports = function areaListEditorial(areas) {
  const rows = areas
    .map((a, i) => `
    <a class="area-row reveal" href="/areas-de-atuacao/${a.slug}/">
      <span class="area-row__index">${String(i + 1).padStart(2, '0')}</span>
      <span>
        <span class="area-row__name">${a.nome}</span>
        <span class="area-row__desc">${a.resumo}</span>
      </span>
      <span class="area-row__arrow">→</span>
    </a>`)
    .join('\n');
  return `<div class="area-list">${rows}</div>`;
};
