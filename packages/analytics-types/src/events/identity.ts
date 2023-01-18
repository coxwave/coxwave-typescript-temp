import { BaseEvent, TAvailableEventType, SpecialEventName, ValidPropertyType } from './base-event';

export interface Identify {
  getUserProperties(): IdentifyUserProperties;
  set(property: string, value: ValidPropertyType): Identify;
  // setOnce(property: string, value: ValidPropertyType): Identify;
  // append(property: string, value: ValidPropertyType): Identify;
  // prepend(property: string, value: ValidPropertyType): Identify;
  // postInsert(property: string, value: ValidPropertyType): Identify;
  // preInsert(property: string, value: ValidPropertyType): Identify;
  // remove(property: string, value: ValidPropertyType): Identify;
  // add(property: string, value: number): Identify;
  // unset(property: string): Identify;
  // clearAll(): Identify;
}

// TODO: Only support for SET for now.
export enum IdentifyOperation {
  // Base Operations to set values
  SET = '$set',
  // SET_ONCE = '$setOnce',

  // // Operations around modifying existing values
  // ADD = '$add',
  // APPEND = '$append',
  // PREPEND = '$prepend',
  // REMOVE = '$remove',

  // // Operations around appending values *if* they aren't present
  // PREINSERT = '$preInsert',
  // POSTINSERT = '$postInsert',

  // // Operations around removing properties/values
  // UNSET = '$unset',
  // CLEAR_ALL = '$clearAll',
}

interface BaseOperationConfig {
  [key: string]: ValidPropertyType;
}

export interface IdentifyUserProperties {
  // Add operations can only take numbers
  // [IdentifyOperation.ADD]?: { [key: string]: number };

  // // This reads the keys of the passed object, but the values are not used
  // [IdentifyOperation.UNSET]?: BaseOperationConfig;
  // // This option does not read the key as it unsets all user properties
  // [IdentifyOperation.CLEAR_ALL]?: any;

  // These operations can take numbers, strings, or arrays of both.
  [IdentifyOperation.SET]?: BaseOperationConfig;
  // [IdentifyOperation.SET_ONCE]?: BaseOperationConfig;
  // [IdentifyOperation.APPEND]?: BaseOperationConfig;
  // [IdentifyOperation.PREPEND]?: BaseOperationConfig;
  // [IdentifyOperation.POSTINSERT]?: BaseOperationConfig;
  // [IdentifyOperation.PREINSERT]?: BaseOperationConfig;
  // [IdentifyOperation.REMOVE]?: BaseOperationConfig;
}
export interface IdentifyRegisterEvent extends BaseEvent {
  event_type: TAvailableEventType;
  event_name: SpecialEventName.REGISTER;
  properties: {
    distinct_id: string;
  };
}

export interface IdentifyUserEvent extends BaseEvent {
  event_type: TAvailableEventType;
  event_name: SpecialEventName.IDENTIFY;
  properties?:
    | IdentifyUserProperties
    | {
        [key in Exclude<string, IdentifyOperation>]: any;
      };
}
export interface IdentifyAliasEvent extends BaseEvent {
  event_type: TAvailableEventType;
  event_name: SpecialEventName.ALIAS;
  properties: {
    alias: string;
    distinct_id: string;
  };
}
// TODO: group will be implemented later
// export interface GroupIdentifyEvent extends BaseEvent {
//   event_type: SpecialEventName.GROUP_IDENTIFY;
//   group_properties:
//     | IdentifyUserProperties
//     | {
//         [key in Exclude<string, IdentifyOperation>]: any;
//       };
// }

export type IdentifyEvent = IdentifyRegisterEvent | IdentifyUserEvent | IdentifyAliasEvent;
