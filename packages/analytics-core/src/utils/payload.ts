import { Event } from '@coxwave/analytics-types';

export const syncServerSpec = (event: Event): Event => {
  const syncedEvent = {
    ...event,
    distinctId: event.properties?.distinctId,
    threadId: event.properties?.threadId,
    name: event.eventName,
    time: event.properties?.time || new Date().getTime(),
  };
  return syncedEvent;
};
