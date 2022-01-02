import { Readable } from 'stream';
import { Awaitable, Nullable, PluginType } from '@/constants';
import { BasePlugin, Extractor, Queue, MediaResolvable } from '.';
import { Client } from '..';

export interface MediaData {
  title: string;
  duration?: number;
  description?: string;
  thumbnail?: string;
  source?: string;
  quality?: string | number;
  [key: string]: unknown;
}

/**
 * Media constructor
 */
export default class Media<T extends Extractor = Extractor> extends BasePlugin {
  public readonly extractor: T;

  public readonly url: string;

  public readonly data: MediaData;

  /**
   * @param {string} url Media url
   * @param {MediaData} data Media data
   */
  constructor(extractor: T, url: string, data: MediaData, id?: Nullable<string>) {
    super(PluginType.Media, id);

    this.extractor = extractor;
    this.url = url;
    this.data = data;
  }

  /**
   * Fetch media stream
   *
   * @returns {Promise<Readable>}
   */
  public fetch(): Promise<Readable> {
    return new Promise((resolve, reject) => {
      Promise.resolve().then(async () => {
        try {
          const stream = await this.extractor.fetch(this.url);
          resolve(stream);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Resolve media resolvable to its media object
   * @param {Client} client
   * @param {MediaResolvable} resolvable
   *
   * @returns {Awaitable<Nullable<Media | Media[]>>}
   */
  public static resolve(client: Client, resolvable: MediaResolvable): Awaitable<Nullable<Media | Media[]>> {
    if (resolvable instanceof Media) return resolvable;
    if (resolvable instanceof Queue) return resolvable.get(0);
    if (typeof resolvable === 'string') return client.extractors.extract(resolvable);

    return null;
  }
}
