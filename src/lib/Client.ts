import { Constructor, PluginLike, PluginType } from '@/typings';
import { getDefault } from '@/utils';
import { MemoryQueue } from '..';
import { QueueManager, Extractor, ExtractorManager, Queue } from './structs';

export interface Structs {
  queue?: Constructor<Queue>;
  queueManager?: typeof QueueManager;
  extractorManager?: typeof ExtractorManager;
}

export interface ClientOptions {
  structs?: Structs;
  plugins?: PluginLike[];
  queues?: Queue[];
}

/**
 * Musicca client class
 */
export default class Client {
  public readonly options: ClientOptions;

  public extractors: ExtractorManager;

  public queues: QueueManager;

  constructor(options: ClientOptions) {
    this.options = options;

    const cExtractorManager = options?.structs?.extractorManager;
    const extractors = getDefault<Extractor[]>(options?.plugins?.filter((pl) => pl.type === PluginType.Extractor) as Extractor[], []);
    this.extractors = new (getDefault<typeof ExtractorManager>(cExtractorManager, ExtractorManager))(this, extractors);

    const cQueueManager = options?.structs?.queueManager;
    const queueStruct = options?.structs?.queue ?? MemoryQueue;
    const queues = options?.queues;
    this.queues = new (getDefault<typeof QueueManager>(cQueueManager, QueueManager))(queueStruct, this, queues);
  }
}