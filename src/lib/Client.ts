import { PluginLike, PluginType } from '@/typings';
import { getDefault } from '@/utils';
import { QueueManager, Extractor, ExtractorManager, Queue } from './structs';
import { QueueConstructor } from './structs/Queue';

export interface Structs {
  queue: QueueConstructor;
  queueManager?: typeof QueueManager;
  extractorManager?: typeof ExtractorManager;
}

export interface ClientOptions {
  structs: Structs;
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

    const extractors = getDefault<Extractor[]>(options?.plugins?.filter((pl) => pl.type === PluginType.Extractor) as Extractor[], []);
    this.extractors = new (getDefault<typeof ExtractorManager>(options?.structs?.extractorManager, ExtractorManager))(this, extractors);

    this.queues = new (getDefault<typeof QueueManager>(options?.structs?.queueManager, QueueManager))(this, options?.queues);
  }
}