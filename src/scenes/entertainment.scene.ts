/* eslint-disable no-console */

import { WizardScene } from 'telegraf/scenes';
import { Scenes } from '../constants/enums';
import { EVENT_FEEDBACK_KEYBOARD_MARKUP } from '../constants/keyboard_markup';
import database from '../services/database';
import { EventDTO } from '../dto/event.dto';
import { Event } from '../services/database/entities/event.entity';

export const entertainmentSuggestionScene = new WizardScene<any>(
  Scenes.SUGGESTION_SCENE,
  async (ctx) => {
    console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 1`);
    await ctx.reply('Секундочку, ищем подходящие для тебя варианты...');

    const userId = +ctx.from.id;
    const isRegisteredUser = await database.usersRepository.existsBy({ id: userId });

    if (!isRegisteredUser) {
      console.error(`User w/ id: ${userId} does't exist`);
      await ctx.reply('Сперва необходимо познакомиться. Кликни на /start');
      return ctx.scene.leave();
    }

    const events = await database.query<Event[]>(
      `SELECT * FROM suggest_events_for_user($1)`,
      [userId],
    );
    console.log('🚀 ~ event:', events);

    if (!events.length) {
      console.error(`There are no events for user w/ id: ${userId}`);
      await ctx.reply('К сожалению, ничего не нашлось. Давай попробуем еще раз. Кликни на /start');
      return ctx.scene.leave();
    }

    const [bestMatchingEvent] = events;
    console.log('🚀 ~ suggestedEvent:', bestMatchingEvent);


    const { caption, media } = new EventDTO(bestMatchingEvent);
    console.log('🚀 ~ suggestedEvents:', bestMatchingEvent);

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

    return ctx.scene.leave();
  },
);
