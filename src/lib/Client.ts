import { PluginLike, PluginType } from '@/typings';
import { getDefault } from '@/utils';
import { Extractor, ExtractorManager } from './extractor';

export interface ManagersList {
  extractor?: typeof ExtractorManager;
}

export interface ClientOptions {
  plugins?: PluginLike[];
  managers?: ManagersList;
}

/**
 * Musicca client class
 */
export default class Client {
  public extractors: ExtractorManager;

  constructor(options?: ClientOptions) {
    const extractors = getDefault<Extractor[]>(options?.plugins?.filter((pl) => pl.type === PluginType.Extractor) as Extractor[], []);
    this.extractors = new (getDefault<typeof ExtractorManager>(options?.managers?.extractor, ExtractorManager))(this, extractors);
  }
}