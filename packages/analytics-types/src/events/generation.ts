import { AvailableEventType, BaseEvent, SpecialEventName } from './base-event';

export const LoggableGenerationType = ['text', 'image', 'audio', 'video'] as const;

export type GenerationIOEntityType = {
  type: typeof LoggableGenerationType;
  value: number | string | Array<string | number>;
};

export type GenerationPropertyType = {
  input?: {
    [key: string]: GenerationIOEntityType;
  };
  output?: {
    [key: string]: GenerationIOEntityType;
  };
};

export interface LogGeneration extends BaseEvent {
  event_type: AvailableEventType.LOG;
  event_name: Exclude<string, SpecialEventName>;
  generation_properties?: GenerationPropertyType;
}

export type Generation = LogGeneration;
