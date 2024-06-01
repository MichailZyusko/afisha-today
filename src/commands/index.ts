import { unlink } from 'fs/promises';
import { bot } from '../bot';
import { QRC } from '../services/qrcode';
import { Agree, Scenes } from '../constants/enums';
import {
  DISAGREE_ON_PERSONAL_DATA_PROCESSING_MSG,
  START_SCENE_REPLICAS, DEFAULT_ERROR_MSG,
  REACH_MAX_USERS_ERROR,
} from '../constants';
import { AGREEMENT_ON_PERSONAL_DATA_PROCESSING_KEYBOARD_MARKUP } from '../constants/keyboard_markup';
import { UserDTO } from '../dto/user.dto';
import db from '../services/database';

export class Commands {
  static async getMyQRCode() {
    bot.command('me', async (ctx) => {
      try {
        const userId = ctx?.from?.id?.toString();

        const { path } = await QRC.encode({
          payload: {
            userId,
            tmstmp: Date.now(),
          },
          userId,
        });

        await ctx.replyWithPhoto({ source: path });
        await unlink(path);
      } catch (error) {
        console.error(error);
        await ctx.reply(DEFAULT_ERROR_MSG);
      }
    });
  }

  static async start() {
    bot.start(async (ctx) => {
      try {
        await ctx.reply(START_SCENE_REPLICAS[0]);
        await ctx.reply(START_SCENE_REPLICAS[1], {
          parse_mode: 'HTML',
          link_preview_options: {
            is_disabled: true,
          },
          reply_markup: {
            inline_keyboard: AGREEMENT_ON_PERSONAL_DATA_PROCESSING_KEYBOARD_MARKUP,
          },
        });
      } catch (error) {
        console.error(error);
        await ctx.reply(DEFAULT_ERROR_MSG);
      }
    });
  }

  static async agreeOnPersonalDataProcessing() {
    bot.action(Agree.AGREE, async (ctx) => {
      try {
        await ctx.deleteMessage();
        const isAllowedToCreateNewUser = await db.query('SELECT valid_user_count()');

        if (!isAllowedToCreateNewUser) {
          await ctx.reply(REACH_MAX_USERS_ERROR);
          return;
        }

        const user = new UserDTO(ctx);
        await db.usersRepository.upsert(user, ['id']);

        await ctx.scene.enter(Scenes.REGISTRATION_SCENE);
      } catch (error) {
        console.error(error);
        await ctx.reply(DEFAULT_ERROR_MSG);
      }
    });
  }

  static async disagreeOnPersonalDataProcessing() {
    bot.action(Agree.DISAGREE, async (ctx) => {
      try {
        await ctx.deleteMessage();
        await ctx.reply(DISAGREE_ON_PERSONAL_DATA_PROCESSING_MSG);
      } catch (error) {
        console.error(error);
        await ctx.reply(DEFAULT_ERROR_MSG);
      }
    });
  }

  static async suggestNewEvent() {
    bot.command('new_event', async (ctx) => {
      try {
        await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
      } catch (error) {
        console.error(error);
        await ctx.reply(DEFAULT_ERROR_MSG);
      }
    });
  }

  static async launch() {
    await bot.launch();
  }
}
