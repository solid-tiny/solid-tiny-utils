import type {
  Accessor,
  AccessorArray,
  OnEffectFunction,
  OnOptions,
} from "solid-js";
import { createEffect, on } from "solid-js";

export function createWatch<S, Next extends Prev, Prev = Next>(
  targets: AccessorArray<S> | Accessor<S>,
  fn: OnEffectFunction<S, undefined | NoInfer<Prev>, Next>,
  opt?: OnOptions
) {
  createEffect(on(targets, fn, opt as { defer: false }));
}
