import { DestinationContext as Context, GenerationPayload, GenerationEvent } from '@coxwave/analytics-types';

import { SERVER_GENERATIONS_PATH } from '../../constants';

import { _BaseDestination } from './base-destination';

import { syncServerSpec } from '../../utils/payload';

export class GenerationDestination extends _BaseDestination {
  _createPayload(contexts: Context[]): GenerationPayload {
    return {
      generations: contexts.map((context) => {
        return syncServerSpec(context.event) as GenerationEvent;
      }),
      options: {},
    };
  }

  _createEndpointUrl(serverUrl: string) {
    return serverUrl + SERVER_GENERATIONS_PATH;
  }
}
