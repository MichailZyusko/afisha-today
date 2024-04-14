import 'dotenv/config';
import { Scenes, Telegraf, session } from 'telegraf';
import { timeLogMiddleware } from '../middleware';
import {
  ContextWithCustomSession,
  entertainmentSuggestionScene,
  registrationScene,
} from '../scenes';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      'TELEGRAMM_API_TOKEN': string;
      'TELEGRAMM_BOT_USERNAME': string;
      'DB_HOST': string;
      'DB_PORT': number;
      'DB_USERNAME': string;
      'DB_PASSWORD': string;
      'DB_NAME': string;
      'DB_URL': string;
      'NODE_ENV': 'dev' | 'prod';
    }
  }
}

const stage = new Scenes.Stage<ContextWithCustomSession>([
  registrationScene,
  entertainmentSuggestionScene,
]);

export const bot = new Telegraf<ContextWithCustomSession>(process.env.TELEGRAMM_API_TOKEN);

bot.use(timeLogMiddleware);
bot.use(session());
bot.use(stage.middleware());

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
