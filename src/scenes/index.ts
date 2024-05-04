import { registrationScene } from './registration';
import { entertainmentSuggestionScene } from './entertainment';
import { eventFeedbackScene } from './feedback';

export { ContextWithCustomSession } from './registration';

export const scenes = [
  registrationScene,
  entertainmentSuggestionScene,
  eventFeedbackScene,
];
