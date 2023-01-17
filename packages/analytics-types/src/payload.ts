import { Event } from './events';

export interface PayloadOptions {
  [key: string]: any;
}

export interface Payload {
  events: readonly Event[];
  options?: PayloadOptions;
}
