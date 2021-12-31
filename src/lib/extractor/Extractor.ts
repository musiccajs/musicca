

import BasePlugin from '../structs/BasePlugin';
import { Awaitable, PluginType } from '@/typings';
import { getDefault } from '@/utils';
import Song from '../structs/Song';

export interface ExtractorOptions {
  priority?: number;
  [key: string]: unknown;
}

/**
 * Extractor plugin
 * @abstract
 */
export default abstract class Extractor extends BasePlugin {
  public name: string;

  public options: ExtractorOptions;

  /**
   * @param {string} name Extractor name
   * @param {ExtractorOptions} [options] Extractor options
   */
  constructor(name: string, options?: ExtractorOptions) {
    super(PluginType.Extractor);

    this.name = name;
    this.options = getDefault<ExtractorOptions>(options, {
      priority: 0
    });
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
  abstract fetch(url: string): Awaitable<ReadableStream>;
}

export type ExtractorResolvable = Extractor | string;