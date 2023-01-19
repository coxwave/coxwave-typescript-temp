import * as coxwave from '@coxwave/analytics-browser';
import { PluginType, LogLevel, TAvailableEventType } from '@coxwave/analytics-types';
import { default as nock } from 'nock';

import { path, SUCCESS_MESSAGE, url, uuidPattern } from './constants';
import { success } from './responses';
import 'isomorphic-fetch';

describe('integration', () => {
  const uuid: string = expect.stringMatching(uuidPattern) as string;
  const library = expect.stringMatching(/^coxwave-ts\/.+/) as string;
  const number = expect.any(Number) as number;
  const opts = {
    trackingOptions: { deviceModel: false },
  };

  afterEach(() => {
    // clean up cookies
    document.cookie = 'COX_PROJECT_TOKEN=null; expires=-1';
  });

  // WARNING: This test has to run first
  // This test is under the assumption that coxwave has not be initiated at all
  // To achieve this condition, it must run before any other tests
  describe('FIRST TEST: defer initialization', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: '',
          href: '',
          pathname: '',
          search: '',
        },
        writable: true,
      });
    });

    beforeEach(() => {
      (window.location as any) = {
        hostname: '',
        href: '',
        pathname: '',
        search: '',
      };
    });

    test('should allow init to be called after other APIs', () => {
      return new Promise((resolve) => {
        const scope = nock(url).post(path).reply(200, success);

        // NOTE: Values to assert on
        const sessionId = Date.now() - 1000;
        const distinctId = 'user@coxwave.com';
        const deviceId = 'device-12345';
        const platform = 'Jest';

        coxwave.setDistinctId(distinctId);
        coxwave.setDeviceId(deviceId);
        coxwave.setSessionId(sessionId);
        coxwave.add({
          type: PluginType.ENRICHMENT,
          name: 'custom',
          setup: async () => {
            return undefined;
          },
          execute: async (event) => {
            event.platform = platform;
            return event;
          },
        });
        void coxwave.track('Event Before Init').promise.then((response) => {
          expect(response.event).toEqual({
            device_id: deviceId, // NOTE: Device ID was set before init
            device_manufacturer: undefined,
            event_type: 'Event Before Init',
            id: uuid,
            ip: '$remote',
            language: 'en-US',
            library: library,
            os_name: 'WebKit',
            os_version: '537.36',
            platform: platform, // NOTE: Session ID was set using a plugin added before init
            session_id: sessionId, // NOTE: Session ID was set before init
            time: number,
            user_id: distinctId, // NOTE: User ID was set before init
          });
          expect(response.code).toBe(200);
          expect(response.message).toBe(SUCCESS_MESSAGE);
          scope.done();
          resolve(undefined);
        });
        coxwave.init('PROJECT_TOKEN', {
          ...opts,
          serverUrl: url + path,
        });
      });
    });

    test('should set trackingOptions on init prior to running queued methods', async () => {
      let requestBody1: Record<string, any> = {};
      const scope1 = nock(url)
        .post(path, (body: Record<string, any>) => {
          requestBody1 = body;
          return true;
        })
        .reply(200, success);
      let requestBody2: Record<string, any> = {};
      const scope2 = nock(url)
        .post(path, (body: Record<string, any>) => {
          requestBody2 = body;
          return true;
        })
        .reply(200, success);

      // NOTE: Values to assert on
      const sessionId = Date.now() - 1000;
      const distinctId = 'user@coxwave.com';
      const deviceId = 'device-12345';

      const client = coxwave.createInstance();
      client.setDistinctId(distinctId);
      client.setDeviceId(deviceId);
      client.setSessionId(sessionId);

      const trackPromise = client.track('Event Before Init').promise;
      await client.init('PROJECT_TOKEN', {
        ...opts,
      }).promise;
      await trackPromise;

      expect(requestBody1).toEqual({
        project_token: 'PROJECT_TOKEN',
        events: [
          {
            device_id: deviceId,
            session_id: sessionId,
            user_id: distinctId,
            time: number,
            platform: 'Web',
            os_name: 'WebKit',
            os_version: '537.36',
            language: 'en-US',
            ip: '$remote',
            id: uuid,
            event_type: '$identify',
            library: library,
          },
        ],
        options: {},
      });
      expect(requestBody2).toEqual({
        project_token: 'PROJECT_TOKEN',
        events: [
          {
            device_id: deviceId,
            session_id: sessionId,
            user_id: distinctId,
            time: number,
            platform: 'Web',
            os_name: 'WebKit',
            os_version: '537.36',
            language: 'en-US',
            ip: '$remote',
            id: uuid,
            event_type: 'Event Before Init',
            library: library,
          },
        ],
        options: {},
      });
      scope1.done();
      scope2.done();
    });
  });

  describe('track', () => {
    test('should track event', async () => {
      const scope = nock(url).post(path).reply(200, success);

      await coxwave.init('PROJECT_TOKEN', {
        ...opts,
      }).promise;
      const response = await coxwave.track('test event', {
        mode: 'test',
      }).promise;
      expect(response.event).toEqual({
        user_id: undefined,
        device_id: uuid,
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: '$track' as TAvailableEventType,
        event_name: 'test event',
        event_properties: {
          mode: 'test',
        },
        library: library,
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      scope.done();
    });

    test('should track event with custom config', async () => {
      const scope = nock(url).post(path).reply(200, success);

      await coxwave.init('PROJECT_TOKEN', {
        deviceId: 'deviceId',
        sessionId: 1,
        ...opts,
      }).promise;
      const response = await coxwave.track('test event').promise;
      expect(response.event).toEqual({
        user_id: 'sdk.dev@coxwave.com',
        device_id: 'deviceId',
        session_id: 1,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: '$track' as TAvailableEventType,
        event_name: 'test event',
        library: library,
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      scope.done();
    });

    test('should track event with event options', async () => {
      const scope = nock(url).post(path).reply(200, success);

      await coxwave.init('PROJECT_TOKEN', {
        ...opts,
      }).promise;
      const response = await coxwave.track('test event', {
        user_id: 'sdk.dev@coxwave.com',
        device_id: 'deviceId',
        session_id: 1,
      }).promise;
      expect(response.event).toEqual({
        user_id: 'sdk.dev@coxwave.com',
        device_id: 'deviceId',
        session_id: 1,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: '$track' as TAvailableEventType,
        event_name: 'test event',
        library: library,
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      scope.done();
    });

    test('should track event with optional ingestionMetadata option', async () => {
      const scope = nock(url).post(path).reply(200, success);

      await coxwave.init('PROJECT_TOKEN', {
        ...opts,
        library: '${sourceName} ${library.version}',
      }).promise;
      const response = await coxwave.track('test event', {
        user_id: 'sdk.dev@coxwave.com',
        device_id: 'deviceId',
        session_id: 1,
      }).promise;
      expect(response.event).toEqual({
        user_id: 'sdk.dev@coxwave.com',
        device_id: 'deviceId',
        session_id: 1,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: '$track' as TAvailableEventType,
        event_name: 'test event',
        library: library,
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      scope.done();
    });

    test('should track event with base event', async () => {
      const scope = nock(url).post(path).reply(200, success);

      await coxwave.init('PROJECT_TOKEN', {
        ...opts,
      }).promise;
      const response = await coxwave.track('test event', undefined, {
        thread_id: 'sdk.dev@coxwave.com',
        device_id: 'deviceId',
        session_id: 1,
      }).promise;
      expect(response.event).toEqual({
        thread_id: 'sdk.dev@coxwave.com',
        device_id: 'deviceId',
        session_id: 1,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: '$track' as TAvailableEventType,
        event_name: 'test event',
        library: library,
        groups: {
          org: '15',
        },
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      scope.done();
    });

    test('should handle 400 error', async () => {
      const first = nock(url)
        .post(path)
        .reply(400, {
          code: 400,
          error: 'Invalid field values on some events',
          events_with_invalid_fields: {
            device_id: [1],
          },
        });
      const second = nock(url).post(path).reply(200, success);

      await coxwave.init('PROJECT_TOKEN', {
        logLevel: 0,
        ...opts,
      }).promise;
      const response = await Promise.all([
        coxwave.track('test event 1').promise,
        coxwave.track('test event 2', {
          device_id: undefined,
        }).promise,
      ]);
      expect(response[0].event).toEqual({
        user_id: undefined,
        device_id: uuid,
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: 'test event 1',
        library: library,
      });
      expect(response[0].code).toBe(200);
      expect(response[0].message).toBe(SUCCESS_MESSAGE);
      expect(response[1].event).toEqual({
        user_id: undefined,
        device_id: undefined,
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: 'test event 2',
        library: library,
      });
      expect(response[1].code).toBe(400);
      expect(response[1].message).toBe('Invalid field values on some events');
      first.done();
      second.done();
    });

    test('should handle 413 error', async () => {
      const first = nock(url).post(path).reply(413, {
        code: 413,
        error: 'Payload too large',
      });
      const second = nock(url).post(path).times(2).reply(200, success);

      await coxwave.init('PROJECT_TOKEN', {
        logLevel: 0,
        flushQueueSize: 2,
        ...opts,
      }).promise;
      const response = await Promise.all([
        coxwave.track('test event 1').promise,
        coxwave.track('test event 2').promise,
      ]);
      expect(response[0].event).toEqual({
        user_id: undefined,
        device_id: uuid,
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: 'test event 1',
        library: library,
      });
      expect(response[0].code).toBe(200);
      expect(response[0].message).toBe(SUCCESS_MESSAGE);
      expect(response[1].event).toEqual({
        user_id: undefined,
        device_id: uuid,
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: 'test event 2',
        library: library,
      });
      expect(response[1].code).toBe(200);
      expect(response[1].message).toBe(SUCCESS_MESSAGE);
      first.done();
      second.done();
    });

    test('should handle 429 error', async () => {
      const first = nock(url)
        .post(path)
        .reply(429, {
          code: 429,
          error: 'Too many requests for some devices and users',
          exceeded_daily_quota_devices: {
            throttled_device_id: 1,
          },
        });
      const second = nock(url).post(path).reply(200, success);

      await coxwave.init('PROJECT_TOKEN', {
        logLevel: 0,
        ...opts,
      }).promise;
      const response = await Promise.all([
        coxwave.track('test event 1').promise,
        coxwave.track('test event 2', {
          device_id: 'throttled_device_id',
        }).promise,
      ]);
      expect(response[0].event).toEqual({
        user_id: undefined,
        device_id: uuid,
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: 'test event 1',
        library: library,
      });
      expect(response[0].code).toBe(200);
      expect(response[0].message).toBe(SUCCESS_MESSAGE);
      expect(response[1].event).toEqual({
        user_id: undefined,
        device_id: 'throttled_device_id',
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: 'test event 2',
        library: library,
      });
      expect(response[1].code).toBe(429);
      expect(response[1].message).toBe('Too many requests for some devices and users');
      first.done();
      second.done();
    });

    test('should handle 500 error', async () => {
      const first = nock(url).post(path).reply(500, {
        code: 500,
      });
      const second = nock(url).post(path).reply(200, success);

      await coxwave.init('PROJECT_TOKEN', {
        logLevel: 0,
        ...opts,
      }).promise;
      const response = await Promise.all([
        coxwave.track('test event 1').promise,
        coxwave.track('test event 2').promise,
      ]);
      expect(response[0].event).toEqual({
        user_id: undefined,
        device_id: uuid,
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: 'test event 1',
        library: library,
      });
      expect(response[0].code).toBe(200);
      expect(response[0].message).toBe(SUCCESS_MESSAGE);
      expect(response[1].event).toEqual({
        user_id: undefined,
        device_id: uuid,
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: 'test event 2',
        library: library,
      });
      expect(response[0].code).toBe(200);
      expect(response[0].message).toBe(SUCCESS_MESSAGE);
      first.done();
      second.done();
    });

    test('should exhaust max retries', async () => {
      const scope = nock(url).post(path).times(3).reply(500, {
        code: 500,
      });

      await coxwave.init('PROJECT_TOKEN', {
        logLevel: 0,
        flushMaxRetries: 3,
        ...opts,
      }).promise;
      const response = await coxwave.track('test event').promise;
      expect(response.event).toEqual({
        user_id: undefined,
        device_id: uuid,
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: '$track' as TAvailableEventType,
        event_name: 'test event',
        library: library,
      });
      expect(response.code).toBe(500);
      expect(response.message).toBe('Event rejected due to exceeded retry count');
      scope.done();
    }, 10000);

    test('should handle missing api key', async () => {
      await coxwave.init('', {
        logLevel: 0,
        ...opts,
      }).promise;
      const response = await coxwave.track('test event').promise;
      expect(response.code).toBe(400);
      expect(response.message).toBe('Event rejected due to missing API key');
    });

    test('should handle client opt out', async () => {
      await coxwave.init('PROJECT_TOKEN', {
        logLevel: 0,
        ...opts,
      }).promise;
      coxwave.setOptOut(true);
      const response = await coxwave.track('test event').promise;
      expect(response.code).toBe(0);
      expect(response.message).toBe('Event skipped due to optOut config');
    });
  });

  describe('identify', () => {
    test('should track event', async () => {
      const scope = nock(url).post(path).reply(200, success);

      await coxwave.init('PROJECT_TOKEN', {
        ...opts,
      }).promise;
      const id = new coxwave.Identify();
      id.set('org', 'amp');
      const response = await coxwave.identify(id).promise;
      expect(response.event).toEqual({
        user_id: undefined,
        device_id: uuid,
        session_id: number,
        time: number,
        platform: 'Web',
        os_name: 'WebKit',
        os_version: '537.36',
        device_manufacturer: undefined,
        language: 'en-US',
        ip: '$remote',
        id: uuid,
        event_type: '$identify',
        library: library,
        user_properties: {
          $set: {
            org: 'amp',
          },
        },
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      scope.done();
    });
  });

  describe('custom config', () => {
    describe('serverUrl', () => {
      test('should track event to custom serverUrl', async () => {
        const serverUrl = 'https://domain.com';
        const scope = nock(serverUrl).post(path).reply(200, success);

        await coxwave.init('PROJECT_TOKEN', {
          ...opts,
          serverUrl: serverUrl + path,
        }).promise;
        const response = await coxwave.track('test event').promise;
        expect(response.event).toEqual({
          user_id: undefined,
          device_id: uuid,
          session_id: number,
          time: number,
          platform: 'Web',
          os_name: 'WebKit',
          os_version: '537.36',
          device_manufacturer: undefined,
          language: 'en-US',
          ip: '$remote',
          id: uuid,
          event_type: '$track' as TAvailableEventType,
          event_name: 'test event',
          library: library,
        });
        expect(response.code).toBe(200);
        expect(response.message).toBe(SUCCESS_MESSAGE);
        scope.done();
      });
    });

    describe('debug mode', () => {
      test('should enable debug mode for track', async () => {
        const scope = nock(url).post(path).reply(200, success);

        const logger = {
          disable: jest.fn(),
          enable: jest.fn(),
          debug: jest.fn(),
          log: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        };
        await coxwave.init('PROJECT_TOKEN', {
          ...opts,
          loggerProvider: logger,
          logLevel: LogLevel.Debug,
        }).promise;

        const response = await coxwave.track('test event').promise;
        expect(response.event).toEqual({
          user_id: undefined,
          device_id: uuid,
          session_id: number,
          time: number,
          platform: 'Web',
          os_name: 'WebKit',
          os_version: '537.36',
          device_manufacturer: undefined,
          language: 'en-US',
          ip: '$remote',
          id: uuid,
          event_type: '$track' as TAvailableEventType,
          event_name: 'test event',
          library: library,
        });
        expect(response.code).toBe(200);
        expect(response.message).toBe(SUCCESS_MESSAGE);
        scope.done();

        expect(logger.debug).toHaveBeenCalledTimes(1);
        /* eslint-disable */
        const debugContext = JSON.parse(logger.debug.mock.calls[0]);
        expect(debugContext.type).toBeDefined();
        expect(debugContext.name).toEqual('track');
        expect(debugContext.args).toBeDefined();
        expect(debugContext.stacktrace).toBeDefined();
        expect(debugContext.time).toBeDefined();
        expect(debugContext.states).toBeDefined();
        /* eslint-enable */
      });

      test('should enable debug mode for setOptOut', async () => {
        const logger = {
          disable: jest.fn(),
          enable: jest.fn(),
          debug: jest.fn(),
          log: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        };
        await coxwave.init('PROJECT_TOKEN', {
          ...opts,
          loggerProvider: logger,
          logLevel: LogLevel.Debug,
        }).promise;
        coxwave.setOptOut(true);

        expect(logger.debug).toHaveBeenCalledTimes(1);
        /* eslint-disable */
        const debugContext = JSON.parse(logger.debug.mock.calls[0]);
        expect(debugContext.type).toBeDefined();
        expect(debugContext.name).toEqual('setOptOut');
        expect(debugContext.args).toBeDefined();
        expect(debugContext.stacktrace).toBeDefined();
        expect(debugContext.time).toBeDefined();
        expect(debugContext.states).toBeDefined();
        /* eslint-enable */
      });
    });
  });
});
