import { AvailableEventType, BaseEvent, SpecialEventName } from './base-event';

export interface SubmitFeedback extends BaseEvent {
  event_type: AvailableEventType.SUBMIT;
  event_name: Exclude<string, SpecialEventName>;
  target_id: string;
  feedback_properties?: { [key: string]: number | string | boolean };
}

export type Feedback = SubmitFeedback;
