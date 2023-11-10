/**
 * This is a type utlity that helps to spread type combination
 * on hover on the type
 * eg: type = typeA | typeB
 * type logType = Prettify<type>
 * the results: {...spreadedTypeA} | {...spreadedTypeB}
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
