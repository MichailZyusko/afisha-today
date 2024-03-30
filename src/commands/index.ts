import { unlink } from 'fs/promises';
import { bot } from '../bot';
import { pathToAssets } from '../config';
import { QRC } from '../services/qrcode';
import { delay } from '../utils';
import { Scenes } from '../constants/enums';
import { DISAGREE_ON_PERSONAL_DATA_PROCESSING_MSG, START_SCENE_REPLICAS } from '../constants';
import { AGREEMENT_ON_PERSONAL_DATA_PROCESSING_KEYBOARD_MARKUP } from '../constants/keyboard_markup';
import { UserDTO } from '../dto/user.dto';
import database from '../services/database';

export class Commands {
  static async getMyQRCode() {
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

  static async start() {
    bot.start(async (ctx) => {
      await ctx.reply(START_SCENE_REPLICAS[0]);
      await delay(0);
      await ctx.reply(START_SCENE_REPLICAS[1]);
      await delay(0);
      await ctx.reply(START_SCENE_REPLICAS[2], {
        reply_markup: {
          inline_keyboard: AGREEMENT_ON_PERSONAL_DATA_PROCESSING_KEYBOARD_MARKUP,
        },
      });
    });
  }

  static async agreeOnPersonalDataProcessing() {
    bot.action('agree', async (ctx) => {
      // !TODO: add errors handling
      ctx.answerCbQuery();

      const user = new UserDTO(ctx);
      await database.usersRepository.upsert(user, ['id']);

      await ctx.scene.enter(Scenes.INTRODUCTION_SCENE);
    });
  }

  static async disagreeOnPersonalDataProcessing() {
    bot.action('disagree', async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.reply(DISAGREE_ON_PERSONAL_DATA_PROCESSING_MSG);
    });
  }

  static async launch() {
    await bot.launch();
  }
}
