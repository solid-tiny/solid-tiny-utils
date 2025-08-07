// biome-ignore lint/suspicious/noExplicitAny: is used for generic function types
export type AnyFn<R = any> = (...args: any[]) => R;
