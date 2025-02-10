/**
 * A type-safe version of `Object.keys` that ensures the returned keys are of type `K`.
 * @typeParam T - The type of the object.
 * @typeParam K - The string keys of `T` (defaults to extracted string keys of `T`).
 * @param obj - The object whose keys are to be retrieved.
 * @returns An array of keys of the object, strongly typed as `K[]`.
 */
export const objectKeys = Object.keys as <
  T extends Record<string, any>,
  K extends keyof T = Extract<keyof T, string>,
>(
  obj: T,
) => K[];

/**
 * A type-safe version of `Object.values` that ensures the returned values are of type `T[K]`.
 * @typeParam T - The type of the object.
 * @typeParam K - The string keys of `T` (defaults to extracted string keys of `T`).
 * @param obj - The object whose values are to be retrieved.
 * @returns An array of values of the object, strongly typed as `Array<T[K]>`.
 */
export const objectValues = Object.values as <
  T extends Record<string, any>,
  K extends keyof T = Extract<keyof T, string>,
>(
  obj: T,
) => T[K][];

/**
 * A type-safe version of `Object.entries` that ensures the returned entries are of type `[K, V]`.
 * @typeParam T - The type of the object.
 * @typeParam K - The string keys of `T` (defaults to extracted string keys of `T`).
 * @typeParam V - The value type of the object keys (defaults to `T[K]`).
 * @param obj - The object whose entries are to be retrieved.
 * @returns An array of key-value pairs of the object, strongly typed as `Array<[K, V]>`.
 */
export const objectEntries = Object.entries as <
  T extends Record<string, any>,
  K extends keyof T = Extract<keyof T, string>,
  V = T[K],
>(
  obj: T,
) => [K, V][];
