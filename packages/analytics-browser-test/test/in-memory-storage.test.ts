import { createInstance } from '@coxwave/analytics-browser';
import { MemoryStorage } from '@coxwave/analytics-core';

import 'isomorphic-fetch';

describe('Storage options', () => {
  afterEach(() => {
    // clean up storage
    document.cookie = 'COX_PROJECT_TOKEN=null; expires=1 Jan 1970 00:00:00 GMT';
    window.localStorage.clear();
  });

  test('should use default storage', async () => {
    //const scope = nock(url).post(path).reply(200, success);

    const coxwave = createInstance();
    await coxwave.init('PROJECT_TOKEN', {
      trackingOptions: {
        platform: false,
      },
    }).promise;

    // await coxwave.track('Event').promise;

    /**
     * cookies are the default storage option for user session
     * asserts that cookie storage was used
     */
    expect(document.cookie).toContain('COX_PROJECT_TOKEN');
    /**
     * local storage is the default storage option for unsent events
     * asserts that local storage was used
     */
    expect(window.localStorage.key(0)).toBe('COX_unsent_PROJECT_TOKEN');

    //scope.done();
  });

  test('should use local storage', async () => {
    //const scope = nock(url).post(path).reply(200, success);

    const coxwave = createInstance();
    await coxwave.init('PROJECT_TOKEN', {
      trackingOptions: {
        platform: false,
      },
      disableCookies: true,
    }).promise;

    // await coxwave.track('Event').promise;

    /**
     * cookies are disabled
     * asserts that cookie storage was not used
     */
    expect(document.cookie).toBe('');
    /**
     * with `disableCookies: true`, user session is stored in local storage
     * asserts that local storage is used for use session and unsent events
     */
    expect(window.localStorage.key(0)).toContain('COX_PROJECT_TOKEN');
    expect(window.localStorage.key(1)).toBe('COX_unsent_PROJECT_TOKEN');
    expect(window.localStorage.length).toBe(2);

    //scope.done();
  });

  test('should use memory storage', async () => {
    //const scope = nock(url).post(path).reply(200, success);

    const coxwave = createInstance();
    await coxwave.init('PROJECT_TOKEN', {
      trackingOptions: {
        platform: false,
      },
      cookieStorage: new MemoryStorage(),
      storageProvider: new MemoryStorage(),
    }).promise;

    // await coxwave.track('Event').promise;

    /**
     * cookieStorage is set to new MemoryStorage()
     * asserts that cookie storage is not used
     */
    expect(document.cookie).toBe('');
    /**
     * storageProvider is set to new MemoryStorage()
     * asserts that local storage is not used
     */
    expect(window.localStorage.length).toBe(0);

    //scope.done();
  });
});
