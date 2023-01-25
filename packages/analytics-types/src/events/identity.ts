import {
  BaseEvent,
  CustomProperties,
  PredefinedIdentifyProperties,
  SpecialEventName,
  ValidPropertyType,
} from './base-event';

export const SpecialIdentifyPropertyKey = ['name', 'email', 'city', 'region', 'country', 'language', 'custom'] as const;

export interface Identify {
  getUserProperties(): CustomProperties; //IdentifyUserProperties;
  set(property: Exclude<string, PredefinedIdentifyProperties>, value: ValidPropertyType): Identify;
}

// TODO: Only support for SET for now.
export enum IdentifyOperation {
  // Base Operations to set values
  SET = '$set',
}

// interface BaseOperationConfig {
//   [key: string]: ValidPropertyType;
// }

// TODO: All other platforms use this schema
// export interface IdentifyUserProperties extends PredefinedIdentifyProperties {
//   [IdentifyOperation.SET]?: BaseOperationConfig;
// }

export interface IdentifyRegisterEvent extends BaseEvent {
  eventName: SpecialEventName.REGISTER;
  distinctId: string;
}

export interface IdentifyUserEvent extends BaseEvent, PredefinedIdentifyProperties {
  eventName: SpecialEventName.IDENTIFY;
  alias: string;
}

export interface IdentifyAliasEvent extends BaseEvent {
  eventName: SpecialEventName.ALIAS;
  alias: string;
  distinctId: string;
}

export type IdentifyEvent = IdentifyRegisterEvent | IdentifyUserEvent | IdentifyAliasEvent;
