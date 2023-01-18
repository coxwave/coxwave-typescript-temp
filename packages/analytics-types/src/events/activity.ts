import { BaseEvent, TAvailableEventType, SpecialEventName, ValidPropertyType } from './base-event';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActivityProperties extends Record<string, ValidPropertyType> {}

export interface TrackActivityEvent extends BaseEvent {
  event_type: TAvailableEventType;
  event_name: Exclude<string, SpecialEventName>;
  properties?: ActivityProperties;
}

export type Activity = TrackActivityEvent;
