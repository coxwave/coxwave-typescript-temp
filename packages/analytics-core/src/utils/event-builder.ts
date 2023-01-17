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
  const baseActivity: TrackActivityEvent = { event_type: AvailableEventType.TRACK, event_name: activityInput };

  return {
    ...baseActivity,
    ...eventOptions,
    ...(activityProperties && { activityProperties: activityProperties }),
  };
};

export const createLogEvent = (
  generationInput: string,
  GenerationProperties?: GenerationProperties,
  eventOptions?: EventOptions,
): Generation => {
  const baseGeneration: Generation = { event_type: AvailableEventType.LOG, event_name: generationInput };

  return {
    ...baseGeneration,
    ...eventOptions,
    ...(GenerationProperties && { generation_properties: GenerationProperties }),
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
    feedback_properties: { target_id: feedbackTraget, ...feedbackProperties },
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
    user_properties: identify.getUserProperties(),
  };

  return IdentifyActivityEvent;
};
