/**
 * Constructs a type based on T and makes properties K optional.
 *
 * @example
 * type User = { name: string, id: string }
 *
 * type UserWithOptionalId = PartialBy<User, 'id'>
 * // this is similar to { name: string, id?: string }
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

/**
 * Constructs a uniot type, properties from the second type take precedence when there is a conflict.
 */
export type Merge<A, B> = Omit<A, keyof B> & B;

export type ErrorComponentProps = {
  error: Error;
  reset: () => void;
};

export type BrainRegionId = string;

export type BrainRegionIdx = number;

export type SelectOption = {
  value: string;
  label: string;
  isDisabled?: boolean;
};

export type ApplicationSection = 'explore' | 'build' | 'simulate';
