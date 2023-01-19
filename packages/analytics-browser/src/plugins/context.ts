import UAParser from '@amplitude/ua-parser-js';
import { getLanguage } from '@coxwave/analytics-client-common';
import { BeforePlugin, BrowserConfig, Event, PluginType } from '@coxwave/analytics-types';

import { VERSION } from '../version';

const BROWSER_PLATFORM = 'Web';
const IP_ADDRESS = '$remote';
export class Context implements BeforePlugin {
  name = 'context';
  type = PluginType.BEFORE as const;

  // this.config is defined in setup() which will always be called first
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config: BrowserConfig;
  uaResult: UAParser.IResult;
  library = `coxwave-ts/${VERSION}`;

  constructor() {
    let agent: string | undefined;
    /* istanbul ignore else */
    if (typeof navigator !== 'undefined') {
      agent = navigator.userAgent;
    }
    this.uaResult = new UAParser(agent).getResult();
  }

  setup(config: BrowserConfig): Promise<undefined> {
    this.config = config;

    return Promise.resolve(undefined);
  }

  async execute(context: Event): Promise<Event> {
    /**
     * Manages user session triggered by new events
     */
    if (!this.isSessionValid()) {
      // Creates new session
      this.config.sessionId = Date.now();
    } // else use previously creates session
    // Updates last event time to extend time-based session
    this.config.lastEventTime = Date.now();
    const time = new Date().getTime();
    const osName = this.uaResult.browser.name;
    const osVersion = this.uaResult.browser.version;
    const deviceModel = this.uaResult.device.model || this.uaResult.os.name;
    const deviceVendor = this.uaResult.device.vendor;

    const event: Event = {
      distinct_id: this.config.distinctId,
      device_id: this.config.deviceId,
      session_id: this.config.sessionId,
      time,
      ...(this.config.appVersion && { app_version: this.config.appVersion }),
      ...(this.config.trackingOptions.platform && { platform: BROWSER_PLATFORM }),
      ...(this.config.trackingOptions.osName && { os_name: osName }),
      ...(this.config.trackingOptions.osVersion && { os_version: osVersion }),
      ...(this.config.trackingOptions.deviceManufacturer && { device_manufacturer: deviceVendor }),
      ...(this.config.trackingOptions.deviceModel && { device_model: deviceModel }),
      ...(this.config.trackingOptions.language && { language: getLanguage() }),
      ...(this.config.trackingOptions.ipAddress && { ip: IP_ADDRESS }),
      ...context,
      library: this.library,
    };
    return event;
  }

  isSessionValid() {
    const lastEventTime = this.config.lastEventTime || Date.now();
    const timeSinceLastEvent = Date.now() - lastEventTime;
    return timeSinceLastEvent < this.config.sessionTimeout;
  }
}
