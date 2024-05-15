/**
 * Let's have tis interface:
 * ```
 * interface Foo {
 *   a: string
 *   b: number
 *   c: string
 * }
 * ```
 * Then, `KeysOfType<Foo, string>` is equivalent to `"a" | "c"`.
 */
export type KeysOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any;
};

/**
 * Example:
 * type Id = { '@id': string }
 * type Name = { name: string }
 *
 * type Person = Id & Name
 *
 * If you try to use Person with { '@id', name } typescript will yell at you
 * with 'Id' and 'Name' are not exist in Person
 * so we should gather all the nested properties types one by one
 *
 * Result:
 * type Person = Unionize<Id & Name>
 * Person = { '@id': string, name: string }
 */
export type Unionize<T extends object> = {
  [k in keyof T]: T[k];
};

type CamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<CamelCase<U>>}`
  : S;

/**
 * A utility type that recursively transforms the keys of an object type from
 * snake_case to camelCase. This transformation preserves the original types
 * of the object's properties.
 *
 * @template T - The type of the object to transform.
 * @returns A new type with camelCase versions of the original keys.
 *
 * @example
 * interface MyInterface {
 *   first_name: string;
 *   last_name: number;
 * }
 * type CamelCased = KeysToCamelCase<MyInterface>;
 * CamelCased is equivalent to:
 * { firstName: string; lastName: number; }
 */
export type KeysToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends Record<string, any>
    ? KeysToCamelCase<T[K]>
    : T[K];
};
