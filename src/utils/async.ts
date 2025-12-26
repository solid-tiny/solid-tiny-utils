/**
 * Async wait
 */
export const sleep = (milliseconds: number) => {
  return new Promise((res) => setTimeout(res, milliseconds));
};

export const runAtNextAnimationFrame = (cb: () => void) => {
  return requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cb();
    });
  });
};
