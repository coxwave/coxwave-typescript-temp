import {
  CoxwaveCore,
  Destination,
  Identify,
  UUID,
  returnWrapper,
  debugWrapper,
  getClientLogConfig,
  getClientStates,
} from '@coxwave/analytics-core';
import {
  BrowserClient,
  BrowserConfig,
  BrowserOptions,
  PredefinedEventProperties,
  Identify as IIdentify,
  Result,
  TransportType,
} from '@coxwave/analytics-types';

import { useBrowserConfig, createTransport } from './config';
import { Context } from './plugins/context';
import { convertProxyObjectToRealObject, isInstanceProxy } from './utils/snippet-helper';

export class CoxwaveBrowser extends CoxwaveCore<BrowserConfig> {
  async init(projectToken = '', options?: BrowserOptions) {
    // Step 0: Block concurrent initialization
    if (this.initializing) {
      return;
    }
    this.initializing = true;

    // Step 1: Create browser config
    const browserOptions = await useBrowserConfig(projectToken, {
      ...options,
      deviceId: options?.deviceId,
      sessionId: options?.sessionId,
      optOut: options?.optOut,
    });

    // Step 2: BrowserConfig setups
    await super._init(browserOptions);

    // Step 3: Register distinctId to Server
    if (!this.config.distinctId) {
      this.setDistinctId(UUID());
    }
    await this.register(this.config.distinctId as string);

    // Step 3: Manage session
    if (
      !this.config.sessionId ||
      (this.config.lastEventTime && Date.now() - this.config.lastEventTime > this.config.sessionTimeout)
    ) {
      // Either
      // 1) No previous session; or
      // 2) Previous session expired
      this.setSessionId(Date.now());
    }

    // Step 4: Install plugins
    // Do not track any events before this
    await this.add(new Context());
    await this.add(new Destination());

    this.initializing = false;

    // Step 6: Run queued dispatch functions
    await this.runQueuedFunctions('dispatchQ');
  }

  getDistinctId() {
    return this.config?.distinctId;
  }

  setDistinctId(distinctId: string | undefined) {
    if (!this.config) {
      this.q.push(this.setDistinctId.bind(this, distinctId));
      return;
    }
    this.config.distinctId = distinctId;
  }

  getDeviceId() {
    return this.config?.deviceId;
  }

  setDeviceId(deviceId: string) {
    if (!this.config) {
      this.q.push(this.setDeviceId.bind(this, deviceId));
      return;
    }
    this.config.deviceId = deviceId;
  }

  reset() {
    this.setDistinctId(UUID());
    this.setDeviceId(UUID());
  }

  getSessionId() {
    return this.config?.sessionId;
  }

  setSessionId(sessionId: number) {
    if (!this.config) {
      this.q.push(this.setSessionId.bind(this, sessionId));
      return;
    }
    this.config.sessionId = sessionId;
    this.config.lastEventTime = undefined;
  }

  getThreadId() {
    return this.config?.threadId;
  }

  setThreadId(threadId?: string) {
    if (!this.config) {
      this.q.push(this.setThreadId.bind(this, threadId));
      return;
    }
    this.config.threadId = threadId;
    this.config.lastEventTime = undefined;
  }

  resetThreadId() {
    this.setThreadId(undefined);
  }

  setTransport(transport: TransportType) {
    if (!this.config) {
      this.q.push(this.setTransport.bind(this, transport));
      return;
    }
    this.config.transportProvider = createTransport(transport);
  }

  register(distinctId: string) {
    return super.register(distinctId);
  }

  identify(identify: IIdentify, predefinedProperties?: PredefinedEventProperties): Promise<Result> {
    // TODO: identify should update distinctId

    if (isInstanceProxy(identify)) {
      const queue = identify._q;
      identify._q = [];
      identify = convertProxyObjectToRealObject(new Identify(), queue);
    }

    // TODO: is it okay to overwrite distinctId?
    if (predefinedProperties?.distinct_id) {
      this.setDistinctId(predefinedProperties.distinct_id);
    }
    if (predefinedProperties?.device_id) {
      this.setDeviceId(predefinedProperties.device_id);
    }

    return super.identify(identify, predefinedProperties);
  }

  alias(alias: string) {
    // TODO: consider alias need to be queued
    // if (!this.config) {
    //   this.q.push(this.alias.bind(this, alias));
    //   return;
    // }
    const distinctId = this.getDistinctId();
    if (!distinctId) {
      // TODO: is it okay to just raise error?
      return Promise.reject(new Error('DistinctId is not set'));
    }

    return super.alias(alias, distinctId);
  }
}

export const createInstance = (): BrowserClient => {
  const client = new CoxwaveBrowser();
  return {
    init: debugWrapper(
      returnWrapper(client.init.bind(client)),
      'init',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    add: debugWrapper(
      returnWrapper(client.add.bind(client)),
      'add',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.plugins']),
    ),
    remove: debugWrapper(
      returnWrapper(client.remove.bind(client)),
      'remove',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.plugins']),
    ),
    track: debugWrapper(
      client.track.bind(client),
      'track',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    log: debugWrapper(
      client.log.bind(client),
      'log',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    feedback: debugWrapper(
      client.feedback.bind(client),
      'feedback',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    register: debugWrapper(
      returnWrapper(client.register.bind(client)),
      'register',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    identify: debugWrapper(
      returnWrapper(client.identify.bind(client)),
      'identify',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    alias: debugWrapper(
      returnWrapper(client.alias.bind(client)),
      'alias',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    flush: debugWrapper(
      returnWrapper(client.flush.bind(client)),
      'flush',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    getDistinctId: debugWrapper(
      client.getDistinctId.bind(client),
      'getDistinctId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.distinctId']),
    ),
    setDistinctId: debugWrapper(
      client.setDistinctId.bind(client),
      'setDistinctId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.distinctId']),
    ),
    getDeviceId: debugWrapper(
      client.getDeviceId.bind(client),
      'getDeviceId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.deviceId']),
    ),
    setDeviceId: debugWrapper(
      client.setDeviceId.bind(client),
      'setDeviceId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.deviceId']),
    ),
    reset: debugWrapper(
      client.reset.bind(client),
      'reset',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.distinctId', 'config.deviceId']),
    ),
    getSessionId: debugWrapper(
      client.getSessionId.bind(client),
      'getSessionId',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    setSessionId: debugWrapper(
      client.setSessionId.bind(client),
      'setSessionId',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    getThreadId: debugWrapper(
      client.getThreadId.bind(client),
      'getThreadId',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    setThreadId: debugWrapper(
      client.setThreadId.bind(client),
      'setThreadId',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    resetThreadId: debugWrapper(
      client.resetThreadId.bind(client),
      'resetThreadId',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    setOptOut: debugWrapper(
      client.setOptOut.bind(client),
      'setOptOut',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    setTransport: debugWrapper(
      client.setTransport.bind(client),
      'setTransport',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
  };
};

export default createInstance();
