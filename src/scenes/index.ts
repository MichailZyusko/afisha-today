/* eslint-disable no-console */

import { WizardScene } from 'telegraf/scenes';
import chunk from 'lodash.chunk';
import { Context as TelegrafContext, Scenes as TelegrafScene } from 'telegraf';
import { Age, Busyness, Scenes, } from '../constants/enums';
import { delay } from '../utils';
import { INTRODUCTION_SCENE_REPLICAS } from '../constants';
import { AGE_KEYBOARD_MARKUP, BUSYNESS_KEYBOARD_MARKUP, SEX_KEYBOARD_MARKUP } from '../constants/keyboard_markup';
import database from '../services/database';
import { UserDTO } from '../dto/user.dto';
import { InlineKeyboardButton } from 'telegraf/types';

/**
 * We can still extend the regular session object that we can use on the
 * context. However, as we're using wizards, we have to make it extend
 * `WizardSession`.
 *
 * It is possible to pass a type variable to `WizardSession` if you also want to
 * extend the wizard session as we do above.
 */
interface SessionWithUser extends TelegrafScene.WizardSession {
  entertainmentKeyboardMarkup: InlineKeyboardButton[]
  user: {
    sex: 'male' | 'female';
    age: Age;
    busyness: Busyness;
    entertainment_preference: number[];
  };
}

export interface ContextWithCustomSession extends TelegrafContext {
  session: SessionWithUser;

  // declare scene type
  scene: TelegrafScene.SceneContextScene<ContextWithCustomSession, TelegrafScene.WizardSessionData>;
  // declare wizard type
  wizard: TelegrafScene.WizardContextWizard<ContextWithCustomSession>;
}

export const registrationScene = new WizardScene<any>(
  Scenes.INTRODUCTION_SCENE,
  async (ctx) => {
    console.log('STEP: 1');
    const fullName = `${ctx.from.first_name} ${ctx.from.last_name ?? ''}`;
    await ctx.reply(`
      Привет ${fullName}!\nТеперь заполни анкету, чтобы мы могли подобрать задания лично под тебя
    `);

    await delay(0);
    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[0], {
      reply_markup: {
        inline_keyboard: SEX_KEYBOARD_MARKUP,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    console.log('STEP: 2');
    console.log('`Sex:`', ctx.update.callback_query.data);
    ctx.scene.session.user = {
      sex: ctx.update.callback_query.data === 'male',
    };

    await ctx.answerCbQuery();
    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[1], {
      reply_markup: {
        inline_keyboard: AGE_KEYBOARD_MARKUP,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    console.log('STEP: 3');
    console.log('`Age:`', ctx.update.callback_query.data);
    ctx.scene.session.user.age = ctx.update.callback_query.data;

    await ctx.answerCbQuery();
    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[2], {
      reply_markup: {
        inline_keyboard: BUSYNESS_KEYBOARD_MARKUP,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    console.log('STEP: 4');
    console.log('`Busyness:`', ctx.update.callback_query.data);
    ctx.scene.session.user.busyness = ctx.update.callback_query.data;

    const entertainmentKeyboardMarkup = await database.entertainmentsRepository.find();
    ctx.scene.session.entertainmentKeyboardMarkup = chunk(
      entertainmentKeyboardMarkup.map((entertainment) => ({
        text: entertainment.name,
        callback_data: entertainment.id,
      })),
      1,
    );

    await ctx.answerCbQuery();
    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[3], {
      reply_markup: {
        inline_keyboard: ctx.scene.session.entertainmentKeyboardMarkup,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    console.log('STEP: 5');
    console.log('`Entertainment_1:`', ctx.update.callback_query.data);

    const { user } = ctx.scene.session;
    ctx.scene.session.user = {
      ...user,
      entertainment_preference: [+ctx.update.callback_query.data],
    };

    await ctx.answerCbQuery();
    const newEntertainmentOptions = chunk(
      ctx.scene.session.entertainmentKeyboardMarkup
        .flat()
        .filter((i: any) => !ctx.scene.session.user.entertainment_preference.includes(i.callback_data)),
      1,
    );

    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[3], {
      reply_markup: {
        inline_keyboard: newEntertainmentOptions,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    console.log('STEP: 6');
    console.log('`Entertainment_2:`', ctx.update.callback_query.data);

    const { user } = ctx.scene.session;
    ctx.scene.session.user = {
      ...user,
      entertainment_preference: [...user.entertainment_preference, +ctx.update.callback_query.data],
    };

    await ctx.answerCbQuery();
    const newEntertainmentOptions = chunk(
      ctx.scene.session.entertainmentKeyboardMarkup
        .flat()
        .filter((i: any) => !ctx.scene.session.user.entertainment_preference.includes(i.callback_data)),
      1,
    );

    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[3], {
      reply_markup: {
        inline_keyboard: newEntertainmentOptions,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    console.log('STEP: 7');
    console.log('`Entertainment_3:`', ctx.update.callback_query.data);

    const { id } = new UserDTO(ctx);
    const { user } = ctx.scene.session;

    await database.usersRepository.update(id, {
      ...user,
      entertainment_preference: [...user.entertainment_preference, +ctx.update.callback_query.data],
    });

    await ctx.answerCbQuery();
    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[4]);

    return ctx.scene.leave();
  },
);
