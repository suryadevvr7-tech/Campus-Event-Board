import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

try {
  await connectDatabase();
  app.listen(env.PORT, () => console.log(`Campus Event Board API listening on port ${env.PORT}`));
} catch (error) {
  console.error('Unable to start Campus Event Board:', error.message);
  process.exit(1);
}

