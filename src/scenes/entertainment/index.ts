import { WizardScene } from 'telegraf/scenes';
import { Scenes } from '../../constants/enums';
import { steps } from './steps';

export const entertainmentSuggestionScene = new WizardScene<any>(
  Scenes.SUGGESTION_SCENE,
  ...steps,
);
