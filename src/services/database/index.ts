import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { Entertainment } from './entities/entertaiment.entity';
import { UserEvent } from './entities/user_event.entity';
import { Partner } from './entities/partner.entity';

class Database {
  private client?: DataSource;

  usersRepository: Repository<User>;

  eventsRepository: Repository<Event>;

  usersEventsRepository: Repository<UserEvent>;

  entertainmentsRepository: Repository<Entertainment>;

  constructor() {
    console.log('db initialization');
  }

  async init(): Promise<void> {
    this.client = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Event, Entertainment, UserEvent, Partner],
      synchronize: true,
      cache: true,
      logging: true,
    });
    await this.client.initialize();

    this.usersRepository = this.client.getRepository(User);
    this.eventsRepository = this.client.getRepository(Event);
    this.usersEventsRepository = this.client.getRepository(UserEvent);
    this.entertainmentsRepository = this.client.getRepository(Entertainment);
  }

  async close(): Promise<void> {
    console.log('db close');
    await this.client?.destroy();
  }
}

export default new Database();
