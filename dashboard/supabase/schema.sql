-- ============================================================
-- ShieldNet Dashboard — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── Profiles ───────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text not null,
  phone text,
  role text not null default 'public'
    check (role in ('admin','agent','farmer','public')),
  shield_score integer not null default 50
    check (shield_score between 0 and 100),
  avatar_url text,
  city text check (city in ('Abuja','Lagos')),
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Users view own profile"      on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile"    on public.profiles for update using (auth.uid() = id);
create policy "Admins view all profiles"    on public.profiles for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ─── Properties ─────────────────────────────────────────────
create table public.properties (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price bigint not null,
  property_type text not null
    check (property_type in ('land','house','apartment','commercial')),
  city text not null check (city in ('Abuja','Lagos')),
  address text not null,
  lat decimal(10,7) not null,
  lng decimal(10,7) not null,
  photos text[] default '{}',
  title_doc_url text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','flagged')),
  shield_verified boolean not null default false,
  fraud_report_count integer not null default 0,
  agent_id uuid references public.profiles(id),
  agent_name text,
  bedrooms integer,
  bathrooms integer,
  area_sqm integer,
  created_at timestamptz not null default now()
);
alter table public.properties enable row level security;

create policy "Public view approved"   on public.properties for select using (status = 'approved');
create policy "Agents insert"          on public.properties for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('agent','admin'))
);
create policy "Agents update own"      on public.properties for update using (
  agent_id = auth.uid() or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins view all props"  on public.properties for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── Farms ──────────────────────────────────────────────────
create table public.farms (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id),
  owner_name text,
  name text not null,
  location text not null,
  city text not null check (city in ('Abuja','Lagos')),
  lat decimal(10,7) not null,
  lng decimal(10,7) not null,
  crop_type text not null,
  area_hectares decimal(10,2) not null,
  created_at timestamptz not null default now()
);
alter table public.farms enable row level security;

create policy "Farmers view own farms" on public.farms for select using (owner_id = auth.uid());
create policy "Farmers insert farms"   on public.farms for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('farmer','admin'))
);
create policy "Admins view all farms"  on public.farms for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── Farm Diary ──────────────────────────────────────────────
create table public.farm_diary (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade,
  date date not null,
  activity text not null,
  notes text,
  weather text,
  created_at timestamptz not null default now()
);
alter table public.farm_diary enable row level security;

create policy "Farm owners manage diary" on public.farm_diary
  using (exists (select 1 from public.farms where id = farm_id and owner_id = auth.uid()));

-- ─── Crop Diagnoses ─────────────────────────────────────────
create table public.crop_diagnoses (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade,
  image_url text not null,
  crop_type text not null,
  diagnosis text,
  confidence integer,
  severity text check (severity in ('low','medium','high')),
  recommendation text,
  status text not null default 'pending'
    check (status in ('pending','reviewed')),
  created_at timestamptz not null default now()
);
alter table public.crop_diagnoses enable row level security;

create policy "Farm owners view diagnoses" on public.crop_diagnoses
  using (exists (select 1 from public.farms where id = farm_id and owner_id = auth.uid()));
create policy "Admins view all diagnoses"  on public.crop_diagnoses for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── Market Prices ──────────────────────────────────────────
create table public.market_prices (
  id uuid primary key default uuid_generate_v4(),
  crop_name text not null,
  price_per_kg decimal(10,2) not null,
  market text not null,
  city text not null check (city in ('Abuja','Lagos')),
  trend text check (trend in ('up','down','stable')),
  change_percent decimal(5,2),
  updated_at timestamptz not null default now()
);
alter table public.market_prices enable row level security;
create policy "Public view prices" on public.market_prices for select using (true);

-- ─── Fraud Reports ──────────────────────────────────────────
create table public.fraud_reports (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references public.properties(id) on delete cascade,
  reporter_id uuid references public.profiles(id),
  reason text not null,
  details text,
  status text not null default 'open'
    check (status in ('open','investigating','resolved')),
  created_at timestamptz not null default now()
);
alter table public.fraud_reports enable row level security;

create policy "Auth users submit reports" on public.fraud_reports for insert
  with check (auth.uid() is not null);
create policy "Admins view reports"       on public.fraud_reports for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── Auto-create profile on signup ──────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role','public')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Realtime ────────────────────────────────────────────────
alter publication supabase_realtime add table public.properties;
alter publication supabase_realtime add table public.fraud_reports;
