import { Extractor } from '../extractor';

export interface SongData {
  title: string;
  duration: number;
  description?: string;
  thumbnail?: string;
  source?: string;
  quality?: string | number;
  [key: string]: unknown;
}

/**
 * Song constructor
 */
export default class Song {
  public readonly extractor: Extractor;

  public readonly url: string;

  public readonly data?: SongData;

  /**
   * @param {string} url Song url
   * @param {SongData} data Song data
   */
  constructor(extractor: Extractor, url: string, data?: SongData) {
    this.extractor = extractor;
    this.url = url;
    this.data = data;
  }

  public fetch(): Promise<ReadableStream> {
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