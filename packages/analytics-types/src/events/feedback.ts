import { AvailableEventType, BaseEvent, SpecialEventName } from './base-event';

export type FeedbackProperties = {
  target_id: string;
  [key: string]: number | string | boolean | Array<string | number>;
};
export interface FeedbackEvent extends BaseEvent {
  event_type: AvailableEventType.SUBMIT;
  event_name: Exclude<string, SpecialEventName>;
  feedback_properties?: FeedbackProperties;
}

export type Feedback = FeedbackEvent;
