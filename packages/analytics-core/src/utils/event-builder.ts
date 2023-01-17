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
  const baseActivity: TrackActivityEvent =
    typeof activityInput === 'string'
      ? { event_type: AvailableEventType.TRACK, event_name: activityInput }
      : activityInput;
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
  const baseGeneration: Generation =
    typeof generationInput === 'string'
      ? { event_type: AvailableEventType.LOG, event_name: generationInput }
      : generationInput;
  return {
    ...baseGeneration,
    ...eventOptions,
    ...(GenerationProperties && { generation_properties: GenerationProperties }),
  };
};

export const createSubmitEvent = (
  feedbackTraget: string,
  feedbackInput: string,
  feedbackProperties?: FeedbackProperties,
  eventOptions?: EventOptions,
): Feedback => {
  const baseFeedback: Feedback =
    typeof feedbackInput === 'string'
      ? { event_type: AvailableEventType.SUBMIT, event_name: feedbackInput, target_id: feedbackTraget }
      : feedbackInput;
  return {
    ...baseFeedback,
    ...eventOptions,
    ...(feedbackProperties && { event_properties: feedbackProperties }),
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
