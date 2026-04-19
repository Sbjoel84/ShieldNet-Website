-- ============================================================
-- ShieldNet Core Technologies — Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================


-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";


-- ============================================================
-- CUSTOM TYPES
-- ============================================================
create type user_role        as enum ('admin', 'agent', 'farmer', 'public');
create type city_type        as enum ('Abuja', 'Lagos');
create type property_type    as enum ('land', 'house', 'apartment', 'commercial');
create type property_status  as enum ('pending', 'approved', 'rejected', 'flagged', 'sold');
create type severity_level   as enum ('low', 'medium', 'high');
create type trend_type       as enum ('up', 'down', 'stable');
create type queue_item_type  as enum ('property_approval', 'ai_scan_review', 'fraud_report');
create type review_status    as enum ('pending', 'approved', 'rejected');
create type fraud_status     as enum ('open', 'investigating', 'resolved');
create type app_type         as enum ('property_inquiry', 'farm_consultation', 'general_contact');
create type app_status       as enum ('new', 'contacted', 'processing', 'completed', 'rejected');
create type interest_type    as enum ('buy', 'rent', 'invest');
create type priority_level   as enum ('low', 'medium', 'high');


-- ============================================================
-- PROFILES
-- mirrors auth.users — auto-created on signup via trigger
-- ============================================================
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  full_name     text not null default '',
  phone         text,
  role          user_role not null default 'public',
  shield_score  int not null default 0 check (shield_score between 0 and 100),
  avatar_url    text,
  city          city_type,
  verified      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- ============================================================
-- PROPERTIES
-- ============================================================
create table properties (
  id                  uuid primary key default uuid_generate_v4(),
  title               text not null,
  description         text not null default '',
  price               bigint not null check (price > 0),
  property_type       property_type not null,
  city                city_type not null,
  address             text not null,
  lat                 double precision not null,
  lng                 double precision not null,
  photos              text[] not null default '{}',
  title_doc_url       text,
  status              property_status not null default 'pending',
  shield_verified     boolean not null default false,
  fraud_report_count  int not null default 0,
  agent_id            uuid references profiles(id) on delete set null,
  agent_name          text not null default '',
  bedrooms            int,
  bathrooms           int,
  area_sqm            int,
  created_at          timestamptz not null default now()
);


-- ============================================================
-- FARMS
-- ============================================================
create table farms (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid references profiles(id) on delete cascade,
  owner_name      text not null default '',
  name            text not null,
  location        text not null,
  city            city_type not null,
  lat             double precision not null,
  lng             double precision not null,
  crop_type       text not null,
  area_hectares   double precision not null check (area_hectares > 0),
  created_at      timestamptz not null default now()
);


-- ============================================================
-- FARM DIARY ENTRIES
-- ============================================================
create table farm_diary_entries (
  id          uuid primary key default uuid_generate_v4(),
  farm_id     uuid not null references farms(id) on delete cascade,
  date        date not null,
  activity    text not null,
  notes       text not null default '',
  weather     text,
  created_at  timestamptz not null default now()
);


-- ============================================================
-- CROP DIAGNOSES
-- ============================================================
create table crop_diagnoses (
  id              uuid primary key default uuid_generate_v4(),
  farm_id         uuid not null references farms(id) on delete cascade,
  image_url       text not null,
  crop_type       text not null,
  diagnosis       text not null,
  confidence      int not null check (confidence between 0 and 100),
  severity        severity_level not null,
  recommendation  text not null default '',
  status          review_status not null default 'pending',
  created_at      timestamptz not null default now()
);


-- ============================================================
-- MARKET PRICES
-- ============================================================
create table market_prices (
  id              uuid primary key default uuid_generate_v4(),
  crop_name       text not null,
  price_per_kg    int not null check (price_per_kg > 0),
  market          text not null,
  city            city_type not null,
  trend           trend_type not null default 'stable',
  change_percent  double precision not null default 0,
  updated_at      timestamptz not null default now()
);


-- ============================================================
-- FRAUD REPORTS
-- ============================================================
create table fraud_reports (
  id           uuid primary key default uuid_generate_v4(),
  property_id  uuid not null references properties(id) on delete cascade,
  reporter_id  uuid references profiles(id) on delete set null,
  reason       text not null,
  details      text not null default '',
  status       fraud_status not null default 'open',
  created_at   timestamptz not null default now()
);

-- Auto-increment fraud_report_count when a report is added
create or replace function increment_fraud_count()
returns trigger language plpgsql security definer as $$
begin
  update properties set fraud_report_count = fraud_report_count + 1
  where id = new.property_id;
  return new;
end;
$$;

create trigger on_fraud_report_created
  after insert on fraud_reports
  for each row execute procedure increment_fraud_count();


-- ============================================================
-- ADMIN QUEUE
-- ============================================================
create table admin_queue (
  id            uuid primary key default uuid_generate_v4(),
  type          queue_item_type not null,
  ref_id        uuid not null,
  title         text not null,
  submitted_by  text not null,
  status        review_status not null default 'pending',
  priority      priority_level not null default 'medium',
  created_at    timestamptz not null default now()
);


-- ============================================================
-- APPLICATIONS (inquiries, consultations, contact)
-- ============================================================
create table applications (
  id              uuid primary key default uuid_generate_v4(),
  type            app_type not null,
  full_name       text not null,
  email           text not null,
  phone           text not null,
  city            city_type,
  message         text not null default '',
  status          app_status not null default 'new',
  priority        priority_level not null default 'medium',
  -- property inquiry fields
  property_id     uuid references properties(id) on delete set null,
  property_title  text,
  interest_type   interest_type,
  budget          bigint,
  -- farm consultation fields
  crop_type       text,
  farm_size_ha    double precision,
  challenge       text,
  -- general contact fields
  subject         text,
  -- admin
  admin_notes     text,
  created_at      timestamptz not null default now()
);


