const alertBox = document.getElementById('alert-box');
const form = document.getElementById('login-form');
const submitBtn = document.getElementById('submit-btn');

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showAlert(message, type) {
  alertBox.innerHTML = `<div class="form-alert form-alert--${type}">${escapeHtml(message)}</div>`;
}

const params = new URLSearchParams(window.location.search);
if (params.get('erro') === 'sem-permissao') {
  showAlert('Login OK, mas esse e-mail não tem permissão de administrador. Fale com quem gerencia o Supabase do escritório.', 'error');
}

(async () => {
  try {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (session) window.location.href = '/admin/';
  } catch (err) {
    showAlert(err.message, 'error');
    form.querySelectorAll('input, button').forEach((el) => (el.disabled = true));
  }
})();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Entrando...';
  alertBox.innerHTML = '';

  try {
    const sb = getSupabase();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    window.location.href = '/admin/';
  } catch (err) {
    showAlert(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Entrar';
  }
});
