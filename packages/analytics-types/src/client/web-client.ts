import { BrowserOptions, ReactNativeOptions } from '../config';
import { CoxwaveReturn } from '../coxwave-promise';

import { BaseClient } from './base-client';

import { TransportType } from '../transport';

interface Client extends BaseClient {
  /**
   * Returns current user ID.
   *
   * ```typescript
   * const userId = getUserId();
   * ```
   */
  getUserId(): string | undefined;

  /**
   * Sets a new user ID.
   *
   * ```typescript
   * setUserId('userId');
   * ```
   */
  setUserId(userId: string | undefined): void;

  /**
   * Returns current device ID.
   *
   * ```typescript
   * const deviceId = getDeviceId();
   * ```
   */
  getDeviceId(): string | undefined;

  /**
   * Sets a new device ID.
   * When setting a custom device ID, make sure the value is sufficiently unique.
   * A uuid is recommended.
   *
   * ```typescript
   * setDeviceId('deviceId');
   * ```
   */
  setDeviceId(deviceId: string): void;

  /**
   * Returns current session ID.
   *
   * ```typescript
   * const sessionId = getSessionId();
   * ```
   */
  getSessionId(): number | undefined;

  /**
   * Sets a new session ID.
   * When setting a custom session ID, make sure the value is in milliseconds since epoch (Unix Timestamp).
   *
   * ```typescript
   * setSessionId(Date.now());
   * ```
   */
  setSessionId(sessionId: number): void;

  /**
   * Returns current thread ID.
   *
   * ```typescript
   * const threadId = getThreadId();
   * ```
   */
  getThreadId(): string | undefined;

  /**
   * Sets a new thread ID.
   * When setting a custom thread ID, make sure the value is UUID format.
   *
   * ```typescript
   * setThreadId(UUID());
   * ```
   */
  setThreadId(threadId: string): void;

  /**
   * Reset a thread ID.
   *
   * ```typescript
   * resetThreadId();
   * ```
   */
  resetThreadId(): void;

  /**
   * Anonymizes users after they log out, by:
   *
   * * setting userId to undefined
   * * setting deviceId to a new uuid value
   * * setting threadId to undefined
   *
   * With an undefined userId and a completely new deviceId, the current user would appear as a brand new user in dashboard.
   *
   * ```typescript
   * import { reset } from '@coxwave/analytics-browser';
   *
   * reset();
   * ```
   */
  reset(): void;
}

export interface BrowserClient extends Client {
  /**
   * Initializes the Coxwave SDK with your projectToken, optional configurations.
   * This method must be called before any other operations.
   *
   * ```typescript
   * await init(PROJECT_TOKEN, options).promise;
   * ```
   */
  init(projectToken: string, userId?: string, options?: BrowserOptions): CoxwaveReturn<void>;

  /**
   * Sets the network transport type for events.
   *
   * ```typescript
   * // Use Fetch API
   * setTransport('fetch');
   *
   * // Use XMLHttpRequest API
   * setTransport('xhr');
   *
   * // Use navigator.sendBeacon API
   * setTransport('beacon');
   * ```
   */
  setTransport(transport: TransportType): void;
}

export interface ReactNativeClient extends Client {
  /**
   * Initializes the Coxwave SDK with your projectToken, optional configurations.
   * This method must be called before any other operations.
   *
   * ```typescript
   * await init(PROJECT_TOKEN, options).promise;
   * ```
   */
  init(projectToken: string, userId?: string, options?: ReactNativeOptions): CoxwaveReturn<void>;
}
