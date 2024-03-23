import { Commands } from './commands';

(async () => {
  await Promise.allSettled([
    Commands.start(),
    Commands.agreeOnPersonalDataProcessing(),
    Commands.disagreeOnPersonalDataProcessing(),
    Commands.getMyQRCode(),
  ]);

  await Commands.launch();
})();

console.log('Bot successfully started');
