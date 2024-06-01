import { Middleware } from 'telegraf';
import {
  EventAgreement, EventFinish, EventState, Scenes,
} from '../../constants/enums';
import {
  EVENT_AGREEMENT_KEYBOARD_MARKUP,
  EVENT_FINISH_KEYBOARD_MARKUP, EVENT_ID_KEYBOARD_MARKUP,
} from '../../constants/keyboard_markup';
import db from '../../services/database';
import { Event } from '../../services/database/entities/event.entity';
import { EventDTO } from '../../dto/event.dto';
import { deepTrim } from '../../utils';

const recommendEvent: Middleware<any> = async (ctx) => {
  try {
    console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 1`);

    const userId = +ctx.from.id;
    const isRegisteredUser = await db.usersRepository.existsBy({ id: userId });

    if (!isRegisteredUser) {
      console.error(`User w/ id: ${userId} does't exist`);
      await ctx.reply('Сперва необходимо познакомиться. Кликни на /start');
      return ctx.scene.leave();
    }

    const events = await db.query<Event[]>(
      'SELECT * FROM suggest_events_for_user($1)',
      [userId],
    );

    ctx.scene.session.events = events;

    if (!events.length) {
      console.error(`There are no events for user w/ id: ${userId}`);
      await ctx.reply('К сожалению, ничего не нашлось. Давай попробуем еще раз. Кликни на /start');
      return ctx.scene.leave();
    }

    const replyWithMediaGroupResponse = await ctx.replyWithMediaGroup(
      events.map(({ media }) => ({
        media,
        type: 'photo',
      })),
    );

    ctx.scene.session.msgIds = [
      ...replyWithMediaGroupResponse.map((reply: any) => reply.message_id),
    ];

    const { message_id: msgId } = await ctx.reply('Что выберешь ты?', {
      reply_markup: {
        inline_keyboard: EVENT_ID_KEYBOARD_MARKUP,
      },
    });
    ctx.scene.session.msgIds.push(msgId);

    return ctx.wizard.next();
  } catch (error) {
    console.error(error);
    await ctx.scene.leave();
    await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
    return undefined;
  }
};

const getMoreDetails: Middleware<any> = async (ctx) => {
  try {
    console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 2`);

    const selectedEventId = ctx.update.callback_query.data;
    const event = ctx.scene.session.events.at(+selectedEventId);
    ctx.scene.session.event = event;
    console.log('🚀 ~ event:', event);

    const { caption, media } = new EventDTO(event);

    await ctx.deleteMessages([...ctx.scene.session.msgIds, ctx.scene.state.msgId].filter(Boolean));
    ctx.scene.state.msgId = null;

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
  } catch (error) {
    console.error(error);
    await ctx.scene.leave();
    await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
    return undefined;
  }
};

const selectEvent: Middleware<any> = async (ctx) => {
  try {
    console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 3`);
    const action = ctx.update.callback_query.data;

    await ctx.deleteMessage();

    if (action === EventAgreement.BACK) {
      await ctx.scene.leave();
      await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
      return undefined;
    }

    const eventId = ctx.scene.session.event.id;
    const userId = ctx.from.id;

    const { id } = await db.usersEventsRepository.save({
      user_id: userId,
      event_id: eventId,
      started_at: new Date(),
      state: EventState.IN_PROGRESS,
    });

    ctx.scene.session.userEventId = id;

    await ctx.reply(
      deepTrim(
        `Отличный вкус! Дай знать когда выполнишь задание. Спасибо!
          
        Чтобы ты точно попал на эту активность, рекомендуем тебе заранее записаться на сайте или в Инстаграме компании 🫶
      `,
      ),
      {
        reply_markup: {
          inline_keyboard: EVENT_FINISH_KEYBOARD_MARKUP,
        },
      },
    );

    return ctx.wizard.next();
  } catch (error) {
    console.error(error);
    await ctx.scene.leave();
    await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
    return undefined;
  }
};

const processEvent: Middleware<any> = async (ctx) => {
  try {
    console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 4`);
    const action = ctx.update.callback_query.data;

    const eventId = ctx.scene.session.event.id;
    const { userEventId } = ctx.scene.session;

    await ctx.deleteMessage();
    if (action === EventFinish.REJECT) {
      await db.usersEventsRepository.update(
        { id: userEventId },
        {
          finished_at: new Date(),
          state: EventState.DECLINED,
        },
      );

      await ctx.scene.leave();
      await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
      return undefined;
    }

    await db.usersEventsRepository.update(
      { id: userEventId },
      {
        finished_at: new Date(),
        state: EventState.COMPLETED,
      },
    );

    await ctx.scene.leave();
    await ctx.scene.enter(Scenes.FEEDBACK_SCENE, { eventId });
  } catch (error) {
    console.error(error);
    await ctx.scene.leave();
    await ctx.scene.enter(Scenes.SUGGESTION_SCENE);
  }

  return undefined;
};

export const steps = [
  recommendEvent,
  getMoreDetails,
  selectEvent,
  processEvent,
];
