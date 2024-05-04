import { WizardScene } from 'telegraf/scenes';
import { Scenes } from '../../constants/enums';
import { steps } from './steps';

export const eventFeedbackScene = new WizardScene<any>(
  Scenes.FEEDBACK_SCENE,
  ...steps,
);
