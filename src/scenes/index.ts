/* eslint-disable no-console */

import { WizardScene } from 'telegraf/scenes';
import {
  Age, Busyness, Entertainment, Scenes,
} from '../constants/enums';
import { delay } from '../utils';
import { POLL_QUESTIONS } from '../constants';

export const registrationScene = new WizardScene<any>(
  Scenes.INTRODUCTION_SCENE,
  async (ctx) => {
    console.log('STEP: 1');
    const fullName = `${ctx.from.first_name} ${ctx.from.last_name}`;
    await ctx.reply(`
      Привет ${fullName}!\nТеперь заполни анкету, чтобы мы могли подобрать задания лично под тебя
    `);
    await delay();
    await ctx.reply('Твой пол', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '👱‍♂️', callback_data: 'male' },
            { text: '👩‍🦰', callback_data: 'female' },
          ],
        ],
      },
    });
    return ctx.wizard.next();
  },
  async (ctx) => {
    // TODO: Persist sex in DB
    console.log('STEP: 2');
    console.log('`Sex:`', ctx.update.callback_query.data);

    await ctx.answerCbQuery();
    await ctx.reply('Твой возраст', {
      reply_markup: {
        inline_keyboard: [

          [
            { text: '👶 до 15', callback_data: Age.CHILD },
            { text: '🧒 16-18', callback_data: Age.TEENAGER },
          ],
          [
            { text: '👦 19-22', callback_data: Age.YOUNG_ADULT },
            { text: '🧑 23-28', callback_data: Age.ADULT },
          ],
          [
            { text: '👨 29-35', callback_data: Age.MIDDLE_ADULT },
            { text: '👨‍🦰 36-42', callback_data: Age.OLD_ADULT },
          ],
          [
            { text: '👨‍🦳 больше 43', callback_data: Age.SENIOR },
          ],
        ],
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    // TODO: Persist age in DB
    console.log('STEP: 3');
    console.log('`Age:`', ctx.update.callback_query.data);

    await ctx.answerCbQuery();
    await ctx.reply('Кол-во свободного времени в день', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'меньше 2 ч.', callback_data: Busyness.LOW },
            { text: '2-4 ч.', callback_data: Busyness.MEDIUM },
          ],
          [
            { text: 'больше 4 ч.', callback_data: Busyness.HIGH },
          ],
        ],
      },
    });

    return ctx.wizard.next();
  },
  async (ctx) => {
    // TODO: Persist Busyness in DB
    console.log('STEP: 4');
    console.log('`Busyness:`', ctx.update.callback_query.data);

    await ctx.answerCbQuery();
    await ctx.replyWithPoll(
      POLL_QUESTIONS.EVENTS_POOL,
      [
        Entertainment.ACTIVE, Entertainment.CHILL_RELAX,
        Entertainment.PARTY, Entertainment.BRAINSTORM,
        Entertainment.ART, Entertainment.FOOD,
      ],
      { allows_multiple_answers: true },
    );

    return ctx.scene.leave();
  },
);
