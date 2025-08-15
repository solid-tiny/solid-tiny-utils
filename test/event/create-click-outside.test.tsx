import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { createSignal } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { createClickOutside } from '~/event';

const TestComponent = () => {
  const [refTrigger, setRefTrigger] = createSignal<HTMLDivElement | null>(null);
  const [refIgnore, setRefIgnore] = createSignal<HTMLDivElement | null>(null);
  const [count, setCount] = createSignal(0);

  createClickOutside(
    refTrigger,
    () => {
      setCount(count() + 1);
    },
    {
      ignore: [refIgnore],
    }
  );

  return (
    <div>
      <div data-testid="inside" ref={setRefTrigger}>
        <p data-testid="inside-inner">{count()}</p>
      </div>
      <div data-testid="ignore" ref={setRefIgnore}>
        ignore
      </div>
      <div data-testid="outside">outside</div>
    </div>
  );
};
const user = userEvent.setup();
describe('createClickOutside', () => {
  it('basic usage', async () => {
    const { getByTestId } = render(() => <TestComponent />);
    const inside = getByTestId('inside');
    const insideInner = getByTestId('inside-inner');
    const ignore = getByTestId('ignore');
    const outside = getByTestId('outside');
    expect(insideInner).toHaveTextContent('0');
    await user.click(inside);
    await user.click(insideInner);
    await user.click(ignore);
    expect(insideInner).toHaveTextContent('0');
    await user.click(outside);
    expect(insideInner).toHaveTextContent('1');

    await user.pointer([{ keys: '[MouseLeft]>', target: inside }]);
    await user.pointer([{ keys: '[/MouseLeft]', target: inside }]);
    expect(insideInner).toHaveTextContent('1');

    await user.pointer([{ keys: '[MouseLeft]>', target: outside }]);
    await user.pointer([{ keys: '[/MouseLeft]', target: inside }]);
    expect(insideInner).toHaveTextContent('2');

    await user.pointer([{ keys: '[MouseLeft]>', target: inside }]);
    await user.pointer([{ keys: '[/MouseLeft]', target: outside }]);
    expect(insideInner).toHaveTextContent('2');
  });
});
