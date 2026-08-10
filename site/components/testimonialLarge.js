module.exports = function testimonialLarge(dep) {
  return `
  <div class="testimonial-lg reveal">
    <span class="testimonial-lg__mark" aria-hidden="true">&ldquo;</span>
    <blockquote>${dep.texto}</blockquote>
    <cite><strong>${dep.nome}</strong> — ${dep.cargo}</cite>
  </div>`;
};
