import { SessionManager } from '@coxwave/analytics-client-common';
import { MemoryStorage } from '@coxwave/analytics-core';
import { BrowserConfig as IBrowserConfig, InitOptions, UserSession } from '@coxwave/analytics-types';

import { BrowserConfig } from '../../src/config';

export const useDefaultConfig = (overrides?: Partial<InitOptions<BrowserConfig>>) =>
  new BrowserConfig(PROJECT_TOKEN, { ...DEFAULT_OPTIONS, ...overrides });

export const PROJECT_TOKEN = 'PROJECT_TOKEN';
export const USER_ID = 'userId';
export const DEVICE_ID = 'DEVICE_ID';
export const trackingConfig = {
  trackingOptions: {
    platform: false,
  },
};

const cookieStorage = new MemoryStorage<UserSession>();

export const DEFAULT_OPTIONS: InitOptions<IBrowserConfig> = {
  projectToken: PROJECT_TOKEN,
  cookieStorage,
  cookieExpiration: 365,
  cookieSameSite: 'Lax',
  cookieSecure: false,
  disableCookies: false,
  domain: '',
  storageProvider: {
    isEnabled: async () => true,
    get: async () => undefined,
    set: async () => undefined,
    remove: async () => undefined,
    reset: async () => undefined,
    getRaw: async () => undefined,
  },
  trackingOptions: {
    deviceManufacturer: true,
    deviceModel: true,
    ipAddress: true,
    language: true,
    osName: true,
    osVersion: true,
    platform: true,
  },
  transportProvider: {
    send: () => Promise.resolve(null),
  },
  sessionManager: new SessionManager(cookieStorage, PROJECT_TOKEN),
  sessionTimeout: 30 * 60 * 1000,
};
