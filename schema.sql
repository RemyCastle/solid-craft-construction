CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  hero_title TEXT NOT NULL,
  hero_lead TEXT NOT NULL,
  about TEXT NOT NULL,
  joel_name TEXT NOT NULL,
  joel_phone_display TEXT NOT NULL,
  joel_phone_footer TEXT NOT NULL,
  joel_phone_tel TEXT NOT NULL,
  joel_cta TEXT NOT NULL,
  ahren_name TEXT NOT NULL,
  ahren_phone_display TEXT NOT NULL,
  ahren_phone_footer TEXT NOT NULL,
  ahren_phone_tel TEXT NOT NULL,
  ahren_cta TEXT NOT NULL,
  email TEXT NOT NULL,
  spanish TEXT NOT NULL,
  cta_secondary TEXT NOT NULL,
  quote_heading TEXT NOT NULL,
  quote_submit TEXT NOT NULL,
  quote_helper TEXT NOT NULL,
  quote_photos TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  line TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  src TEXT NOT NULL,
  r2_key TEXT,
  job_preset TEXT NOT NULL DEFAULT '',
  job_custom TEXT NOT NULL DEFAULT '',
  width INTEGER,
  height INTEGER,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS comparisons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  before_src TEXT NOT NULL DEFAULT '',
  before_key TEXT,
  after_src TEXT NOT NULL DEFAULT '',
  after_key TEXT,
  job_preset TEXT NOT NULL DEFAULT '',
  job_custom TEXT NOT NULL DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  stars INTEGER NOT NULL,
  text TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  job TEXT NOT NULL DEFAULT '',
  need TEXT NOT NULL,
  photo_key TEXT,
  photo_keys TEXT,
  status TEXT NOT NULL DEFAULT 'unread'
);
