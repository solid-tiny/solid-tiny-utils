export function hasAnimation(element: HTMLElement): boolean {
  const styles = getComputedStyle(element);
  const duration = Number.parseFloat(styles.animationDuration || "0");
  return duration > 0;
}
