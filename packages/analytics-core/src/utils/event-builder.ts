import {
  AvailableEventType,
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

export const createTrackEvent = (
  activityInput: string,
  activityProperties?: ActivityProperties,
  eventOptions?: EventOptions,
): TrackActivityEvent => {
  const baseActivity: TrackActivityEvent = {
    event_type: AvailableEventType.TRACK,
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
    event_type: AvailableEventType.LOG,
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
    event_type: AvailableEventType.FEEDBACK,
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
    ...eventOptions,
    event_type: AvailableEventType.TRACK,
    event_name: SpecialEventName.IDENTIFY,
    properties: identify.getUserProperties(),
  };

  return IdentifyActivityEvent;
};
