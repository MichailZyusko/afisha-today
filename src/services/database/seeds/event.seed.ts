import db from '../index';
import { Event } from '../entities/event.entity';
import { Entertainment } from '../entities/entertainment.entity';
import { Partner } from '../entities/partner.entity';

export const EVENTS_SEED = [
  {
    id: 1,
    name: 'Event 1',
    description: 'Event 1 description',
    media: 'http://http.cat/400',
    price: '10.00',
    location: 'https://yandex.com/maps/-/CDVBuQzk',
    address: 'Address 1',
    schedule: 'Schedule 1',
    started_at: new Date(),
    expired_at: new Date(),
    partner: 1 as unknown as Partner,
    is_adult_only: true,
    url: 'http://http.cat/400',
    entertainment_tags: [1, 2, 3] as unknown as Entertainment,
    created_at: new Date(),
    updated_at: new Date(),
  } as Event,
  {
    id: 2,
    name: 'Event 2',
    description: 'Event 2 description',
    media: 'http://http.cat/401',
    price: '11.00',
    location: 'https://yandex.com/maps/-/CDVBuQzk',
    address: 'Address 2',
    schedule: 'Schedule 2',
    started_at: new Date(),
    expired_at: new Date(),
    partner: 1 as unknown as Partner,
    is_adult_only: false,
    url: 'http://http.cat/400',
    entertainment_tags: [2, 3, 4] as unknown as Entertainment,
    created_at: new Date(),
    updated_at: new Date(),
  } as Event, {
    id: 3,
    name: 'Event 3',
    description: 'Event 3 description',
    media: 'http://http.cat/403',
    price: '13.00',
    location: 'https://yandex.com/maps/-/CDVBuQzk',
    address: 'Address 3',
    schedule: 'Schedule 3',
    started_at: new Date(),
    expired_at: new Date(),
    partner: 2 as unknown as Partner,
    is_adult_only: true,
    url: 'http://http.cat/400',
    entertainment_tags: [1, 4, 3] as unknown as Entertainment,
    created_at: new Date(),
    updated_at: new Date(),
  } as Event, {
    id: 4,
    name: 'Event 4',
    description: 'Event 4 description',
    media: 'http://http.cat/404',
    price: '14.00',
    location: 'https://yandex.com/maps/-/CDVBuQzk',
    address: 'Address 4',
    schedule: 'Schedule 4',
    started_at: new Date(),
    expired_at: new Date(),
    partner: 1 as unknown as Partner,
    is_adult_only: true,
    url: 'http://http.cat/400',
    entertainment_tags: [1, 6, 5] as unknown as Entertainment,
    created_at: new Date(),
    updated_at: new Date(),
  } as Event, {
    id: 1,
    name: 'Event 5',
    description: 'Event 5 description',
    media: 'http://http.cat/500',
    price: '50.00',
    location: 'https://yandex.com/maps/-/CDVBuQzk',
    address: 'Address 5',
    schedule: 'Schedule 5',
    started_at: new Date(),
    expired_at: new Date(),
    partner: 1 as unknown as Partner,
    is_adult_only: false,
    url: 'http://http.cat/400',
    entertainment_tags: [1, 4, 2] as unknown as Entertainment,
    created_at: new Date(),
    updated_at: new Date(),
  } as Event,
];

export const eventsSeed = async () => {
  try {
    await db.eventsRepository.insert(EVENTS_SEED);
  } catch (error: any) {
    console.error(error);

    throw new Error(error);
  }
};
