CREATE TABLE IF NOT EXISTS subscribers (
  id                 TEXT PRIMARY KEY,
  email              TEXT UNIQUE NOT NULL,
  status             TEXT NOT NULL DEFAULT 'pending',
  topics             TEXT NOT NULL DEFAULT '["architecture","leadership","life"]',
  confirmation_token TEXT,
  unsubscribe_token  TEXT NOT NULL,
  confirmed_at       TEXT,
  created_at         TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_confirmation_token ON subscribers(confirmation_token);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_unsubscribe_token ON subscribers(unsubscribe_token);
