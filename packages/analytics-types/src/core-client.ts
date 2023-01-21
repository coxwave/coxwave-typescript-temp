import { Config } from './config';
import { ActivityProperties, FeedbackProperties, GenerationProperties, PredefinedEventProperties } from './events';
import { Result } from './result';

export interface CoreClient<T extends Config> {
  config: T;

  track(
    activityName: string,
    activityProperties?: ActivityProperties,
    predefinedProperties?: PredefinedEventProperties,
  ): { id: string; promise: Promise<Result> };

  log(
    generationName: string,
    generationProperties?: GenerationProperties,
    predefinedProperties?: PredefinedEventProperties,
  ): { id: string; promise: Promise<Result> };

  feedback(
    feedbackName: string,
    feedbackProperties: FeedbackProperties,
    predefinedProperties?: PredefinedEventProperties,
  ): { id: string; promise: Promise<Result> };
}
