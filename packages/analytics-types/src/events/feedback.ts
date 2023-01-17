import { AvailableEventType, BaseEvent, SpecialEventName } from './base-event';

export interface FeedbackProperties {
  target_id: string;
  [key: string]: number | string | boolean | Array<string | number>;
}

export interface FeedbackEvent extends BaseEvent {
  event_type: AvailableEventType.FEEDBACK;
  event_name: Exclude<string, SpecialEventName>;
  feedback_properties?: FeedbackProperties;
}

export type Feedback = FeedbackEvent;
