import { PluginType } from '@/constants';
import Client from '../../Client';
import { BasePlugin, Extractor } from '..';

export type ExtractorResolvable = Extractor | string;

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

  public async extract(input: string) {
    const extractor = this.values().find((ext) => ext.validate(input));
    if (!extractor) return null;

    const extracted = await extractor.extract(input);

    return extracted;
  }

  /**
   * Get all available extractors
   * @returns {Map<string, Extractor>}
   */
  public all() {
    return this.extractors;
  }

  /**
   * Get all extractor as an array, sorted by its priority
   * @returns {Extractor[]}
   */
  public values() {
    return [...this.extractors.values()].sort((a, b) => b.priority - a.priority);
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