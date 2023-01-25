import { Activity, Event, Feedback, Generation, ValidPropertyType } from './events';

export interface PayloadOptions {
  [key: string]: any;
}

export interface GeneralPayload {
  events: readonly Event[];
  options?: PayloadOptions;
}

export interface ActivityPayload {
  activities: readonly Activity[];
  options?: PayloadOptions;
}

export interface GenerationPayload {
  generations: readonly Generation[];
  options?: PayloadOptions;
}

export interface FeedbackPayload {
  feedbacks: readonly Feedback[];
  options?: PayloadOptions;
}

export interface IdentifyPayload {
  alias?: string;
  distinctId?: string;
  name?: string;
  email?: string;
  city?: string;
  region?: string;
  country?: string;
  language?: string;
  custom?: ValidPropertyType;
}

export type Payload = GeneralPayload | ActivityPayload | GenerationPayload | FeedbackPayload | IdentifyPayload;
