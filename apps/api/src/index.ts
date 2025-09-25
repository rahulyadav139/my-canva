import { createApp } from './app';
import { connectDatabase } from '@repo/database/db';
import { Env } from './lib/env';
import { startHocuspocusServer } from './hocuspocus';

const app = createApp();

const port = Env.get('PORT');
const databaseUrl = Env.get('DATABASE_URL');

async function startServer() {
  try {
    app.listen(port, async () => {
      console.log(`http server is running on port ${port}`);

      console.log('connecting to database...');

      await connectDatabase(databaseUrl);

      console.log('database connected');
    });

    // Start the Hocuspocus server
    await startHocuspocusServer();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
