module.exports = function caseBlock(c, i) {
  const alt = i % 2 === 1 ? ' case-block--right' : '';
  return `
  <div class="case-block${alt} reveal">
    <div class="case-block__inner">
      <span class="case-block__setor">${c.setor}</span>
      <h3>${c.titulo}</h3>
      <p>${c.texto}</p>
    </div>
  </div>`;
};
