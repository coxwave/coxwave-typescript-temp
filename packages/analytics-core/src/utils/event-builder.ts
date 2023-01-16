import {
  AvailableEventType,
  TrackActivity,
  IdentifyActivity,
  SpecialEventName,
  Identify as IIdentify,
  EventOptions,
  Generation,
  Feedback,
  ActivityPropertyType,
  FeedbackPropertyType,
  GenerationPropertyType,
} from '@coxwave/analytics-types';

export const createTrackEvent = (
  activityInput: string,
  activityProperties?: ActivityPropertyType,
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

export const createLogEvent = (
  generationInput: string,
  GenerationPropertyType?: GenerationPropertyType,
  eventOptions?: EventOptions,
): Generation => {
  const baseGeneration: Generation =
    typeof generationInput === 'string'
      ? { event_type: AvailableEventType.LOG, event_name: generationInput }
      : generationInput;
  return {
    ...baseGeneration,
    ...eventOptions,
    ...(GenerationPropertyType && { generation_properties: GenerationPropertyType }),
  };
};

export const createSubmitEvent = (
  feedbackTraget: string,
  feedbackInput: string,
  feedbackProperties?: FeedbackPropertyType,
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

export const createIdentifyEvent = (identify: IIdentify, eventOptions?: EventOptions): IdentifyActivity => {
  const identifyActivity: IdentifyActivity = {
    ...eventOptions,
    event_type: AvailableEventType.TRACK,
    event_name: SpecialEventName.IDENTIFY,
    user_properties: identify.getUserProperties(),
  };

  return identifyActivity;
};
