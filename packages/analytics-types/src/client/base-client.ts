import { CoxwaveReturn } from '../coxwave-promise';
import { EventOptions, Identify, GenerationPropertyType } from '../events';
import { Plugin } from '../plugin';
import { Result } from '../result';

export interface BaseClient {
  /**
   * Adds a new plugin.
   *
   * ```typescript
   * const plugin = {
   *   name: 'myPlugin',
   *   type: PluginType.ENRICHMENT,
   *   setup(config: Config) {
   *     return;
   *   },
   *   execute(context: Event) {
   *     return context;
   *   },
   * };
   * coxwave.add(plugin);
   * ```
   */
  add(plugin: Plugin): CoxwaveReturn<void>;

  /**
   * Removes a plugin.
   *
   * ```typescript
   * coxwave.remove('myPlugin');
   * ```
   */
  remove(pluginName: string): CoxwaveReturn<void>;

  /**
   * Tracks user-defined activity, with specified name, optional activity properties and optional overwrites.
   *
   * ```typescript
   * // activity tracking with activity name only
   * track('Page Load');
   *
   * // activity tracking with activity name and additional activity properties
   * track('Page Load', { loadTime: 1000 });
   *
   * // activity tracking with activity name, additional activity properties, and overwritten activity options
   * track('Page Load', { loadTime: 1000 }, { sessionId: -1 });
   *
   * // alternatively, this method is awaitable
   * const result = await track('Page Load').promise;
   * console.log(result.event); // {...}
   * console.log(result.code); // 200
   * console.log(result.message); // "User Activity tracked successfully"
   * ```
   */
  track(
    activityInput: string,
    activityProperties?: Record<string, any>,
    activityOptions?: EventOptions,
  ): CoxwaveReturn<Result>;

  /**
   * Logs model generated generations, with specified name, optional generation properties and optional overwrites.
   *
   * ```typescript
   * // generation logging with generation name only
   * log('Blog-Contents');
   *
   * // generation logging with generation name and additional gneration properties
   * log('Blog-Contents', { input: { foo: { type: "text", value: "hello world"}}, output: { bar: { type: "text", value: "hello world" }}});
   *
   * // generation logging with generation name, additional generation properties, and overwritten generation options
   * log('Blog-Contents', { input: { foo: { type: "text", value: "hello world"}}, output: { bar: { type: "text", value: "hello world" }}}, { sessionId: -1 });
   *
   * // alternatively, this method is awaitable
   * const result = await log('Blog-Contents').promise;
   * console.log(result.event); // {...}
   * console.log(result.code); // 200
   * console.log(result.message); // "Event logged successfully"
   * ```
   */
  log(
    generationInput: string,
    GenerationPropertyType?: GenerationPropertyType,
    generationOptions?: EventOptions,
  ): CoxwaveReturn<Result>;

  /**
   * Submit Feedbacks, with specified name, optional feedback properties and optional overwrites.
   *
   * ```typescript
   * // submit feedback with generation_id and feedback name
   * submit(<generation_id>, 'Thumbs-Up', );
   *
   * // submit feedback with generation_id, feedback name and additional feedback properties
   * submit(<generation_id>, 'rating', { score: 5 });
   *
   * // submit feedback with generation_id, feedback name, additional feedback properties, and overwritten event options
   * submit(<generation_id>, 'rating', { score: 5 }, { sessionId: -1 });
   *
   * // alternatively, this method is awaitable
   * const result = await submit(<generation_id>, 'Thumbs-Up').promise;
   * console.log(result.event); // {...}
   * console.log(result.code); // 200
   * console.log(result.message); // "Feedback Submitted successfully"
   * ```
   */
  submit(
    feedbackTraget: string,
    feedbackInput: string,
    feedbackProperties?: Record<string, number | string | boolean>,
    feedbackOptions?: EventOptions,
  ): CoxwaveReturn<Result>;

  /**
   * Sends an identify event containing user property operations
   *
   * ```typescript
   * const id = new Identify();
   * id.set('colors', ['rose', 'gold']);
   * identify(id);
   *
   * // alternatively, this tracking method is awaitable
   * const result = await identify(id).promise;
   * console.log(result.event); // {...}
   * console.log(result.code); // 200
   * console.log(result.message); // "Event tracked successfully"
   * ```
   */
  identify(identify: Identify, eventOptions?: EventOptions): CoxwaveReturn<Result>;

  /**
   * Sets a new optOut config value. This toggles event tracking on/off.
   *
   *```typescript
   * // Stops tracking
   * setOptOut(true);
   *
   * // Starts/resumes tracking
   * setOptOut(false);
   * ```
   */
  setOptOut(optOut: boolean): void;

  /**
   * Flush all unsent events.
   *
   *```typescript
   * flush();
   * ```
   */
  flush(): CoxwaveReturn<void>;
}
