#!/usr/bin/env node

/**
 * Neon Schema Loader - Node.js Version
 * Loads all database tables directly using node-postgres
 * 
 * Usage:
 *   node load-schema.js
 * 
 * Make sure DATABASE_URL is set in .env.local
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function loadSchema() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL not set');
    console.error('');
    console.error('Please add to .env.local:');
    console.error('  DATABASE_URL=postgresql://...');
    console.error('');
    console.error('Get it from: https://console.neon.tech/');
    process.exit(1);
  }

  console.log('\n🚀 Neon Database Schema Loader');
  console.log('================================\n');

  try {
    const pool = new Pool({ connectionString: databaseUrl });

    console.log('📡 Connecting to database...');
    const client = await pool.connect();
    console.log('✅ Connected!\n');

    // Read schema file
    console.log('📝 Reading schema file...');
    const schemaPath = path.join(__dirname, 'DATABASE_SCHEMA_NEON.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema loaded\n');

    // Split into individual commands
    const commands = schema
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('/**') && !cmd.startsWith('--'));

    console.log(`📊 Executing ${commands.length} SQL commands...\n`);

    let executed = 0;
    for (const command of commands) {
      try {
        await client.query(command);
        executed++;
        
        // Show progress
        if (command.includes('CREATE TABLE')) {
          const tableName = command.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i)?.[1];
          if (tableName) {
            console.log(`  ✅ Created table: ${tableName}`);
          }
        } else if (command.includes('CREATE INDEX')) {
          console.log(`  ✅ Created index`);
        } else if (command.includes('CREATE EXTENSION')) {
          const extName = command.match(/CREATE EXTENSION\s+(?:IF NOT EXISTS\s+)?"([^"]+)"/i)?.[1];
          if (extName) {
            console.log(`  ✅ Enabled extension: ${extName}`);
          }
        }
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.error(`  ⚠️  Error: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Executed ${executed} SQL commands\n`);

    // Verify tables
    console.log('🔍 Verifying tables...\n');
    const result = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    if (result.rows.length > 0) {
      console.log('📊 Tables created:\n');
      result.rows.forEach((row, i) => {
        console.log(`  ${i + 1}. ${row.tablename}`);
      });
    }

    console.log(`\n✅ Total tables: ${result.rows.length}\n`);

    await client.release();
    await pool.end();

    console.log('🎉 SUCCESS! Database schema fully loaded.\n');
    console.log('📝 Next steps:');
    console.log('  1. Update React components to use API routes');
    console.log('  2. Migrate data from Firebase');
    console.log('  3. Deploy to Vercel\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('  1. Check DATABASE_URL is correct');
    console.error('  2. Verify Neon credentials');
    console.error('  3. Ensure .env.local is loaded\n');
    process.exit(1);
  }
}

loadSchema();
