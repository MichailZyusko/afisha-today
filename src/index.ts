import 'reflect-metadata';
import { Commands } from './commands';
import db from './services/database';

(async () => {
  try {
    await Promise.allSettled([
      Commands.start(),
      Commands.agreeOnPersonalDataProcessing(),
      Commands.disagreeOnPersonalDataProcessing(),
      // Commands.getMyQRCode(),
      Commands.suggestNewEvent(),
    ]);

    await db.init();
    await Commands.launch();

    console.log('Bot successfully started');
  } catch (e) {
    console.error(e);
  } finally {
    await db.close();
    process.exit(0);
  }
})();
