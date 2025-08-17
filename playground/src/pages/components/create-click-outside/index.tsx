import { createSignal, onMount } from 'solid-js';
import { createClickOutside } from '~/index';

export default function Index() {
  const [count, setCount] = createSignal(0);
  let ref!: HTMLDivElement;
  let refIgnore!: HTMLDivElement;

  onMount(() => {
    createClickOutside(ref, () => setCount((c) => c + 1), {
      ignore: [refIgnore],
    });
  });

  return (
    <div class="select-none h-600px">
      <div class="b b-solid b-gray-300 p-2">outside count: {count()}</div>

      <div class="mt-2 px-2 py-8 bg-blue" ref={ref}>
        inside
      </div>
      <div class="mt-5 p-2 bg-red">
        This and other elements except 'inside' and 'ignore me' should trigger
        click-outside callback
      </div>
      <div class="mt-5 p-2 bg-amber" ref={refIgnore}>
        ignore me
      </div>
    </div>
  );
}
