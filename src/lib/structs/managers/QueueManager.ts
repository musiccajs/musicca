import { Constructor, Nullable, PluginType } from '@/constants';
import Client from '../../Client';
import { BasePlugin, MusiccaError, Queue, Media } from '..';

export type QueueResolvable<T extends Queue = Queue> = T | string;
export type MediaResolvable = Queue | Media | string;

/**
 * Queue manager
 */
export class QueueManager<T extends Queue = Queue> extends BasePlugin {
  public readonly client: Client;

  public readonly list: Map<string, T>;

  private readonly struct: Constructor<T>;

  /**
   * @param {Client} client Musicca client
   * @param {Queue[]=} [queues] Initial queues
   */
  constructor(struct: Constructor<T>, client: Client, queues?: Nullable<T[]>) {
    super(PluginType.QueueManager);

    this.client = client;
    this.list = new Map(queues?.map((queue) => [queue.id, queue]));

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
   * @returns {Map<string, T>}
   */
  public all(): Map<string, T> {
    return this.list;
  }

  /**
   * Create a new queue
   * @param {TransformOptions} [options] New queue options
   * @param {string} [id] New queue ID
   *
   * @returns {T}
   */
  public create(id?: string): T {
    const instance = new this.Struct(this, id);
    this.list.set(instance.id, instance);

    return instance;
  }

  /**
   * Add an queue to the manager
   * @param {T} queue The queue
   *
   * @returns {T}
   * @throws {MusiccaError}
   */
  public add(queue: T): T {
    if (this.list.has(queue.id)) throw new MusiccaError('DUPLICATE_QUEUE', queue);

    this.list.set(queue.id, queue);
    return queue;
  }

  /**
   * Remove queue from the manager
   * @param {QueueResolvable<T>} resolvable Queue to remove
   *
   * @returns {Nullable<T>}
   */
  public remove(resolvable: QueueResolvable<T>): Nullable<T> {
    const queue = this.get(resolvable);

    if (queue) this.list.delete(queue.id);

    return queue;
  }

  /**
   * Resolve to queue object
   * @param {QueueResolvable<T>} resolvable Queue to resolve
   *
   * @returns {Nullable<T>}
   */
  public get(resolvable: QueueResolvable<T>): Nullable<T> {
    const id = this.getId(resolvable);
    if (!id) return null;

    return this.list.get(id);
  }

  /**
   * Resolve to queue's ID
   * @param {QueueResolvable<T>} resolvable Queue to resolve
   *
   * @returns {string | undefined}
   */
  public getId(resolvable: QueueResolvable<T>): string | undefined {
    if (typeof resolvable === 'string' && this.list.has(resolvable)) return resolvable;

    return (resolvable as T)?.id;
  }
}