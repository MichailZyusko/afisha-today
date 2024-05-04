import { Middleware } from 'telegraf';
import { EventFeedback, Scenes } from '../../constants/enums';
import {
  EVENT_FEEDBACK_KEYBOARD_MARKUP,
} from '../../constants/keyboard_markup';
import db from '../../services/database';
import { User } from '../../services/database/entities/user.entity';
import { Event } from '../../services/database/entities/event.entity';

const processEvent: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.FEEDBACK_SCENE}~STEP: 1`);

  ctx.scene.session.feedback = {};

  await ctx.answerCbQuery();
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
  console.log(`${Scenes.FEEDBACK_SCENE}~STEP: 2`);
  const eventFeedback = ctx.update.callback_query.data;
  console.log('🚀 ~ eventFeedback:', eventFeedback);

  ctx.scene.session.feedback.is_liked = eventFeedback === EventFeedback.LIKE;

  await ctx.answerCbQuery();
  await ctx.reply(
    'Можешь оставить свой письменный отзыв? Что было хорошо? Что можно улучшить?',
    {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: 'Оставьте свой отзыв',
      },
    },
  );

  return ctx.wizard.next();
};

const processEventFinish: Middleware<any> = async (ctx) => {
  console.log(`${Scenes.FEEDBACK_SCENE}~STEP: 3`);

  const eventComment = ctx.update.message.text;
  console.log('🚀 ~ eventComment:', eventComment);

  await ctx.reply(
    'Отлично! Спасибо за твой отзыв. Если захочешь еще, просто кликни на /new_event',
  );

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

  return ctx.scene.leave();
};

export const steps = [
  processEvent,
  collectFeedback,
  processEventFinish,
];
