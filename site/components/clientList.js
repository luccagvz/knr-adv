module.exports = function clientList(clientes) {
  const items = clientes
    .map((nome) => `<div class="client-list__item">${nome}</div>`)
    .join('\n');
  return `<div class="client-list">${items}</div>`;
};
