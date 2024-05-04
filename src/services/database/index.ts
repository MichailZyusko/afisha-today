import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { Entertainment } from './entities/entertainment.entity';
import { UserEvent } from './entities/user_event.entity';
import { Partner } from './entities/partner.entity';
import { EventFeedback } from './entities/event_feedback.entity';
import { AppSettings } from './entities/app_settings.entity';

class Database {
  private client?: DataSource;

  usersRepository: Repository<User>;

  eventsRepository: Repository<Event>;

  usersEventsRepository: Repository<UserEvent>;

  entertainmentsRepository: Repository<Entertainment>;

  partnersRepository: Repository<Partner>;

  eventFeedbacksRepository: Repository<EventFeedback>;

  constructor() {
    console.log('db initialization');
  }

  async init(): Promise<void> {
    this.client = new DataSource({
      type: 'postgres',
      ...(process.env.NODE_ENV === 'prod'
        ? {
          url: process.env.DB_URL,
        }
        : {
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }
      ),
      entities: [
        User, Event, Entertainment,
        UserEvent, Partner, EventFeedback,
        AppSettings,
      ],
      synchronize: true,
      cache: true,
      logging: true,
    });
    await this.client.initialize();

    this.usersRepository = this.client.getRepository(User);
    this.eventsRepository = this.client.getRepository(Event);
    this.usersEventsRepository = this.client.getRepository(UserEvent);
    this.entertainmentsRepository = this.client.getRepository(Entertainment);
    this.partnersRepository = this.client.getRepository(Partner);
    this.eventFeedbacksRepository = this.client.getRepository(EventFeedback);
  }

  async close(): Promise<void> {
    console.log('db close');
    await this.client?.destroy();
  }

  async query<T>(...params: Parameters<DataSource['query']>) {
    return this.client!.query<T>(...params);
  }
}

export default new Database();
