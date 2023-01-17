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
  EventOptions,
  Identify as IIdentify,
  Result,
  TransportType,
} from '@coxwave/analytics-types';

import { useBrowserConfig, createTransport } from './config';
import { Context } from './plugins/context';
import { convertProxyObjectToRealObject, isInstanceProxy } from './utils/snippet-helper';

export class CoxwaveBrowser extends CoxwaveCore<BrowserConfig> {
  async init(projectToken = '', userId?: string, options?: BrowserOptions) {
    // Step 0: Block concurrent initialization
    if (this.initializing) {
      return;
    }
    this.initializing = true;

    // Step 2: Create browser config
    const browserOptions = await useBrowserConfig(projectToken, userId, {
      ...options,
      deviceId: options?.deviceId,
      sessionId: options?.sessionId,
      optOut: options?.optOut,
    });

    await super._init(browserOptions);

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

  getUserId() {
    return this.config?.userId;
  }

  setUserId(userId: string | undefined) {
    if (!this.config) {
      this.q.push(this.setUserId.bind(this, userId));
      return;
    }
    this.config.userId = userId;
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
    this.setUserId(undefined);
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

  identify(identify: IIdentify, eventOptions?: EventOptions): Promise<Result> {
    if (isInstanceProxy(identify)) {
      const queue = identify._q;
      identify._q = [];
      identify = convertProxyObjectToRealObject(new Identify(), queue);
    }
    if (eventOptions?.user_id) {
      this.setUserId(eventOptions.user_id);
    }
    if (eventOptions?.device_id) {
      this.setDeviceId(eventOptions.device_id);
    }
    return super.identify(identify, eventOptions);
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
      returnWrapper(client.track.bind(client)),
      'track',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    log: debugWrapper(
      returnWrapper(client.log.bind(client)),
      'log',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    feedback: debugWrapper(
      returnWrapper(client.feedback.bind(client)),
      'feedback',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    identify: debugWrapper(
      returnWrapper(client.identify.bind(client)),
      'identify',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    flush: debugWrapper(
      returnWrapper(client.flush.bind(client)),
      'flush',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    getUserId: debugWrapper(
      client.getUserId.bind(client),
      'getUserId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.userId']),
    ),
    setUserId: debugWrapper(
      client.setUserId.bind(client),
      'setUserId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.userId']),
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
      getClientStates(client, ['config', 'config.userId', 'config.deviceId']),
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
