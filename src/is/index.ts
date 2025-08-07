// biome-ignore lint/complexity/noBannedTypes: is Function
export function isFn(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}
