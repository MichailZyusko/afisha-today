import { Age, Busyness, Entertainment } from './enums';

export const AGREEMENT_ON_PERSONAL_DATA_PROCESSING_KEYBOARD_MARKUP = [
  [
    { text: '✅ Согласен', callback_data: 'agree' },
    { text: '❌ Не согласен', callback_data: 'disagree' },
  ],
];

export const SEX_KEYBOARD_MARKUP = [
  [
    { text: '👱‍♂️', callback_data: 'male' },
    { text: '👩‍🦰', callback_data: 'female' },
  ],
];

export const AGE_KEYBOARD_MARKUP = [
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

export const BUSYNESS_KEYBOARD_MARKUP = [
  [
    { text: 'меньше 2 ч.', callback_data: Busyness.LOW },
    { text: '2-4 ч.', callback_data: Busyness.MEDIUM },
  ],
  [
    { text: 'больше 4 ч.', callback_data: Busyness.HIGH },
  ],
];

export const ENTERTAINMENT_KEYBOARD_MARKUP = [
  [
    { text: Entertainment.ACTIVE, callback_data: Entertainment.ACTIVE },
    { text: Entertainment.PARTY, callback_data: Entertainment.PARTY },
  ],
  [
    { text: Entertainment.CHILL_RELAX, callback_data: Entertainment.CHILL_RELAX },
    { text: Entertainment.BRAINSTORM, callback_data: Entertainment.BRAINSTORM },
  ],
  [
    { text: Entertainment.ART, callback_data: Entertainment.ART },
    { text: Entertainment.FOOD, callback_data: Entertainment.FOOD },
  ],
];
