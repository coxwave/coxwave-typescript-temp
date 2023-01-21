import { FetchTransport } from '@coxwave/analytics-client-common';
import * as core from '@coxwave/analytics-core';
import { Status, TransportType, UserSession } from '@coxwave/analytics-types';

import { CoxwaveBrowser } from '../src/browser-client';
import * as Config from '../src/config';
import * as SnippetHelper from '../src/utils/snippet-helper';

describe('browser-client', () => {
  const PROJECT_TOKEN = 'PROJECT_TOKEN';
  const DEVICE_ID = 'DEVICE_ID';
  const trackingConfig = {
    trackingOptions: {
      platform: false,
    },
  };

  afterEach(() => {
    // clean up cookies
    document.cookie = 'COX_PROJECT_TOKEN=null; expires=-1';
  });

  describe('init', () => {
    test('should read from new cookies config', async () => {
      const cookieStorage = new core.MemoryStorage<UserSession>();
      jest.spyOn(cookieStorage, 'get').mockResolvedValue({
        sessionId: 1,
        deviceId: DEVICE_ID,
        optOut: false,
      });
      const client = new CoxwaveBrowser();
      await client.init(PROJECT_TOKEN, {
        optOut: true,
        cookieStorage,
        ...trackingConfig,
      });
      expect(client.getDeviceId()).toBe(DEVICE_ID);
      expect(client.getSessionId()).toBe(1);
    });

    test('should call prevent concurrent init executions', async () => {
      const useBrowserConfig = jest.spyOn(Config, 'useBrowserConfig');
      const client = new CoxwaveBrowser();
      await Promise.all([
        client.init(PROJECT_TOKEN, {
          ...trackingConfig,
        }),
        client.init(PROJECT_TOKEN, {
          ...trackingConfig,
        }),
        client.init(PROJECT_TOKEN, {
          ...trackingConfig,
        }),
      ]);
      // NOTE: `parseOldCookies` and `useBrowserConfig` are only called once despite multiple init calls
      expect(useBrowserConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDeviceId', () => {
    test('should get device id', async () => {
      const client = new CoxwaveBrowser();
      await client.init(PROJECT_TOKEN, {
        deviceId: DEVICE_ID,
        ...trackingConfig,
      });
      expect(client.getDeviceId()).toBe(DEVICE_ID);
    });

    test('should handle undefined config', async () => {
      const client = new CoxwaveBrowser();
      expect(client.getDeviceId()).toBe(undefined);
    });
  });

  describe('setDeviceId', () => {
    test('should set device id config', async () => {
      const client = new CoxwaveBrowser();
      await client.init(PROJECT_TOKEN, {
        ...trackingConfig,
      });
      client.setDeviceId(DEVICE_ID);
      expect(client.getDeviceId()).toBe(DEVICE_ID);
    });

    test('should defer set device id', () => {
      return new Promise<void>((resolve) => {
        const client = new CoxwaveBrowser();
        void client
          .init(PROJECT_TOKEN, {
            ...trackingConfig,
          })
          .then(() => {
            expect(client.getDeviceId()).toBe('asdfg');
            resolve();
          });
        client.setDeviceId('asdfg');
      });
    });
  });

  describe('reset', () => {
    test('should reset user id and generate new device id config', async () => {
      const client = new CoxwaveBrowser();
      await client.init(PROJECT_TOKEN);
      client.setDeviceId(DEVICE_ID);
      expect(client.getDeviceId()).toBe(DEVICE_ID);
      client.reset();
      expect(client.getDeviceId()).not.toBe(DEVICE_ID);
    });
  });

  describe('getSessionId', () => {
    test('should get session id', async () => {
      const client = new CoxwaveBrowser();
      await client.init(PROJECT_TOKEN, {
        sessionId: 1,
        ...trackingConfig,
      });
      expect(client.getSessionId()).toBe(1);
    });

    test('should handle undefined config', async () => {
      const client = new CoxwaveBrowser();
      expect(client.getSessionId()).toBe(undefined);
    });
  });

  describe('setSessionId', () => {
    test('should set session id', async () => {
      const client = new CoxwaveBrowser();
      await client.init(PROJECT_TOKEN, {
        ...trackingConfig,
      });
      client.setSessionId(1);
      expect(client.getSessionId()).toBe(1);
    });

    test('should defer set session id', () => {
      return new Promise<void>((resolve) => {
        const client = new CoxwaveBrowser();
        void client
          .init(PROJECT_TOKEN, {
            ...trackingConfig,
          })
          .then(() => {
            expect(client.getSessionId()).toBe(1);
            resolve();
          });
        client.setSessionId(1);
      });
    });
  });

  describe('setTransport', () => {
    test('should set transport', async () => {
      const fetch = new FetchTransport();
      const createTransport = jest.spyOn(Config, 'createTransport').mockReturnValueOnce(fetch);
      const client = new CoxwaveBrowser();
      await client.init(PROJECT_TOKEN, {
        ...trackingConfig,
      });
      client.setTransport(TransportType.Fetch);
      expect(createTransport).toHaveBeenCalledTimes(2);
    });

    test('should defer set transport', () => {
      return new Promise<void>((resolve) => {
        const fetch = new FetchTransport();
        const createTransport = jest.spyOn(Config, 'createTransport').mockReturnValueOnce(fetch);
        const client = new CoxwaveBrowser();
        void client
          .init(PROJECT_TOKEN, {
            ...trackingConfig,
          })
          .then(() => {
            expect(createTransport).toHaveBeenCalledTimes(2);
            resolve();
          });
        client.setTransport(TransportType.Fetch);
      });
    });
  });

  describe('identify', () => {
    test('should track identify', async () => {
      const send = jest.fn().mockReturnValueOnce({
        status: Status.Success,
        statusCode: 200,
        body: {
          eventsIngested: 1,
          payloadSizeBytes: 1,
          serverUploadTime: 1,
        },
      });
      const client = new CoxwaveBrowser();
      await client.init(PROJECT_TOKEN, {
        transportProvider: {
          send,
        },
        ...trackingConfig,
      });
      const identifyObject = new core.Identify();
      const result = await client.identify(identifyObject, { deviceId: '123' });
      expect(result.code).toEqual(200);
      expect(send).toHaveBeenCalledTimes(1);
    });

    test('should track identify using proxy', async () => {
      const send = jest.fn().mockReturnValueOnce({
        status: Status.Success,
        statusCode: 200,
        body: {
          eventsIngested: 1,
          payloadSizeBytes: 1,
          serverUploadTime: 1,
        },
      });
      const convertProxyObjectToRealObject = jest
        .spyOn(SnippetHelper, 'convertProxyObjectToRealObject')
        .mockReturnValueOnce(new core.Identify());
      const client = new CoxwaveBrowser();
      await client.init(PROJECT_TOKEN, {
        transportProvider: {
          send,
        },
        ...trackingConfig,
      });
      const identifyObject = {
        _q: [],
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore to verify behavior in snippet installation
      const result = await client.identify(identifyObject);
      expect(result.code).toEqual(200);
      expect(send).toHaveBeenCalledTimes(1);
      expect(convertProxyObjectToRealObject).toHaveBeenCalledTimes(1);
    });
  });
});
