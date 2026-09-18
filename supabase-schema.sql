create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text,
  empresa text,
  whatsapp text,
  email text,
  tipo_negocio text,
  trayectoria text,
  redes text[],
  seguidores jsonb,
  gestion_leads text,
  branding_estado text,
  objetivo text,
  presupuesto text,
  urgencia text,
  ecosistema_recomendado text,
  mensualidad_cotizada numeric,
  forma_pago text,
  canal text,
  contrato_aceptado_en timestamptz
);

create table if not exists contract_acceptances (
  id uuid primary key default gen_random_uuid(),
  accepted_at timestamptz not null default now(),
  nombre text,
  email text,
  empresa text,
  whatsapp text,
  version_contrato text not null
);
