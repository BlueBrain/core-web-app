import { isBoolean, isString } from '@/util/type-guards';

export function isTracable(
  method: string,
  criteria: boolean | string | string[] | RegExp | ((method: string) => boolean)
) {
  if (isBoolean(criteria)) return criteria === true;
  if (isString(criteria)) return criteria === method;
  if (Array.isArray(criteria)) return criteria.includes(method);
  if (criteria instanceof RegExp) {
    // eslint-disable-next-line no-param-reassign
    criteria.lastIndex = -1;
    return criteria.test(method);
  }
  return criteria(method);
}

/**
 * It can be useful to trace some calls in the console.
 * `createDebugToggler` returns a function which willonly log
 * methods that are allowed to be.
 * @param arg Different ways on filtering entrypoints:
 *  * `false`: no trace at all.
 *  * `true`: trace all entrypoints.
 *  * `string`: trace entrypoints whose name contains `arg`.
 *  * `string[]`: trace only entrypoints whose names are in the array `arg`.
 *  * `(method: string) => boolean`: custom function.
 */
export function makeDebugToggler(
  criteria: boolean | string | string[] | ((method: string) => boolean)
): (prefix: string, method: string, data: unknown) => void {
  return (prefix: string, method: string, data: unknown) => {
    if (!isTracable(method, criteria)) return;
    // eslint-disable-next-line no-console
    console.log(prefix, method, data);
  };
}
