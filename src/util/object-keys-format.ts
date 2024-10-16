import snakeCase from 'lodash/snakeCase';
import camelCase from 'lodash/camelCase';
import { mapKeysDeep } from 'deepdash-es/standalone';

export type SnakeCase<S extends string> = S extends `${infer T}_${infer Rest}`
  ? `${Lowercase<T>}_${SnakeCase<Rest>}` // Key is already in snake_case
  : S extends `${infer T}${infer Rest}`
    ? T extends Capitalize<T>
      ? `_${Lowercase<T>}${SnakeCase<Rest>}`
      : `${T}${SnakeCase<Rest>}`
    : S;

export type DeepSnakeCase<T> =
  T extends Array<infer U> // Check if T is an array
    ? DeepSnakeCase<U>[] // Process the items of the array
    : T extends object // Check if T is a plain object
      ? {
          [K in keyof T as K extends string ? SnakeCase<K> : K]: T[K] extends Function // Keep methods unchanged
            ? T[K]
            : DeepSnakeCase<T[K]>; // Recursively apply to nested objects
        }
      : T; // Keep primitive types unchanged

export type CamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<CamelCase<U>>}` // Convert each part to camelCase
  : S extends `${infer T}${infer U}`
    ? `${Lowercase<T>}${CamelCase<U>}` // Handle any remaining parts
    : S; // If it's a single segment, return as is

export type DeepCamelCase<T> =
  T extends Array<infer U> // Check if T is an array
    ? DeepCamelCase<U>[] // Process the items of the array
    : T extends object // Check if T is a plain object
      ? {
          [K in keyof T as K extends string ? CamelCase<K> : K]: T[K] extends Function // Keep methods unchanged
            ? T[K]
            : DeepCamelCase<T[K]>; // Recursively apply to nested objects
        }
      : T; // Keep primitive types unchanged

export function convertObjectKeystoCamelCase<T>(obj: T): DeepCamelCase<T> {
  return mapKeysDeep(obj, (_, key) => camelCase(key as string)) as DeepCamelCase<T>;
}

export function convertObjectKeystoSnakeCase<T>(obj: T): DeepSnakeCase<T> {
  return mapKeysDeep(obj, (_, key) => snakeCase(key as string));
}
