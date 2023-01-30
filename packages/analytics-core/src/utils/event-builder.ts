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
  SpecialActivityPropertyKey,
  SpecialFeedbackPropertyKey,
  SpecialIdentifyPropertyKey,
  ValidPropertyType,
  SpecialGenerationPropertyKey,
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

export const createTrackEvent = (activityName: string, activityProperties: ActivityProperties = {}): ActivityEvent => {
  const { specialProperties, customProperties } = splitProperties(activityProperties, SpecialActivityPropertyKey);

  return {
    id: UUID(),
    eventType: AvailableEventType.TRACK,
    eventName: activityName,
    ...specialProperties,
    properties: customProperties,
  };
};

export const createLogEvent = (
  generationName: string,
  generationProperties: GenerationProperties = {},
): GenerationEvent => {
  const { specialProperties, customProperties } = splitProperties(generationProperties, SpecialGenerationPropertyKey);

  return {
    id: UUID(),
    eventType: AvailableEventType.LOG,
    eventName: generationName,
    ...specialProperties,
    properties: customProperties,
  };
};

export const createFeedbackEvent = (feedbackName: string, feedbackProperties: FeedbackProperties): FeedbackEvent => {
  const { specialProperties, customProperties } = splitProperties(feedbackProperties, SpecialFeedbackPropertyKey);

  return {
    id: UUID(),
    eventType: AvailableEventType.FEEDBACK,
    eventName: feedbackName,
    ...(specialProperties as FeedbackProperties),
    properties: customProperties,
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

export const createIdentifyUserEvent = (alias: string, identify?: IIdentify): IdentifyUserEvent => {
  const identifyProperties = identify?.getUserProperties() || {};
  const { specialProperties, customProperties } = splitProperties(identifyProperties, SpecialIdentifyPropertyKey);

  const IdentifyUserEvent: IdentifyUserEvent = {
    id: UUID(),
    eventType: AvailableEventType.IDENTIFY,
    eventName: SpecialEventName.IDENTIFY,
    alias: alias,
    // TODO: check this is okay
    ...specialProperties,
    ...customProperties,
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
