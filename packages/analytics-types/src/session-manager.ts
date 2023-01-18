export interface UserSession {
  userId?: string;
  distinctId?: string;
  deviceId?: string;
  sessionId?: number;
  threadId?: string;
  lastEventTime?: number;
  optOut: boolean;
}

export interface SessionManagerOptions {
  projectToken: string;
  sessionTimeout: number;
}

export interface SessionManager {
  setSession(session: UserSession): void;
  getSessionId(): number | undefined;
  setSessionId(sessionId?: number): void;
  getThreadId(): string | undefined;
  setThreadId(threadId?: string): void;
  getDeviceId(): string | undefined;
  setDeviceId(deviceId?: string): void;
  getUserId(): string | undefined;
  setUserId(userId?: string): void;
  getDistinctId(): string | undefined;
  setDistinctId(distinctId?: string): void;
  getLastEventTime(): number | undefined;
  setLastEventTime(lastEventTime?: number): void;
  getOptOut(): boolean;
  setOptOut(optOut: boolean): void;
}
