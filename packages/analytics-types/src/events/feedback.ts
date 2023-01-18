import { TAvailableEventType, BaseEvent, SpecialEventName, ValidPropertyType } from './base-event';

export interface FeedbackProperties extends Record<string, ValidPropertyType> {
  generation_id: string;
}

export interface FeedbackEvent extends BaseEvent {
  event_type: TAvailableEventType;
  event_name: Exclude<string, SpecialEventName>;
  properties: FeedbackProperties;
}

export type Feedback = FeedbackEvent;
