// window.__SUPABASE_ENV__ é gerado pelo build.js (site/build.js → writeAdminEnv)
// a partir de SUPABASE_URL / SUPABASE_ANON_KEY. Em dev local sem build, fica vazio.
const ENV = window.__SUPABASE_ENV__ || {};

let client = null;

function getSupabase() {
  if (client) return client;
  if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
    throw new Error('Supabase não configurado. Rode "node build.js" com SUPABASE_URL e SUPABASE_ANON_KEY definidas (veja .env.example).');
  }
  client = window.supabase.createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
  return client;
}
