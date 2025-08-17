/**
 * Get entries of an object
 */
export const entries = Object.entries as <T extends object>(
  obj: T
) => [keyof T, T[keyof T]][];

/**
 * Get keys of an object
 */
export const keys = Object.keys as <T extends object>(object: T) => (keyof T)[];
