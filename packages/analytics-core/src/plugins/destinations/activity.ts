import {
  DestinationContext as Context,
  Payload,
  ActivityEvent,
  ActivityDestinationPlugin,
  PluginType,
} from '@coxwave/analytics-types';

import { SERVER_ACTIVITIES_PATH } from '../../constants';

import { _BaseDestination } from './base-destination';

export class ActivityDestination extends _BaseDestination implements ActivityDestinationPlugin {
  type = PluginType.DESTINATION_ACTIVITY as const;

  _createPayload(contexts: Context[]): Payload {
    return {
      activities: contexts.map((context) => {
        return context.event as ActivityEvent;
      }),
      options: {},
    };
  }

  _createEndpointUrl(serverUrl: string) {
    return serverUrl + SERVER_ACTIVITIES_PATH;
  }
}
