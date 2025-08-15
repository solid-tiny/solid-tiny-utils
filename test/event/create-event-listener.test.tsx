import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { createSignal } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { createEventListener } from '~/event';

const TestComponent = () => {
  const [refTrigger, setRefTrigger] = createSignal<HTMLDivElement | null>(null);
  const [count, setCount] = createSignal(0);
  const [globalCount, setGlobalCount] = createSignal(0);
  const [trigger, setTrigger] = createSignal<'click' | 'dblclick'>('click');

  const clean = createEventListener(refTrigger, trigger, () => {
    setCount(count() + 1);
  });

  createEventListener(document, 'click', () => {
    setGlobalCount(globalCount() + 1);
  });

  return (
    <div>
      <div data-testid="click-me" ref={setRefTrigger}>
        <p data-testid="inside-inner">{count()}</p>
      </div>
      <div data-testid="global-count">{globalCount()}</div>
      <button data-testid="btn-cleanup" onClick={clean} type="button">
        clean
      </button>
      <button
        data-testid="btn-trigger"
        onClick={() => setTrigger('dblclick')}
        type="button"
      >
        Trigger dblclick
      </button>
    </div>
  );
};
const user = userEvent.setup();
describe('create-event-listener', () => {
  it('basic usage', async () => {
    const { getByTestId } = render(() => <TestComponent />);
    const clickMe = getByTestId('click-me');
    const insideInner = getByTestId('inside-inner');
    const globalCount = getByTestId('global-count');
    const btnCleanup = getByTestId('btn-cleanup');
    const btnTrigger = getByTestId('btn-trigger');
    expect(insideInner).toHaveTextContent('0');
    expect(globalCount).toHaveTextContent('0');
    await user.click(clickMe);
    expect(insideInner).toHaveTextContent('1');
    expect(globalCount).toHaveTextContent('1');
    await user.click(insideInner);
    expect(insideInner).toHaveTextContent('2');
    expect(globalCount).toHaveTextContent('2');
    await user.click(globalCount);
    expect(insideInner).toHaveTextContent('2');
    expect(globalCount).toHaveTextContent('3');

    // change trigger to dblclick
    await user.click(btnTrigger);
    await user.click(clickMe);
    expect(insideInner).toHaveTextContent('2');
    await user.dblClick(clickMe);
    expect(insideInner).toHaveTextContent('3');

    // cleanup
    await user.click(btnCleanup);
    await user.dblClick(clickMe);
    expect(insideInner).toHaveTextContent('3');
    expect(globalCount).toHaveTextContent('10');
  });
});
