import { unlink } from 'fs/promises';
import { bot } from '../bot';
import { pathToAssets } from '../config';
import { QRC } from '../services/qrcode';
import { delay } from '../utils';
import { Scenes } from '../constants/enums';
import { POLL_QUESTIONS } from '../constants';

export class Commands {
  static async getMyQRCode(): Promise<void> {
    bot.command('me', async (ctx) => {
      const userId = ctx.from.id.toString();

      await QRC.encode({
        payload: {
          userId,
          tmstmp: Date.now(),
        },
        userId,
      });
      await ctx.replyWithPhoto({ source: `${pathToAssets}/qrcode/${userId}.png` });
      await unlink(`${pathToAssets}/qrcode/${userId}.png`);
    });
  }

  static async start(): Promise<void> {
    bot.start(async (ctx) => {
      await ctx.reply('Приветствие + описание проекта');
      await delay();
      await ctx.reply('Краткое пособие по участию в лампе (в каком случае и как ты получаешь приз)');
      await delay();
      await ctx.reply('Согласие на обработку персональных данных', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Согласен', callback_data: 'agree' },
              { text: '❌ Не согласен', callback_data: 'disagree' },
            ],
          ],
        },
      });
    });
  }

  static async handlePollVote(): Promise<void> {
    bot.on('poll', async (ctx) => {
      console.log('🚀 ~ ctx:', ctx);

      if (ctx.poll.question === POLL_QUESTIONS.EVENTS_POOL) {
        // TODO: Persist entertainment in DB
        console.log('STEP: 5');
        console.log('`Entertainment:`', ctx.poll);
      }
    });
  }

  static async agreeOnPersonalDataProcessing(): Promise<void> {
    bot.action('agree', async (ctx) => {
      ctx.editMessageText('Заебок');
      // TODO: Persist user in DB

      await ctx.scene.enter(Scenes.INTRODUCTION_SCENE);
    });
  }

  static async disagreeOnPersonalDataProcessing(): Promise<void> {
    bot.action('disagree', async (ctx) => {
      ctx.editMessageText('не заебок');
      await ctx.reply('Было приятно с тобой пообзаться, брат. Если передумаешь, напиши /start');
    });
  }

  static async launch(): Promise<void> {
    await bot.launch();
  }
}
