import { AvailableEventType, BaseEvent, SpecialEventName } from './base-event';

export const LoggableGenerationType = ['text', 'image', 'audio', 'video'] as const;

export interface LoggableGenerationObject {
  type: typeof LoggableGenerationType;
  value: number | string | Array<string | number>;
}

export interface GenerationPropertyType {
  input?: {
    [key: string]: LoggableGenerationObject;
  };
  output?: {
    [key: string]: LoggableGenerationObject;
  };
}

export interface LogGeneration extends BaseEvent {
  event_type: AvailableEventType.LOG;
  event_name: Exclude<string, SpecialEventName>;
  generation_properties?: GenerationPropertyType;
}

export type Generation = LogGeneration;
