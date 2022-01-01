import { TransformOptions } from 'stream';
import { Constructor, PluginType } from '@/constants';
import Client from '../../Client';
import { BasePlugin, Queue, Song } from '..';

export type QueueResolvable<T extends Queue = Queue> = T | string;

/**
 * Queue manager
 */
export default class QueueManager<T extends Queue = Queue> extends BasePlugin {
  public readonly client: Client;

  public readonly queues: Map<string, T>;

  public readonly queueDefaultOptions?: TransformOptions;

  public readonly QueueStruct: Constructor<T>;

  /**
   * @param {Client} client Musicca client
   * @param {Queue[]=} [queues] Initial queues
   */
  constructor(struct: Constructor<T>, client: Client, queues?: T[]) {
    super(PluginType.QueueManager);

    this.client = client;
    this.queues = new Map(queues?.map((queue) => [queue.id, queue]));

    this.QueueStruct = struct;
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
    const instance = new this.QueueStruct(options ?? this.queueDefaultOptions, id);
    await instance.add(songs ?? []);

    return instance;
  }

  /**
   * Add an queue to the manager
   * @param {T} queue The queue
   * @returns {T}
   */
  public add(queue: T) {
    this.queues.set(queue.id, queue);
    return queue;
  }

  /**
   * Remove queue from the manager
   * @param {QueueResolvable<T>} resolvable Queue to remove
   * @returns {Queue=}
   */
  public remove(resolvable: QueueResolvable<T>) {
    const extractor = this.resolve(resolvable);

    if (extractor) this.queues.delete(extractor.id);

    return extractor;
  }

  /**
   * Resolve to queue object
   * @param {QueueResolvable<T>} resolvable Queue to resolve
   * @returns {Queue=}
   */
  public resolve(resolvable: QueueResolvable<T>) {
    const id = this.resolveId(resolvable);
    return this.queues.get(id);
  }

  /**
   * Resolve to queue's ID
   * @param {QueueResolvable<T>} resolvable Queue to resolve
   * @returns {string=}
   */
  resolveId(resolvable: QueueResolvable<T>) {
    if (typeof resolvable === 'string' && this.queues.has(resolvable)) return resolvable;
    return (resolvable as Queue).id;
  }
}