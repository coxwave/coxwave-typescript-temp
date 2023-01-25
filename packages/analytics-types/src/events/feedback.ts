import { BaseEvent } from './base-event';

export const SpecialFeedbackPropertyKey = ['generation_id'] as const;
export type TSpecialFeedbackPropertyKey = (typeof SpecialFeedbackPropertyKey)[number];

export interface FeedbackProperties extends Record<string, any> {
  generation_id: string;
}

export interface FeedbackEvent extends BaseEvent, FeedbackProperties {}
