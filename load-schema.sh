#!/bin/bash

# PostgreSQL Schema Loader for Neon
# This script loads all database tables into Neon PostgreSQL

echo "🚀 Neon Database Schema Loader"
echo "================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable not set"
  echo ""
  echo "Please set your DATABASE_URL first:"
  echo "  On Linux/Mac: export DATABASE_URL='postgresql://...'"
  echo "  On Windows (PowerShell): \$env:DATABASE_URL='postgresql://...'"
  echo ""
  echo "Get your DATABASE_URL from: https://console.neon.tech/"
  exit 1
fi

echo "📡 Connecting to database..."
echo "Database: $(echo $DATABASE_URL | cut -d'/' -f3)"
echo ""

# Load the schema
echo "📝 Loading schema..."
psql "$DATABASE_URL" -f DATABASE_SCHEMA_NEON.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ SUCCESS! Database schema loaded."
  echo ""
  echo "📊 Tables created:"
  psql "$DATABASE_URL" -c "\dt" | grep -E "public | (users|couples|messages|photos|love_notes|boops|drawings|widgets|games|streaks|date_ideas|milestones|memories|location_updates)"
  echo ""
  echo "🎉 Ready to deploy!"
else
  echo ""
  echo "❌ Failed to load schema. Check your DATABASE_URL and try again."
  exit 1
fi
