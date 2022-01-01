

import { Readable } from 'stream';
import { BasePlugin, Song } from '.';
import { Awaitable, PluginType } from '@/constants';
import { getDefault } from '@/utils';

export interface ExtractorOptions {
  priority?: number;
  [key: string]: unknown;
}

/**
 * Extractor plugin
 * @abstract
 */
export default abstract class Extractor<T extends ExtractorOptions = ExtractorOptions> extends BasePlugin {
  public readonly priority: number = 0;

  public name: string;

  public options: Omit<T, 'priority'>;

  /**
   * @param {string} name Extractor name
   * @param {ExtractorOptions} [options] Extractor options
   */
  constructor(name: string, options?: T, id?: string) {
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
   * @returns {Awaitable<Song | Song[]>}
   */
  abstract extract(input: string): Awaitable<Song | Song[]>;

  /**
   * Download data from url extracted from `extract` method to a `Readable` stream
   * @param {string} url Url to download the resource
   *
   * @returns {Awaitable<ReadableStream>}
   */
  abstract fetch(url: string): Awaitable<Readable>;
}