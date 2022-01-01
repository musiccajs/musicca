import { PassThrough, TransformOptions, Readable } from 'stream';
import { Awaitable, Nullable, PluginType } from '@/constants';
import { BasePlugin, MusiccaError, QueueManager, Song, SongResolvable } from '.';
import { isNullOrUndefined } from '@/utils';

/**
 * Queue class
 * @abstract
 */
export default abstract class Queue extends BasePlugin {
  public readonly manager: QueueManager;

  public playing = false;

  public paused = false;

  public position = -1;

  public readonly stream: PassThrough;

  private playingStream?: Readable;

  /**
   * @param {TransformOptions} streamOptions Stream option
   */
  constructor(manager: QueueManager, streamOptions?: TransformOptions, id?: string) {
    super(PluginType.Queue, id);

    this.manager = manager;
    this.stream = new PassThrough(streamOptions);
  }

  /**
   * Get all queue list in array
   *
   * @returns {Awaitable<Song[]>}
   */
  public abstract all(): Awaitable<Song[]>;

  /**
   * Add a song or an array of songs to the queue
   * @param {Song | Song[]} song Song(s) to add
   * @param {number} [position] Exact position to insert the song(s). (Default is the last position)
   *
   * @returns {Awaitable<Song | Song[]>}
   */
  public abstract add(song: Song | Song[], position?: number): Awaitable<Song | Song[]>;

  /**
   * Get a song based on the position
   * @param {number} position
   *
   * @returns {Awaitable<Nullable<Song>>}
   */
  public abstract get(position: number): Awaitable<Nullable<Song>>;

  /**
   * Remove a song based on the position
   * @param {number} position
   *
   * @returns {Awaitable<Nullable<Song>>}
   */
  public abstract remove(position: number): Awaitable<Nullable<Song>>;

  /**
   * Clear the queue
   */
  public abstract clear(): Awaitable<void>;

  /**
   * Get index of the song (Similar to {@link Array.indexOf})
   * @param {Song} song Song reference
   */
  public abstract indexOf(song: Song): Awaitable<number>;

  /**
   * Get currently playing song
   *
   * @returns {Promise<Nullable<Song>>}
   */
  public async nowPlaying() {
    if (!this.playing || this.paused) return null;

    return this.get(this.position);
  }

  /**
   * Play a song directly or from the queue
   * @param {Nullable<Song | number>} resolvable Song resolvable (`number` to reference the song in the list)
   * @param {boolean} [pipeThroughStream] Whether to pipe the song stream to {@link Queue.stream} or not
   *
   * @returns {Readable}
   * @throws {MusiccaError}
   */
  public async play(resolvable: SongResolvable | number, pipeThroughStream = true) {
    // eslint-disable-next-line no-param-reassign
    if (typeof resolvable === 'number') resolvable = await this.get(resolvable) as Song;
    if (typeof resolvable === 'string') {
      const res = await this.manager.client.extractors.extract(resolvable) as Song | Song[];
      if (Array.isArray(res)) {
        const [first] = res;
        // eslint-disable-next-line prefer-destructuring, no-param-reassign
        resolvable = first;
        await this.add(res);
      }
      // eslint-disable-next-line no-param-reassign
      else resolvable = res;
    }
    // eslint-disable-next-line no-param-reassign
    if (resolvable instanceof Queue) resolvable = await resolvable.get(0) as Song;

    // Final runtime check
    if (isNullOrUndefined(resolvable)) throw new MusiccaError('MISSING_ARGUMENT', 'resolvable');

    const stream = await resolvable.fetch();
    let position = typeof resolvable === 'number'
      ? resolvable
      : await this.indexOf(resolvable);

    if (position === -1) {
      await this.add(resolvable);
      position = await this.indexOf(resolvable);
    }

    if (!pipeThroughStream) return stream;

    return this.playStream(stream, position) as Readable;
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
