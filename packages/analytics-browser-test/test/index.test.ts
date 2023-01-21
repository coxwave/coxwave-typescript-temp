// import * as coxwave from '@coxwave/analytics-browser';
import { createInstance } from '@coxwave/analytics-browser';
import { TAvailableEventType } from '@coxwave/analytics-types';
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
  // describe('FIRST TEST: defer initialization', () => {
  //   beforeAll(() => {
  //     Object.defineProperty(window, 'location', {
  //       value: {
  //         hostname: '',
  //         href: '',
  //         pathname: '',
  //         search: '',
  //       },
  //       writable: true,
  //     });
  //   });

  //   beforeEach(() => {
  //     (window.location as any) = {
  //       hostname: '',
  //       href: '',
  //       pathname: '',
  //       search: '',
  //     };
  //   });

  // test('should allow init to be called after other APIs', () => {
  //   return new Promise((resolve) => {
  //     const scope = nock(url).post(path).reply(200, success);

  //     // NOTE: Values to assert on
  //     const sessionId = Date.now() - 1000;
  //     const distinctId = 'user@coxwave.com';
  //     const deviceId = 'device-12345';
  //     const platform = 'Jest';

  //     coxwave.setDistinctId(distinctId);
  //     coxwave.setDeviceId(deviceId);
  //     coxwave.setSessionId(sessionId);
  //     coxwave.add({
  //       type: PluginType.ENRICHMENT,
  //       name: 'custom',
  //       setup: async () => {
  //         return undefined;
  //       },
  //       execute: async (event: Event) => {
  //         event.properties = event.properties ?? {};
  //         event.properties.platform = platform;
  //         return event;
  //       },
  //     });
  //     void coxwave.track('Event Before Init').promise.then((response) => {
  //       expect(response.event).toEqual({
  //         id: uuid,
  //         eventType: '$track',
  //         eventName: 'Event Before Init',
  //         properties: {
  //           deviceId: deviceId, // NOTE: Device ID was set before init
  //           deviceManufacturer: undefined,
  //           ip: '$remote',
  //           language: 'en-US',
  //           library: library,
  //           osName: 'WebKit',
  //           osVersion: '537.36',
  //           platform: platform, // NOTE: Session ID was set using a plugin added before init
  //           sessionId: sessionId, // NOTE: Session ID was set before init
  //           time: number,
  //           distinctId: distinctId, // NOTE: User ID was set before init
  //           custom: {},
  //         }
  //       });
  //       expect(response.code).toBe(200);
  //       expect(response.message).toBe(SUCCESS_MESSAGE);
  //       scope.done();
  //       resolve(undefined);
  //     });
  //     coxwave.init('PROJECT_TOKEN', {
  //       ...opts,
  //       serverUrl: url + path,
  //     });
  //   });
  // });
  // });

  describe('track', () => {
    test('should track event', async () => {
      const scope = nock(url).post(path).reply(200, success);

      const coxwave = createInstance();
      await coxwave.init('PROJECT_TOKEN', {
        ...opts,
      }).promise;
      const response = await coxwave.track('test event', {
        mode: 'test',
      }).promise;
      expect(response.event).toEqual({
        id: uuid,
        eventType: '$track' as TAvailableEventType,
        eventName: 'test event',
        properties: {
          distinctId: uuid,
          deviceId: uuid,
          sessionId: number,
          time: number,
          platform: 'Web',
          osName: 'WebKit',
          osVersion: '537.36',
          deviceManufacturer: undefined,
          language: 'en-US',
          ip: '$remote',
          library: library,
          custom: { mode: 'test' },
        },
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      scope.done();
    });

    // test('should track event with custom config', async () => {
    //   const scope = nock(url).post(path).reply(200, success);

    //   await coxwave.init('PROJECT_TOKEN', {
    //     userId: 'sdk.dev@coxwave.com',
    //     deviceId: 'deviceId',
    //     sessionId: 1,
    //     ...opts,
    //   }).promise;
    //   const response = await coxwave.track('test event').promise;
    //   expect(response.event).toEqual({
    //     id: uuid,
    //     eventType: '$track' as TAvailableEventType,
    //     eventName: 'test event',
    //     properties: {
    //       distinctId: uuid,
    //       userId: 'sdk.dev@coxwave.com',
    //       deviceId: 'deviceId',
    //       sessionId: 1,
    //       time: number,
    //       platform: 'Web',
    //       osName: 'WebKit',
    //       osVersion: '537.36',
    //       deviceManufacturer: undefined,
    //       language: 'en-US',
    //       ip: '$remote',
    //       library: library,
    //       custom: {},
    //     }
    //   });
    //   expect(response.code).toBe(200);
    //   expect(response.message).toBe(SUCCESS_MESSAGE);
    //   scope.done();
    // });

    // test('should track event with event options', async () => {
    //   const scope = nock(url).post(path).reply(200, success);

    //   await coxwave.init('PROJECT_TOKEN', {
    //     ...opts,
    //   }).promise;

    //   const response = await coxwave.track('test event', {
    //     userId: 'sdk.dev@coxwave.com',
    //     deviceId: 'deviceId',
    //     sessionId: 1,
    //   }).promise;
    //   expect(response.event).toEqual({
    //     id: uuid,
    //     eventType: '$track' as TAvailableEventType,
    //     eventName: 'test event',
    //     properties: {
    //       distinctId: uuid,
    //       deviceId: uuid,
    //       sessionId: number,
    //       time: number,
    //       platform: 'Web',
    //       osName: 'WebKit',
    //       osVersion: '537.36',
    //       deviceManufacturer: undefined,
    //       language: 'en-US',
    //       ip: '$remote',
    //       library: library,
    //       custom: {
    //         userId: 'sdk.dev@coxwave.com',
    //         deviceId: 'deviceId',
    //         sessionId: 1,
    //       },
    //     },
    //   });
    //   expect(response.code).toBe(200);
    //   expect(response.message).toBe(SUCCESS_MESSAGE);
    //   scope.done();
    // });

    // test('should track event with optional ingestionMetadata option', async () => {
    //   const scope = nock(url).post(path).reply(200, success);

    //   await coxwave.init('PROJECT_TOKEN', {
    //     ...opts,
    //     library: 'this-library',
    //   }).promise;

    //   const response = await coxwave.track('test event', {
    //     userId: 'sdk.dev@coxwave.com',
    //     deviceId: 'deviceId',
    //     sessionId: 1,
    //   }).promise;

    //   expect(response.event).toEqual({
    //     id: uuid,
    //     eventType: '$track' as TAvailableEventType,
    //     eventName: 'test event',
    //     properties: {
    //       distinctId: uuid,
    //       deviceId: 'deviceId',
    //       sessionId: number,
    //       time: number,
    //       platform: 'Web',
    //       osName: 'WebKit',
    //       osVersion: '537.36',
    //       deviceManufacturer: undefined,
    //       language: 'en-US',
    //       ip: '$remote',
    //       library: 'this-library',
    //       custom: {
    //         userId: 'sdk.dev@coxwave.com',
    //         deviceId: 'deviceId',
    //         sessionId: 1,
    //       },
    //     }
    //   });
    //   expect(response.code).toBe(200);
    //   expect(response.message).toBe(SUCCESS_MESSAGE);
    //   scope.done();
    // });

    // test('should track event with base event', async () => {
    //   const scope = nock(url).post(path).reply(200, success);

    //   await coxwave.init('PROJECT_TOKEN', {
    //     ...opts,
    //   }).promise;

    //   const response = await coxwave.track('test event', undefined, {
    //     threadId: 'this-is-thread-id',
    //     deviceId: 'deviceId',
    //     sessionId: 1,
    //   }).promise;

    //   expect(response.event).toEqual({
    //     id: uuid,
    //     eventType: '$track' as TAvailableEventType,
    //     eventName: 'test event',
    //     properties: {
    //       distinctId: uuid,
    //       threadId: 'this-is-thread-id',
    //       deviceId: 'deviceId',
    //       sessionId: 1,
    //       time: number,
    //       platform: 'Web',
    //       osName: 'WebKit',
    //       osVersion: '537.36',
    //       deviceManufacturer: undefined,
    //       language: 'en-US',
    //       ip: '$remote',
    //       library: library,
    //       custom: {},
    //     }
    //   });
    //   expect(response.code).toBe(200);
    //   expect(response.message).toBe(SUCCESS_MESSAGE);
    //   scope.done();
    // });

    // test('should handle 400 error', async () => {
    //   const first = nock(url)
    //     .post(path)
    //     .reply(400, {
    //       code: 400,
    //       error: 'Invalid field values on some events',
    //       events_with_invalid_fields: {
    //         deviceId: [1],
    //       },
    //     });
    //   const second = nock(url).post(path).reply(200, success);

    //   await coxwave.init('PROJECT_TOKEN', {
    //     logLevel: 0,
    //     ...opts,
    //   }).promise;
    //   const response = await Promise.all([
    //     coxwave.track('test event 1').promise,
    //     coxwave.track('test event 2', {
    //       deviceId: undefined,
    //     }).promise,
    //   ]);
    //   expect(response[0].event).toEqual({
    //     id: uuid,
    //     eventType: '$track',
    //     eventName: 'test event 1',
    //     properties: {
    //       distinctId: uuid,
    //       deviceId: uuid,
    //       sessionId: number,
    //       time: number,
    //       platform: 'Web',
    //       osName: 'WebKit',
    //       osVersion: '537.36',
    //       deviceManufacturer: undefined,
    //       language: 'en-US',
    //       ip: '$remote',
    //       library: library,
    //       custom: {},
    //     }
    //   });
    //   expect(response[0].code).toBe(200);
    //   expect(response[0].message).toBe(SUCCESS_MESSAGE);
    //   expect(response[1].event).toEqual({
    //     id: uuid,
    //     eventType: '$track',
    //     eventName: 'test event 2',
    //     properties: {
    //       distinctId: uuid,
    //       deviceId: undefined,
    //       sessionId: number,
    //       time: number,
    //       platform: 'Web',
    //       osName: 'WebKit',
    //       osVersion: '537.36',
    //       deviceManufacturer: undefined,
    //       language: 'en-US',
    //       ip: '$remote',
    //       library: library,
    //       custom: {},
    //     }
    //   });
    //   expect(response[1].code).toBe(400);
    //   expect(response[1].message).toBe('Invalid field values on some events');
    //   first.done();
    //   second.done();
    // });

    // test('should handle 413 error', async () => {
    //   const first = nock(url).post(path).reply(413, {
    //     code: 413,
    //     error: 'Payload too large',
    //   });
    //   const second = nock(url).post(path).times(2).reply(200, success);

    //   await coxwave.init('PROJECT_TOKEN', {
    //     logLevel: 0,
    //     flushQueueSize: 2,
    //     ...opts,
    //   }).promise;
    //   const response = await Promise.all([
    //     coxwave.track('test event 1').promise,
    //     coxwave.track('test event 2').promise,
    //   ]);
    //   expect(response[0].event).toEqual({
    //     id: uuid,
    //     eventType: '$track',
    //     eventName: 'test event 1',
    //     properties: {
    //       distinctId: uuid,
    //       deviceId: uuid,
    //       sessionId: number,
    //       time: number,
    //       platform: 'Web',
    //       osName: 'WebKit',
    //       osVersion: '537.36',
    //       deviceManufacturer: undefined,
    //       language: 'en-US',
    //       ip: '$remote',
    //       library: library,
    //       custom: {},
    //     }
    //   });
    //   expect(response[0].code).toBe(200);
    //   expect(response[0].message).toBe(SUCCESS_MESSAGE);
    //   expect(response[1].event).toEqual({
    //     id: uuid,
    //     eventType: '$track',
    //     eventName: 'test event 2',
    //     properties: {
    //       distinctId: uuid,
    //       deviceId: uuid,
    //       sessionId: number,
    //       time: number,
    //       platform: 'Web',
    //       osName: 'WebKit',
    //       osVersion: '537.36',
    //       deviceManufacturer: undefined,
    //       language: 'en-US',
    //       ip: '$remote',
    //       library: library,
    //       custom: {},
    //     }
    //   });
    //   expect(response[1].code).toBe(200);
    //   expect(response[1].message).toBe(SUCCESS_MESSAGE);
    //   first.done();
    //   second.done();
    // });

    // test('should handle missing api key', async () => {
    //   await coxwave.init('', {
    //     logLevel: 0,
    //     ...opts,
    //   }).promise;
    //   const response = await coxwave.track('test event').promise;
    //   expect(response.code).toBe(400);
    //   expect(response.message).toBe('Event rejected due to missing Project Token');
    // });

    // test('should handle client opt out', async () => {
    //   await coxwave.init('PROJECT_TOKEN', {
    //     logLevel: 0,
    //     ...opts,
    //   }).promise;
    //   coxwave.setOptOut(true);
    //   const response = await coxwave.track('test event').promise;
    //   expect(response.code).toBe(0);
    //   expect(response.message).toBe('Event skipped due to optOut config');
    // });
  });

  // describe('identify', () => {
  //   test('should track event', async () => {
  //     const scope = nock(url).post(path).reply(200, success);

  //     await coxwave.init('PROJECT_TOKEN', {
  //       ...opts,
  //     }).promise;
  //     const id = new coxwave.Identify();
  //     id.set('org', 'amp');
  //     const response = await coxwave.identify(id).promise;
  //     expect(response.event).toEqual({
  //       distinctId: uuid,
  //       deviceId: uuid,
  //       sessionId: number,
  //       time: number,
  //       platform: 'Web',
  //       osName: 'WebKit',
  //       osVersion: '537.36',
  //       deviceManufacturer: undefined,
  //       language: 'en-US',
  //       ip: '$remote',
  //       id: uuid,
  //       eventType: '$identify',
  //       library: library,
  //       custom: {},
  //       user_properties: {
  //         $set: {
  //           org: 'amp',
  //         },
  //       },
  //     });
  //     expect(response.code).toBe(200);
  //     expect(response.message).toBe(SUCCESS_MESSAGE);
  //     scope.done();
  //   });
  // });

  // describe('custom config', () => {
  //   describe('serverUrl', () => {
  //     test('should track event to custom serverUrl', async () => {
  //       const serverUrl = 'https://domain.com';
  //       const scope = nock(serverUrl).post(path).reply(200, success);

  //       await coxwave.init('PROJECT_TOKEN', {
  //         ...opts,
  //         serverUrl: serverUrl + path,
  //       }).promise;
  //       const response = await coxwave.track('test event').promise;
  //       expect(response.event).toEqual({
  //         id: uuid,
  //         eventType: '$track',
  //         eventName: 'test event',
  //         properties: {
  //           distinctId: uuid,
  //           deviceId: uuid,
  //           sessionId: number,
  //           time: number,
  //           platform: 'Web',
  //           osName: 'WebKit',
  //           osVersion: '537.36',
  //           deviceManufacturer: undefined,
  //           language: 'en-US',
  //           ip: '$remote',
  //           library: library,
  //           custom: {},
  //         }
  //       });
  //       expect(response.code).toBe(200);
  //       expect(response.message).toBe(SUCCESS_MESSAGE);
  //       scope.done();
  //     });
  //   });

  //   describe('debug mode', () => {
  //     test('should enable debug mode for track', async () => {
  //       const scope = nock(url).post(path).reply(200, success);

  //       const logger = {
  //         disable: jest.fn(),
  //         enable: jest.fn(),
  //         debug: jest.fn(),
  //         log: jest.fn(),
  //         warn: jest.fn(),
  //         error: jest.fn(),
  //       };
  //       await coxwave.init('PROJECT_TOKEN', {
  //         ...opts,
  //         loggerProvider: logger,
  //         logLevel: LogLevel.Debug,
  //       }).promise;

  //       const response = await coxwave.track('test event').promise;
  //       expect(response.event).toEqual({
  //         id: uuid,
  //         eventType: '$track',
  //         eventName: 'test event',
  //         properties: {
  //           distinctId: uuid,
  //           deviceId: uuid,
  //           sessionId: number,
  //           time: number,
  //           platform: 'Web',
  //           osName: 'WebKit',
  //           osVersion: '537.36',
  //           deviceManufacturer: undefined,
  //           language: 'en-US',
  //           ip: '$remote',
  //           library: library,
  //           custom: {},
  //         }
  //       });
  //       expect(response.code).toBe(200);
  //       expect(response.message).toBe(SUCCESS_MESSAGE);
  //       scope.done();

  //       expect(logger.debug).toHaveBeenCalledTimes(1);
  //       /* eslint-disable */
  //       const debugContext = JSON.parse(logger.debug.mock.calls[0]);
  //       expect(debugContext.type).toBeDefined();
  //       expect(debugContext.name).toEqual('track');
  //       expect(debugContext.args).toBeDefined();
  //       expect(debugContext.stacktrace).toBeDefined();
  //       expect(debugContext.time).toBeDefined();
  //       expect(debugContext.states).toBeDefined();
  //       /* eslint-enable */
  //     });

  //     test('should enable debug mode for setOptOut', async () => {
  //       const logger = {
  //         disable: jest.fn(),
  //         enable: jest.fn(),
  //         debug: jest.fn(),
  //         log: jest.fn(),
  //         warn: jest.fn(),
  //         error: jest.fn(),
  //       };
  //       await coxwave.init('PROJECT_TOKEN', {
  //         ...opts,
  //         loggerProvider: logger,
  //         logLevel: LogLevel.Debug,
  //       }).promise;
  //       coxwave.setOptOut(true);

  //       expect(logger.debug).toHaveBeenCalledTimes(1);
  //       /* eslint-disable */
  //       const debugContext = JSON.parse(logger.debug.mock.calls[0]);
  //       expect(debugContext.type).toBeDefined();
  //       expect(debugContext.name).toEqual('setOptOut');
  //       expect(debugContext.args).toBeDefined();
  //       expect(debugContext.stacktrace).toBeDefined();
  //       expect(debugContext.time).toBeDefined();
  //       expect(debugContext.states).toBeDefined();
  //       /* eslint-enable */
  //     });
  //   });
  // });
});
