import {
  ActivityEvent,
  IdentifyEvent,
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
): ActivityEvent => {
  const baseActivity: ActivityEvent = {
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
    properties: { generation_id: feedbackTraget, ...feedbackProperties },
  };

  return {
    ...baseFeedback,
    ...eventOptions,
  };
};

export const createRegisterEvent = (distinct_id: string): IdentifyEvent => {
  const IdentifyEvent: IdentifyEvent = {
    id: UUID(),
    event_type: '$identify',
    event_name: SpecialEventName.REGISTER,
    properties: { distinct_id: distinct_id },
  };

  return IdentifyEvent;
};

export const createIdentifyEvent = (identify: IIdentify, eventOptions?: EventOptions): IdentifyEvent => {
  const IdentifyEvent: IdentifyEvent = {
    id: UUID(),
    event_type: '$identify',
    event_name: SpecialEventName.IDENTIFY,
    properties: identify.getUserProperties(),
    ...eventOptions,
  };

  return IdentifyEvent;
};

export const createAliasEvent = (alias: string, distinct_id: string): IdentifyEvent => {
  const IdentifyEvent: IdentifyEvent = {
    id: UUID(),
    event_type: '$identify',
    event_name: SpecialEventName.ALIAS,
    properties: { alias: alias, distinct_id: distinct_id },
  };

  return IdentifyEvent;
};
