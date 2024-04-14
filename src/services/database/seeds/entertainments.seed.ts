import db from '../index';
import { Entertainment } from '../../../constants/enums';

const ENTERTAINMENTS_SEED = [
  Entertainment.ACTIVE,
  Entertainment.CHILL_RELAX,
  Entertainment.PARTY,
  Entertainment.BRAINSTORM,
  Entertainment.FOOD,
  Entertainment.ART,
];

export const entertainmentsSeed = async () => {
  await db.entertainmentsRepository.insert(
    ENTERTAINMENTS_SEED.map((entertainment) => ({
      name: entertainment,
    })),
  );
};
