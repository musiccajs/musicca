import {
  BasePlugin,
  Extractor as ExtractorStruct,
} from '.';

export type PluginLike = ExtractorStruct | BasePlugin;
export type Nullable<T> = T | null | undefined;
export type Awaitable<T> = T | Promise<T>;
export interface Constructor<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(...args: any): T;
}

export enum PluginType {
  Logger = 0,
  Extractor = 1,
  ExtractorManager = 2,
  Queue = 3,
  QueueManager = 4,
  Song = 5
}