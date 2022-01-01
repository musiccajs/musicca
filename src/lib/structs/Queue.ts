import { Readable } from 'stream';
import { Awaitable, Nullable, PluginType } from '@/constants';
import { BasePlugin, MusiccaError, QueueManager, Song, SongResolvable } from '.';

/**
 * Queue class
 * @abstract
 */
export default abstract class Queue extends BasePlugin {
  public readonly manager: QueueManager;

  public position = -1;

  /**
   * @param {TransformOptions} streamOptions Stream option
   */
  constructor(manager: QueueManager, id?: string) {
    super(PluginType.Queue, id);

    this.manager = manager;
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
   * @returns {Awaitable<T>}
   */
  public abstract add<T extends Song | Song[] = Song>(song: T, position?: number): Awaitable<T>;

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
   * Get queue list length
   *
   * @returns {Promise<number>}
   */
  public async size(): Promise<number> {
    const all = await this.all();
    return all.length;
  }

  /**
   * Get previus song object
   *
   * @returns {Promise<Nullable<Song>>}
   */
  public async previous(): Promise<Nullable<Song>> {
    const position = this.position - 1;

    if (position <= -1) return null;

    this.position = position;

    const current = await this.current();
    return current;
  }

  /**
   * Get currently playing song
   *
   * @returns {Promise<Nullable<Song>>}
   */
  public async current(): Promise<Nullable<Song>> {
    return this.get(this.position);
  }

  /**
   * Get next song object
   *
   * @returns {Promise<Nullable<Song>>}
   */
  public async next(): Promise<Nullable<Song>> {
    const max = await this.size() - 1;
    const position = this.position + 1;

    if (position >= max) return null;

    this.position = position;

    const current = await this.current();
    return current;
  }

  /**
   * Play a song directly or from the queue
   * @param {Nullable<Song | number>} resolvable Song resolvable (`number` to reference the song in the list)
   * @param {boolean} [pipeThroughStream] Whether to pipe the song stream to {@link Queue.stream} or not
   *
   * @returns {Promise<Readable>}
   * @throws {MusiccaError}
   */
  public async play(resolvable: SongResolvable | number): Promise<Readable> {
    const resolved = await this.resolveSong(resolvable);
    if (!resolved) throw new MusiccaError('MISSING_ARGUMENT', 'resolvable');

    const stream = await resolved.fetch();
    const position = await this.indexOf(resolved);
    if (position === -1) await this.add(resolved);

    return stream;
  }

  private async resolveSong(resolvable: SongResolvable | number): Promise<Nullable<Song>> {
    if (typeof resolvable === 'number') {
      const res = await this.get(resolvable);
      return res;
    }

    const res = await Song.resolve(this.manager.client, resolvable);

    if (!res) {
      const current = await this.current();
      return current;
    }

    if (Array.isArray(res)) {
      await this.add(res);

      const [first] = res;
      return first;
    }

    return res;
  }
}
