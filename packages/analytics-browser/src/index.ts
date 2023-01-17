/* eslint-disable @typescript-eslint/unbound-method */
import client from './browser-client';

export { createInstance } from './browser-client';
export const {
  add,
  flush,
  getDeviceId,
  getSessionId,
  getThreadId,
  getUserId,
  identify,
  init,
  remove,
  reset,
  setDeviceId,
  setOptOut,
  setSessionId,
  setThreadId,
  setTransport,
  setUserId,
  resetThreadId,
  track,
  log,
  submit,
} = client;
export { runQueuedFunctions } from './utils/snippet-helper';
export { Identify } from '@coxwave/analytics-core';
export * as Types from '@coxwave/analytics-types';
