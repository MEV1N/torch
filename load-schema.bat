@echo off
REM PowerShell Schema Loader for Neon
REM This script loads all database tables into Neon PostgreSQL

echo.
echo ^"^^ Neon Database Schema Loader
echo ================================
echo.

REM Check if DATABASE_URL is set
if "%DATABASE_URL%"=="" (
  echo ^❌ Error: DATABASE_URL environment variable not set
  echo.
  echo Please set your DATABASE_URL first:
  echo   In PowerShell: $env:DATABASE_URL='postgresql://...'
  echo   In CMD: set DATABASE_URL=postgresql://...
  echo.
  echo Get your DATABASE_URL from: https://console.neon.tech/
  pause
  exit /b 1
)

echo ^📡 Connecting to database...
for /f "tokens=3 delims=/" %%A in ("%DATABASE_URL%") do (
  echo Database: %%A
)
echo.

REM Load the schema
echo ^📝 Loading schema...
psql "%DATABASE_URL%" -f DATABASE_SCHEMA_NEON.sql

if %ERRORLEVEL% EQU 0 (
  echo.
  echo ^✅ SUCCESS! Database schema loaded.
  echo.
  echo ^📊 Tables created:
  psql "%DATABASE_URL%" -c "\dt"
  echo.
  echo ^🎉 Ready to deploy!
) else (
  echo.
  echo ^❌ Failed to load schema. Check your DATABASE_URL and try again.
  pause
  exit /b 1
)
