import { BaseEvent, PredefinedEventProperties, SpecialEventName } from './base-event';

export const LoggableGenerationMedia = ['text', 'image', 'audio', 'video'] as const;
export type TLoggableGenerationMedia = (typeof LoggableGenerationMedia)[number];

export const SpecialGenerationPropertyKey = ['model_id', 'input', 'output'] as const;

export interface GenerationIOEntity {
  type: TLoggableGenerationMedia;
  value: number | string | Array<string | number>;
}

export interface GenerationProperties extends Record<string, any> {
  model_id?: string;
  input?: {
    [key: string]: GenerationIOEntity | number | string | boolean;
  };
  output?: {
    [key: string]: GenerationIOEntity | number | string | boolean;
  };
}

export interface GenerationEvent extends BaseEvent, GenerationProperties {
  event_name: Exclude<string, SpecialEventName>;
  properties?: PredefinedEventProperties;
}

export type Generation = GenerationEvent;
