/** biome-ignore-all lint/suspicious/noExplicitAny: test */
import { createRoot, createSignal } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createIntersectionObserver } from '~/event';
import { noop } from '~/fn';
import {
  getAllMockedIOInstances,
  getLastMockedIOInstance,
  MockedIntersectionObserver,
} from './mock-intersection-observer';

describe('create intersection observer', () => {
  let div!: HTMLDivElement;
  let img!: HTMLImageElement;
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockedIntersectionObserver);
    div = document.createElement('div');
    img = document.createElement('img');
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create an intersection observer', () => {
    const previousInstanceCount = getAllMockedIOInstances().length;
    const dispose = createRoot((d) => {
      createIntersectionObserver([div], noop);
      return d;
    });
    const newInstanceCount = getAllMockedIOInstances().length;
    expect(previousInstanceCount + 1, 'new instance was not created').toBe(
      newInstanceCount
    );

    const inst = getLastMockedIOInstance();
    const obElements = inst.elements;
    expect(obElements[0], 'element was not observed').toBe(div);
    dispose();
    expect(inst.elements.length, 'elements were not cleaned up').toBe(0);
  });

  it('should observe multiple elements', () => {
    createRoot(() => {
      createIntersectionObserver([div, img], noop);
    });

    const inst = getLastMockedIOInstance();
    expect(inst.elements).toEqual([div, img]);
  });

  it('should observe signal', () => {
    const changeTarget = createRoot(() => {
      const [target, setTarget] = createSignal<HTMLDivElement | null>(null);
      createIntersectionObserver([target], noop);

      return setTarget;
    });
    const inst = getLastMockedIOInstance();
    expect(inst.elements).toEqual([]);
    changeTarget(div);
    expect(inst.elements).toEqual([div]);
    changeTarget(img);
    expect(inst.elements).toEqual([img]);
    changeTarget(null);
    expect(inst.elements).toEqual([]);
  });

  it('options should passed to constructor correctly', () => {
    const options: IntersectionObserverInit = {
      root: document,
      rootMargin: '0px',
      threshold: 0.1,
    };
    createRoot(() => {
      createIntersectionObserver([div], noop, options);
    });
    const inst = getLastMockedIOInstance();
    expect(inst.options).toEqual(options);
  });

  it('callback should called correctly', () => {
    const callback = vi.fn();
    createRoot(() => {
      createIntersectionObserver([div], callback);
    });

    const inst = getLastMockedIOInstance();
    inst.__TEST__callback();
    expect(callback).toBeCalledTimes(1);
  });
});
