import 'dotenv/config';
import { Scenes, Telegraf, session } from 'telegraf';
import { timeLogMiddleware } from '../middleware';
import { registrationScene } from '../scenes';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      'TELEGRAMM_API_TOKEN': string
      'TELEGRAMM_BOT_USERNAME': string
    }
  }
}

const stage = new Scenes.Stage<Scenes.SceneContext>([registrationScene]);

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TELEGRAMM_API_TOKEN);

bot.use(timeLogMiddleware);
bot.use(session());
bot.use(stage.middleware());

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
