/**
 * DATABASE SCHEMA - Neon PostgreSQL
 * Run these SQL commands in your Neon dashboard
 * https://console.neon.tech/
 */

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image_url VARCHAR(500),
  paired_with_user_id UUID REFERENCES users(id),
  relationship_start_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Couples Table
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invite_code VARCHAR(10) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photos Table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  sender_name VARCHAR(255),
  photo_url VARCHAR(500) NOT NULL,
  caption TEXT,
  is_viewed BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMP,
  is_disappearing BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photo Reactions Table
CREATE TABLE photo_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(photo_id, user_id)
);

-- Love Notes Table
CREATE TABLE love_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id),
  from_name VARCHAR(255),
  to_user_id UUID NOT NULL REFERENCES users(id),
  text TEXT NOT NULL,
  sentiment VARCHAR(50) DEFAULT 'romantic', -- romantic, funny, supportive, spicy
  emoji VARCHAR(10) DEFAULT '💕',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Love Note Reactions Table
CREATE TABLE love_note_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID NOT NULL REFERENCES love_notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(note_id, user_id)
);

-- Boops Table
CREATE TABLE boops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id),
  from_name VARCHAR(255),
  to_user_id UUID NOT NULL REFERENCES users(id),
  emoji VARCHAR(10) DEFAULT '👆',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Milestones Table
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  type VARCHAR(50), -- anniversary, birthday, goal, bucket-list, custom
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  emoji VARCHAR(10) DEFAULT '⭐',
  importance VARCHAR(20) DEFAULT 'high', -- low, medium, high
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Date Ideas Table
CREATE TABLE date_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  idea VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  difficulty VARCHAR(20), -- easy, medium, hard
  budget VARCHAR(10), -- free, cheap, $, $$, $$$
  description TEXT,
  rating INTEGER DEFAULT 0, -- 0-5 stars
  completed_at TIMESTAMP,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Streaks Table
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  messages_exchanged INTEGER DEFAULT 0,
  memories_shared INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Questions Table
CREATE TABLE daily_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  category VARCHAR(50), -- deep, fun, romantic, nostalgic, spicy, dream
  difficulty VARCHAR(20)
);

-- Question Answers Table
CREATE TABLE question_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES daily_questions(id),
  user_id UUID NOT NULL REFERENCES users(id),
  answer TEXT,
  answer_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(couple_id, question_id, user_id, answer_date)
);

-- Drawings Table
CREATE TABLE drawings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  drawing_url VARCHAR(500) NOT NULL,
  drawing_data JSONB, -- Canvas stroke data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drawing Reactions Table
CREATE TABLE drawing_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drawing_id UUID NOT NULL REFERENCES drawings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(drawing_id, user_id)
);

-- Widgets Table
CREATE TABLE widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  type VARCHAR(50), -- counter, timer, photo, text, drawing, game, quote
  title VARCHAR(255),
  config JSONB, -- Widget-specific configuration
  position INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Distance Tracking Table
CREATE TABLE distance_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user1_latitude DECIMAL(9, 6),
  user1_longitude DECIMAL(9, 6),
  user2_latitude DECIMAL(9, 6),
  user2_longitude DECIMAL(9, 6),
  distance_km DECIMAL(10, 2),
  timezone_offset INTEGER,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_couples_user1 ON couples(user1_id);
CREATE INDEX idx_couples_user2 ON couples(user2_id);
CREATE INDEX idx_messages_couple ON messages(couple_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at DESC);
CREATE INDEX idx_photos_couple ON photos(couple_id);
CREATE INDEX idx_love_notes_couple ON love_notes(couple_id);
CREATE INDEX idx_boops_couple ON boops(couple_id);
CREATE INDEX idx_milestones_couple ON milestones(couple_id);
CREATE INDEX idx_question_answers_date ON question_answers(answer_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_couples_updated_at BEFORE UPDATE ON couples
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON widgets
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
