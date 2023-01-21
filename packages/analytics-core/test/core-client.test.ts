import { Status, TAvailableEventType } from '@coxwave/analytics-types';

import { CoxwaveCore, Identify } from '../src/index';

import { matchUUID, useDefaultConfig, ALIAS_NAME, DISTINCT_ID } from './helpers/default';

describe('core-client', () => {
  const success = {
    id: '_',
    event: { id: '_', eventType: '$track' as TAvailableEventType, eventName: 'sample' },
    code: 200,
    message: Status.Success,
  };
  const client = new CoxwaveCore();

  describe('init', () => {
    test('should call init', async () => {
      expect(client.config).toBeUndefined();
      await client._init(useDefaultConfig());
      expect(client.config).toBeDefined();
    });
  });

  describe('track', () => {
    test('should return event_id immediately', async () => {
      const eventName = 'eventName';
      const eventProperties = { event: 'test' };
      const response = client.track(eventName, eventProperties);

      expect(matchUUID(response.id)).toBeTruthy();
    });

    test('should call track', async () => {
      const dispatch = jest.spyOn(client, 'dispatch').mockReturnValueOnce(Promise.resolve(success));
      const eventName = 'eventName';
      const eventProperties = { event: 'test' };
      const result = await client.track(eventName, eventProperties).promise;

      expect(result).toEqual(success);
      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('register', () => {
    test('should call register', async () => {
      const dispatch = jest.spyOn(client, 'dispatch').mockReturnValueOnce(Promise.resolve(success));
      const response = await client.register(DISTINCT_ID);
      expect(response).toEqual(success);
      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('identify', () => {
    test('should call identify', async () => {
      const dispatch = jest.spyOn(client, 'dispatch').mockReturnValueOnce(Promise.resolve(success));
      const identify: Identify = new Identify();
      const response = await client.identify(identify, undefined);
      expect(response).toEqual(success);
      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('alias', () => {
    test('should call alias', async () => {
      const dispatch = jest.spyOn(client, 'dispatch').mockReturnValueOnce(Promise.resolve(success));
      const response = await client.alias(ALIAS_NAME, DISTINCT_ID);
      expect(response).toEqual(success);
      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
