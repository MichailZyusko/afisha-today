import { Context } from 'telegraf';
import { CallbackQuery, Update } from 'telegraf/types';

const DEFAULT_MESSAGE = { chat: { id: '' } };
const DEFAULT_FROM = {
  id: '0',
  first_name: 'Anonymous',
  last_name: 'Anonymous',
  username: 'Anonymous',
};

export class UserDTO {
  id: number;

  chat_id: string;

  user_name: string;

  full_name: string;

  phone: string;

  constructor(ctx: Context<Update.CallbackQueryUpdate<CallbackQuery>>) {
    const {
      from = DEFAULT_FROM,
      message = DEFAULT_MESSAGE,
    } = ctx.callbackQuery;

    const {
      id,
      first_name: firstName = 'Anonymous',
      last_name: lastName = 'Anonymous',
      username = 'Anonymous',
    } = from;
    const {
      chat: { id: chatId },
    } = message;

    this.chat_id = chatId.toString();
    this.id = +id;
    this.user_name = username;
    this.full_name = `${firstName} ${lastName}`;
  }
}
