import db from '../index';
import { Partner } from '../entities/partner.entity';

const PARTNER_SEED = [
  {
    id: 1,
    name: 'Partner 1',
    description: 'Partner 1 description',
  },
  {
    id: 2,
    name: 'Partner 2',
    description: 'Partner 2 description',
  },
  {
    id: 3,
    name: 'Partner 3',
    description: 'Partner 3 description',
  },
  {
    id: 4,
    name: 'Partner 4',
    description: 'Partner 4 description',
  },
  {
    id: 5,
    name: 'Partner 5',
    description: 'Partner 5 description',
  },
] as Partner[];

export const partnerSeed = async () => {
  try {
    await db.partnersRepository.insert(PARTNER_SEED);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};
