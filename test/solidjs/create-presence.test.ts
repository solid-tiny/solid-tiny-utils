import { createRoot, createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import { createPresence } from "~/solidjs";

describe("createPresence", () => {
  it("initializes closed when show is false", () => {
    createRoot((dispose) => {
      const [show] = createSignal(false);
      const el = document.createElement("div");
      const [render, state] = createPresence({ show, element: () => el });

      expect(state()).toBe("closed");
      expect(render()).toBe(false);
      dispose();
    });
  });

  it("immediately opens when there is no animation", () => {
    const h = createRoot((dispose) => {
      const [show, setShow] = createSignal(false);
      const el = document.createElement("div");

      const [render, state] = createPresence({ show, element: () => el });

      return {
        render,
        state,
        setShow,
        dispose,
      };
    });

    expect(h.render()).toBe(false);
    expect(h.state()).toBe("closed");

    // open
    h.setShow(true);
    expect(h.render()).toBe(true);
    expect(h.state()).toBe("opened");

    h.dispose();
  });

  it("waits for animationend when element has animation and toggles state on events", () => {
    const h = createRoot((dispose) => {
      const [show, setShow] = createSignal(false);
      const el = document.createElement("div");
      el.style.animationDuration = "100ms";
      const [render, state] = createPresence({ show, element: () => el });

      const fireAnimationEnd = () => {
        el.dispatchEvent(new Event("animationend"));
      };

      return {
        render,
        state,
        setShow,
        fireAnimationEnd,
        dispose,
      };
    });

    h.setShow(true);
    expect(h.render()).toBe(true);
    expect(h.state()).toBe("opening");

    // simulate animation end
    h.fireAnimationEnd();
    expect(h.render()).toBe(true);
    expect(h.state()).toBe("opened");
  });
});
