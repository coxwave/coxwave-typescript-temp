export { Activity, ActivityEvent, SpecialActivityPropertyKey, ActivityProperties } from './activity';
export {
  BaseEvent,
  CustomProperties,
  PredefinedEventProperties,
  PredefinedIdentifyProperties,
  PredefinedPropertyType,
  AvailableEventType,
  TAvailableEventType,
  SpecialEventName,
  ValidPropertyType,
} from './base-event';
export { Feedback, FeedbackEvent, SpecialFeedbackPropertyKey, FeedbackProperties } from './feedback';
export {
  Generation,
  GenerationEvent,
  GenerationIOEntity,
  SpecialGenerationPropertyKey,
  GenerationProperties,
} from './generation';
export {
  SpecialIdentifyPropertyKey,
  IdentifyEvent,
  IdentifyRegisterEvent,
  IdentifyUserEvent,
  IdentifyAliasEvent,
  IdentifyOperation,
  Identify,
} from './identity';

import { Activity } from './activity';
import { Feedback } from './feedback';
import { Generation } from './generation';
import { IdentifyEvent } from './identity';

export type Event = Activity | Feedback | Generation | IdentifyEvent;
