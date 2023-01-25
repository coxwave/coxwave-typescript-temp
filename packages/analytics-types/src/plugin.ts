import { Config } from './config';
import { Event } from './events';
import { Result } from './result';

export const PluginType = {
  BEFORE: 'before',
  ENRICHMENT: 'enrichment',
  DESTINATION: 'destination',
  DESTINATION_ACTIVITY: 'destination_activity',
  DESTINATION_GENERATION: 'destination_generation',
  DESTINATION_FEEDBACK: 'destination_feedback',
  DESTINATION_IDENTIFY: 'destination_identify',
} as const;
export type TPluginType = (typeof PluginType)[keyof typeof PluginType];

export interface BeforePlugin {
  name: string;
  type: TPluginType;
  setup(config: Config): Promise<void>;
  execute(context: Event): Promise<Event>;
}

export interface EnrichmentPlugin {
  name: string;
  type: TPluginType;
  setup(config: Config): Promise<void>;
  execute(context: Event): Promise<Event>;
}

export interface DestinationPlugin {
  name: string;
  type: TPluginType;
  setup(config: Config): Promise<void>;
  execute(context: Event): Promise<Result>;
  flush?(): Promise<void>;
}

export type Plugin = BeforePlugin | EnrichmentPlugin | DestinationPlugin;
