import 'dotenv/config';
import db from '../index';
import { entertainmentsSeed } from './entertainments.seed';
import { eventsSeed } from './event.seed';
import { partnerSeed } from './partner.seed';

(async () => {
  try {
    await db.init();

    await Promise.allSettled([
      entertainmentsSeed(),
      partnerSeed(),
    ]);

    await eventsSeed();
  } catch (error) {
    console.error(error);
  } finally {
    await db.close();
    process.exit(0);
  }
})();
