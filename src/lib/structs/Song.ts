import { Readable } from 'stream';
import { PluginType } from '@/constants';
import { BasePlugin, Extractor } from '.';

export interface SongData {
  title: string;
  duration?: number;
  description?: string;
  thumbnail?: string;
  source?: string;
  quality?: string | number;
  id?: string;
  [key: string]: unknown;
}

/**
 * Song constructor
 */
export default class Song extends BasePlugin {
  public readonly extractor: Extractor;

  public readonly url: string;

  public readonly data: Omit<SongData, 'id'>;

  /**
   * @param {string} url Song url
   * @param {SongData} data Song data
   */
  constructor(extractor: Extractor, url: string, data: SongData) {
    const { id, ...opts } = data ?? {};
    super(PluginType.Song, id);

    this.extractor = extractor;
    this.url = url;
    this.data = opts as SongData;
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
}