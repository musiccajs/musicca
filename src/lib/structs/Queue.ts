import { PassThrough, TransformOptions, Readable } from 'stream';
import { Awaitable, PluginType } from '@/constants';
import { BasePlugin, Song } from '.';

/**
 * Queue class
 * @abstract
 */
export default abstract class Queue extends BasePlugin {
  public playing = false;

  public paused = false;

  public position = -1;

  public readonly stream: PassThrough;

  private playingStream?: Readable;

  /**
   * @param {TransformOptions} streamOptions Stream option
   */
  constructor(streamOptions?: TransformOptions, id?: string) {
    super(PluginType.Queue, id);

    this.stream = new PassThrough(streamOptions);
  }

  public abstract all(): Awaitable<Song[]>;

  public abstract add(song: Song | Song[], position?: number): Awaitable<Song | Song[]>;

  public abstract get(position: number): Awaitable<Song | null>;

  public abstract remove(position: number): Awaitable<Song | null>;

  public abstract removeAll(): Awaitable<void>;

  public async nowPlaying() {
    if (!this.playing || this.paused) return null;

    return this.get(this.position);
  }

  public async play(position: number, pipeThroughStream = true) {
    const song = await this.get(position);
    if (!song) return null;

    const stream = await song.fetch();

    if (!pipeThroughStream) return stream;

    return this.playStream(stream, position);
  }

  public playStream(stream?: Readable, newPosition?: number) {
    if (!stream) {
      if (this.playingStream && this.paused) {
        this.playing = true;
        this.paused = false;
        this.playingStream.resume();
      }

      return null;
    }

    this.stop();

    this.playing = true;
    this.paused = false;
    this.playingStream = stream;
    if (typeof newPosition === 'number') this.position = Math.round(newPosition);

    stream.pipe(this.stream);

    return stream;
  }

  public stop() {
    if ((!this.playing && !this.paused) || !this.playingStream) return;

    this.playingStream.unpipe(this.stream);
    this.playingStream.destroy();
    this.playingStream = undefined;

    this.playing = false;
    this.paused = false;
  }

  public pause() {
    if (this.paused || !this.playingStream) return;

    this.playingStream.pause();
    this.playing = false;
    this.paused = true;
  }
}
