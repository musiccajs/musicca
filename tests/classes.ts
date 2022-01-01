/* eslint-disable max-classes-per-file */
import { Readable } from 'stream';
import { randomBytes } from 'crypto';
import { Extractor, Queue, Song } from '../src';

// TEMP
export class MemoryQueue extends Queue {
  public list: Song[] = [];

  public all() {
    return this.list;
  }

  public add(song: Song | Song[], position = 0) {
    const wrap = Array.isArray(song) ? song : [song];
    this.list.splice(position, 0, ...wrap);

    return song;
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

  public indexOf(song: Song) {
    return this.list.indexOf(song);
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

  extract(input: string): Song {
    return new Song(this, `https://foo.example.com/${input}`, {
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

  extract(input: string): Song {
    return new Song(this, `https://bar.example.com/${input}`, {
      title: input
    }, 'bar');
  }

  fetch() {
    return new RandomReadable('bar');
  }
}