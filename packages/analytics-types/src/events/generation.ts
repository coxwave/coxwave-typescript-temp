import { AvailableEventType, BaseEvent, SpecialEventName } from './base-event';

export const LoggableGenerationMedia = ['text', 'image', 'audio', 'video'] as const;

export interface GenerationIOEntity {
  type: typeof LoggableGenerationMedia;
  value: number | string | Array<string | number>;
}

export interface GenerationProperties {
  model_id?: string;
  input?: {
    [key: string]: GenerationIOEntity;
  };
  output?: {
    [key: string]: GenerationIOEntity;
  };
}

export interface GenerationEvent extends BaseEvent {
  event_type: AvailableEventType.LOG;
  event_name: Exclude<string, SpecialEventName>;
  generation_properties?: GenerationProperties;
}

export type Generation = GenerationEvent;
