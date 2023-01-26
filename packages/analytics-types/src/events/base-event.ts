/**
 * Strings that have special meaning when used as an event's type
 * and have different specifications.
 */
export const AvailableEventType = {
  TRACK: '$register',
  LOG: '$identify',
  FEEDBACK: '$alias',
  IDENTIFY: '$identify',
} as const;
export type TAvailableEventType = (typeof AvailableEventType)[keyof typeof AvailableEventType];

/**
 * Strings that have special meaning when used as an event's name
 * and have different specifications.
 */
export const SpecialEventName = {
  REGISTER: '$register',
  IDENTIFY: '$identify',
  ALIAS: '$alias',
} as const;
export type TSpecialEventName = (typeof SpecialEventName)[keyof typeof SpecialEventName];

export interface BaseEvent {
  id: string;
  eventType: TAvailableEventType;
  eventName: string;
  properties?: PredefinedEventProperties;
}

export interface PredefinedEventProperties {
  // default options
  distinctId?: string;
  time?: number;
  library?: string;
  sessionId?: number;
  threadId?: string; // uuid only
  // user & device related options
  userId?: string;
  deviceId?: string;
  appVersion?: string;
  versionName?: string;
  platform?: string;
  osName?: string;
  osVersion?: string;
  deviceBrand?: string;
  deviceManufacturer?: string;
  deviceModel?: string;
  // location related options
  locationLat?: number;
  locationLng?: number;
  ip?: string;
  custom?: { [key: string]: any };
}

export interface PredefinedIdentifyProperties {
  name?: string;
  email?: string;
  city?: string;
  region?: string;
  country?: string;
  language?: string;
  custom?: { [key: string]: any };
}

export type ValidPropertyType =
  | number
  | string
  | boolean
  | Array<string | number>
  | { [key: string]: ValidPropertyType };
