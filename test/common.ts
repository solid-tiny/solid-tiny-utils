import type { OnTestFinishedHandler } from 'vitest';

export function ignoreRejections(
  onTestFinished: (fn: OnTestFinishedHandler, timeout?: number) => void
) {
  onTestFinished(() => {
    // if the event was never called during the test,
    // make sure it's removed before the next test starts
    process.removeAllListeners('unhandledrejection');
  });

  // disable Vitest's rejection handle
  process.on('unhandledRejection', () => {
    // your own handler
  });
}
