import type { JSX } from "solid-js/jsx-runtime";
import { access } from "~/solidjs";
import { isClient } from "~/utils";

const alreadyInjected: string[] = [];

/**
 * Mounts a style element to the document head.
 * If the style element with the given id already exists, it updates its content.
 * If `refresh` is true, it will update the style even if it has already been injected.
 * Note: This function should only be called in a client environment or `onMount`
 *
 * @param style - The CSS style to inject.
 * @param id - The id of the style element.
 * @param refresh - Whether to refresh the style if it already exists. Defaults to **false**.
 */
export function mountStyle(
  style: string | (() => string),
  id: string,
  refresh = false
) {
  if (!isClient) {
    return;
  }
  if (alreadyInjected.includes(id) && !refresh) {
    return;
  }

  let styleElement = document.querySelector(`style#${id}`);

  if (styleElement) {
    styleElement.textContent = access(style);
    return;
  }

  styleElement = document.createElement("style");
  styleElement.id = id;
  styleElement.textContent = access(style);
  document.head.appendChild(styleElement);
  alreadyInjected.push(id);
}

const extractCSSregex = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;
export function stringStyleToObject(style: string): JSX.CSSProperties {
  const object: Record<string, string> = {};
  let match: RegExpExecArray | null = extractCSSregex.exec(style);
  while (match) {
    if (match[1] && match[2]) {
      object[match[1]] = match[2];
    }
    match = extractCSSregex.exec(style);
  }
  return object;
}

export function combineStyle(
  a: JSX.CSSProperties,
  b: JSX.CSSProperties | string | undefined
): JSX.CSSProperties | string {
  const bb = typeof b === "string" ? stringStyleToObject(b) : b;
  return { ...a, ...bb };
}

export function combineClass(
  defaultClass: string,
  ...otherClass: (string | undefined | null)[]
) {
  return [defaultClass, ...otherClass].filter(Boolean).join(" ");
}
