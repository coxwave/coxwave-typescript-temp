import {
  ActivityEvent,
  IdentifyEvent,
  SpecialEventName,
  Identify as IIdentify,
  Generation,
  Feedback,
  CustomProperties,
  PredefinedEventProperties,
  PredefinedIdentifyProperties,
  SpecialActivityPropertyKey,
  SpecialGenerationPropertyKey,
  SpecialFeedbackPropertyKey,
  ActivityProperties,
  GenerationProperties,
  FeedbackProperties,
} from '@coxwave/analytics-types';

import { UUID } from './uuid';

export const splitProperties = (
  properties: CustomProperties,
  specialKeys: readonly string[],
): Record<string, CustomProperties> => {
  const specialProperties: CustomProperties = {};
  const customProperties: CustomProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    if (specialKeys.includes(key)) {
      specialProperties[key] = value;
    } else {
      customProperties[key] = value;
    }
  }

  return { specialProperties, customProperties };
};

export const createTrackEvent = (
  activityName: string,
  activityProperties: ActivityProperties = {},
  predefinedProperties: PredefinedEventProperties = {},
): ActivityEvent => {
  const { specialProperties, customProperties } = splitProperties(activityProperties, SpecialActivityPropertyKey);

  predefinedProperties.custom = predefinedProperties.custom
    ? { ...predefinedProperties.custom, ...customProperties }
    : customProperties;

  return {
    id: UUID(),
    eventType: '$track',
    eventName: activityName,
    ...specialProperties,
    properties: predefinedProperties,
  };
};

export const createLogEvent = (
  generationName: string,
  generationProperties: GenerationProperties = {},
  predefinedProperties: PredefinedEventProperties = {},
): Generation => {
  const { specialProperties, customProperties } = splitProperties(generationProperties, SpecialGenerationPropertyKey);

  predefinedProperties.custom = predefinedProperties.custom
    ? { ...predefinedProperties.custom, ...customProperties }
    : customProperties;

  return {
    id: UUID(),
    eventType: '$log',
    eventName: generationName,
    ...specialProperties,
    properties: predefinedProperties,
  };
};

export const createFeedbackEvent = (
  feedbackName: string,
  feedbackProperties: FeedbackProperties,
  predefinedProperties: PredefinedEventProperties = {},
): Feedback => {
  const { specialProperties, customProperties } = splitProperties(feedbackProperties, SpecialFeedbackPropertyKey);

  predefinedProperties.custom = predefinedProperties.custom
    ? { ...predefinedProperties.custom, ...customProperties }
    : customProperties;

  return {
    id: UUID(),
    eventType: '$feedback',
    eventName: feedbackName,
    ...(specialProperties as FeedbackProperties),
    properties: predefinedProperties,
  };
};

export const createRegisterEvent = (distinctId: string): IdentifyEvent => {
  const IdentifyEvent: IdentifyEvent = {
    id: UUID(),
    eventType: '$identify',
    eventName: SpecialEventName.REGISTER,
    distinctId: distinctId,
  };

  return IdentifyEvent;
};

export const createIdentifyEvent = (
  identify: IIdentify,
  predefinedProperties?: PredefinedIdentifyProperties,
): IdentifyEvent => {
  const IdentifyEvent: IdentifyEvent = {
    id: UUID(),
    eventType: '$identify',
    eventName: SpecialEventName.IDENTIFY,
    properties: identify.getUserProperties(),
    ...predefinedProperties,
  };

  return IdentifyEvent;
};

export const createAliasEvent = (alias: string, distinctId: string): IdentifyEvent => {
  const IdentifyEvent: IdentifyEvent = {
    id: UUID(),
    eventType: '$identify',
    eventName: SpecialEventName.ALIAS,
    alias: alias,
    distinctId: distinctId,
  };

  return IdentifyEvent;
};
