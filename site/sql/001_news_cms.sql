-- ============================================================
-- KNR CMS de Notícias — schema, RLS e storage
-- Rodar uma vez no SQL Editor do Supabase (Project → SQL Editor → New query → Run)
-- Idempotente: pode rodar de novo sem quebrar nada.
-- ============================================================

-- 1) Tabela de notícias -----------------------------------------------------
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,                      -- HTML do editor rich text (sanitizado no build/preview)
  cover_image text,                  -- URL pública no Storage
  category text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'scheduled', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seo_title text,
  seo_description text,
  created_by uuid references auth.users(id)
);

create index if not exists news_status_published_idx
  on public.news (status, published_at desc);

create index if not exists news_slug_idx on public.news (slug);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists news_set_updated_at on public.news;
create trigger news_set_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

-- 2) Allowlist de administradores ------------------------------------------
-- Nenhuma política de INSERT/UPDATE/DELETE é criada aqui de propósito:
-- só o dono do projeto (via SQL Editor / Dashboard) adiciona admins.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- 3) RLS ---------------------------------------------------------------------
alter table public.news enable row level security;
alter table public.admin_users enable row level security;

-- Leitura pública: só notícias publicadas (usado pelo build.js com a anon key)
drop policy if exists "public_read_published" on public.news;
create policy "public_read_published" on public.news
  for select
  using (status = 'published' and (published_at is null or published_at <= now()));

-- Admins autenticados enxergam tudo (inclusive rascunhos, p/ dashboard e preview)
drop policy if exists "admin_read_all" on public.news;
create policy "admin_read_all" on public.news
  for select
  using (auth.uid() in (select user_id from public.admin_users));

-- Só admins podem criar/editar/excluir
drop policy if exists "admin_write" on public.news;
create policy "admin_write" on public.news
  for insert
  with check (auth.uid() in (select user_id from public.admin_users));

drop policy if exists "admin_update" on public.news;
create policy "admin_update" on public.news
  for update
  using (auth.uid() in (select user_id from public.admin_users))
  with check (auth.uid() in (select user_id from public.admin_users));

drop policy if exists "admin_delete" on public.news;
create policy "admin_delete" on public.news
  for delete
  using (auth.uid() in (select user_id from public.admin_users));

-- admin_users: cada usuário só enxerga a própria linha (usado só para checar "sou admin?")
drop policy if exists "self_read" on public.admin_users;
create policy "self_read" on public.admin_users
  for select
  using (auth.uid() = user_id);

-- 4) Storage: bucket de imagens de notícias ----------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('news-images', 'news-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 10485760,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Leitura pública dos arquivos (bucket já é público, política extra por clareza)
drop policy if exists "news_images_public_read" on storage.objects;
create policy "news_images_public_read" on storage.objects
  for select
  using (bucket_id = 'news-images');

-- Upload/edição/exclusão só por admins
drop policy if exists "news_images_admin_write" on storage.objects;
create policy "news_images_admin_write" on storage.objects
  for insert
  with check (
    bucket_id = 'news-images'
    and auth.uid() in (select user_id from public.admin_users)
  );

drop policy if exists "news_images_admin_update" on storage.objects;
create policy "news_images_admin_update" on storage.objects
  for update
  using (
    bucket_id = 'news-images'
    and auth.uid() in (select user_id from public.admin_users)
  );

drop policy if exists "news_images_admin_delete" on storage.objects;
create policy "news_images_admin_delete" on storage.objects
  for delete
  using (
    bucket_id = 'news-images'
    and auth.uid() in (select user_id from public.admin_users)
  );

-- ============================================================
-- Depois de rodar este script:
-- 1. Crie o primeiro usuário em Authentication → Users → Add user
--    (Auto Confirm User = true, ou confirme o e-mail depois).
-- 2. Pegue o UUID desse usuário e rode:
--    insert into public.admin_users (user_id, email)
--    values ('COLE-O-UUID-AQUI', 'email@do-usuario.com');
-- 3. Em Authentication → Providers → Email, desative "Allow new users to
--    sign up" para que ninguém crie conta sozinho pelo /admin.
-- ============================================================
