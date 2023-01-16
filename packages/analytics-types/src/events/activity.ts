import { BaseEvent, AvailableEventType, SpecialEventName } from './base-event';

export type ValidPropertyType =
  | number
  | string
  | boolean
  | Array<string | number>
  | { [key: string]: ValidPropertyType };

export type ActivityPropertyType = {
  [key: string]: number | string | boolean | Array<string | number>;
};

export interface Identify {
  getUserProperties(): IdentifyUserProperties;
  set(property: string, value: ValidPropertyType): Identify;
  setOnce(property: string, value: ValidPropertyType): Identify;
  append(property: string, value: ValidPropertyType): Identify;
  prepend(property: string, value: ValidPropertyType): Identify;
  postInsert(property: string, value: ValidPropertyType): Identify;
  preInsert(property: string, value: ValidPropertyType): Identify;
  remove(property: string, value: ValidPropertyType): Identify;
  add(property: string, value: number): Identify;
  unset(property: string): Identify;
  clearAll(): Identify;
}

export enum IdentifyOperation {
  // Base Operations to set values
  SET = '$set',
  SET_ONCE = '$setOnce',

  // Operations around modifying existing values
  ADD = '$add',
  APPEND = '$append',
  PREPEND = '$prepend',
  REMOVE = '$remove',

  // Operations around appending values *if* they aren't present
  PREINSERT = '$preInsert',
  POSTINSERT = '$postInsert',

  // Operations around removing properties/values
  UNSET = '$unset',
  CLEAR_ALL = '$clearAll',
}

interface BaseOperationConfig {
  [key: string]: ValidPropertyType;
}

export interface IdentifyUserProperties {
  // Add operations can only take numbers
  [IdentifyOperation.ADD]?: { [key: string]: number };

  // This reads the keys of the passed object, but the values are not used
  [IdentifyOperation.UNSET]?: BaseOperationConfig;
  // This option does not read the key as it unsets all user properties
  [IdentifyOperation.CLEAR_ALL]?: any;

  // These operations can take numbers, strings, or arrays of both.
  [IdentifyOperation.SET]?: BaseOperationConfig;
  [IdentifyOperation.SET_ONCE]?: BaseOperationConfig;
  [IdentifyOperation.APPEND]?: BaseOperationConfig;
  [IdentifyOperation.PREPEND]?: BaseOperationConfig;
  [IdentifyOperation.POSTINSERT]?: BaseOperationConfig;
  [IdentifyOperation.PREINSERT]?: BaseOperationConfig;
  [IdentifyOperation.REMOVE]?: BaseOperationConfig;
}

export interface TrackActivity extends BaseEvent {
  event_type: AvailableEventType.TRACK;
  event_name: Exclude<string, SpecialEventName>;
  activity_properties?: ActivityPropertyType;
}

export interface IdentifyActivity extends BaseEvent {
  event_type: AvailableEventType.TRACK;
  event_name: SpecialEventName.IDENTIFY;
  user_properties:
    | IdentifyUserProperties
    | {
        [key in Exclude<string, IdentifyOperation>]: any;
      };
}

// TODO: group will be implemented later
// export interface GroupIdentifyActivity extends BaseEvent {
//   event_type: SpecialEventName.GROUP_IDENTIFY;
//   group_properties:
//     | IdentifyUserProperties
//     | {
//         [key in Exclude<string, IdentifyOperation>]: any;
//       };
// }

export type Activity = TrackActivity | IdentifyActivity;
