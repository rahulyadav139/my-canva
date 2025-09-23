import { createApp } from './app';
import { Env } from './lib/env';
import { connectDatabase } from '@repo/database/db';

const app = createApp();

const port = Env.get('PORT');
const databaseUrl = Env.get('DATABASE_URL');

async function startServer() {
  try {
    // Connect to database first
    console.log('Connecting to database...');
    await connectDatabase(databaseUrl);
    console.log('✅ Database connected');

    // Start the HTTP API server
    app.listen(port, () => {
      console.log(`✅ HTTP API server is running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
