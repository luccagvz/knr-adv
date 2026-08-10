module.exports = function breadcrumb(trail) {
  const items = trail
    .map((t, i) =>
      i === trail.length - 1 ? `<span>${t.label}</span>` : `<a href="${t.href}">${t.label}</a>`
    )
    .join(' / ');
  return `<nav class="breadcrumb">${items}</nav>`;
};
