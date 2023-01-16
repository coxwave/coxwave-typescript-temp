import { COXWAVE_PREFIX } from '@coxwave/analytics-core';

export const getCookieName = (apiKey: string, postKey = '', limit = 10) => {
  return [COXWAVE_PREFIX, postKey, apiKey.substring(0, limit)].filter(Boolean).join('_');
};

export const getOldCookieName = (apiKey: string) => {
  return `${COXWAVE_PREFIX.toLowerCase()}_${apiKey.substring(0, 6)}`;
};
