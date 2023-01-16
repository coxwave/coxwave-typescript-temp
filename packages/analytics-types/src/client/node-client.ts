import { NodeOptions } from '../config';
import { CoxwaveReturn } from '../coxwave-promise';

import { BaseClient } from './base-client';

export interface NodeClient extends BaseClient {
  /**
   * Initializes the Coxwave SDK with your apiKey, optional configurations.
   * This method must be called before any other operations.
   *
   * ```typescript
   * await init(API_KEY, options).promise;
   * ```
   */
  init(apiKey: string, options?: NodeOptions): CoxwaveReturn<void>;
}
