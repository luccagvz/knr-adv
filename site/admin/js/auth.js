// Auth compartilhada entre as páginas do /admin.
// Autenticação sozinha não basta: só é "admin" quem tem uma linha em
// public.admin_users — e isso é decidido pelo RLS no Postgres, não aqui.
// Este guard client-side é só UX (evita piscar tela); a segurança de
// verdade está nas policies (ver site/sql/001_news_cms.sql).

const KNRAuth = {
  async requireAdminSession() {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
      window.location.href = '/admin/login.html';
      return null;
    }

    const { data: adminRow, error } = await sb
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error || !adminRow) {
      await sb.auth.signOut();
      window.location.href = '/admin/login.html?erro=sem-permissao';
      return null;
    }

    return { session, user: session.user };
  },

  wireLogout(buttonEl) {
    if (!buttonEl) return;
    buttonEl.addEventListener('click', async () => {
      const sb = getSupabase();
      await sb.auth.signOut();
      window.location.href = '/admin/login.html';
    });
  },

  showUserEmail(el, email) {
    if (el) el.textContent = email || '';
  },
};
