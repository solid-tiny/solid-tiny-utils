import { createAutoAnimate } from "@formkit/auto-animate/solid";
import { For } from "solid-js";
import { createList } from "~/reactive";

export default function Demo() {
  const [list, helpers] = createList([
    {
      name: "Item 1",
    },
  ]);

  const [parent] = createAutoAnimate<HTMLDivElement>();

  const compareByName = (a: { name: string }, b: { name: string }) =>
    a.name.localeCompare(b.name);
  return (
    <div>
      <div ref={parent}>
        <For each={list}>
          {(item, index) => (
            <div class="mb-2 flex h-10 w-full items-center justify-between rounded-md bg-blue-200 px-2">
              <span>{item.name}</span>
              <div class="flex items-center">
                <button
                  disabled={index() === 0}
                  onClick={() => {
                    helpers.move(index(), index() - 1);
                  }}
                  type="button"
                >
                  ↑
                </button>
                <button
                  disabled={index() === list.length - 1}
                  onClick={() => {
                    helpers.move(index(), index() + 1);
                  }}
                  type="button"
                >
                  ↓
                </button>
                <button
                  class="ml-2"
                  onClick={() => {
                    helpers.remove(index());
                  }}
                  type="button"
                >
                  x
                </button>
              </div>
            </div>
          )}
        </For>
        <div class="flex items-center gap-1 rounded-md p-2">
          <button
            disabled={list.length >= 8}
            onClick={() => {
              helpers.insert({ name: `Item ${list.length + 1}` });
            }}
            type="button"
          >
            Add Item
          </button>
          <button
            disabled={helpers.isSortedBy(compareByName)}
            onClick={() => {
              helpers.sort(compareByName);
            }}
            type="button"
          >
            Sort By Name
          </button>
          <button
            disabled={list.length < 2}
            onClick={() => {
              helpers.move(0, list.length - 1);
            }}
            type="button"
          >
            Move Last
          </button>
        </div>
      </div>
    </div>
  );
}
