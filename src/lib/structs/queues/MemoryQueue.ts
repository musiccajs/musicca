import { Queue, Media } from '..';

export default class MemoryQueue extends Queue {
  public list: Media[] = [];

  public all() {
    return this.list;
  }

  public add<T extends Media | Media[] = Media>(media: T, position?: number) {
    const wrap = Array.isArray(media) ? media : [media];

    if (!(position === null || position === undefined)) this.list.splice(position as number, 0, ...wrap);
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