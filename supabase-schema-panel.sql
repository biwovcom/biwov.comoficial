-- Esquema del panel privado (/panel) de biwov_. Se corre en el SQL Editor
-- de Supabase. No toca las tablas del sitio público (leads, contract_acceptances).
-- Este archivo se AMPLÍA en cada fase (Fase 1: solo "prospectos"); siempre
-- se puede volver a correr completo gracias a "if not exists".

-- =========================================================
-- Función utilitaria para mantener updated_at al día
-- =========================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================================
-- PROSPECTOS
-- =========================================================
create table if not exists prospectos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) default auth.uid(),

  nombre text not null,
  empresa text,
  tipo_negocio text,
  whatsapp text not null,
  email text,
  pais text,
  ciudad text,
  canal_origen text,
  notas text,

  paso_actual text not null default 'nuevo'
    check (paso_actual in ('nuevo','filtro','diagnostico','analisis','propuesta_enviada','ganado','perdido')),
  semaforo text
    check (semaforo in ('verde','amarillo','rojo'))
);

-- Por si la tabla ya existía de una fase anterior sin esta columna.
alter table prospectos add column if not exists tipo_negocio text;

drop trigger if exists prospectos_set_updated_at on prospectos;
create trigger prospectos_set_updated_at
  before update on prospectos
  for each row execute function set_updated_at();

create index if not exists idx_prospectos_paso_actual on prospectos(paso_actual);
create index if not exists idx_prospectos_semaforo on prospectos(semaforo);
create index if not exists idx_prospectos_created_at on prospectos(created_at desc);

-- =========================================================
-- RLS — herramienta interna: cualquier usuario autenticado
-- (Kathe y su equipo) puede leer/escribir todo. No hay noción de
-- "solo mis prospectos" porque es un CRM de equipo, no multi-tenant.
-- =========================================================
alter table prospectos enable row level security;

drop policy if exists "equipo autenticado - todo" on prospectos;
create policy "equipo autenticado - todo" on prospectos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================
-- FILTRO RÁPIDO (histórico: se puede repetir el filtro)
-- =========================================================
create table if not exists filtro_respuestas (
  id uuid primary key default gen_random_uuid(),
  prospecto_id uuid not null references prospectos(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) default auth.uid(),

  respuestas jsonb not null,
  semaforo text not null check (semaforo in ('verde','amarillo','rojo')),
  razon text
);

create index if not exists idx_filtro_prospecto on filtro_respuestas(prospecto_id, created_at desc);

alter table filtro_respuestas enable row level security;

drop policy if exists "equipo autenticado - todo" on filtro_respuestas;
create policy "equipo autenticado - todo" on filtro_respuestas
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================
-- DIAGNÓSTICO LARGO (1 por prospecto, se autoguarda / sobreescribe)
-- =========================================================
create table if not exists diagnostico_respuestas (
  id uuid primary key default gen_random_uuid(),
  prospecto_id uuid not null unique references prospectos(id) on delete cascade,

  respuestas jsonb not null default '{}'::jsonb,
  bloques_completados text[] not null default '{}',
  completado boolean not null default false,

  ultima_actualizacion timestamptz not null default now()
);

alter table diagnostico_respuestas enable row level security;

drop policy if exists "equipo autenticado - todo" on diagnostico_respuestas;
create policy "equipo autenticado - todo" on diagnostico_respuestas
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
