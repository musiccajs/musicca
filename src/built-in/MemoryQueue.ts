import { Queue, Song } from '..';

export default class MemoryQueue extends Queue {
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

  public removeAll() {
    this.list = [];
  }
}