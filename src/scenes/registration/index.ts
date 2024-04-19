/* eslint-disable no-console */

import { WizardScene } from 'telegraf/scenes';
import { Context as TelegrafContext, Scenes as TelegrafScene } from 'telegraf';
import { Age, Busyness, Scenes } from '../../constants/enums';
import { steps } from './steps';

/**
 * We can still extend the regular session object that we can use on the
 * context. However, as we're using wizards, we have to make it extend
 * `WizardSession`.
 *
 * It is possible to pass a type variable to `WizardSession` if you also want to
 * extend the wizard session as we do above.
 */
interface SessionWithUser extends TelegrafScene.WizardSession {
  user: {
    sex: 'male' | 'female';
    age: Age;
    busyness: Busyness;
    entertainment_preference: number[];
  };
  entertainments_preference: number[][];
  step: number;
}

export interface ContextWithCustomSession extends TelegrafContext {
  session: SessionWithUser;
  // declare scene type
  scene: TelegrafScene.SceneContextScene<ContextWithCustomSession, TelegrafScene.WizardSessionData>;
  // declare wizard type
  wizard: TelegrafScene.WizardContextWizard<ContextWithCustomSession>;
}

export const registrationScene = new WizardScene<ContextWithCustomSession>(
  Scenes.REGISTRATION_SCENE,
  ...steps,
);
