-- ============================================================
-- KNR CMS — hardening de segurança (auditoria 2026-08-11)
-- Rodar uma vez no SQL Editor do Supabase, depois de 001_news_cms.sql.
-- Idempotente: pode rodar de novo sem quebrar nada.
-- ============================================================

-- 1) Slug com formato validado no banco -------------------------------------
-- O admin já gera slugs seguros via JS, mas RLS controla QUEM escreve, não O
-- FORMATO do que é escrito — isso garante que nenhuma linha em `news` possa
-- ter um slug fora do padrão esperado por build.js/insightDetail(), mesmo se
-- alguém gravar direto via API em vez de passar pela UI do admin.
-- Se isso falhar com "constraint violada", é porque já existe uma linha com
-- slug fora do padrão — corrija a linha antes de rodar de novo.
alter table public.news drop constraint if exists news_slug_format;
alter table public.news add constraint news_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

-- 2) Autoria automática -------------------------------------------------------
-- O client não envia created_by hoje; isso preenche sozinho com quem
-- efetivamente publicou a linha, pro audit log abaixo fazer sentido.
alter table public.news alter column created_by set default auth.uid();

-- 3) Audit log de ações administrativas ---------------------------------------
-- Registra quem fez o quê e quando (login já fica nos logs nativos do
-- Supabase Auth — Authentication → Logs). Não guarda o conteúdo da notícia,
-- só metadados: id, ação, autor, status antes/depois.
create table if not exists public.news_audit_log (
  id bigint generated always as identity primary key,
  news_id uuid,
  news_slug text,
  action text not null check (action in ('insert', 'update', 'publish', 'unpublish', 'delete')),
  actor uuid,
  old_status text,
  new_status text,
  created_at timestamptz not null default now()
);

create index if not exists news_audit_log_news_id_idx on public.news_audit_log (news_id);

alter table public.news_audit_log enable row level security;

-- Só admins conseguem LER o log. Ninguém escreve nele diretamente — só a
-- trigger abaixo (via security definer), então não existe policy de insert.
drop policy if exists "admin_read_audit" on public.news_audit_log;
create policy "admin_read_audit" on public.news_audit_log
  for select
  using (auth.uid() in (select user_id from public.admin_users));

create or replace function public.log_news_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.news_audit_log (news_id, news_slug, action, actor, new_status)
    values (new.id, new.slug, 'insert', auth.uid(), new.status);
    return new;
  elsif (tg_op = 'UPDATE') then
    insert into public.news_audit_log (news_id, news_slug, action, actor, old_status, new_status)
    values (
      new.id, new.slug,
      case
        when old.status is distinct from new.status and new.status = 'published' then 'publish'
        when old.status is distinct from new.status and old.status = 'published' then 'unpublish'
        else 'update'
      end,
      auth.uid(), old.status, new.status
    );
    return new;
  elsif (tg_op = 'DELETE') then
    insert into public.news_audit_log (news_id, news_slug, action, actor, old_status)
    values (old.id, old.slug, 'delete', auth.uid(), old.status);
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists news_audit on public.news;
create trigger news_audit
  after insert or update or delete on public.news
  for each row execute function public.log_news_change();

-- ============================================================
-- Recomendações que NÃO foram aplicadas automaticamente (exigem decisão ou
-- configuração manual no Dashboard do Supabase):
--
-- 1. CAPTCHA no login (Authentication → Settings → Bot and Abuse Protection):
--    Supabase já faz rate limiting nativo no endpoint de auth (não
--    configurável, mas ativo por padrão). CAPTCHA é uma camada opcional
--    adicional — só vale a pena se o painel /admin começar a sofrer
--    tentativas de login automatizadas de verdade.
--
-- 2. MFA (Authentication → Settings → Multi-Factor Authentication): o
--    Supabase Auth já suporta TOTP nativamente. Não foi habilitado
--    automaticamente pra não haver risco de travar a única conta admin sem
--    um fluxo de recuperação testado. Ver relatório final pra como habilitar.
--
-- 3. Authentication → URL Configuration → Site URL / Redirect URLs: configure
--    com o domínio real de produção assim que o site for deployado, senão o
--    fluxo de "esqueci minha senha" do Supabase Auth pode gerar links errados.
-- ============================================================
