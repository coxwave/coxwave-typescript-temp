import {
  AvailableEventType,
  TrackActivity,
  IdentifyActivity,
  SpecialEventName,
  Identify as IIdentify,
  EventOptions,
  Generation,
  Feedback,
  GenerationProperties,
} from '@coxwave/analytics-types';

export const createTrackEvent = (
  activityInput: TrackActivity | string,
  activityProperties?: Record<string, any>,
  eventOptions?: EventOptions,
): TrackActivity => {
  const baseActivity: TrackActivity =
    typeof activityInput === 'string'
      ? { event_type: AvailableEventType.TRACK, event_name: activityInput }
      : activityInput;
  return {
    ...baseActivity,
    ...eventOptions,
    ...(activityProperties && { activityProperties: activityProperties }),
  };
};

export const createIdentifyEvent = (identify: IIdentify, eventOptions?: EventOptions): IdentifyActivity => {
  const identifyActivity: IdentifyActivity = {
    ...eventOptions,
    event_type: AvailableEventType.TRACK,
    event_name: SpecialEventName.IDENTIFY,
    user_properties: identify.getUserProperties(),
  };

  return identifyActivity;
};

export const createLogEvent = (
  generationInput: Generation | string,
  generationProperties?: GenerationProperties,
  eventOptions?: EventOptions,
): Generation => {
  const baseGeneration: Generation =
    typeof generationInput === 'string'
      ? { event_type: AvailableEventType.LOG, event_name: generationInput }
      : generationInput;
  return {
    ...baseGeneration,
    ...eventOptions,
    ...(generationProperties && { generation_properties: generationProperties }),
  };
};

export const createSubmitEvent = (
  feedbackInput: Feedback | string,
  feedbackTraget?: string,
  feedbackProperties?: Record<string, any>,
  eventOptions?: EventOptions,
): Feedback => {
  const baseFeedback: Feedback =
    typeof feedbackInput === 'string'
      ? { event_type: AvailableEventType.SUBMIT, event_name: feedbackInput, target_id: feedbackTraget as string }
      : feedbackInput;
  return {
    ...baseFeedback,
    ...eventOptions,
    ...(feedbackProperties && { event_properties: feedbackProperties }),
  };
};
