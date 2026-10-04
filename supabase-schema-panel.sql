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
  redes_sociales text,
  whatsapp text not null,
  email text,
  pais text,
  ciudad text,
  canal_origen text,
  notas text,

  paso_actual text not null default 'nuevo'
    check (paso_actual in ('nuevo','filtro','llamada','diagnostico','analisis','propuesta_enviada','ganado','perdido')),
  semaforo text
    check (semaforo in ('verde','amarillo','rojo')),

  categoria text default 'contacto'
    check (categoria in ('contacto','lead','prospecto','cliente')),
  nicho_mercado text,

  link_redes_prospecto text,
  que_quiere_resolver text
);

-- Por si la tabla ya existía de una fase anterior sin estas columnas.
alter table prospectos add column if not exists tipo_negocio text;
alter table prospectos add column if not exists redes_sociales text;
alter table prospectos add column if not exists link_redes_prospecto text;
alter table prospectos add column if not exists que_quiere_resolver text;
alter table prospectos add column if not exists categoria text default 'contacto';
alter table prospectos add column if not exists nicho_mercado text;

-- Por si la tabla ya existía con el check antiguo (sin 'llamada' como paso válido).
alter table prospectos drop constraint if exists prospectos_paso_actual_check;
alter table prospectos add constraint prospectos_paso_actual_check
  check (paso_actual in ('nuevo','filtro','llamada','diagnostico','analisis','propuesta_enviada','ganado','perdido'));

alter table prospectos drop constraint if exists prospectos_categoria_check;
alter table prospectos add constraint prospectos_categoria_check
  check (categoria in ('contacto','lead','prospecto','cliente'));

-- Etiqueta (contacto/lead/prospecto/cliente) de lo que ya existía: a falta de
-- mejor señal, se infiere del avance que ya tiene en el embudo. Es un punto
-- de partida editable desde la ficha de cada prospecto, no una regla fija.
update prospectos set categoria = 'contacto'
  where categoria is null and paso_actual = 'nuevo';
update prospectos set categoria = 'lead'
  where categoria is null and paso_actual = 'filtro';
update prospectos set categoria = 'prospecto'
  where categoria is null and paso_actual in ('llamada','diagnostico','analisis','propuesta_enviada','perdido');
update prospectos set categoria = 'cliente'
  where categoria is null and paso_actual = 'ganado';
-- Por si ya se habían clasificado antes de existir la etiqueta "cliente".
update prospectos set categoria = 'cliente'
  where paso_actual = 'ganado' and categoria = 'prospecto';

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

-- =========================================================
-- ANÁLISIS CON IA (historial de versiones por prospecto)
-- =========================================================
create table if not exists analisis_ia (
  id uuid primary key default gen_random_uuid(),
  prospecto_id uuid not null references prospectos(id) on delete cascade,
  version int not null default 1,

  origen text not null default 'ia' check (origen in ('ia','manual')),

  generado_por_ia jsonb,   -- salida cruda de la IA automática, nunca se edita (auditoría)
  contenido_editado jsonb, -- copia editable de la salida estructurada de la IA automática
  texto_manual text,       -- pegado a mano desde claude.ai u otro lado, cuando origen = 'manual'
  modelo text,

  creado_en timestamptz not null default now(),
  editado_en timestamptz,
  editado_por uuid references auth.users(id),

  estado text not null default 'borrador' check (estado in ('borrador','aprobado'))
);

-- Por si la tabla ya existía de antes con estas columnas como NOT NULL.
alter table analisis_ia alter column generado_por_ia drop not null;
alter table analisis_ia alter column contenido_editado drop not null;
alter table analisis_ia alter column modelo drop not null;
alter table analisis_ia add column if not exists origen text not null default 'ia' check (origen in ('ia','manual'));
alter table analisis_ia add column if not exists texto_manual text;

create index if not exists idx_analisis_prospecto on analisis_ia(prospecto_id, version desc);

alter table analisis_ia enable row level security;

drop policy if exists "equipo autenticado - todo" on analisis_ia;
create policy "equipo autenticado - todo" on analisis_ia
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================
-- PREPARACIÓN DE LA LLAMADA (10 preguntas clave, 1 por prospecto)
-- =========================================================
create table if not exists llamada_respuestas (
  id uuid primary key default gen_random_uuid(),
  prospecto_id uuid not null unique references prospectos(id) on delete cascade,

  respuestas jsonb not null default '{}'::jsonb,
  completado boolean not null default false,

  ultima_actualizacion timestamptz not null default now()
);

