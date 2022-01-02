

import { Readable } from 'stream';
import { BasePlugin, Media } from '.';
import { Awaitable, Nullable, PluginType } from '@/constants';
import { getDefault } from '@/utils';

export interface ExtractorOptions {
  priority?: number;
  [key: string]: unknown;
}

/**
 * Extractor plugin
 * @abstract
 */
export abstract class Extractor<T extends ExtractorOptions = ExtractorOptions> extends BasePlugin {
  public readonly priority: number = 0;

  public name: string;

  public options: Omit<T, 'priority'>;

  /**
   * @param {string} name Extractor name
   * @param {ExtractorOptions} [options] Extractor options
   */
  constructor(name: string, options?: Nullable<T>, id?: Nullable<string>) {
    super(PluginType.Extractor, id);

    this.name = name;

    const { priority, ...opts } = getDefault<T>(options, {} as T);

    this.options = opts;
    this.priority = priority ?? 0;
  }

  /**
   * Validate method to determine whether to use this extractor or not
   * @abstract
   * @param {string} input Input to test
   *
   * @returns {boolean}
   */
  abstract validate(input: string): boolean;

  /**
   * Extract input to normalized object
   * @param {string} input Input to extract from
   *
   * @returns {Awaitable<Media | Media[]>}
   */
  abstract extract(input: string): Awaitable<Media | Media[]>;

  /**
   * Download data from url extracted from `extract` method to a `Readable` stream
   * @param {string} url Url to download the resource
   *
   * @returns {Awaitable<Readable>}
   */
  abstract fetch(url: string): Awaitable<Readable>;
}