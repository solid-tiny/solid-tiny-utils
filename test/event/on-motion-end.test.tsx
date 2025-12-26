import { render } from "@solidjs/testing-library";
import { createSignal, onMount } from "solid-js";
import { describe, expect, it } from "vitest";
import { createOnMotionEnd } from "~/event";

const TestComponent = () => {
  const [ref, setRef] = createSignal<HTMLDivElement | undefined>(undefined);
  const [ended, setEnded] = createSignal(false);

  onMount(() => {
    createOnMotionEnd(ref, () => {
      setEnded(true);
    });
  });

  return (
    <div>
      <div
        data-testid="box"
        ref={setRef}
        // inline style so computed style reflects a transition when `createOnMotionEnd` runs
        role="button"
        style={{}}
      >
        {ended() ? "ended" : "pending"}
      </div>
    </div>
  );
};

describe("createOnMotionEnd", () => {
  it("recognizes a basic transition", () => {
    const { getByTestId } = render(() => <TestComponent />);
    const box = getByTestId("box");
    expect(box).toHaveTextContent("pending");

    box.dispatchEvent(
      new TransitionEvent("transitionend", {
        propertyName: "opacity",
      })
    );

    expect(box).toHaveTextContent("ended");
  });
});
