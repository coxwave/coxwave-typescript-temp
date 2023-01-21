import { DestinationContext as Context, Payload, FeedbackEvent, PluginType } from '@coxwave/analytics-types';

import { SERVER_FEEDBACKS_PATH } from '../../constants';

import { _BaseDestination } from './base-destination';

import { syncServerSpec } from '../../utils/payload';

export class FeedbackDestination extends _BaseDestination {
  type = PluginType.DESTINATION_FEEDBACK as const;

  _createPayload(contexts: Context[]): Payload {
    return {
      feedbacks: contexts.map((context) => {
        return syncServerSpec(context.event) as FeedbackEvent;
      }),
      options: {},
    };
  }

  _createEndpointUrl(serverUrl: string) {
    return serverUrl + SERVER_FEEDBACKS_PATH;
  }
}
