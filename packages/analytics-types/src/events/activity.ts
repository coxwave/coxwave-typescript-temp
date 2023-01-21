import { BaseEvent, PredefinedEventProperties, SpecialEventName } from './base-event';

export const SpecialActivityPropertyKey = [] as const;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActivityProperties extends Record<string, any> {}

export interface ActivityEvent extends BaseEvent, ActivityProperties {
  eventName: Exclude<string, SpecialEventName>;
  properties?: PredefinedEventProperties;
}

export type Activity = ActivityEvent;
