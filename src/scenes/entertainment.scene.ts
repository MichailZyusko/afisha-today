/* eslint-disable no-console */

import { WizardScene } from 'telegraf/scenes';
import { Scenes } from '../constants/enums';
import { EVENT_FEEDBACK_KEYBOARD_MARKUP } from '../constants/keyboard_markup';
import database from '../services/database';
import { EventDTO } from '../dto/event.dto';

export const entertainmentSuggestionScene = new WizardScene<any>(
  Scenes.SUGGESTION_SCENE,
  async (ctx) => {
    console.log(`${Scenes.SUGGESTION_SCENE}~STEP: 1`);
    await ctx.reply('Секундочку, ищем подходящие для тебя варианты...');


    const userId = +ctx.from.id;
    const user = await database.usersRepository.findOneBy({ id: userId });
    console.log('🚀 ~ user:', user);


    const events = await database.eventsRepository.find();
    const suggestedEvent = events.at(~~(Math.random() * events.length));

    if (!suggestedEvent) {
      throw new Error('Event missing');
    }

    const { caption, media } = new EventDTO(suggestedEvent);
    console.log('🚀 ~ suggestedEvents:', suggestedEvent);

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
