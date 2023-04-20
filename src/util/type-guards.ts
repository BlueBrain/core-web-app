/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-use-before-define */
export function isObject(data: unknown): data is Record<string, unknown> {
  if (!data) return false;
  if (Array.isArray(data)) return false;
  return typeof data === 'object';
}

export function isString(data: unknown): data is string {
  return typeof data === 'string';
}

export function isNumber(data: unknown): data is number {
  return typeof data === 'number';
}

export function isBoolean(data: unknown): data is boolean {
  return typeof data === 'boolean';
}

export function isArrayBuffer(data: unknown): data is ArrayBuffer {
  if (!data) return false;
  return data instanceof ArrayBuffer;
}

export function isStringArray(data: unknown): data is string[] {
  if (!Array.isArray(data)) return false;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of data) {
    if (!isString(item)) return false;
  }
  return true;
}

export function assertNumber(data: unknown, name = 'data'): asserts data is number {
  if (!isNumber(data)) {
    throw Error(`${name} was expected to be a number but we got ${typeof data}!`);
  }
}

export function assertString(data: unknown, name = 'data'): asserts data is string {
  if (!isString(data)) {
    throw Error(`${name} was expected to be a string but we got ${typeof data}!`);
  }
}

export function assertOptionalString(
  data: unknown,
  name = 'data'
): asserts data is string | undefined {
  if (data && !isString(data)) {
    throw Error(`${name} was expected to be a string but we got ${typeof data}!`);
  }
}

export function assertBoolean(data: unknown, name = 'data'): asserts data is boolean {
  if (!isBoolean(data)) {
    throw Error(`${name} was expected to be a boolean but we got ${typeof data}!`);
  }
}

export function assertObject(
  data: unknown,
  name = 'data'
): asserts data is Record<string, unknown> {
  if (!isObject(data)) {
    throw Error(`${name} was expected to be an object but we got ${typeof data}!`);
  }
}

export function assertArrayBuffer(data: unknown, name = 'data'): asserts data is ArrayBuffer {
  if (!isArrayBuffer(data)) {
    throw Error(`${name} was expected to be an ArrayBuffer but we got ${typeof data}!`);
  }
}

export function assertOptionalArrayBuffer(
  data: unknown,
  name = 'data'
): asserts data is ArrayBuffer | undefined {
  if (data && !isArrayBuffer(data)) {
    throw Error(`${name} was expected to be an ArrayBuffer but we got ${typeof data}!`);
  }
}

export type TypeDef =
  | 'boolean'
  | 'null'
  | 'number'
  | 'string'
  | 'undefined'
  | 'unknown'
  | ['number', { min?: number; max?: number }]
  | ['|', ...TypeDef[]]
  | ['?', TypeDef]
  | ['array', TypeDef]
  | [`array(${number})`, TypeDef]
  | ['map', TypeDef]
  | { [name: string]: TypeDef };

export function assertType<T>(data: unknown, type: TypeDef, prefix = 'data'): asserts data is T {
  if (type === 'unknown') return;

  if (type === 'null') {
    if (data !== null) {
      throw Error(`Expected ${prefix} to be null and not a ${typeof data}!`);
    }
    return;
  }
  if (typeof type === 'string') {
    if (typeof data !== type) {
      throw Error(`Expected ${prefix} to be a string and not a ${typeof data}!`);
    }
    return;
  }
  if (Array.isArray(type)) {
    const [kind] = type;
    switch (kind) {
      case 'array':
        assertTypeArray(data, prefix, type);
        return;
      case 'map':
        assertTypeMap(data, prefix, type);
        return;
      case '?':
        assertTypeOptional(data, prefix, type);
        return;
      case '|':
        assertTypeAlternative(data, prefix, type);
        return;
      default:
        if (kind.startsWith('array(')) {
          const size = parseInt(kind.substring('array('.length, kind.length - 1), 10);
          assertTypeArrayWithDimension(data, prefix, type as [unknown, TypeDef], size);
          return;
        }
        throw Error(
          `Don't know how to create a type guard for this kind of type: ${JSON.stringify(type)}`
        );
    }
  }

  if (typeof data !== 'object')
    throw Error(`Expected ${prefix} to be an object and not a ${typeof data}!`);

  const obj = data as { [key: string]: unknown };
  for (const name of Object.keys(type)) {
    if (typeof name !== 'string') continue;

    const objType = type[name];
    if (objType) assertType(obj[name], type[name], `${prefix}.${name}`);
  }
}

function assertTypeArray(data: unknown, prefix: string, type: ['array', TypeDef]) {
  if (!Array.isArray(data))
    throw Error(`Expected ${prefix} to be an array and not a ${typeof data}!`);
  const [, subType] = type;
  for (let i = 0; i < data.length; i += 1) {
    assertType(data[i], subType, `${prefix}[${i}]`);
  }
}

function assertTypeArrayWithDimension(
  data: unknown,
  prefix: string,
  type: [unknown, TypeDef],
  size: number
) {
  if (!Array.isArray(data))
    throw Error(`Expected ${prefix} to be an array and not a ${typeof data}!`);
  if (data.length !== size)
    throw Error(`${prefix} was expected to have a length of ${size}, but we got ${data.length}!`);
  const [, subType] = type;
  for (let i = 0; i < data.length; i += 1) {
    assertType(data[i], subType, `${prefix}[${i}]`);
  }
}

function assertTypeMap(data: unknown, prefix: string, type: ['map', TypeDef]) {
  if (!isObject(data)) throw Error(`Expected ${prefix} to be an object and not a ${typeof data}!`);
  const [, subType] = type;
  for (const key of Object.keys(data)) {
    if (typeof key === 'string') {
      assertType(data[key], subType, `${prefix}[${key}]`);
    }
  }
}

function assertTypeOptional(data: unknown, prefix: string, type: ['?', TypeDef]) {
  if (typeof data === 'undefined') return;

  const [, optionalType] = type;
  assertType(data, optionalType, prefix);
}

function assertTypeAlternative(data: unknown, prefix: string, type: ['|', ...TypeDef[]]) {
  const [, ...altTypes] = type;
  let lastException = Error(
    `No type has been defined for this alternative: ${JSON.stringify(type)}!`
  );
  for (const altType of altTypes) {
    try {
      assertType(data, altType, prefix);
      return;
    } catch (ex) {
      if (ex instanceof Error) lastException = ex;
    }
  }
  throw lastException;
}
