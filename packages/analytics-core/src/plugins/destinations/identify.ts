import { DestinationContext as Context, IdentifyEvent, Payload, PluginType, Result } from '@coxwave/analytics-types';
import { syncIdentifyServerSpec } from 'src/utils/payload';

import { _BaseDestination } from './base-destination';

import { createServerConfig } from '../../config';
import { SERVER_GENERATIONS_PATH } from '../../constants';
import { MISSING_PROJECT_TOKEN_MESSAGE, UNEXPECTED_ERROR_MESSAGE } from '../../messages';

export const SERVER_IDENTIFY_REGISTER_PATH = '/user-identities/init';
export const SERVER_IDENTIFY_IDENTIFY_PATH = '/user-identities/identify';
export const SERVER_IDENTIFY_ALIAS_PATH = '/user-identities/alias';

export class IdentifyDestination extends _BaseDestination {
  type = PluginType.DESTINATION_IDENTIFY as const;

  execute(event: IdentifyEvent): Promise<Result> {
    return new Promise((resolve) => {
      const context = {
        event,
        attempts: 0,
        callback: (result: Result) => resolve(result),
        timeout: 0,
      };
      void this.sendIdentify(context);
    });
  }

  _createPayload(contexts: Context[]): Payload {
    const event = contexts[0].event;
    return syncIdentifyServerSpec(event as IdentifyEvent);
  }

  _createEndpointUrl(serverUrl: string) {
    return serverUrl + SERVER_GENERATIONS_PATH;
  }

  async sendIdentify(event: Context, useRetry = true) {
    if (!this.config.projectToken) {
      return this.fulfillRequest([event], 400, MISSING_PROJECT_TOKEN_MESSAGE);
    }
    const projectToken = this.config.projectToken;
    const payload = this._createPayload([event]);

    try {
      const { serverUrl } = createServerConfig(this.config.serverUrl, this.config.serverZone, this.config.useBatch);
      const endpointUrl = this._createEndpointUrl(serverUrl);

      const res = await this.config.transportProvider.send(endpointUrl, payload, projectToken);
      if (res === null) {
        this.fulfillRequest([event], 0, UNEXPECTED_ERROR_MESSAGE);
        return;
      }
      if (!useRetry) {
        if ('body' in res) {
          let responseBody = '';
          try {
            responseBody = JSON.stringify(res.body, null, 2);
          } catch {
            // to avoid crash, but don't care about the error, add comment to avoid empty block lint error
          }
          this.fulfillRequest([event], res.statusCode, `${res.status}: ${responseBody}`);
        } else {
          this.fulfillRequest([event], res.statusCode, res.status);
        }
        return;
      }
      this.handleReponse(res, [event]);
    } catch (e) {
      this.fulfillRequest([event], 0, String(e));
    }
  }
}
