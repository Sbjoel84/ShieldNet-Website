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
