import { Middleware } from 'telegraf';
import {
  DEFAULT_CATEGORIES, REGISTRATION_EVENTS_COUNT,
} from '../../constants';
import { REGISTRATION_REPLIES } from '../../constants/REGISTRATION_REPLIES';
import { Scenes, Sex } from '../../constants/enums';
import { deepTrim } from '../../utils';
import { UserDTO } from '../../dto/user.dto';
import db from '../../services/database';

const processSexSelection: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.REGISTRATION_SCENE}~STEP: 1`);
  const fullName = `${ctx.from.first_name} ${ctx.from.last_name ?? ''}`;

  await ctx.reply(
    deepTrim(`
      Привет ${fullName}!\nТеперь заполни, пожалуйста, анкету, чтобы мы могли подобрать задания лично под тебя!

      ${REGISTRATION_REPLIES[0].msg}
    `),
    {
      reply_markup: {
        inline_keyboard: REGISTRATION_REPLIES[0].keyboard,
      },
    },
  );

  return ctx.wizard.next();
};

const processAgeSelection: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.REGISTRATION_SCENE}~STEP: 2`);
  ctx.scene.session.user = {
    sex: ctx.update.callback_query.data === Sex.MALE,
  };
  ctx.scene.session.entertainments_preference = [];
  ctx.scene.session.step = 0;
  ctx.scene.session.msgId = null;
  ctx.scene.session.msgIds = [];

  await ctx.deleteMessage();
  await ctx.reply(REGISTRATION_REPLIES[1].msg, {
    reply_markup: {
      inline_keyboard: REGISTRATION_REPLIES[1].keyboard,
    },
  });

  return ctx.wizard.next();
};

const processEventSelection: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.REGISTRATION_SCENE}~STEP: 3`);
  ctx.scene.session.user.age = ctx.update.callback_query.data;

  await ctx.deleteMessage();
  await ctx.reply(REGISTRATION_REPLIES[2].msg, {
    reply_markup: {
      inline_keyboard: REGISTRATION_REPLIES[2].keyboard,
    },
  });

  return ctx.wizard.next();
};

const processEventFeedback: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.REGISTRATION_SCENE}~STEP: ${ctx.scene.session.step + 1}`);
  const userResponse = ctx.update.callback_query.data;

  ctx.scene.session.entertainments_preference.push(JSON.parse(userResponse));

  ctx.scene.session.step += 1;
  const { step } = ctx.scene.session;
  console.log(`Questions_${step}:`, userResponse);

  await ctx.deleteMessage();
  await ctx.reply(REGISTRATION_REPLIES[step + 2].msg, {
    reply_markup: {
      inline_keyboard: REGISTRATION_REPLIES[step + 2].keyboard,
    },
  });

  return ctx.wizard.next();
};

const processEventFinish: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.REGISTRATION_SCENE}~STEP: ${ctx.scene.session.step + 1}`);
  const userResponse = ctx.update.callback_query.data;
  ctx.scene.session.entertainments_preference.push(JSON.parse(userResponse));

  const { id } = new UserDTO(ctx);
  const { user } = ctx.scene.session;
  const entertainmentPreference = ctx.scene.session.entertainments_preference
    .flat()
    .map(Number);

  await db.usersRepository.update(id, {
    ...user,
    entertainment_preference: [...new Set([...DEFAULT_CATEGORIES, ...entertainmentPreference])],
  });

  await ctx.deleteMessage();
  const { message_id: msgId } = await ctx.reply(`Отлично! Теперь мы знаем друг друга намного лучше!
  
Мы подберем для тебя 5 заданий на основе твоих предпочтений. Выбирай одно из них, с которого ты решил начать!`);
  await ctx.scene.leave();
  await ctx.scene.enter(Scenes.SUGGESTION_SCENE, { msgId });
};

export const steps = [
  processSexSelection,
  processAgeSelection,
  processEventSelection,
  ...(new Array(REGISTRATION_EVENTS_COUNT).fill(processEventFeedback)),
  processEventFinish,
];
