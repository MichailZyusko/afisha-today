import 'dotenv/config';
import db from '../index';
import { entertainmentsSeed } from './entertainments.seed';

(async () => {
  try {
    await db.init();

    await entertainmentsSeed();
  } catch (error) {
    console.error(error)
  } finally {
    await db.close();
    process.exit(0);
  }
})();
