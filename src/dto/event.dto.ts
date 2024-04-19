import { Event } from '../services/database/entities/event.entity';
import { deepTrim, formatDateRange } from '../utils';

export class EventDTO {
  caption: string;

  media: string;

  constructor(event: Event) {
    this.media = event.media;
    this.caption = deepTrim(`
      Предлагаю посмотреть на <b>"${event.name}"</b>
      В двух словах это ${event.description}
      💰: ${event.price}
      📍: <a href="${event.location_url}">${event.address}</a>
      🕔: ${event.schedule}
      🗓: ${formatDateRange(event.started_at, event.expired_at)}
      🔞: ${event.age}
      🌐: <a href="${event.url}">Website</a>
    `);
  }
}
