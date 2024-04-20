import { Event } from '../services/database/entities/event.entity';
import { deepTrim, formatDateRange } from '../utils';

type TConstructorOptions = {
  short: boolean;
};

export class EventDTO {
  caption: string;

  media: string;

  constructor(event: Event, opt: TConstructorOptions = { short: false }) {
    this.media = event.media;

    this.caption = opt.short
      ? deepTrim(`
        Предлагаю посмотреть на <b>"${event.name}"</b> ${event.is_adult_only ? '🔞' : ''}
        В двух словах это ${event.description}
        💰: ${event.price}
        📍: <a href="${event.location}" > ${event.address} </a>
        🕔: ${event.schedule}
        🗓: ${formatDateRange(event.started_at, event.expired_at)}
        🌐: <a href="${event.url}">Website</a>
  `)
      : deepTrim(`
        Предлагаю посмотреть на <b>"${event.name}"</b> ${event.is_adult_only ? '🔞' : ''}
        В двух словах это ${event.description}
        💰: ${event.price}
        📍: <a href="${event.location}">${event.address}</a>
        🕔: ${event.schedule}
        🗓: ${formatDateRange(event.started_at, event.expired_at)}
        🌐: <a href="${event.url}">Website</a>
  `);
  }
}
