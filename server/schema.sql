-- ── Profiles ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            TEXT        PRIMARY KEY,
  email         TEXT        UNIQUE NOT NULL,
  full_name     TEXT        NOT NULL,
  phone         TEXT,
  role          TEXT        NOT NULL DEFAULT 'public',
  shield_score  INTEGER     NOT NULL DEFAULT 0,
  avatar_url    TEXT,
  city          TEXT,
  verified      BOOLEAN     NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  password_hash TEXT        NOT NULL
);

-- ── Properties ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id                 TEXT        PRIMARY KEY,
  title              TEXT        NOT NULL,
  description        TEXT        NOT NULL,
  price              BIGINT      NOT NULL,
  property_type      TEXT        NOT NULL DEFAULT 'house',
  city               TEXT        NOT NULL,
  address            TEXT        NOT NULL,
  lat                NUMERIC,
  lng                NUMERIC,
  photos             TEXT[]      NOT NULL DEFAULT '{}',
  title_doc_url      TEXT,
  status             TEXT        NOT NULL DEFAULT 'pending',
  shield_verified    BOOLEAN     NOT NULL DEFAULT false,
  fraud_report_count INTEGER     NOT NULL DEFAULT 0,
  agent_id           TEXT        REFERENCES profiles(id) ON DELETE SET NULL,
  agent_name         TEXT        NOT NULL DEFAULT '',
  bedrooms           INTEGER,
  bathrooms          INTEGER,
  area_sqm           NUMERIC,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Farms ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farms (
  id            TEXT        PRIMARY KEY,
  owner_id      TEXT        REFERENCES profiles(id) ON DELETE SET NULL,
  owner_name    TEXT        NOT NULL,
  name          TEXT        NOT NULL,
  location      TEXT        NOT NULL,
  city          TEXT        NOT NULL,
  lat           NUMERIC,
  lng           NUMERIC,
  crop_type     TEXT        NOT NULL,
  area_hectares NUMERIC     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Market Prices ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_prices (
  id             TEXT        PRIMARY KEY,
  crop_name      TEXT        NOT NULL,
  price_per_kg   NUMERIC     NOT NULL,
  market         TEXT        NOT NULL,
  city           TEXT        NOT NULL,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trend          TEXT        NOT NULL DEFAULT 'stable',
  change_percent NUMERIC     NOT NULL DEFAULT 0
);

-- ── Crop Diagnoses ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crop_diagnoses (
  id             TEXT        PRIMARY KEY,
  farm_id        TEXT        REFERENCES farms(id) ON DELETE CASCADE,
  image_url      TEXT,
  crop_type      TEXT        NOT NULL,
  diagnosis      TEXT        NOT NULL,
  confidence     INTEGER     NOT NULL,
  severity       TEXT        NOT NULL DEFAULT 'low',
  recommendation TEXT        NOT NULL,
  status         TEXT        NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Farm Diary ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farm_diary_entries (
  id         TEXT        PRIMARY KEY,
  farm_id    TEXT        REFERENCES farms(id) ON DELETE CASCADE,
  date       DATE        NOT NULL,
  activity   TEXT        NOT NULL,
  notes      TEXT        NOT NULL,
  weather    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Applications (contact / inquiries) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id             TEXT        PRIMARY KEY,
  type           TEXT        NOT NULL DEFAULT 'general_contact',
  full_name      TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  city           TEXT,
  message        TEXT        NOT NULL,
  status         TEXT        NOT NULL DEFAULT 'new',
  priority       TEXT        NOT NULL DEFAULT 'medium',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  property_id    TEXT,
  property_title TEXT,
  interest_type  TEXT,
  budget         BIGINT,
  crop_type      TEXT,
  farm_size_ha   NUMERIC,
  challenge      TEXT,
  subject        TEXT,
  admin_notes    TEXT
);

-- ── Admin Queue ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_queue_items (
  id           TEXT        PRIMARY KEY,
  type         TEXT        NOT NULL,
  ref_id       TEXT        NOT NULL,
  title        TEXT        NOT NULL,
  submitted_by TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'pending',
  priority     TEXT        NOT NULL DEFAULT 'medium',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Listing Submissions (public agent form) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_submissions (
  id            TEXT        PRIMARY KEY,
  agent_name    TEXT        NOT NULL,
  agent_email   TEXT        NOT NULL,
  agent_phone   TEXT        NOT NULL,
  agency_name   TEXT,
  title         TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  property_type TEXT        NOT NULL DEFAULT 'house',
  city          TEXT        NOT NULL,
  address       TEXT        NOT NULL,
  price         BIGINT      NOT NULL,
  bedrooms      INTEGER,
  bathrooms     INTEGER,
  area_sqm      NUMERIC,
  has_title_doc BOOLEAN     NOT NULL DEFAULT false,
  extra_notes   TEXT,
  status        TEXT        NOT NULL DEFAULT 'pending',
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
