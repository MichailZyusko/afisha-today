/* eslint-disable no-console */

import { WizardScene } from 'telegraf/scenes';
import chunk from 'lodash.chunk';
import { Entertainment, Scenes } from '../constants/enums';
import { delay } from '../utils';
import { INTRODUCTION_SCENE_REPLICAS } from '../constants';
import { AGE_KEYBOARD_MARKUP, BUSYNESS_KEYBOARD_MARKUP, SEX_KEYBOARD_MARKUP } from '../constants/keyboard_markup';

let entertainmentOptions = [
  [
    { text: Entertainment.ACTIVE, callback_data: Entertainment.ACTIVE },
    { text: Entertainment.PARTY, callback_data: Entertainment.PARTY },
  ],
  [
    { text: Entertainment.CHILL_RELAX, callback_data: Entertainment.CHILL_RELAX },
    { text: Entertainment.BRAINSTORM, callback_data: Entertainment.BRAINSTORM },
  ],
  [
    { text: Entertainment.ART, callback_data: Entertainment.ART },
    { text: Entertainment.FOOD, callback_data: Entertainment.FOOD },
  ],
];

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
    // TODO: Persist sex in DB
    console.log('STEP: 2');
    console.log('`Sex:`', ctx.update.callback_query.data);

    await ctx.answerCbQuery();
    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[1], {
      reply_markup: {
        inline_keyboard: AGE_KEYBOARD_MARKUP,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    // TODO: Persist age in DB
    console.log('STEP: 3');
    console.log('`Age:`', ctx.update.callback_query.data);

    await ctx.answerCbQuery();
    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[2], {
      reply_markup: {
        inline_keyboard: BUSYNESS_KEYBOARD_MARKUP,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    // TODO: Persist Busyness in DB
    console.log('STEP: 4');
    console.log('`Busyness:`', ctx.update.callback_query.data);

    await ctx.answerCbQuery();
    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[3], {
      reply_markup: {
        inline_keyboard: entertainmentOptions,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    // TODO: Persist Busyness in DB
    console.log('STEP: 5');
    console.log('`Entertainment_1:`', ctx.update.callback_query.data);

    await ctx.answerCbQuery();
    entertainmentOptions = chunk(entertainmentOptions
      .flat()
      .filter((i) => i.text !== ctx.update.callback_query.data), 2);

    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[3], {
      reply_markup: {
        inline_keyboard: entertainmentOptions,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    // TODO: Persist Busyness in DB
    console.log('STEP: 6');
    console.log('`Entertainment_2:`', ctx.update.callback_query.data);

    await ctx.answerCbQuery();
    entertainmentOptions = chunk(entertainmentOptions
      .flat()
      .filter((i) => i.text !== ctx.update.callback_query.data), 2);

    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[3], {
      reply_markup: {
        inline_keyboard: entertainmentOptions,
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    // TODO: Persist Busyness in DB
    console.log('STEP: 7');
    console.log('`Entertainment_3:`', ctx.update.callback_query.data);

    await ctx.answerCbQuery();
    await ctx.reply(INTRODUCTION_SCENE_REPLICAS[4]);

    return ctx.scene.leave();
  },
);
