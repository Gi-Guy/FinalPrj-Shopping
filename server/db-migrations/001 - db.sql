
-- CREATE TABLE IF NOT EXISTS users (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   email TEXT UNIQUE NOT NULL,
--   location TEXT,
--   bio TEXT,
--   avatar TEXT
-- );
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  gender TEXT,
  phone TEXT,
  is_seller BOOLEAN DEFAULT FALSE,
  shop_id INTEGER REFERENCES shops(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
-- shop tale.sql
-- TENP UNTIL USERS TABLE IS CREATED
-- CREATE TABLE IF NOT EXISTS shops (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   description TEXT,
--   slug TEXT UNIQUE,
--   is_active BOOLEAN DEFAULT true,
--   location TEXT,
--   working_hours TEXT,
--   owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- TENP UNTIL USERS TABLE IS CREATED
CREATE TABLE IF NOT EXISTS shops (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  location TEXT,
  working_hours TEXT,
  owner_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Category table.sql
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  slug TEXT NOT NULL,
  shop_id INTEGER NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (slug, shop_id)
);