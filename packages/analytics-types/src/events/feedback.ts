import { TAvailableEventType, BaseEvent, SpecialEventName } from './base-event';

export interface FeedbackProperties {
  target_id: string;
  [key: string]: number | string | boolean | Array<string | number>;
}

export interface FeedbackEvent extends BaseEvent {
  event_type: TAvailableEventType;
  event_name: Exclude<string, SpecialEventName>;
  properties: FeedbackProperties;
}

export type Feedback = FeedbackEvent;
