import { BaseEvent, CustomProperties, PredefinedEventProperties, SpecialEventName } from './base-event';

export const SpecialActivityPropertyKey = [] as const;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActivityProperties extends CustomProperties {}

export interface ActivityEvent extends BaseEvent, ActivityProperties {
  event_name: Exclude<string, SpecialEventName>;
  properties?: PredefinedEventProperties;
}

export type Activity = ActivityEvent;
