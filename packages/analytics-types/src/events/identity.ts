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
  eventName: SpecialEventName.REGISTER;
  distinctId: string;
}

export interface IdentifyUserEvent extends BaseEvent, IdentifyUserProperties {
  eventName: SpecialEventName.IDENTIFY;
}

export interface IdentifyAliasEvent extends BaseEvent {
  eventName: SpecialEventName.ALIAS;
  alias: string;
  distinctId: string;
}

export type IdentifyEvent = IdentifyRegisterEvent | IdentifyUserEvent | IdentifyAliasEvent;
