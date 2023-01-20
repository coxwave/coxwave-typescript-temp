import { BaseEvent, CustomProperties, PredefinedEventProperties, SpecialEventName } from './base-event';

export const SpecialFeedbackPropertyKey = ['generation_id'] as const;

export interface FeedbackProperties extends CustomProperties {
  generation_id: string;
}

export interface FeedbackEvent extends BaseEvent, FeedbackProperties {
  event_name: Exclude<string, SpecialEventName>;
  properties?: PredefinedEventProperties;
}

export type Feedback = FeedbackEvent;
