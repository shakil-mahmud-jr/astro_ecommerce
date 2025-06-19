import { Client } from 'pg';

async function createDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();
    
    // Check if database exists
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'bazar_db'"
    );

    if (res.rowCount === 0) {
      // Create database if it doesn't exist
      await client.query('CREATE DATABASE bazar_db');
      console.log('Database bazar_db created successfully');
    } else {
      console.log('Database bazar_db already exists');
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

createDatabase(); 