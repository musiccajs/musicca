import {
  BasePlugin,
  Extractor as ExtractorStruct,
} from '.';

export type PluginLike = ExtractorStruct | BasePlugin;

/**
 * @template T
 * @typedef {T | null | undefined} Nullable
 */
export type Nullable<T> = T | null | undefined;

/**
 * @template T
 * @typedef {T | Promise<T>} Awaitable
 */
export type Awaitable<T> = T | Promise<T>;

/**
 * @template T
 * @typedef {new(...args: any[]) => T} Constructor
 */
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