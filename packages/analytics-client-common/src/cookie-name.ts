import { COXWAVE_PREFIX } from '@coxwave/analytics-core';

export const getCookieName = (projectToken: string, postKey = '', limit = 10) => {
  return [COXWAVE_PREFIX, postKey, projectToken.substring(0, limit)].filter(Boolean).join('_');
};

export const getOldCookieName = (projectToken: string) => {
  return `${COXWAVE_PREFIX.toLowerCase()}_${projectToken.substring(0, 6)}`;
};
