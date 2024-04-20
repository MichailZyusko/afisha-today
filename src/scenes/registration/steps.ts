import { Middleware } from 'telegraf';
import { INTRODUCTION_SCENE_REPLICAS } from '../../constants';
import { EventFeedback, Scenes, Sex } from '../../constants/enums';
import {
  AGE_KEYBOARD_MARKUP,
  EVENT_FEEDBACK_KEYBOARD_MARKUP,
  SEX_KEYBOARD_MARKUP,
} from '../../constants/keyboard_markup';
import { delay } from '../../utils';
import { EventDTO } from '../../dto/event.dto';
import { EVENTS_SEED } from '../../services/database/seeds/event.seed';
import { UserDTO } from '../../dto/user.dto';
import db from '../../services/database';

const processSexSelection: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.REGISTRATION_SCENE}~STEP: 1`);
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
};

const processAgeSelection: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.REGISTRATION_SCENE}~STEP: 2`);
  console.log('`Sex:`', ctx.update.callback_query.data);
  ctx.scene.session.user = {
    sex: ctx.update.callback_query.data === Sex.MALE,
  };
  ctx.scene.session.entertainments_preference = [];
  ctx.scene.session.step = 0;

  await ctx.answerCbQuery();
  await ctx.reply(INTRODUCTION_SCENE_REPLICAS[1], {
    reply_markup: {
      inline_keyboard: AGE_KEYBOARD_MARKUP,
    },
  });

  return ctx.wizard.next();
};

const processEventSelection: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.REGISTRATION_SCENE}~STEP: 3`);
  console.log('`Age:`', ctx.update.callback_query.data);
  ctx.scene.session.user.age = ctx.update.callback_query.data;

  const { step } = ctx.scene.session;
  const { caption, media } = new EventDTO(EVENTS_SEED[step]);

  await ctx.answerCbQuery();
  await ctx.reply(INTRODUCTION_SCENE_REPLICAS[2]);
  await ctx.replyWithPhoto(
    { url: media },
    {
      caption,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: EVENT_FEEDBACK_KEYBOARD_MARKUP,
      },
    },
  );

  return ctx.wizard.next();
};

const processEventFeedback: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.REGISTRATION_SCENE}~STEP: ${ctx.scene.session.step + 1}`);

  if (ctx.update.callback_query.data === EventFeedback.LIKE) {
    ctx.scene.session.entertainments_preference.push(
      EVENTS_SEED[ctx.scene.session.step].entertainment_tags,
    );
  }

  ctx.scene.session.step += 1;
  const { step } = ctx.scene.session;
  console.log(`Event_${step}:`, ctx.update.callback_query.data);

  const { caption, media } = new EventDTO(EVENTS_SEED[step]);

  await ctx.answerCbQuery();
  await ctx.replyWithPhoto(
    { url: media },
    {
      caption,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: EVENT_FEEDBACK_KEYBOARD_MARKUP,
      },
    },
  );

  return ctx.wizard.next();
};

const processEventFinish: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.REGISTRATION_SCENE}~STEP: 8`);

  if (ctx.update.callback_query.data === EventFeedback.LIKE) {
    ctx.scene.session.entertainments_preference.push(
      EVENTS_SEED[ctx.scene.session.step].entertainment_tags,
    );
  }

  const { id } = new UserDTO(ctx);
  const { user } = ctx.scene.session;
  const entertainmentPreference = ctx.scene.session.entertainments_preference.flat();
  console.log('🚀 ~ entertainmentPreference:', entertainmentPreference);

  await db.usersRepository.update(id, {
    ...user,
    entertainment_preference: [...new Set(entertainmentPreference)],
  });

  await ctx.answerCbQuery();
  await ctx.reply(INTRODUCTION_SCENE_REPLICAS[4]);
  await ctx.scene.leave();
  await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
};

export const steps = [
  processSexSelection,
  processAgeSelection,
  processEventSelection,
  processEventFeedback,
  processEventFeedback,
  processEventFeedback,
  processEventFeedback,
  processEventFinish,
];
