import type { MaybeAccessor } from "~/types/maybe";
import { isFn } from "~/utils";

export function access<T>(value: MaybeAccessor<T>): T {
  return isFn(value) ? value() : value;
}
