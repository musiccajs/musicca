import { Nullable, PluginType } from '@/constants';
import Client from '../../Client';
import { BasePlugin, Extractor, MusiccaError, Media } from '..';

export type ExtractorResolvable = Extractor | string;

/**
 * Extractor manager
 */
export class ExtractorManager extends BasePlugin {
  public readonly client: Client;

  public readonly list: Map<string, Extractor>;

  /**
   * @param {Client} client Musicca client
   * @param {Extractor[]} [extractors] Initial extractors
   */
  constructor(client: Client, extractors?: Nullable<Extractor[]>) {
    super(PluginType.ExtractorManager);

    this.client = client;
    this.list = new Map(extractors?.map((extractor) => [extractor.id, extractor]));
  }

  /**
   * Try to loop through all exteractor and call {@link Extractor.extract} if match
   * @param {string} input Input to pass to extractor
   *
   * @returns {Promise<Nullable<Media | Media[]>>}
   */
  public async extract(input: string): Promise<Media | Media[] | null> {
    if (!input) return null;

    const extractor = this.values().find((ext) => ext.validate(input));
    if (!extractor) return null;

    const extracted = await extractor.extract(input);

    return extracted;
  }

  /**
   * Get all available extractors
   *
   * @returns {Map<string, Extractor>}
   */
  public all() {
    return this.list;
  }

  /**
   * Get all extractor as an array, sorted by its priority
   * @returns {Extractor[]}
   */
  public values() {
    return [...this.list.values()].sort((a, b) => b.priority - a.priority);
  }

  /**
   * Add an extractor to the manager
   * @param {Extractor} extractor The extractor
   *
   * @returns {Extractor}
   * @throws {MusiccaError}
   */
  public add<T extends Extractor = Extractor>(extractor: T) {
    if (this.list.has(extractor.id)) throw new MusiccaError('DUPLICATE_EXTRACTOR', extractor);

    this.list.set(extractor.id, extractor);
    return extractor;
  }

  /**
   * Remove extractor from the manager
   * @param {ExtractorResolvable} resolvable Extractor to remove
   *
   * @returns {Nullable<Extractor>}
   */
  public remove(resolvable: ExtractorResolvable) {
    const extractor = this.get(resolvable);

    if (extractor) this.list.delete(extractor.id);

    return extractor;
  }

  /**
   * Resolve to Extractor object
   * @param {ExtractorResolvable} resolvable Extractor to resolve
   *
   * @returns {Nullable<T>}
   */
  public get<T extends Extractor = Extractor>(resolvable: ExtractorResolvable): Nullable<T> {
    const id = this.getId(resolvable);
    if (!id) return null;

    return this.list.get(id) as T | undefined;
  }

  /**
   * Resolve to Extractor's ID
   * @param {ExtractorResolvable} resolvable Extractor to resolve
   *
   * @returns {string | undefined}
   */
  public getId(resolvable: ExtractorResolvable): string | undefined {
    if (typeof resolvable === 'string' && this.list.has(resolvable)) return resolvable;

    return (resolvable as Extractor)?.id;
  }
}