import { InlineKeyboardButton } from 'telegraf/types';
import { deepTrim } from '../utils';
import {
  ACTIVE_SPORTS_PREFERENCES_KEYBOARD_MARKUP, AGE_KEYBOARD_MARKUP,
  CHILL_RELAX_PREFERENCES_KEYBOARD_MARKUP,
  FOOD_HUNTER_PREFERENCES_KEYBOARD_MARKUP, FREE_TIME_PREFERENCES_KEYBOARD_MARKUP,
  NIGHT_LIFESTYLE_PREFERENCES_KEYBOARD_MARKUP, OUTDOORS_PREFERENCES_KEYBOARD_MARKUP,
  SELF_EDUCATION_PREFERENCES_KEYBOARD_MARKUP, SEX_KEYBOARD_MARKUP,
} from './keyboard_markup';
import { Entertainment } from './enums';

export const DISAGREE_ON_PERSONAL_DATA_PROCESSING_MSG = 'Было приятно с тобой пообщаться, брат. Если передумаешь, напиши /start';

export const REACH_MAX_USERS_ERROR = 'К сожалению, больше нельзя создавать новые аккаунты, так как достигнут максимум для бета-тестирования';

export const START_SCENE_REPLICAS = {
  0: `Привет! Добро пожаловать в бот Lampa Project 💛

Здесь мы тестируем наш новый проект, который избавит тебя от незнания, "чем же заняться сегодня?", и поможет провести эту весну максимально насыщенно!

Получай задания, подобранные специально для тебя, выполняй их, становись активным игроком, участвуй в вечеринке в честь окончания тестирования и выигрывай подарок.

Все игроки, которые выполнили больше 10 заданий, станут участниками нашей финальной вечеринки-соревнования.

А 3 ее победителя получат главные призы на общую сумму 1000 BYN!

Каждое задание имеет разные уровни сложности. Используй эту шпаргалку чтобы запомнить 😉
1 - легко и дешево
2 - требует минимальных усилий
3 - надо постараться и потратить деньги:`,

  1: 'Для того, чтобы мы познакомились поближе, нам нужно твое согласие на обработку персональных данных 😊',
};

export const REGISTRATION_REPLIES = {
  0: {
    msg: 'Твой пол',
    keyboard: SEX_KEYBOARD_MARKUP,
  },
  1: {
    msg: 'Твой возраст',
    keyboard: AGE_KEYBOARD_MARKUP,
  },
  2: {
    msg: 'Как ты предпочитаешь проводить свободное время?',
    keyboard: FREE_TIME_PREFERENCES_KEYBOARD_MARKUP,
  },
  3: {
    msg: 'Как ты относишься к активному отдыху и спорту?',
    keyboard: ACTIVE_SPORTS_PREFERENCES_KEYBOARD_MARKUP,
  },
  4: {
    msg: 'Любишь ли ты учиться чему-то новому?',
    keyboard: SELF_EDUCATION_PREFERENCES_KEYBOARD_MARKUP,
  },
  5: {
    msg: 'Что насчет посещения баров и клубов?',
    keyboard: NIGHT_LIFESTYLE_PREFERENCES_KEYBOARD_MARKUP,
  },
  6: {
    msg: 'Любишь ли ты открывать для себя новые гастро-заведения?',
    keyboard: FOOD_HUNTER_PREFERENCES_KEYBOARD_MARKUP,
  },
  7: {
    msg: 'Что думаешь насчет отдыха на природе?',
    keyboard: OUTDOORS_PREFERENCES_KEYBOARD_MARKUP,
  },
  8: {
    msg: 'Любишь ли ты спокойный отдых/чилл?',
    keyboard: CHILL_RELAX_PREFERENCES_KEYBOARD_MARKUP,
  },
} as Record<number, { msg: string, keyboard: InlineKeyboardButton[][] }>;

export const DEFAULT_CATEGORIES = [
  Entertainment.INDOORS, Entertainment.LONELY,
  Entertainment.FREE, Entertainment.ENTERTAINMENT,
].map(Number);

export const DEFAULT_ERROR_MSG = deepTrim(`
  Кажется что-то пошло не так. Попробуйте еще раз позже!
  Спасибо за понимание 😉!
`);

export const REGISTRATION_EVENTS_COUNT = 6;
