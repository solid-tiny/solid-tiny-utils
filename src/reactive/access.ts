import { isFn } from '~/lodash';
import type { MaybeAccessor } from '~/types/maybe';

export function access<T>(value: MaybeAccessor<T>): T {
  return isFn(value) ? value() : value;
}
