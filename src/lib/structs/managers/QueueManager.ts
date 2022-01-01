import { TransformOptions } from 'stream';
import { Constructor, Nullable, PluginType } from '@/constants';
import Client from '../../Client';
import { BasePlugin, MusiccaError, Queue, Song } from '..';

export type QueueResolvable<T extends Queue = Queue> = T | string;
export type SongResolvable = Nullable<Queue | Song | string>;

/**
 * Queue manager
 */
export class QueueManager<T extends Queue = Queue> extends BasePlugin {
  public readonly client: Client;

  public readonly queues: Map<string, T>;

  public readonly queueDefaultOptions?: TransformOptions;

  private readonly struct: Constructor<T>;

  /**
   * @param {Client} client Musicca client
   * @param {Queue[]=} [queues] Initial queues
   */
  constructor(struct: Constructor<T>, client: Client, queues?: Nullable<T[]>) {
    super(PluginType.QueueManager);

    this.client = client;
    this.queues = new Map(queues?.map((queue) => [queue.id, queue]));

    this.struct = struct;
  }

  /**
   * Get default queue constructor set on initiating
   * @returns {Constructor<T>}
   */
  public get Struct() {
    return this.struct;
  }

  /**
   * Get all available queues
   * @returns {Map<string, Queue>}
   */
  public all() {
    return this.queues;
  }

  /**
   * Create a new queue
   * @param {TransformOptions} [options] New queue options
   * @param {Song | Song[]} [songs] New queue initial songs
   * @param {string} [id] New queue ID
   *
   * @returns {T}
   */
  public async create(options?: TransformOptions, songs?: Song | Song[], id?: string) {
    const instance = new this.Struct(this, options ?? this.queueDefaultOptions, id);
    await instance.add(songs ?? []);

    return instance;
  }

  /**
   * Add an queue to the manager
   * @param {T} queue The queue
   *
   * @returns {T}
   * @throws {MusiccaError}
   */
  public add(queue: T) {
    if (this.queues.has(queue.id)) throw new MusiccaError('DUPLICATE_QUEUE', queue);

    this.queues.set(queue.id, queue);
    return queue;
  }

  /**
   * Remove queue from the manager
   * @param {QueueResolvable<T>} resolvable Queue to remove
   * @returns {Queue=}
   */
  public remove(resolvable: QueueResolvable<T>) {
    const queue = this.get(resolvable);

    if (queue) this.queues.delete(queue.id);

    return queue;
  }

  /**
   * Resolve to queue object
   * @param {QueueResolvable<T>} resolvable Queue to resolve
   * @returns {Queue=}
   */
  public get(resolvable: QueueResolvable<T>) {
    const id = this.getId(resolvable);
    return this.queues.get(id);
  }

  /**
   * Resolve to queue's ID
   * @param {QueueResolvable<T>} resolvable Queue to resolve
   * @returns {string=}
   */
  public getId(resolvable: QueueResolvable<T>) {
    if (typeof resolvable === 'string' && this.queues.has(resolvable)) return resolvable;
    return (resolvable as T).id;
  }
}