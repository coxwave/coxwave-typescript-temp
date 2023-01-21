import { Config } from './config';
import { Event } from './events';
import { Result } from './result';

export enum PluginType {
  BEFORE = 'before',
  ENRICHMENT = 'enrichment',
  DESTINATION = 'destination',
  DESTINATION_ACTIVITY = 'destination_activity',
  DESTINATION_GENERATION = 'destination_generation',
  DESTINATION_FEEDBACK = 'destination_feedback',
  DESTINATION_IDENTIFY = 'destination_identify',
}

export interface BeforePlugin {
  name: string;
  type: PluginType.BEFORE;
  setup(config: Config): Promise<void>;
  execute(context: Event): Promise<Event>;
}

export interface EnrichmentPlugin {
  name: string;
  type: PluginType.ENRICHMENT;
  setup(config: Config): Promise<void>;
  execute(context: Event): Promise<Event>;
}

export interface DestinationPlugin {
  name: string;
  type: string;
  setup(config: Config): Promise<void>;
  execute(context: Event): Promise<Result>;
  flush?(): Promise<void>;
}

export interface ActivityDestinationPlugin extends DestinationPlugin {
  type: PluginType.DESTINATION_ACTIVITY;
}

export interface GenerationDestinationPlugin extends DestinationPlugin {
  type: PluginType.DESTINATION_GENERATION;
}

export interface FeedbackDestinationPlugin extends DestinationPlugin {
  type: PluginType.DESTINATION_FEEDBACK;
}

export interface IdentifyDestinationPlugin extends DestinationPlugin {
  type: PluginType.DESTINATION_IDENTIFY;
}

export type Plugin =
  | BeforePlugin
  | EnrichmentPlugin
  | DestinationPlugin
  | ActivityDestinationPlugin
  | GenerationDestinationPlugin
  | FeedbackDestinationPlugin
  | IdentifyDestinationPlugin;
