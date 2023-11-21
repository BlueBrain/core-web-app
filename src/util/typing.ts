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
