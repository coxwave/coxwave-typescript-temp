/**
 * Strings that have special meaning when used as an event's type
 * and have different specifications.
 */
export const AvailableEventType = ['$track', '$log', '$feedback', '$identify'] as const;
export type TAvailableEventType = (typeof AvailableEventType)[number];

/**
 * Strings that have special meaning when used as an event's name
 * and have different specifications.
 */
export enum SpecialEventName {
  REGISTER = '$register',
  IDENTIFY = '$identify',
  ALIAS = '$alias',
}

export interface BaseEvent extends Record<string, any> {
  id: string;
  eventType: TAvailableEventType;
  eventName: string;
  properties?: PredefinedPropertyType;
}

export interface CustomProperties {
  [key: string]: ValidPropertyType;
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
  custom?: CustomProperties;
}

export interface PredefinedIdentifyProperties extends PredefinedEventProperties {
  alias?: string;
  name?: string;
  email?: string;
  city?: string;
  region?: string;
  country?: string;
  language?: string;
  custom?: CustomProperties;
}

export type PredefinedPropertyType = PredefinedEventProperties | PredefinedIdentifyProperties;
export type ValidPropertyType =
  | number
  | string
  | boolean
  | Array<string | number>
  | { [key: string]: ValidPropertyType }
  | undefined;
