import { TransformOptions } from 'stream';
import { PluginType } from '@/typings';
import Client from '../../Client';
import { BasePlugin, Queue, Song, QueueConstructor } from '..';

export type QueueResolvable = Queue | string;

/**
 * Queue manager
 */
export default class QueueManager extends BasePlugin {
  public readonly client: Client;

  public readonly queues: Map<string, Queue>;

  public readonly queueDefaultOptions?: TransformOptions;

  public readonly QueueStruct: QueueConstructor;

  /**
   * @param {Client} client Musicca client
   * @param {Queue[]=} [queues] Initial queues
   */
  constructor(client: Client, queues?: Queue[]) {
    super(PluginType.QueueManager);

    this.client = client;
    this.queues = new Map(queues?.map((queue) => [queue.id, queue]));

    this.QueueStruct = this.client.options.structs.queue;
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
   * @returns {Queue}
   */
  public async create(options?: TransformOptions, songs?: Song | Song[], id?: string) {
    const instance = new this.QueueStruct(options ?? this.queueDefaultOptions, id);
    await instance.add(songs ?? []);

    return instance;
  }

  /**
   * Add an extractor to the manager
   * @param {Queue} extractor The extractor
   * @returns {Queue}
   */
  public add(extractor: Queue) {
    this.queues.set(extractor.id, extractor);
    return extractor;
  }

  /**
   * Remove extractor from the manager
   * @param {QueueResolvable} resolvable Queue to remove
   * @returns {Queue=}
   */
  public remove(resolvable: QueueResolvable) {
    const extractor = this.resolve(resolvable);

    if (extractor) this.queues.delete(extractor.id);

    return extractor;
  }

  /**
   * Resolve to Queue object
   * @param {QueueResolvable} resolvable Queue to resolve
   * @returns {Queue=}
   */
  public resolve(resolvable: QueueResolvable) {
    const id = this.resolveId(resolvable);
    return this.queues.get(id);
  }

  /**
   * Resolve to Queue's ID
   * @param {QueueResolvable} resolvable Queue to resolve
   * @returns {string=}
   */
  resolveId(resolvable: QueueResolvable) {
    if (typeof resolvable === 'string' && this.queues.has(resolvable)) return resolvable;
    return (resolvable as Queue).id;
  }
}