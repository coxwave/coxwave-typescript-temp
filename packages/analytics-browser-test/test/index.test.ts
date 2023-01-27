// import * as coxwave from '@coxwave/analytics-browser';
import { Identify, createInstance } from '@coxwave/analytics-browser';
import { UUID } from '@coxwave/analytics-core';
import { AvailableEventType, SpecialEventName } from '@coxwave/analytics-types';

import { SUCCESS_MESSAGE, uuidPattern, PROJECT_TOKEN } from './constants';

import 'isomorphic-fetch';

describe('integration', () => {
  const uuid: string = expect.stringMatching(uuidPattern) as string;
  const library = expect.stringMatching(/^coxwave-ts\/.+/) as string;
  const number = expect.any(Number) as number;
  const record = expect.any(Object) as Record<string, any>;
  const opts = {
    trackingOptions: { deviceModel: false },
  };

  afterEach(() => {
    // clean up cookies
    document.cookie = 'COX_PROJECT_TOKEN=null; expires=-1';
  });

  describe('track', () => {
    test('should track event', async () => {
      //const scope = nock(url).post(path).reply(200, success);

      const coxwave = createInstance();
      await coxwave.init(PROJECT_TOKEN, {
        ...opts,
      }).promise;
      const response = await coxwave.track('test event', {
        mode: 'test',
      }).promise;
      expect(response.event).toEqual({
        id: uuid,
        eventType: AvailableEventType.TRACK,
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
      //scope.done();
    });
  });

  describe('log', () => {
    test('should log event', async () => {
      //const scope = nock(url).post(path).reply(200, success);

      const coxwave = createInstance();
      await coxwave.init(PROJECT_TOKEN, {
        ...opts,
      }).promise;
      const response = await coxwave.log('Blog-Contents', {
        input: { foo: { type: 'text', value: 'hello world' } },
        output: { bar: { type: 'text', value: 'hello world' } },
      }).promise;
      expect(response.event).toEqual({
        id: uuid,
        eventType: AvailableEventType.LOG,
        eventName: 'Blog-Contents',
        input: { foo: { type: 'text', value: 'hello world' } },
        output: { bar: { type: 'text', value: 'hello world' } },
        properties: {
          distinctId: uuid,
          userId: undefined,
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
          custom: {},
        },
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      //scope.done();
    });
  });

  describe('feedback', () => {
    test('should feedback event', async () => {
      //const scope = nock(url).post(path).reply(200, success);

      const coxwave = createInstance();
      await coxwave.init(PROJECT_TOKEN, {
        ...opts,
      }).promise;

      const generationId = coxwave.log('test-feedback').id;
      const response = await coxwave.feedback('rating', {
        generationId: generationId,
        score: 5,
      }).promise;

      expect(response.event).toEqual({
        id: uuid,
        eventType: AvailableEventType.FEEDBACK,
        eventName: 'rating',
        generationId: uuid,
        properties: {
          distinctId: uuid,
          userId: undefined,
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
          custom: {
            score: 5,
          },
        },
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      //scope.done();
    });
  });

  describe('alias', () => {
    test('should alias event', async () => {
      //const scope = nock(url).post(path).reply(200, success);

      const coxwave = createInstance();
      await coxwave.init(PROJECT_TOKEN, {
        ...opts,
      }).promise;
      const response = await coxwave.alias(UUID()).promise;
      expect(response.event).toEqual({
        id: uuid,
        distinctId: uuid,
        eventType: AvailableEventType.IDENTIFY,
        eventName: SpecialEventName.ALIAS,
        alias: uuid,
        properties: record,
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      //scope.done();
    });
  });

  describe('identify', () => {
    test('should identify event', async () => {
      //const scope = nock(url).post(path).reply(200, success);

      const coxwave = createInstance();
      await coxwave.init(PROJECT_TOKEN, {
        ...opts,
      }).promise;
      const id = new Identify();
      id.set('name', 'foo');
      id.set('org', 'bar');
      const response = await coxwave.identify('my-alias', id).promise;
      expect(response.event).toEqual({
        id: uuid,
        eventType: AvailableEventType.IDENTIFY,
        eventName: SpecialEventName.IDENTIFY,
        alias: 'my-alias',
        name: 'foo',
        custom: {
          org: 'bar',
        },
        properties: record,
      });
      expect(response.code).toBe(200);
      expect(response.message).toBe(SUCCESS_MESSAGE);
      //scope.done();
    });
  });

  // describe('custom config', () => {
  //   describe('serverUrl', () => {
  //     test('should track event to custom serverUrl', async () => {
  //       const serverUrl = 'https://domain.com';
  //       const scope = nock(serverUrl).post(path).reply(200, success);

  //       await coxwave.init(PROJECT_TOKEN, {
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
  //       await coxwave.init(PROJECT_TOKEN, {
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
  //       await coxwave.init(PROJECT_TOKEN, {
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
