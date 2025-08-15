/**
 * return '' if show is true
 *
 * suitable when you want to conditionally apply data attributes
 *
 * @example
 *
 * ```tsx
 *
 * function MyComponent(props:{size:'small'|'medium'|'large'}) {
 *   return <div
 *            data-size-small={dataIf(props.size === 'small')}
 *            data-size-medium={dataIf(props.size === 'medium')}
 *            data-size-large={dataIf(props.size === 'large')}
 *            >Hello</div>;
 * }
 *
 * ```
 */
export function dataIf(show: boolean) {
  return show ? '' : undefined;
}