alter table llamada_respuestas enable row level security;

drop policy if exists "equipo autenticado - todo" on llamada_respuestas;
create policy "equipo autenticado - todo" on llamada_respuestas
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================
-- COTIZADOR (TRM + mano de obra, costos de proveedores, tarifas base)
-- Base para armar paquetes más adelante. No toca las tablas de prospectos.
-- =========================================================
create table if not exists cotizador_config (
  id int primary key default 1 check (id = 1),
  trm numeric not null default 3900,
  salario_deseado numeric not null default 2000000,
  costos_fijos_mes numeric not null default 200000,
  horas_facturables_mes numeric not null default 40,
  updated_at timestamptz not null default now()
);

insert into cotizador_config (id) values (1) on conflict (id) do nothing;

create table if not exists cotizador_costos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  proveedor text not null default '',
  contacto text,
  concepto text not null default '',
  unidad text,
  moneda text not null default 'COP' check (moneda in ('COP','USD')),
  costo numeric not null default 0,
  orden int not null default 0
);

-- Qué incluye cada plan / entregables (se agregó después de crear la tabla).
alter table cotizador_costos add column if not exists detalle text;

create table if not exists cotizador_tarifas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  grupo text,
  servicio text not null default '',
  unidad text,
  horas numeric not null default 0,
  precio_cliente numeric not null default 0,
  -- [{key, tipo:'proveedor', costo_id, cantidad} | {key, tipo:'manual', descripcion, moneda, costo, cantidad}]
  componentes jsonb not null default '[]'::jsonb,
  orden int not null default 0
);

drop trigger if exists cotizador_config_set_updated_at on cotizador_config;
create trigger cotizador_config_set_updated_at
  before update on cotizador_config for each row execute function set_updated_at();
drop trigger if exists cotizador_costos_set_updated_at on cotizador_costos;
create trigger cotizador_costos_set_updated_at
  before update on cotizador_costos for each row execute function set_updated_at();
drop trigger if exists cotizador_tarifas_set_updated_at on cotizador_tarifas;
create trigger cotizador_tarifas_set_updated_at
  before update on cotizador_tarifas for each row execute function set_updated_at();

alter table cotizador_config enable row level security;
alter table cotizador_costos enable row level security;
alter table cotizador_tarifas enable row level security;

drop policy if exists "equipo autenticado - todo" on cotizador_config;
create policy "equipo autenticado - todo" on cotizador_config
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "equipo autenticado - todo" on cotizador_costos;
create policy "equipo autenticado - todo" on cotizador_costos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "equipo autenticado - todo" on cotizador_tarifas;
create policy "equipo autenticado - todo" on cotizador_tarifas
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Datos iniciales (tarifas confirmadas el 15 sep 2026). Solo se cargan si
-- las tablas están vacías, así que volver a correr el archivo no duplica nada.
do $$
declare
  v_img uuid; v_car uuid; v_ed uuid; v_gr uuid; v_sub uuid; v_copy uuid;
