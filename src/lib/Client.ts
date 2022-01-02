import { Constructor, PluginLike, PluginType } from '@/constants';
import { getDefault } from '@/utils';
import { QueueManager, Extractor, ExtractorManager, Queue } from './structs';

export interface Structs<T extends Queue> {
  queue: Constructor<T>;
}

export interface ClientOptions<T extends Queue = Queue> {
  plugins?: PluginLike[];
  structs: Structs<T>;
}

/**
 * Musicca client class
 */
export class Client<T extends Queue = Queue> {
  public readonly options: ClientOptions<T>;

  public extractors: ExtractorManager;

  public queues: QueueManager<T>;

  constructor(options: ClientOptions<T>) {
    this.options = options ?? {};

    const extractors = getDefault<Extractor[]>(options?.plugins?.filter((pl) => pl.type === PluginType.Extractor) as Extractor[], []);
    this.extractors = new ExtractorManager(this, extractors);

    const queueStruct = options?.structs?.queue;
    this.queues = new QueueManager<T>(queueStruct, this);
  }
}