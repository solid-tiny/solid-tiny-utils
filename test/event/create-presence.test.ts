import { createRoot, createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import { createPresence } from "../../src/event";

describe("createPresence", () => {
  it("initializes closed when show is false", () => {
    createRoot((dispose) => {
      const [show] = createSignal(false);
      const el = document.createElement("div");
      const presence = createPresence({ show, element: () => el });

      expect(presence.state()).toBe("closed");
      expect(presence.show()).toBe(false);
      dispose();
    });
  });

  it("immediately opens when there is no animation", () => {
    const h = createRoot((dispose) => {
      const [show, setShow] = createSignal(false);
      const el = document.createElement("div");

      const presence = createPresence({ show, element: () => el });

      return {
        presence,
        setShow,
        dispose,
      };
    });

    expect(h.presence.show()).toBe(false);
    expect(h.presence.state()).toBe("closed");

    // open
    h.setShow(true);
    expect(h.presence.show()).toBe(true);
    expect(h.presence.state()).toBe("opened");

    h.dispose();
  });

  it("waits for animationend when element has animation and toggles state on events", () => {
    const h = createRoot((dispose) => {
      const [show, setShow] = createSignal(false);
      const el = document.createElement("div");
      el.style.animationDuration = "100ms";
      const presence = createPresence({ show, element: () => el });

      const fireAnimationEnd = () => {
        el.dispatchEvent(new Event("animationend"));
      };

      return {
        presence,
        setShow,
        fireAnimationEnd,
        dispose,
      };
    });

    h.setShow(true);
    expect(h.presence.show()).toBe(true);
    expect(h.presence.state()).toBe("opening");

    // simulate animation end
    h.fireAnimationEnd();
    expect(h.presence.show()).toBe(true);
    expect(h.presence.state()).toBe("opened");
  });
});
