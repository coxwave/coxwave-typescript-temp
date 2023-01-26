import { BaseEvent, PredefinedIdentifyProperties, TSpecialEventName, ValidPropertyType } from './base-event';

export const SpecialIdentifyPropertyKey = ['name', 'email', 'city', 'region', 'country', 'language', 'custom'] as const;
export type TSpecialIdentifyPropertyKey = (typeof SpecialIdentifyPropertyKey)[number];

export interface IdentifyUserProperties {
  [key: string]: ValidPropertyType;
}

export interface Identify {
  getUserProperties(): IdentifyUserProperties;
  set(property: Exclude<string, PredefinedIdentifyProperties>, value: ValidPropertyType): Identify;
}

// TODO: Only support for SET for now.
export enum IdentifyOperation {
  SET = '$set',
}

export interface IdentifyRegisterEvent extends BaseEvent {
  eventName: TSpecialEventName;
  distinctId: string;
}

export interface IdentifyUserEvent extends BaseEvent, PredefinedIdentifyProperties {
  eventName: TSpecialEventName;
  alias: string;
}

export interface IdentifyAliasEvent extends BaseEvent {
  eventName: TSpecialEventName;
  alias: string;
  distinctId: string;
}
