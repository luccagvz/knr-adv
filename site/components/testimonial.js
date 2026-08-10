module.exports = function testimonial(dep) {
  return `
  <div class="testimonial">
    <blockquote>“${dep.texto}”</blockquote>
    <cite><strong>${dep.nome}</strong> — ${dep.cargo}</cite>
  </div>`;
};
