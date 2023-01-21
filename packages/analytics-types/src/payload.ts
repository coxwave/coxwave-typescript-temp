import { Activity, Event, Feedback, Generation } from './events';

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

export type Payload = GeneralPayload | ActivityPayload | GenerationPayload | FeedbackPayload;
