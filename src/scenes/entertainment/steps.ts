
import { Middleware } from "telegraf";
import { Scenes } from "../../constants/enums";
import { EVENT_AGREEMENT_KEYBOARD_MARKUP, EVENT_FEEDBACK_KEYBOARD_MARKUP, EVENT_FINISH_KEYBOARD_MARKUP, EVENT_ID_KEYBOARD_MARKUP } from "../../constants/keyboard_markup";
import db from "../../services/database";
import { EventDTO } from "../../dto/event.dto";

const recommendEvent: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 1`);
  await ctx.reply('Секундочку, ищем подходящие для тебя варианты...');

  const userId = +ctx.from.id;
  const isRegisteredUser = await db.usersRepository.existsBy({ id: userId });

  if (!isRegisteredUser) {
    console.error(`User w/ id: ${userId} does't exist`);
    await ctx.reply('Сперва необходимо познакомиться. Кликни на /start');
    return ctx.scene.leave();
  }

  // const events = await database.query<Event[]>(
  //   `SELECT * FROM suggest_events_for_user($1)`,
  //   [userId],
  // );
  const events = await db.eventsRepository.find();
  console.log('🚀 ~ event:', events);
  ctx.scene.session.events = events;

  if (!events.length) {
    console.error(`There are no events for user w/ id: ${userId}`);
    await ctx.reply('К сожалению, ничего не нашлось. Давай попробуем еще раз. Кликни на /start');
    return ctx.scene.leave();
  }

  await ctx.replyWithMediaGroup(
    events.map(({ media }) => ({
      media,
      type: 'photo'
    })),
  );
  await ctx.reply('Выбери то, что тебе больше окликаеться', {
    reply_markup: {
      inline_keyboard: EVENT_ID_KEYBOARD_MARKUP,
    },
  });

  return ctx.wizard.next();
};

const getMoreDetails: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 2`);

  const selectedEventId = ctx.update.callback_query.data;
  console.log('🚀 ~ selectedEventId:', selectedEventId);
  const event = ctx.scene.session.events.at(+selectedEventId);
  console.log('🚀 ~ event:', event);

  const { caption, media } = new EventDTO(event);

  await ctx.answerCbQuery();
  await ctx.replyWithPhoto(
    { url: media },
    {
      caption,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: EVENT_AGREEMENT_KEYBOARD_MARKUP,
      },
    },
  );

  return ctx.wizard.next();
};

const selectEvent: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 3`);
  const action = ctx.update.callback_query.data;

  await ctx.answerCbQuery();

  if (action === 'back') {
    await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
    return
  }

  await ctx.reply(
    'Отличный вкус! Дай знать когда выполнишь задание. Спасибо!',
    {
      reply_markup: {
        inline_keyboard: EVENT_FINISH_KEYBOARD_MARKUP,
      },
    },
  );

  return ctx.wizard.next();
};

const processEvent: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 4`);
  const action = ctx.update.callback_query.data;

  await ctx.answerCbQuery();
  if (action === 'reject') {
    await ctx.reply('Миша, все хуйня, давай по новой!');
    await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
    return
  }

  await ctx.reply(
    'Как тебе нравится? Спасибо!',
    {
      reply_markup: {
        inline_keyboard: EVENT_FEEDBACK_KEYBOARD_MARKUP,
      },
    },
  );

  return ctx.wizard.next();
};

const collectFeedback: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 5`);
  const eventFeedback = ctx.update.callback_query.data;
  console.log('🚀 ~ eventFeedback:', eventFeedback);

  await ctx.answerCbQuery();
  await ctx.reply(
    'Можешь оставить свой письменный отзыв? Что было хорошо? Что можно улучшить?',
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: "Оставьте свой отзыв",
      },
    }
  );

  return ctx.wizard.next();
};

const processEventFinish: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 6`);
  const eventComment = ctx.update.message.text;
  console.log('🚀 ~ eventFeedback:', eventComment);

  await ctx.reply(
    'Отлично! Спасибо за твой отзыв. Если захочешь еще, просто кликни на /new_event',
  );

  return ctx.scene.leave();
};

export const steps = [
  recommendEvent,
  getMoreDetails,
  selectEvent,
  processEvent,
  collectFeedback,
  processEventFinish,
]