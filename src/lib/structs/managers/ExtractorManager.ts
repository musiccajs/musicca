import { PluginType } from '@/typings';
import Extractor, { ExtractorResolvable } from '../Extractor';
import Client from '../../Client';
import BasePlugin from '../BasePlugin';

/**
 * Extractor manager
 */
export default class ExtractorManager extends BasePlugin {
  public readonly client: Client;

  public readonly extractors: Map<string, Extractor>;

  /**
   * @param {Client} client Musicca client
   * @param {Extractor[]} [extractors] Initial extractors
   */
  constructor(client: Client, extractors?: Extractor[]) {
    super(PluginType.ExtractorManager);

    this.client = client;
    this.extractors = new Map(extractors?.map((extractor) => [extractor.id, extractor]));
  }

  /**
   * Get all available extractors
   * @returns {Map<string, Extractor>}
   */
  public all() {
    return this.extractors;
  }

  /**
   * Add an extractor to the manager
   * @param {Extractor} extractor The extractor
   * @returns {Extractor}
   */
  public add(extractor: Extractor) {
    this.extractors.set(extractor.id, extractor);
    return extractor;
  }

  /**
   * Remove extractor from the manager
   * @param {ExtractorResolvable} resolvable Extractor to remove
   * @returns {Extractor=}
   */
  public remove(resolvable: ExtractorResolvable) {
    const extractor = this.resolve(resolvable);

    if (extractor) this.extractors.delete(extractor.id);

    return extractor;
  }

  /**
   * Resolve to Extractor object
   * @param {ExtractorResolvable} resolvable Extractor to resolve
   * @returns {Extractor=}
   */
  public resolve(resolvable: ExtractorResolvable) {
    const id = this.resolveId(resolvable);
    return this.extractors.get(id);
  }

  /**
   * Resolve to Extractor's ID
   * @param {ExtractorResolvable} resolvable Extractor to resolve
   * @returns {string=}
   */
  public resolveId(resolvable: ExtractorResolvable) {
    if (typeof resolvable === 'string' && this.extractors.has(resolvable)) return resolvable;
    return (resolvable as Extractor).id;
  }
}