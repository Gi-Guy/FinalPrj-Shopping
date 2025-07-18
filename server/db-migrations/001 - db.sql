--test table.sql
CREATE TABLE IF NOT EXISTS test_table (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  location TEXT,
  bio TEXT,
  avatar TEXT

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