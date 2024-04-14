import { InlineKeyboardButton } from 'telegraf/types';
import { Age, Busyness, Entertainment } from './enums';

export const AGREEMENT_ON_PERSONAL_DATA_PROCESSING_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: '✅ Согласен', callback_data: 'agree' },
    { text: '❌ Не согласен', callback_data: 'disagree' },
  ],
];

export const SEX_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: '👱‍♂️', callback_data: 'male' },
    { text: '👩‍🦰', callback_data: 'female' },
  ],
];

export const EVENT_FEEDBACK_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: '👍', callback_data: 'like' },
    { text: '👎', callback_data: 'dislike' },
  ],
];

export const AGE_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
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
];

export const BUSYNESS_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: 'меньше 2 ч.', callback_data: Busyness.LOW },
    { text: '2-4 ч.', callback_data: Busyness.MEDIUM },
  ],
  [
    { text: 'больше 4 ч.', callback_data: Busyness.HIGH },
  ],
];
