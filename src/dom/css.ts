import { isClient } from '~/is';

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
export function mountStyle(style: string, id: string, refresh = false) {
  if (!isClient) {
    return;
  }
  if (alreadyInjected.includes(id) && !refresh) {
    return;
  }

  let styleElement = document.querySelector(`style#${id}`);

  if (styleElement) {
    styleElement.innerHTML = style;
    return;
  }

  styleElement = document.createElement('style');
  styleElement.id = id;
  styleElement.innerHTML = style;
  document.head.appendChild(styleElement);
  alreadyInjected.push(id);
}
