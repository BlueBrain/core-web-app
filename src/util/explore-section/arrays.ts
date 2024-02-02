export default function uniqueArrayOfObjectsByKey<T extends object, U extends keyof T>(
  array: T[],
  key: U
) {
  return Array.from(new Set(array.map((element) => element[key]))).map(
    (val) =>
      ({
        ...array.find((element) => element[key] === val),
      }) as T
  );
}
