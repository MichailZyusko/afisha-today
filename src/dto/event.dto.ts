import { Event } from '../services/database/entities/event.entity';
import { deepTrim, formatDateRange } from '../utils';

const ALWAYS_AVAILABLE = '01.01.1970 – 01.01.2100';

type TConstructorOptions = {
  short: boolean;
};

export class EventDTO {
  caption: string;

  media: string;

  constructor(event: Event, opt: TConstructorOptions = { short: false }) {
    this.media = event.media;
    const workingPeriod = formatDateRange(event.started_at, event.expired_at);

    this.caption = opt.short
      ? deepTrim(`
        <b>"${event.name}"</b> ${event.is_adult_only ? '🔞' : ''}
        А если подробнее - ${event.description}

        💰: ${event.price}
        📍: <a href="${event.location}" >${event.address}</a>
        🕔: ${event.schedule}${workingPeriod === ALWAYS_AVAILABLE ? '' : `\n🗓: ${workingPeriod}`}
        🌐: <a href="${event.url}" >${event.name}</a>

       <i>Режим работы и стоимость актуальна на 27 мая, подробности уточняйте при записи или покупке билета.</i>
  `)
      : deepTrim(`
        <b>"${event.name}"</b> ${event.is_adult_only ? '🔞' : ''}
        А если подробнее - ${event.description}

        💰: ${event.price}
        📍: <a href="${event.location}" >${event.address}</a>
        🕔: ${event.schedule}${workingPeriod === ALWAYS_AVAILABLE ? '' : `\n🗓: ${workingPeriod}`}
        🌐: <a href="${event.url}" >${event.name}</a>

        <i>Режим работы и стоимость актуальна на 27 мая, подробности уточняйте при записи или покупке билета.</i>
  `);
  }
}
