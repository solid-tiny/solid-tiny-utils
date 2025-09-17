import type { Accessor } from "solid-js";

export type MaybeArray<T> = T | T[];
export type MaybePromise<T> = T | Promise<T>;
export type MaybeAccessor<T> = T | Accessor<T>;
export type MaybeNullableAccessor<T> = T | Accessor<T | null | undefined>;
