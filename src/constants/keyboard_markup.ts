import { InlineKeyboardButton } from 'telegraf/types';
import {
  Age, Agree, Busyness,
  EventAgreement, EventFeedback,
  EventFeedbackFinish, EventFinish, Sex,
} from './enums';

export const AGREEMENT_ON_PERSONAL_DATA_PROCESSING_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: '✅ Согласен', callback_data: Agree.AGREE },
    { text: '❌ Не согласен', callback_data: Agree.DISAGREE },
  ],
];

export const SEX_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: '👱‍♂️', callback_data: Sex.MALE },
    { text: '👩‍🦰', callback_data: Sex.FEMALE },
  ],
];

export const EVENT_FEEDBACK_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: '👍', callback_data: EventFeedback.LIKE },
    { text: '👎', callback_data: EventFeedback.DISLIKE },
  ],
];

export const EVENT_FEEDBACK_FINISH_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: '📝 Оставить отзыв', callback_data: EventFeedbackFinish.LEAVE_FEEDBACK },
    { text: '🆕 Получить новое задание', callback_data: EventFeedbackFinish.GET_NEW_EVENT },
  ],
];

export const EVENT_AGREEMENT_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: '✅ Принять', callback_data: EventAgreement.APPROVE },
    { text: '⬅️ Назад', callback_data: EventAgreement.BACK },
  ],
];

export const EVENT_FINISH_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: '✅ Выполнено', callback_data: EventFinish.DONE },
    { text: '❌ Отказ', callback_data: EventFinish.REJECT },
  ],
];

export const EVENT_ID_KEYBOARD_MARKUP: InlineKeyboardButton[][] = [
  [
    { text: '1️⃣', callback_data: '0' },
    { text: '2️⃣', callback_data: '1' },
  ],
  [
    { text: '3️⃣', callback_data: '2' },
    { text: '4️⃣', callback_data: '3' },
  ],
  [
    { text: '5️⃣', callback_data: '4' },
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
