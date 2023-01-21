import { DestinationContext as Context, Payload, PluginType } from '@coxwave/analytics-types';

import { _BaseDestination } from './base-destination';

export class IdentifyDestination extends _BaseDestination {
  type = PluginType.DESTINATION_IDENTIFY as const;

  _createPayload(contexts: Context[]): Payload {
    return {
      activities: contexts.map((context) => {
        return context.event;
      }),
      options: {},
    };
  }

  _createEndpointUrl(serverUrl: string) {
    return serverUrl + '/identify';
  }
}
