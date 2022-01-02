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
  Extractor = 0,
  ExtractorManager = 1,
  Queue = 2,
  QueueManager = 3,
  Media = 4
}