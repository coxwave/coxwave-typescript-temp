import { DestinationContext as Context, FeedbackPayload, FeedbackEvent } from '@coxwave/analytics-types';

import { SERVER_FEEDBACKS_PATH } from '../../constants';

import { _BaseDestination } from './base-destination';

import { syncServerSpec } from '../../utils/payload';

export class FeedbackDestination extends _BaseDestination {
  _createPayload(contexts: Context[]): FeedbackPayload {
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
