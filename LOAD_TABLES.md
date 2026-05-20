# 📊 Load Database Tables — 3 Methods

## Method 1: Neon Console (Easiest - 2 minutes)

1. Go to https://console.neon.tech/
2. Select your project and database
3. Click "SQL Editor"
4. Open `DATABASE_SCHEMA_NEON.sql` in this repository
5. Copy ALL the SQL code
6. Paste into the SQL Editor
7. Click "Run"
8. ✅ Done! All tables created

---

## Method 2: Command Line with psql (Recommended - 1 minute)

### Prerequisites
- `psql` command-line tool installed
- `DATABASE_URL` environment variable set

### Steps

**Windows (PowerShell):**
```powershell
# Set your database URL
$env:DATABASE_URL = "postgresql://user:pass@host/database"

# Run the schema loader
.\load-schema.bat
```

**Mac/Linux:**
```bash
# Set your database URL
export DATABASE_URL="postgresql://user:pass@host/database"

# Run the schema loader
bash load-schema.sh
```

---

## Method 3: Node.js Script (For npm projects - 1 minute)

### Prerequisites
- Node.js installed
- `pg` package installed: `npm install pg`
- `.env.local` file with `DATABASE_URL`

### Steps

```bash
# Load schema using Node.js
node load-schema.js
```

This will:
1. ✅ Connect to your Neon database
2. ✅ Load all SQL commands
3. ✅ Create all 15 tables
4. ✅ Verify everything worked
5. ✅ Show table list

---

## 🎯 Recommended: Method 2 (Command Line)

**Fastest and most reliable:**

```powershell
# Set environment variable
$env:DATABASE_URL = "postgresql://..."

# Run loader (Windows)
.\load-schema.bat

# Or (Mac/Linux)
bash load-schema.sh
```

Output will show:
```
📡 Connecting to database...
✅ Connected!

📝 Reading schema file...
✅ Schema loaded

📊 Tables created:
  ✅ Created table: users
  ✅ Created table: couples
  ✅ Created table: messages
  ✅ Created table: photos
  ... (all 15 tables)

✅ SUCCESS! Database schema loaded.
```

---

## 📋 Tables Created (15 total)

1. **users** — User accounts
2. **couples** — Couple relationships
3. **messages** — Chat messages
4. **photos** — Photo uploads
5. **photo_reactions** — Photo emoji reactions
6. **love_notes** — Love note cards
7. **love_note_reactions** — Love note reactions
8. **boops** — Boop notifications
9. **drawings** — Drawing uploads
10. **drawing_reactions** — Drawing reactions
11. **widgets** — Custom widgets
12. **game_sessions** — Active game sessions
13. **game_records** — Completed games
14. **streaks** — Love streaks
15. **daily_questions** — Daily question prompts

Plus additional tables for:
- question_answers
- streak_activities
- date_ideas
- milestones
- memories
- distance_tracking
- location_updates
- user_preferences
- compatibility_quizzes
- quiz_answers

---

## ✅ Verify Tables Are Created

### Using Neon Console
1. Go to https://console.neon.tech/
2. Open SQL Editor
3. Run: `SELECT * FROM information_schema.tables WHERE table_schema='public';`
4. Should show all 15+ tables

### Using psql Command
```bash
psql $DATABASE_URL -c "\dt"
```

Should output:
```
             List of relations
 Schema |      Name       | Type  | Owner
--------+-----------------+-------+-------
 public | boops           | table | neon
 public | couples         | table | neon
 public | daily_questions | table | neon
 public | date_ideas      | table | neon
 public | distance_tracking | table | neon
 ... (more tables)
```

### Using Node.js
```bash
node load-schema.js
```

Will show:
```
📊 Tables created:

  1. boops
  2. couples
  3. daily_questions
  4. date_ideas
  5. distance_tracking
  ... (all tables)

✅ Total tables: 25
```

---

## 🔧 Troubleshooting

### Error: "DATABASE_URL not set"

**Solution:**
```powershell
# PowerShell
$env:DATABASE_URL = "postgresql://user:password@host/database"

# Or add to .env.local
DATABASE_URL=postgresql://user:password@host/database
```

### Error: "Connection refused"

**Solution:**
1. Verify DATABASE_URL is correct
2. Check that Neon project is active
3. Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### Error: "Table already exists"

**This is okay!** It means:
- Tables are already created
- You're safe to run the script again
- No data will be lost

### Error: "Permission denied"

**Solution:**
- Verify you have admin access to the database
- Check Neon project roles
- Use main admin credentials

---

## 📝 Next Steps

After tables are created:

1. ✅ Tables loaded
2. ⏳ Update React components → See COMPONENT_UPDATE_GUIDE.md
3. ⏳ Migrate Firebase data → Use migration script
4. ⏳ Test API routes → `npm run dev`
5. ⏳ Deploy to Vercel → `vercel deploy --prod`

---

## 🎉 You're All Set!

Tables are ready. Move on to **component updates**.

See: `COMPONENT_UPDATE_GUIDE.md`
