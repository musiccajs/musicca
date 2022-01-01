import { Readable } from 'stream';
import { Awaitable, Nullable, PluginType } from '@/constants';
import { BasePlugin, Extractor, Queue, SongResolvable } from '.';
import { Client } from '..';

export interface SongData {
  title: string;
  duration?: number;
  description?: string;
  thumbnail?: string;
  source?: string;
  quality?: string | number;
  [key: string]: unknown;
}

/**
 * Song constructor
 */
export default class Song extends BasePlugin {
  public readonly extractor: Extractor;

  public readonly url: string;

  public readonly data: SongData;

  /**
   * @param {string} url Song url
   * @param {SongData} data Song data
   */
  constructor(extractor: Extractor, url: string, data: SongData, id?: Nullable<string>) {
    super(PluginType.Song, id);

    this.extractor = extractor;
    this.url = url;
    this.data = data;
  }

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

  public static resolve(client: Client, resolvable: SongResolvable): Awaitable<Nullable<Song | Song[]>> {
    if (resolvable instanceof Song) return resolvable;
    if (resolvable instanceof Queue) return resolvable.get(0);
    if (typeof resolvable === 'string') return client.extractors.extract(resolvable);

    return null;
  }
}