-- ============================================================
-- INDEXES
-- ============================================================
create index on properties (city, status);
create index on properties (agent_id);
create index on farms (owner_id, city);
create index on farm_diary_entries (farm_id, date desc);
create index on crop_diagnoses (farm_id, status);
create index on market_prices (city, crop_name);
create index on fraud_reports (property_id, status);
create index on admin_queue (status, priority desc);
create index on applications (type, status, created_at desc);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table profiles           enable row level security;
alter table properties         enable row level security;
alter table farms              enable row level security;
alter table farm_diary_entries enable row level security;
alter table crop_diagnoses     enable row level security;
alter table market_prices      enable row level security;
alter table fraud_reports      enable row level security;
alter table admin_queue        enable row level security;
alter table applications       enable row level security;

-- Helper: check if current user is admin
create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: users read/update their own row; admins read all
create policy "profiles: own read"   on profiles for select using (auth.uid() = id or is_admin());
create policy "profiles: own update" on profiles for update using (auth.uid() = id);

-- properties: public can read approved; agents manage their own; admins manage all
create policy "properties: public read"  on properties for select using (status = 'approved' or auth.uid() = agent_id or is_admin());
create policy "properties: agent insert" on properties for insert with check (auth.uid() = agent_id);
create policy "properties: agent update" on properties for update using (auth.uid() = agent_id or is_admin());
create policy "properties: admin delete" on properties for delete using (is_admin());

-- farms: public read; owner + admin write
create policy "farms: public read"  on farms for select using (true);
create policy "farms: owner insert" on farms for insert with check (auth.uid() = owner_id);
create policy "farms: owner update" on farms for update using (auth.uid() = owner_id or is_admin());
create policy "farms: owner delete" on farms for delete using (auth.uid() = owner_id or is_admin());

-- farm diary: farm owner + admins
create policy "diary: owner access" on farm_diary_entries for all
  using (exists (select 1 from farms where id = farm_id and (owner_id = auth.uid() or is_admin())));

-- crop diagnoses: farm owner + admins
create policy "diagnoses: owner access" on crop_diagnoses for all
  using (exists (select 1 from farms where id = farm_id and (owner_id = auth.uid() or is_admin())));

-- market prices: public read; admin write
create policy "market: public read" on market_prices for select using (true);
create policy "market: admin write" on market_prices for all using (is_admin());

-- fraud reports: reporter inserts; admins manage
create policy "fraud: insert"       on fraud_reports for insert with check (auth.uid() = reporter_id);
create policy "fraud: reporter read" on fraud_reports for select using (auth.uid() = reporter_id or is_admin());
create policy "fraud: admin update" on fraud_reports for update using (is_admin());

-- admin queue: admins only
create policy "queue: admin only" on admin_queue for all using (is_admin());

-- applications: anyone inserts (public forms); admins manage
create policy "apps: public insert" on applications for insert with check (true);
create policy "apps: admin read"    on applications for select using (is_admin());
create policy "apps: admin update"  on applications for update using (is_admin());


-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('property-photos', 'property-photos', true),
  ('title-documents', 'title-documents', false),
  ('avatars',         'avatars',         true),
  ('crop-images',     'crop-images',     true)
on conflict (id) do nothing;

-- Storage policies
create policy "property-photos: public read"
  on storage.objects for select using (bucket_id = 'property-photos');
create policy "property-photos: auth upload"
  on storage.objects for insert with check (bucket_id = 'property-photos' and auth.role() = 'authenticated');

create policy "title-docs: agent read"
  on storage.objects for select using (bucket_id = 'title-documents' and auth.role() = 'authenticated');
create policy "title-docs: agent upload"
  on storage.objects for insert with check (bucket_id = 'title-documents' and auth.role() = 'authenticated');

create policy "avatars: public read"
  on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars: own upload"
  on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "crop-images: public read"
  on storage.objects for select using (bucket_id = 'crop-images');
create policy "crop-images: farmer upload"
  on storage.objects for insert with check (bucket_id = 'crop-images' and auth.role() = 'authenticated');


-- ============================================================
-- SEED DATA — Market Prices
-- ============================================================
insert into market_prices (crop_name, price_per_kg, market, city, trend, change_percent, updated_at) values
  ('Maize',        450,  'Garki Market',   'Abuja', 'up',     3.2,   '2026-04-17T06:00:00Z'),
  ('Rice (Local)', 980,  'Wuse Market',    'Abuja', 'stable', 0.5,   '2026-04-17T06:00:00Z'),
  ('Yam',          750,  'Dei-Dei Market', 'Abuja', 'stable', 1.1,   '2026-04-17T06:00:00Z'),
  ('Groundnut',    680,  'Garki Market',   'Abuja', 'down',   -1.5,  '2026-04-17T06:00:00Z'),
  ('Tomatoes',     1200, 'Mile 12 Market', 'Lagos', 'up',     8.5,   '2026-04-17T06:00:00Z'),
  ('Cassava',      180,  'Mushin Market',  'Lagos', 'down',   -2.1,  '2026-04-17T06:00:00Z'),
  ('Plantain',     320,  'Oshodi Market',  'Lagos', 'up',     5.7,   '2026-04-17T06:00:00Z'),
  ('Peppers',      2100, 'Mile 12 Market', 'Lagos', 'up',     12.3,  '2026-04-17T06:00:00Z');
