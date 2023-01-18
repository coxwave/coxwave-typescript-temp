import { Status, TAvailableEventType } from '@coxwave/analytics-types';

import { CoxwaveCore } from '../src/index';

import { matchUUID, useDefaultConfig } from './helpers/default';

describe('core-client', () => {
  const success = {
    id: '_',
    event: { id: '_', event_type: '$track' as TAvailableEventType, event_name: 'sample' },
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
});