begin
  if exists (select 1 from cotizador_costos) or exists (select 1 from cotizador_tarifas) then
    return;
  end if;

  insert into cotizador_costos (proveedor, contacto, concepto, unidad, costo, orden) values
    ('Josue Oyola', '315 655 0301 / 311 304 2262', 'Edición de video', 'video', 50000, 1),
    ('Josue Oyola', '315 655 0301 / 311 304 2262', 'Fotografía editada', 'foto', 12000, 2),
    ('Josue Oyola', '315 655 0301 / 311 304 2262', 'Grabación de video', 'sesión', 80000, 3);
  insert into cotizador_costos (proveedor, contacto, concepto, unidad, costo, orden)
    values ('Valentina · Valen Workshop', '+57 311 407 3630', 'Edición de video', 'video', 50000, 4)
    returning id into v_ed;
  insert into cotizador_costos (proveedor, contacto, concepto, unidad, costo, orden)
    values ('Valentina · Valen Workshop', '+57 311 407 3630', 'Grabación', 'sesión', 50000, 5)
    returning id into v_gr;
  insert into cotizador_costos (proveedor, contacto, concepto, unidad, costo, orden)
    values ('Valeria · Valeria Publicista', '+57 320 719 5103', 'Imagen', 'pieza', 13000, 6)
    returning id into v_img;
  insert into cotizador_costos (proveedor, contacto, concepto, unidad, costo, orden)
    values ('Valeria · Valeria Publicista', '+57 320 719 5103', 'Carrusel', 'set', 20000, 7)
    returning id into v_car;
  insert into cotizador_costos (proveedor, contacto, concepto, unidad, costo, orden)
    values ('Asistente', null, 'Subida de contenido', 'mes', 100000, 8)
    returning id into v_sub;
  insert into cotizador_costos (proveedor, contacto, concepto, unidad, costo, orden)
    values ('Asistente', null, 'Copywriting', 'mes', 100000, 9)
    returning id into v_copy;

  insert into cotizador_tarifas (grupo, servicio, unidad, horas, precio_cliente, componentes, orden) values
    ('Contenido', 'Imagen / pieza estática', 'pieza', 0, 18000,
      jsonb_build_array(jsonb_build_object('key','s1','tipo','proveedor','costo_id',v_img,'cantidad',1)), 1),
    ('Contenido', 'Carrusel (set ~5 piezas)', 'carrusel', 0, 30000,
      jsonb_build_array(jsonb_build_object('key','s2','tipo','proveedor','costo_id',v_car,'cantidad',1)), 2),
    ('Contenido', 'Historia (pieza individual)', 'historia', 0, 15000,
      jsonb_build_array(jsonb_build_object('key','s3','tipo','proveedor','costo_id',v_img,'cantidad',1)), 3),
    ('Contenido', 'Video completo (grabación + edición)', 'video', 0, 180000,
      jsonb_build_array(
        jsonb_build_object('key','s4','tipo','proveedor','costo_id',v_gr,'cantidad',1),
        jsonb_build_object('key','s5','tipo','proveedor','costo_id',v_ed,'cantidad',1)), 4),
    ('Contenido', 'Edición de video (el cliente entrega la grabación)', 'video', 0, 80000,
      jsonb_build_array(jsonb_build_object('key','s6','tipo','proveedor','costo_id',v_ed,'cantidad',1)), 5),
    ('Contenido', 'Grabación sola — la hace Valentina', 'sesión', 0, 110000,
      jsonb_build_array(jsonb_build_object('key','s7','tipo','proveedor','costo_id',v_gr,'cantidad',1)), 6),
    ('Contenido', 'Grabación sola — la haces tú', 'sesión', 2, 110000, '[]'::jsonb, 7),
    ('Gestión mensual', 'Subida de contenido', 'mes', 0.5, 200000,
      jsonb_build_array(jsonb_build_object('key','s8','tipo','proveedor','costo_id',v_sub,'cantidad',1)), 8),
    ('Gestión mensual', 'Copywriting', 'mes', 0.5, 200000,
      jsonb_build_array(jsonb_build_object('key','s9','tipo','proveedor','costo_id',v_copy,'cantidad',1)), 9),
    ('Gestión mensual', 'Estrategia de contenido', 'mes', 3, 200000, '[]'::jsonb, 10),
    ('Gestión mensual', 'Asesoría y acompañamiento', 'mes', 2, 150000, '[]'::jsonb, 11),
    ('Gestión mensual', 'Gestión campaña publicitaria básica', 'mes', 2, 200000, '[]'::jsonb, 12),
    ('Gestión mensual', 'Gestión campaña publicitaria avanzada', 'mes', 4, 350000, '[]'::jsonb, 13),
    ('Único / montaje', 'Creación de redes IG + FB + TikTok', 'único', 2.5, 180000, '[]'::jsonb, 14),
    ('Único / montaje', 'Optimización de perfiles existentes', 'único', 1.5, 120000, '[]'::jsonb, 15),
    ('Único / montaje', 'Diagnóstico y estrategia inicial (Fase 0)', 'único', 6, 400000, '[]'::jsonb, 16),
    ('Único / montaje', 'Puesta en marcha de campaña (cuenta, píxel, primera campaña)', 'único', 3, 250000, '[]'::jsonb, 17),
    ('Único / montaje', 'Página web básica (con Claude Code)', 'único', 4, 1300000,
      jsonb_build_array(
        jsonb_build_object('key','s10','tipo','manual','descripcion','Dominio (1 año)','moneda','COP','costo',0,'cantidad',1),
        jsonb_build_object('key','s11','tipo','manual','descripcion','Hosting (1 año)','moneda','COP','costo',200000,'cantidad',1),
        jsonb_build_object('key','s12','tipo','manual','descripcion','Claude Code (prorrateo)','moneda','COP','costo',80000,'cantidad',1)), 18),
    ('Recurrente (año 2 en adelante)', 'Renovación anual de hosting + dominio', 'año', 0, 275000,
      jsonb_build_array(
        jsonb_build_object('key','s13','tipo','manual','descripcion','Hosting + dominio (renovación)','moneda','COP','costo',200000,'cantidad',1)), 19);
