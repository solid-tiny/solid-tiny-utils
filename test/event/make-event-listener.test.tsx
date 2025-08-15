import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { createSignal, onMount } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { makeEventListener } from '~/event';

const TestComponent = () => {
  let refTrigger!: HTMLDivElement;
  const [count, setCount] = createSignal(0);
  const [globalCount, setGlobalCount] = createSignal(0);

  onMount(() => {
    makeEventListener(refTrigger, 'click', () => {
      setCount(count() + 1);
    });

    makeEventListener('click', () => {
      setGlobalCount(globalCount() + 1);
    });
  });

  return (
    <div>
      <div data-testid="click-me" ref={refTrigger}>
        <p data-testid="inside-inner">{count()}</p>
      </div>
      <div data-testid="global-count">{globalCount()}</div>
    </div>
  );
};
const user = userEvent.setup();
describe('make-event-listener', () => {
  it('basic usage', async () => {
    const { getByTestId } = render(() => <TestComponent />);
    const clickMe = getByTestId('click-me');
    const insideInner = getByTestId('inside-inner');
    const globalCount = getByTestId('global-count');
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
  });
});
