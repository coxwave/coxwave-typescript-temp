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

export interface BaseEvent {
  id: string;
  event_type: TAvailableEventType;
  event_name: string;
  properties?: PredefinedPropertyType;
}

export interface CustomProperties {
  [key: string]: ValidPropertyType | undefined | object;
}

export interface PredefinedEventProperties {
  // default options
  distinct_id?: string;
  time?: number;
  library?: string;
  session_id?: number;
  thread_id?: string; // uuid only
  // user & device related options
  user_id?: string;
  device_id?: string;
  app_version?: string;
  version_name?: string;
  platform?: string;
  os_name?: string;
  os_version?: string;
  device_brand?: string;
  device_manufacturer?: string;
  device_model?: string;
  // location related options
  location_lat?: number;
  location_lng?: number;
  ip?: string;
  custom?: { [key: string]: ValidPropertyType };
}

export interface PredefinedIdentifyProperties extends PredefinedEventProperties {
  alias?: string;
  name?: string;
  email?: string;
  city?: string;
  region?: string;
  country?: string;
  language?: string;
  custom?: { [key: string]: ValidPropertyType };
}

export type PredefinedPropertyType = PredefinedEventProperties | PredefinedIdentifyProperties;
export type ValidPropertyType =
  | number
  | string
  | boolean
  | Array<string | number>
  | { [key: string]: ValidPropertyType };
