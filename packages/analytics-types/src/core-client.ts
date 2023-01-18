import { Config } from './config';
import { ActivityProperties, GenerationProperties, EventOptions, FeedbackProperties } from './events';
import { Result } from './result';

export interface CoreClient<T extends Config> {
  config: T;
  track(
    activityInput: string,
    activityProperties?: ActivityProperties,
    eventOptions?: EventOptions,
  ): { id: string; promise: Promise<Result> };

  log(
    generationInput: string,
    generationProperties?: GenerationProperties,
    eventOptions?: EventOptions,
  ): { id: string; promise: Promise<Result> };

  feedback(
    feedbackTarget: string,
    feedbackInput: string,
    feedbackProperties?: FeedbackProperties,
    eventOptions?: EventOptions,
  ): { id: string; promise: Promise<Result> };
}
