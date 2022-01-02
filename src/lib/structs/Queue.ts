import { Readable } from 'stream';
import { Awaitable, Nullable, PluginType } from '@/constants';
import { BasePlugin, MusiccaError, QueueManager, Media, MediaResolvable } from '.';

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
   * @returns {Awaitable<Media[]>}
   */
  public abstract all(): Awaitable<Media[]>;

  /**
   * Add a media or an array of medias to the queue
   * @param {Media | Media[]} media Media(s) to add
   * @param {number} [position] Exact position to insert the media(s). (Default is the last position)
   *
   * @returns {Awaitable<T>}
   */
  public abstract add<T extends Media | Media[] = Media>(media: T, position?: number): Awaitable<T>;

  /**
   * Get a media based on the position
   * @param {number} position
   *
   * @returns {Awaitable<Nullable<Media>>}
   */
  public abstract get(position: number): Awaitable<Nullable<Media>>;

  /**
   * Remove a media based on the position
   * @param {number} position
   *
   * @returns {Awaitable<Nullable<Media>>}
   */
  public abstract remove(position: number): Awaitable<Nullable<Media>>;

  /**
   * Clear the queue
   */
  public abstract clear(): Awaitable<void>;

  /**
   * Get index of the media (Similar to {@link Array.indexOf})
   * @param {Media} media Media reference
   */
  public abstract indexOf(media: Media): Awaitable<number>;

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
   * Get previus media object
   *
   * @returns {Promise<Nullable<Media>>}
   */
  public async previous(): Promise<Nullable<Media>> {
    const position = this.position - 1;

    if (position <= -1) return null;

    this.position = position;

    const current = await this.current();
    return current;
  }

  /**
   * Get currently playing media
   *
   * @returns {Promise<Nullable<Media>>}
   */
  public async current(): Promise<Nullable<Media>> {
    return this.get(this.position);
  }

  /**
   * Get next media object
   *
   * @returns {Promise<Nullable<Media>>}
   */
  public async next(): Promise<Nullable<Media>> {
    const max = await this.size() - 1;
    const position = this.position + 1;

    if (position >= max) return null;

    this.position = position;

    const current = await this.current();
    return current;
  }

  /**
   * Play a media directly or from the queue
   * @param {Nullable<Media | number>} resolvable Media resolvable (`number` to reference the media in the list)
   * @param {boolean} [pipeThroughStream] Whether to pipe the media stream to {@link Queue.stream} or not
   *
   * @returns {Promise<Readable>}
   * @throws {MusiccaError}
   */
  public async play(resolvable: MediaResolvable | number): Promise<Readable> {
    const resolved = await this.resolveMedia(resolvable);
    if (!resolved) throw new MusiccaError('INVALID_ARGUMENT', 'resolvable');

    const stream = await resolved.fetch();
    const position = await this.indexOf(resolved);
    if (position === -1) await this.add(resolved);

    return stream;
  }

  private async resolveMedia(resolvable: MediaResolvable | number): Promise<Nullable<Media>> {
    if (typeof resolvable === 'number') {
      const res = await this.get(resolvable);
      return res;
    }

    const res = await Media.resolve(this.manager.client, resolvable);

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
