import { IngestionMetadataEventProperty } from '../ingestion-metadata';

/**
 * Strings that have special meaning when used as an event's type
 * and have different specifications.
 */
export enum AvailableEventType {
  TRACK = '$track',
  LOG = '$log',
  FEEDBACK = '$feedback',
}

/**
 * Strings that have special meaning when used as an event's name
 * and have different specifications.
 */
export enum SpecialEventName {
  IDENTIFY = '$identify',
}

export interface BaseEvent extends EventOptions {
  id: string;
  event_type: AvailableEventType;
  event_name: string;
  properties?: { [key: string]: any };
  // TODO: implement later
  // group_properties?: { [key: string]: any };
  // groups?: { [key: string]: any };
}

export type EventOptions = {
  // default options
  time?: number;
  library?: string;
  session_id?: number;
  thread_id?: string; // uuid only
  ingestion_metadata?: IngestionMetadataEventProperty;
  // TODO: move to user related options -> to identify
  // email?: string
  // name?: string
  user_id?: string;
  country?: string;
  region?: string;
  city?: string;
  language?: string;
  // device related options
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
};
