/* eslint-disable max-classes-per-file */
import { Readable } from 'stream';
import { randomBytes } from 'crypto';
import { Extractor, Queue, Media, Utils } from '../src';

export class MemoryQueue extends Queue {
  public list: Media[] = [];

  public all() {
    return this.list;
  }

  public add<T extends Media | Media[] = Media>(media: T, position?: number) {
    const wrap = Array.isArray(media) ? media : [media];

    if (Utils.isNullOrUndefined(position)) this.list.splice(position as number, 0, ...wrap);
    else this.list.push(...wrap);

    return media;
  }

  public get(position: number) {
    return this.list[position];
  }

  public remove(position: number) {
    return this.list.splice(position, 1)[0];
  }

  public clear() {
    this.list = [];
  }

  public indexOf(media: Media) {
    return this.list.indexOf(media);
  }
}

export class RandomReadable extends Readable {
  public readonly name: string;

  constructor(name: string) {
    super();

    this.name = name;
  }

  // eslint-disable-next-line no-underscore-dangle
  public _read(size: number): void {
    this.push(randomBytes(size));
  }
}

export class FooExtractor extends Extractor {
  constructor() {
    super('foo-extractor', undefined, 'foo');
  }

  validate(input: string) {
    return /foo$/.test(input);
  }

  extract(input: string): Media {
    return new Media(this, `https://foo.example.com/${input}`, {
      title: input
    }, 'foo');
  }

  fetch() {
    return new RandomReadable('foo');
  }
}

export class BarExtractor extends Extractor {
  constructor() {
    super('bar-extractor', undefined, 'bar');
  }

  validate(input: string) {
    return /bar$/.test(input);
  }

  extract(input: string): Media {
    return new Media(this, `https://bar.example.com/${input}`, {
      title: input
    }, 'bar');
  }

  fetch() {
    return new RandomReadable('bar');
  }
}

export class TacExtractor extends Extractor {
  constructor() {
    super('tac-extractor', undefined, 'tac');
  }

  validate(input: string) {
    return /tac$/.test(input);
  }

  extract(input: string): Media {
    return new Media(this, `https://tac.example.com/${input}`, {
      title: input
    }, 'tac');
  }

  fetch() {
    return new RandomReadable('tac');
  }
}