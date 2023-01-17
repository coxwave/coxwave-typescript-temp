import { Event } from './events';
import { LogLevel, Logger } from './logger';
import { SessionManager, UserSession } from './session-manager';
import { Storage } from './storage';
import { Transport, TransportType } from './transport';

export const ServerZone = ['US', 'EU'] as const;
export type TServerZone = (typeof ServerZone)[number];

export interface Config {
  projectToken: string;
  flushIntervalMillis: number;
  flushMaxRetries: number;
  flushQueueSize: number;
  logLevel: LogLevel;
  loggerProvider: Logger;
  optOut: boolean;
  serverUrl: string | undefined;
  serverZone?: TServerZone;
  storageProvider?: Storage<Event[]>;
  transportProvider: Transport;
  useBatch: boolean;
}

export interface BrowserConfig extends Config {
  appVersion?: string;
  deviceId?: string;
  cookieExpiration: number;
  cookieSameSite: string;
  cookieSecure: boolean;
  cookieStorage: Storage<UserSession>;
  disableCookies: boolean;
  domain: string;
  lastEventTime?: number;
  threadId?: string;
  sessionId?: number;
  sessionManager: SessionManager;
  sessionTimeout: number;
  trackingOptions: TrackingOptions;
  userId?: string;
}

export type ReactNativeConfig = Omit<BrowserConfig, 'trackingOptions'> & {
  trackingOptions: ReactNativeTrackingOptions;
  trackingSessionEvents?: boolean;
};

export type NodeConfig = Config;

export type InitOptions<T extends Config> =
  | Partial<Config> &
      Omit<T, keyof Config> & {
        projectToken: string;
        transportProvider: Transport;
      };

export interface TrackingOptions {
  deviceManufacturer?: boolean;
  deviceModel?: boolean;
  ipAddress?: boolean;
  language?: boolean;
  osName?: boolean;
  osVersion?: boolean;
  platform?: boolean;
  [key: string]: boolean | undefined;
}

export interface ReactNativeTrackingOptions extends TrackingOptions {
  adid?: boolean;
  carrier?: boolean;
}

export type BrowserOptions = Omit<
  Partial<
    BrowserConfig & {
      transport: TransportType;
    }
  >,
  'projectToken'
>;

export type ReactNativeOptions = Omit<
  Partial<
    ReactNativeConfig & {
      transport: TransportType;
    }
  >,
  'projectToken'
>;

export type NodeOptions = Omit<Partial<NodeConfig>, 'projectToken'>;
