// Compartilhado pelas funções preview.js e rebuild.js.
// Nunca usa service role key — só repassa o token do usuário logado pro
// Supabase e deixa o RLS decidir. Ver site/sql/001_news_cms.sql.

const { isValidUuid } = require('./_http');

async function getAuthedAdmin(accessToken) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('SUPABASE_URL/SUPABASE_ANON_KEY não configuradas no ambiente da função.');
  if (!accessToken) return null;

  const userRes = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!userRes.ok) return null;
  const user = await userRes.json();
  if (!user || !isValidUuid(user.id)) return null;

  const adminRes = await fetch(
    `${url}/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(user.id)}`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` } }
  );
  if (!adminRes.ok) return null;
  const rows = await adminRes.json();
  if (!rows.length) return null;

  return { user, accessToken };
}

module.exports = { getAuthedAdmin };
