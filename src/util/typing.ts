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
