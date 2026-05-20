/**
 * Neon PostgreSQL Database Connection
 * https://neon.tech
 */

import { neon } from '@neondatabase/serverless';

// Get connection string from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create SQL query function
export const sql = neon(connectionString);

/**
 * Execute a query with error handling
 */
export async function query<T = any>(
  queryText: string,
  values?: any[]
): Promise<T[]> {
  try {
    if (values) {
      const result = await sql(queryText, values);
      return result as T[];
    } else {
      const result = await sql(queryText);
      return result as T[];
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a single row query
 */
export async function queryOne<T = any>(
  queryText: string,
  values?: any[]
): Promise<T | null> {
  const results = await query<T>(queryText, values);
  return results.length > 0 ? results[0] : null;
}

/**
 * Execute a transaction
 */
export async function transaction<T>(
  callback: (txSql: typeof sql) => Promise<T>
): Promise<T> {
  try {
    // Note: Neon serverless doesn't support transactions in the same way as traditional databases
    // This is a simplified version - for complex transactions, consider using a connection pool
    return await callback(sql);
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

export default sql;
