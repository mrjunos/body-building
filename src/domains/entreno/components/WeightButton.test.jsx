import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WeightButton } from './WeightButton.jsx';

beforeEach(() => {
  vi.useFakeTimers();
  // jsdom has no PointerEvent: keep pointer identity and button fields in tests.
  vi.stubGlobal('PointerEvent', class extends MouseEvent {
    constructor(type, init = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.isPrimary = init.isPrimary ?? true;
    }
  });
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });
const advance = (ms) => act(() => vi.advanceTimersByTime(ms));
const down = (button) => fireEvent.pointerDown(button, { pointerId: 1, button: 0 });
const release = (button) => {
  fireEvent.pointerUp(button, { pointerId: 1 });
  fireEvent.click(button, { detail: 1 });
};
const setup = () => {
  const step = vi.fn();
  const view = render(<WeightButton onStep={step}>Más</WeightButton>);
  return { step, button: screen.getByRole('button'), ...view };
};

describe('WeightButton', () => {
  it('steps once for each tap, with no delayed or double step', () => {
    const { button, step } = setup();
    for (let i = 0; i < 3; i++) { down(button); release(button); }
    advance(5000);
    expect(step).toHaveBeenCalledTimes(3);
  });

  it('accelerates repeat frequency and does not step on release after holding', () => {
    const { button, step } = setup();
    down(button);
    advance(399);
    expect(step).toHaveBeenCalledTimes(1);
    advance(1);
    expect(step).toHaveBeenCalledTimes(2);
    advance(600);
    const firstSecond = step.mock.calls.length;
    advance(1000);
    const secondSecond = step.mock.calls.length - firstSecond;
    advance(1000);
    expect(step.mock.calls.length - firstSecond - secondSecond).toBeGreaterThan(secondSecond);
    const held = step.mock.calls.length;
    release(button);
    advance(5000);
    expect(step).toHaveBeenCalledTimes(held);
  });

  it.each(['pointerCancel', 'lostPointerCapture', 'pointerLeave', 'blur', 'contextMenu'])(
    'stops on %s, and can start another hold', (event) => {
      const { button, step } = setup();
      down(button);
      advance(650);
      fireEvent[event](button, { pointerId: 1 });
      const before = step.mock.calls.length;
      advance(2000);
      expect(step).toHaveBeenCalledTimes(before);
      down(button);
      advance(400);
      release(button);
      expect(step).toHaveBeenCalledTimes(before + 2);
    }
  );

  it.each(['pointerup', 'pointercancel', 'blur'])('stops on window %s', (event) => {
    const { button, step } = setup();
    down(button);
    fireEvent(window, event === 'blur' ? new Event(event) : new PointerEvent(event, { pointerId: 1 }));
    advance(5000);
    expect(step).toHaveBeenCalledTimes(1);
  });

  it('stops when hidden or unmounted', () => {
    const { button, step, unmount } = setup();
    down(button);
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    advance(5000);
    expect(step).toHaveBeenCalledTimes(1);
    hidden.mockRestore();
    down(button);
    unmount();
    advance(5000);
    expect(step).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['Enter', ' '])('supports keyboard %s without OS auto-repeat duplicates', (key) => {
    const { button, step } = setup();
    fireEvent.keyDown(button, { key });
    fireEvent.keyDown(button, { key, repeat: true });
    expect(step).toHaveBeenCalledTimes(1);
    advance(400);
    fireEvent.keyUp(button, { key });
    advance(5000);
    expect(step).toHaveBeenCalledTimes(2);
  });

  it('supports assistive clicks after a canceled pointer press', () => {
    const { button, step } = setup();
    down(button);
    fireEvent.pointerCancel(button);
    fireEvent.click(button, { detail: 0 });
    expect(step).toHaveBeenCalledTimes(2);
  });

  it('Escape stops a keyboard hold without an extra step on keyup', () => {
    const { button, step } = setup();
    fireEvent.keyDown(button, { key: 'Enter' });
    advance(400);
    fireEvent.keyDown(button, { key: 'Escape' });
    fireEvent.keyUp(button, { key: 'Enter' });
    advance(5000);
    expect(step).toHaveBeenCalledTimes(2);
  });

  it('uses the latest callback while held', () => {
    const { button, step, rerender } = setup();
    down(button);
    const updated = vi.fn();
    rerender(<WeightButton onStep={updated}>Más</WeightButton>);
    advance(400);
    expect(step).toHaveBeenCalledTimes(1);
    expect(updated).toHaveBeenCalledTimes(1);
  });

  it('ignores secondary buttons and unrelated pointer releases', () => {
    const { button, step } = setup();
    fireEvent.pointerDown(button, { button: 2 });
    expect(step).not.toHaveBeenCalled();
    down(button);
    fireEvent.pointerUp(window, { pointerId: 2 });
    advance(400);
    expect(step).toHaveBeenCalledTimes(2);
    release(button);
  });
});
