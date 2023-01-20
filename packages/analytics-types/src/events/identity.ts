import { BaseEvent, PredefinedIdentifyProperties, SpecialEventName, ValidPropertyType } from './base-event';

export interface Identify {
  getUserProperties(): IdentifyUserProperties;
  set(property: string, value: ValidPropertyType): Identify;
}

// TODO: Only support for SET for now.
export enum IdentifyOperation {
  // Base Operations to set values
  SET = '$set',
}

interface BaseOperationConfig {
  [key: string]: ValidPropertyType;
}

export interface IdentifyUserProperties extends PredefinedIdentifyProperties {
  [IdentifyOperation.SET]?: BaseOperationConfig;
}

export interface IdentifyRegisterEvent extends BaseEvent {
  event_name: SpecialEventName.REGISTER;
  distinct_id: string;
}

export interface IdentifyUserEvent extends BaseEvent, IdentifyUserProperties {
  event_name: SpecialEventName.IDENTIFY;
}

export interface IdentifyAliasEvent extends BaseEvent {
  event_name: SpecialEventName.ALIAS;
  alias: string;
  distinct_id: string;
}

export type IdentifyEvent = IdentifyRegisterEvent | IdentifyUserEvent | IdentifyAliasEvent;
