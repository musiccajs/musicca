import {
  BasePlugin,
  Extractor as ExtractorStruct,
} from '.';

export type PluginLike = ExtractorStruct | BasePlugin;
export type Awaitable<T> = T | Promise<T>;

export enum PluginType {
  Logger = 0,
  Extractor = 1,
  ExtractorManager = 2,
  Queue = 3,
  QueueManager = 4,
}