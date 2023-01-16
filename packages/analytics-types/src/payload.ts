import { Event } from './events';

export interface PayloadOptions {
  [key: string]: any;
}

export interface Payload {
  api_key: string;
  events: readonly Event[];
  options?: PayloadOptions;
}