end $$;

-- =========================================================
-- PAQUETES (combinaciones de tarifas base + ítems manuales)
-- =========================================================
create table if not exists cotizador_paquetes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nombre text not null default '',
  descripcion text,
  -- [{key, tipo:'tarifa', tarifa_id, cantidad} | {key, tipo:'manual', descripcion, costo, precio, cantidad}]
  items jsonb not null default '[]'::jsonb,
  precio_final numeric, -- null = se cobra la suma de los ítems
  orden int not null default 0
);

drop trigger if exists cotizador_paquetes_set_updated_at on cotizador_paquetes;
create trigger cotizador_paquetes_set_updated_at
  before update on cotizador_paquetes for each row execute function set_updated_at();

alter table cotizador_paquetes enable row level security;

drop policy if exists "equipo autenticado - todo" on cotizador_paquetes;
create policy "equipo autenticado - todo" on cotizador_paquetes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Envío al cliente: precio en USD (null = se calcula con la TRM) y links de pago.
alter table cotizador_paquetes add column if not exists precio_usd numeric;
alter table cotizador_paquetes add column if not exists link_pago_cop text;
alter table cotizador_paquetes add column if not exists link_pago_usd text;

-- =========================================================
-- ACEPTACIONES DE COTIZACIONES (el cliente acepta en /cotizacion/[id])
-- Se insertan desde el servidor con service role; el equipo las lee en el panel.
-- =========================================================
create table if not exists cotizador_aceptaciones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  paquete_id uuid references cotizador_paquetes(id) on delete set null,
  nombre text not null,
  email text,
  whatsapp text,
  empresa text,
  moneda text not null check (moneda in ('COP','USD')),
  monto numeric not null,
  snapshot jsonb not null default '{}'::jsonb -- lo que el cliente vio y aceptó
);

create index if not exists idx_aceptaciones_paquete on cotizador_aceptaciones(paquete_id, created_at desc);

alter table cotizador_aceptaciones enable row level security;

drop policy if exists "equipo autenticado - todo" on cotizador_aceptaciones;
create policy "equipo autenticado - todo" on cotizador_aceptaciones
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- COMBINAR PAQUETES + DESCUENTO POR CANTIDAD
-- Descuento automático por cantidad de servicios en un paquete (tramos editables desde el panel).
alter table cotizador_config add column if not exists descuentos_volumen jsonb not null
  default '[{"min":2,"pct":5},{"min":3,"pct":10},{"min":4,"pct":15}]'::jsonb;

-- Cada paquete decide si aplica ese descuento. Los paquetes que ya existían quedan
-- en false para que su precio no cambie solo; los nuevos se crean con true.
alter table cotizador_paquetes add column if not exists aplicar_descuento boolean not null default false;

-- =========================================================
-- REGISTROS DE TIEMPO
-- Cuánto se demora Kathe en cada tipo de ejecución (flujos, sitios web,
-- landing pages, campañas, etc.), por proyecto. Base para ir calculando
-- promedios reales de tiempo por tarea.
-- =========================================================
create table if not exists registros_tiempo (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) default auth.uid(),

  fecha date not null default current_date,
  categoria text not null,
  proyecto text,
  horas numeric(5,2) not null check (horas > 0),
  notas text
);

create index if not exists idx_registros_tiempo_fecha on registros_tiempo(fecha desc);

alter table registros_tiempo enable row level security;

drop policy if exists "equipo autenticado - todo" on registros_tiempo;
create policy "equipo autenticado - todo" on registros_tiempo
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
