CREATE TABLE IF NOT EXISTS assumable_data (
  unique_id TEXT PRIMARY KEY,
  listing_key TEXT UNIQUE NOT NULL,
  interest_rate REAL,
  remaining_balance REAL,
  down_payment_required REAL,
  rental_restrictions TEXT NOT NULL DEFAULT 'Not known',
  balance_loan_term INTEGER
);
CREATE TABLE IF NOT EXISTS custom_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  badge TEXT,
  note TEXT
);
CREATE TABLE IF NOT EXISTS custom_fields (
  id TEXT PRIMARY KEY,
  category_id TEXT,
  name TEXT NOT NULL,
  type TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS custom_values (
  listing_key TEXT NOT NULL,
  field_id TEXT NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY (listing_key, field_id)
);
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL,
  phone TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  intent TEXT,
  source TEXT,
  home TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  submitted_at TEXT NOT NULL,
  sample INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  client_id TEXT,
  home_id INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS saved_searches (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  client_id TEXT,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  client_id TEXT,
  payload TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  payload TEXT,
  created_at TEXT NOT NULL
);
