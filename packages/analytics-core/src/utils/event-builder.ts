import {
  AvailableEventType,
  ActivityEvent,
  GenerationEvent,
  FeedbackEvent,
  Identify as IIdentify,
  IdentifyRegisterEvent,
  IdentifyAliasEvent,
  IdentifyUserEvent,
  SpecialEventName,
  ActivityProperties,
  GenerationProperties,
  FeedbackProperties,
  PredefinedEventProperties,
  PredefinedIdentifyProperties,
  SpecialActivityPropertyKey,
  SpecialFeedbackPropertyKey,
  SpecialIdentifyPropertyKey,
  ValidPropertyType,
} from '@coxwave/analytics-types';

import { UUID } from './uuid';

type TPropertyRecord = { [key: string]: ValidPropertyType };

export const splitProperties = (properties: TPropertyRecord, specialKeys: readonly string[]) => {
  const specialProperties: TPropertyRecord = {};
  const customProperties: TPropertyRecord = {};

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
  predefinedProperties: PredefinedEventProperties = { custom: {} },
): ActivityEvent => {
  const { specialProperties, customProperties } = splitProperties(activityProperties, SpecialActivityPropertyKey);

  predefinedProperties.custom = predefinedProperties.custom
    ? { ...predefinedProperties.custom, ...customProperties }
    : customProperties;

  return {
    id: UUID(),
    eventType: AvailableEventType.TRACK,
    eventName: activityName,
    ...specialProperties,
    properties: predefinedProperties,
  };
};

export const createLogEvent = (
  generationName: string,
  generationProperties: GenerationProperties = {},
  predefinedProperties: PredefinedEventProperties = {},
): GenerationEvent => {
  const { specialProperties, customProperties } = splitProperties(generationProperties, SpecialActivityPropertyKey);

  predefinedProperties.custom = predefinedProperties.custom
    ? { ...predefinedProperties.custom, ...customProperties }
    : customProperties;

  return {
    id: UUID(),
    eventType: AvailableEventType.LOG,
    eventName: generationName,
    ...specialProperties,
    properties: predefinedProperties,
  };
};

export const createFeedbackEvent = (
  feedbackName: string,
  feedbackProperties: FeedbackProperties,
  predefinedProperties: PredefinedEventProperties = {},
): FeedbackEvent => {
  const { specialProperties, customProperties } = splitProperties(feedbackProperties, SpecialFeedbackPropertyKey);

  predefinedProperties.custom = predefinedProperties.custom
    ? { ...predefinedProperties.custom, ...customProperties }
    : customProperties;

  return {
    id: UUID(),
    eventType: AvailableEventType.FEEDBACK,
    eventName: feedbackName,
    ...(specialProperties as FeedbackProperties),
    properties: predefinedProperties,
  };
};

export const createIdentifyRegisterEvent = (distinctId: string): IdentifyRegisterEvent => {
  const IdentifyRegisterEvent: IdentifyRegisterEvent = {
    id: UUID(),
    eventType: AvailableEventType.IDENTIFY,
    eventName: SpecialEventName.REGISTER,
    distinctId: distinctId,
  };

  return IdentifyRegisterEvent;
};

export const createIdentifyUserEvent = (
  alias: string,
  identify: IIdentify,
  predefinedProperties?: PredefinedIdentifyProperties,
): IdentifyUserEvent => {
  const identifyProperties = identify.getUserProperties();
  const { specialProperties, customProperties } = splitProperties(identifyProperties, SpecialIdentifyPropertyKey);

  const IdentifyUserEvent: IdentifyUserEvent = {
    id: UUID(),
    eventType: AvailableEventType.IDENTIFY,
    eventName: SpecialEventName.IDENTIFY,
    alias: alias,
    // TODO: check this is okay
    ...specialProperties,
    ...predefinedProperties,
    custom: customProperties,
  };

  return IdentifyUserEvent;
};

export const createIdentifyAliasEvent = (alias: string, distinctId: string): IdentifyAliasEvent => {
  const IdentifyAliasEvent: IdentifyAliasEvent = {
    id: UUID(),
    eventType: AvailableEventType.IDENTIFY,
    eventName: SpecialEventName.ALIAS,
    alias: alias,
    distinctId: distinctId,
  };

  return IdentifyAliasEvent;
};
