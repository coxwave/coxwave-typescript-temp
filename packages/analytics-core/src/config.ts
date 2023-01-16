import {
  Event,
  Config as IConfig,
  Logger as ILogger,
  InitOptions,
  LogLevel,
  Storage,
  Transport,
  IngestionMetadata,
  ServerZone,
} from '@coxwave/analytics-types';

import {
  COXWAVE_SERVER_URL,
  COXWAVE_BATCH_SERVER_URL,
  EU_COXWAVE_SERVER_URL,
  EU_COXWAVE_BATCH_SERVER_URL,
} from './constants';
import { Logger } from './logger';

export const getDefaultConfig = () => ({
  flushMaxRetries: 12,
  flushQueueSize: 200,
  flushIntervalMillis: 10000,
  logLevel: LogLevel.Warn,
  loggerProvider: new Logger(),
  optOut: false,
  serverUrl: COXWAVE_SERVER_URL,
  serverZone: ServerZone.US,
  useBatch: false,
});

export class Config implements IConfig {
  apiKey: string;
  flushIntervalMillis: number;
  flushMaxRetries: number;
  flushQueueSize: number;
  loggerProvider: ILogger;
  logLevel: LogLevel;
  ingestionMetadata?: IngestionMetadata;
  serverUrl: string | undefined;
  serverZone?: ServerZone;
  transportProvider: Transport;
  storageProvider?: Storage<Event[]>;
  useBatch: boolean;

  private _optOut = false;
  get optOut() {
    return this._optOut;
  }
  set optOut(optOut: boolean) {
    this._optOut = optOut;
  }

  constructor(options: InitOptions<IConfig>) {
    const defaultConfig = getDefaultConfig();
    this.apiKey = options.apiKey;
    this.flushIntervalMillis = options.flushIntervalMillis || defaultConfig.flushIntervalMillis;
    this.flushMaxRetries = options.flushMaxRetries || defaultConfig.flushMaxRetries;
    this.flushQueueSize = options.flushQueueSize || defaultConfig.flushQueueSize;
    this.loggerProvider = options.loggerProvider || defaultConfig.loggerProvider;
    this.logLevel = options.logLevel ?? defaultConfig.logLevel;
    this.ingestionMetadata = options.ingestionMetadata;
    this.optOut = options.optOut ?? defaultConfig.optOut;
    this.serverUrl = options.serverUrl;
    this.serverZone = options.serverZone || defaultConfig.serverZone;
    this.storageProvider = options.storageProvider;
    this.transportProvider = options.transportProvider;
    this.useBatch = options.useBatch ?? defaultConfig.useBatch;
    this.loggerProvider.enable(this.logLevel);

    const serverConfig = createServerConfig(options.serverUrl, options.serverZone, options.useBatch);
    this.serverZone = serverConfig.serverZone;
    this.serverUrl = serverConfig.serverUrl;
  }
}

export const getServerUrl = (serverZone: ServerZone, useBatch: boolean) => {
  if (serverZone === ServerZone.EU) {
    return useBatch ? EU_COXWAVE_BATCH_SERVER_URL : EU_COXWAVE_SERVER_URL;
  }
  return useBatch ? COXWAVE_BATCH_SERVER_URL : COXWAVE_SERVER_URL;
};

export const createServerConfig = (
  serverUrl = '',
  serverZone: ServerZone = getDefaultConfig().serverZone,
  useBatch: boolean = getDefaultConfig().useBatch,
) => {
  if (serverUrl) {
    return { serverUrl, serverZone: undefined };
  }
  const _serverZone = [ServerZone.US, ServerZone.EU].includes(serverZone) ? serverZone : getDefaultConfig().serverZone;
  return {
    serverZone: _serverZone,
    serverUrl: getServerUrl(_serverZone, useBatch),
  };
};
