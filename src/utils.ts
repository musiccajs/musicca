/* eslint-disable import/prefer-default-export */

import { Nullable } from './constants';

/**
 * Get a default value if input is undefined
 * @param {any} input Input value
 * @param {any} def Default value
 * @returns {any}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDefault<T>(input: Nullable<T>, def: T): T {
  if (typeof input === 'object' && !Array.isArray(input) && typeof def === 'object' && !Array.isArray(def)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj = { ...input } as T | any;

    Object
      .keys(newObj)
      .forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newObj[key] = getDefault(newObj[key], (def as T | any)[key]);
      });

    return newObj;
  }

  return input ?? def;
};

/**
 * Generate a random ID
 * @returns {string}
 */
export function generateID(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Check whether input is null or undefined
 * @param {any} input Input
 *
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNullOrUndefined(input: any): boolean {
  return input === undefined || input === null;
}

/**
 * Clamp value to min and max values
 * @param {number} value
 * @param {number} min
 * @param {number} max
 *
 * @returns {number}
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}