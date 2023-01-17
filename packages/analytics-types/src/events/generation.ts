import { TAvailableEventType, BaseEvent, SpecialEventName } from './base-event';

export const LoggableGenerationMedia = ['text', 'image', 'audio', 'video'] as const;
export type TLoggableGenerationMedia = (typeof LoggableGenerationMedia)[number];

export interface GenerationIOEntity {
  type: TLoggableGenerationMedia;
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
  event_type: TAvailableEventType;
  event_name: Exclude<string, SpecialEventName>;
  properties?: GenerationProperties;
}

export type Generation = GenerationEvent;
