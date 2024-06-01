import { Middleware } from 'telegraf';
import { EventFeedback, EventFeedbackFinish, Scenes } from '../../constants/enums';
import {
  EVENT_FEEDBACK_FINISH_KEYBOARD_MARKUP,
  EVENT_FEEDBACK_KEYBOARD_MARKUP,
} from '../../constants/keyboard_markup';
import db from '../../services/database';
import { User } from '../../services/database/entities/user.entity';
import { Event } from '../../services/database/entities/event.entity';

const collectPhotoProof: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.FEEDBACK_SCENE}~STEP: 1`);

  const { message_id: msgId } = await ctx.reply(
    'Можешь оставить свое фото-подтверждение?',
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: 'Фото чека или свои счастливые лица напротив заведения',
      },
    },
  );

  ctx.scene.session.feedback = {};
  ctx.scene.session.msgId = msgId;

  return ctx.wizard.next();
};

const processEvent: Middleware<any> = async (ctx) => {
  if (ctx.scene.state.msgId) {
    await ctx.deleteMessage(ctx.scene.state.msgId);
  }

  await ctx.deleteMessage();

  try {
    console.log(`${Scenes.FEEDBACK_SCENE}~STEP: 2`);

    const photo = ctx?.update?.message?.photo.at(-1);
    const fileId = photo?.file_id;
    const photoLink = await ctx.telegram.getFileLink(fileId);

    ctx.scene.session.feedback.photo_proof = photoLink;

    await ctx.deleteMessage(ctx.scene.session.msgId);
    await ctx.reply(
      'Как ты оцениваешь это задание? ',
      {
        reply_markup: {
          inline_keyboard: EVENT_FEEDBACK_KEYBOARD_MARKUP,
        },
      },
    );

    return ctx.wizard.next();
  } catch (error) {
    console.error(error);

    const { message_id: msgId } = await ctx.reply(
      'Пожалуйста, пришли свое фото-подтверждение, а не просто текст',
    );
    await ctx.deleteMessage(ctx.scene.session.msgId);
    await ctx.scene.leave();
    await ctx.scene.enter(Scenes.FEEDBACK_SCENE, {
      eventId: ctx.scene.state.eventId,
      msgId,
    });

    return undefined;
  }
};

const collectFeedback: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.FEEDBACK_SCENE}~STEP: 3`);
  await ctx.deleteMessage();

  const eventFeedback = ctx.update?.callback_query?.data;
  ctx.scene.session.feedback.is_liked = eventFeedback === EventFeedback.LIKE;

  const { message_id: msgId } = await ctx.reply(
    `Спасибо за твой отзыв! 
Будем рады услышать твой развернутый отзыв или дать тебе новое задание 😉`,
    {
      reply_markup: {
        inline_keyboard: EVENT_FEEDBACK_FINISH_KEYBOARD_MARKUP,
      },
    },
  );

  ctx.scene.session.msgId = msgId;

  return ctx.wizard.next();
};

const processEventFinish: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.FEEDBACK_SCENE}~STEP: 4`);
  await ctx.deleteMessage();

  const action = ctx.update.callback_query.data;

  if (action === EventFeedbackFinish.GET_NEW_EVENT) {
    const event = new Event();
    event.id = ctx.scene.state.eventId;

    const user = new User();
    user.id = ctx.from.id;

    const eventFeedback = {
      ...ctx.scene.session.feedback,
      event,
      user,
    };
    console.log('🚀 ~ eventFeedback:', eventFeedback);

    await db.eventFeedbacksRepository.save(eventFeedback);

    await ctx.scene.leave();
    await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
    return undefined;
  }

  const { message_id: msgId } = await ctx.reply(
    'Можешь оставить свой письменный отзыв? Что было хорошо? Что можно улучшить?',
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: 'Мне все понравилось потому что...',
      },
    },
  );
  ctx.scene.session.msgId = msgId;

  return ctx.wizard.next();
};

const processEventFinishWithComment: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.FEEDBACK_SCENE}~STEP: 5`);

  await ctx.deleteMessage();
  await ctx.deleteMessage(ctx.scene.session.msgId);

  const eventComment = ctx.update.message.text;

  const event = new Event();
  event.id = ctx.scene.state.eventId;

  const user = new User();
  user.id = ctx.from.id;

  const eventFeedback = {
    ...ctx.scene.session.feedback,
    comment: eventComment,
    event,
    user,
  };
  console.log('🚀 ~ eventFeedback:', eventFeedback);

  await db.eventFeedbacksRepository.save(eventFeedback);

  await ctx.reply('Спасибо за отзыв!', {
    reply_markup: {
      inline_keyboard: [
        [{
          text: '🆕 Получить новое задание',
          callback_data: EventFeedbackFinish.GET_NEW_EVENT,
        }],
      ],
    },
  });

  return ctx.wizard.next();
};

const startNewEvent: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.FEEDBACK_SCENE}~STEP: 6`);

  await ctx.deleteMessage();
  await ctx.scene.leave();
  await ctx.scene.enter(Scenes.SUGGESTION_SCENE);

  return undefined;
};

export const steps = [
  collectPhotoProof,
  processEvent,
  collectFeedback,
  processEventFinish,
  processEventFinishWithComment,
  startNewEvent,
];
