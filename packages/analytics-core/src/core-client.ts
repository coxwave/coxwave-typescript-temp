import {
  CoreClient,
  Config,
  Event,
  EventOptions,
  Identify,
  Plugin,
  Result,
  Activity,
  Generation,
  GenerationProperties,
  Feedback,
} from '@coxwave/analytics-types';

import { CLIENT_NOT_INITIALIZED, OPT_OUT_MESSAGE } from './messages';
import { Timeline } from './timeline';
import { createIdentifyEvent, createTrackEvent, createLogEvent, createSubmitEvent } from './utils/event-builder';
import { buildResult } from './utils/result-builder';

export class AmplitudeCore<T extends Config> implements CoreClient<T> {
  initializing = false;
  name: string;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config: T;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  timeline: Timeline;
  protected q: CallableFunction[] = [];
  protected dispatchQ: CallableFunction[] = [];

  constructor(name = '$default') {
    this.timeline = new Timeline();
    this.name = name;
  }

  async _init(config: T) {
    this.config = config;
    this.timeline.reset();
    await this.runQueuedFunctions('q');
  }

  async runQueuedFunctions(queueName: 'q' | 'dispatchQ') {
    const queuedFunctions = this[queueName];
    this[queueName] = [];
    for (const queuedFunction of queuedFunctions) {
      await queuedFunction();
    }
  }

  track(eventInput: Activity | string, eventProperties?: Record<string, any>, eventOptions?: EventOptions) {
    const event = createTrackEvent(eventInput, eventProperties, eventOptions);
    return this.dispatch(event);
  }

  identify(identify: Identify, eventOptions?: EventOptions) {
    const event = createIdentifyEvent(identify, eventOptions);
    return this.dispatch(event);
  }

  log(generationInput: Generation | string, generationProperties?: GenerationProperties, eventOptions?: EventOptions) {
    const event = createLogEvent(generationInput, generationProperties, eventOptions);
    return this.dispatch(event);
  }

  submit(
    feedbackInput: Feedback | string,
    feedbackTraget?: string,
    feedbackProperties?: Record<string, any>,
    eventOptions?: EventOptions,
  ) {
    const event = createSubmitEvent(feedbackInput, feedbackTraget, feedbackProperties, eventOptions);
    return this.dispatch(event);
  }

  async add(plugin: Plugin) {
    if (!this.config) {
      this.q.push(this.add.bind(this, plugin));
      return;
    }
    return this.timeline.register(plugin, this.config);
  }

  async remove(pluginName: string) {
    if (!this.config) {
      this.q.push(this.remove.bind(this, pluginName));
      return;
    }
    return this.timeline.deregister(pluginName);
  }

  dispatchWithCallback(event: Event, callback: (result: Result) => void): void {
    if (!this.config) {
      return callback(buildResult(event, 0, CLIENT_NOT_INITIALIZED));
    }
    void this.process(event).then(callback);
  }

  async dispatch(event: Event): Promise<Result> {
    if (!this.config) {
      return new Promise<Result>((resolve) => {
        this.dispatchQ.push(this.dispatchWithCallback.bind(this, event, resolve));
      });
    }

    return this.process(event);
  }

  async process(event: Event): Promise<Result> {
    try {
      // skip event processing if opt out
      if (this.config.optOut) {
        return buildResult(event, 0, OPT_OUT_MESSAGE);
      }

      const result = await this.timeline.push(event);

      result.code === 200
        ? this.config.loggerProvider.log(result.message)
        : this.config.loggerProvider.error(result.message);

      return result;
    } catch (e) {
      const message = String(e);
      this.config.loggerProvider.error(message);
      const result = buildResult(event, 0, message);

      return result;
    }
  }

  setOptOut(optOut: boolean) {
    if (!this.config) {
      this.q.push(this.setOptOut.bind(this, Boolean(optOut)));
      return;
    }
    this.config.optOut = Boolean(optOut);
  }

  flush() {
    return this.timeline.flush();
  }
}
