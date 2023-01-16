import { AvailableEventType, BaseEvent, SpecialEventName } from './base-event';

export type FeedbackPropertyType = {
  [key: string]: number | string | boolean | Array<string | number>;
};
export interface SubmitFeedback extends BaseEvent {
  event_type: AvailableEventType.SUBMIT;
  event_name: Exclude<string, SpecialEventName>;
  target_id: string;
  feedback_properties?: FeedbackPropertyType;
}

export type Feedback = SubmitFeedback;
