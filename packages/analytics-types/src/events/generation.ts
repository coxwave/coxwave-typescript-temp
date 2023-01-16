import { AvailableEventType, BaseEvent, SpecialEventName } from './base-event';

export const LoggableGenerationType = ['text', 'image', 'audio', 'video'] as const;

export interface LoggableGenerationObject {
  type: typeof LoggableGenerationType;
  value: number | string | boolean;
}

export interface GenerationProperties {
  // Add operations can only take numbers
  input: {
    [key: string]: LoggableGenerationObject;
  };
  output: {
    [key: string]: LoggableGenerationObject;
  };
}

export interface LogGeneration extends BaseEvent {
  event_type: AvailableEventType.LOG;
  event_name: Exclude<string, SpecialEventName>;
  generation_properties: GenerationProperties;
}

export type Generation = LogGeneration;
