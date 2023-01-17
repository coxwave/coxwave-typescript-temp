import {
  TrackActivityEvent,
  IdentifyActivityEvent,
  SpecialEventName,
  Identify as IIdentify,
  EventOptions,
  Generation,
  Feedback,
  ActivityProperties,
  FeedbackProperties,
  GenerationProperties,
} from '@coxwave/analytics-types';

import { UUID } from './uuid';

export const createTrackEvent = (
  activityInput: string,
  activityProperties?: ActivityProperties,
  eventOptions?: EventOptions,
): TrackActivityEvent => {
  const baseActivity: TrackActivityEvent = {
    id: UUID(),
    event_type: '$track',
    event_name: activityInput,
    properties: activityProperties,
  };

  return {
    ...baseActivity,
    ...eventOptions,
  };
};

export const createLogEvent = (
  generationInput: string,
  generationProperties?: GenerationProperties,
  eventOptions?: EventOptions,
): Generation => {
  const baseGeneration: Generation = {
    id: UUID(),
    event_type: '$log',
    event_name: generationInput,
    properties: generationProperties,
  };

  return {
    ...baseGeneration,
    ...eventOptions,
  };
};

export const createFeedbackEvent = (
  feedbackTraget: string,
  feedbackInput: string,
  feedbackProperties?: FeedbackProperties,
  eventOptions?: EventOptions,
): Feedback => {
  const baseFeedback: Feedback = {
    id: UUID(),
    event_type: '$feedback',
    event_name: feedbackInput,
    properties: { target_id: feedbackTraget, ...feedbackProperties },
  };

  return {
    ...baseFeedback,
    ...eventOptions,
  };
};

export const createIdentifyEvent = (identify: IIdentify, eventOptions?: EventOptions): IdentifyActivityEvent => {
  const IdentifyActivityEvent: IdentifyActivityEvent = {
    id: UUID(),
    event_type: '$track',
    event_name: SpecialEventName.IDENTIFY,
    properties: identify.getUserProperties(),
    ...eventOptions,
  };

  return IdentifyActivityEvent;
};
