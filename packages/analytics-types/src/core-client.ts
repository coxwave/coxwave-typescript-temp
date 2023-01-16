import { Config } from './config';
import { BaseEvent, EventOptions } from './events';
import { Result } from './result';

export interface CoreClient<T extends Config> {
  config: T;
  track(
    eventInput: BaseEvent | string,
    eventProperties?: Record<string, any>,
    eventOptions?: EventOptions,
  ): Promise<Result>;
}
