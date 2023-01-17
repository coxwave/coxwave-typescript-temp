import { Payload } from './payload';
import { Response } from './response';

export interface Transport {
  send(serverUrl: string, payload: Payload, projectToken: string): Promise<Response | null>;
}

export enum TransportType {
  XHR = 'xhr',
  Fetch = 'fetch',
}
