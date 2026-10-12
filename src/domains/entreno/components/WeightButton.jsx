import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

/** One step per press; holding speeds up the frequency, never the step size. */
export function WeightButton({ onStep, children, ...props }) {
  const step = useRef(onStep);
  const timer = useRef(null);
  const input = useRef(null);
  const pointerClick = useRef(false);

  useLayoutEffect(() => { step.current = onStep; }, [onStep]);

  const stop = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = null;
    input.current = null;
  }, []);

  useEffect(() => {
    const endPointer = (event) => {
      if (input.current?.pointerId === event.pointerId) stop();
    };
    const hide = () => { if (document.hidden) stop(); };
    window.addEventListener('pointerup', endPointer);
    window.addEventListener('pointercancel', endPointer);
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', hide);
    return () => {
      stop();
      window.removeEventListener('pointerup', endPointer);
      window.removeEventListener('pointercancel', endPointer);
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', hide);
    };
  }, [stop]);

  const start = (source) => {
    if (input.current) return;
    input.current = source;
    let delay = 250;
    const repeat = () => {
      if (!input.current) return;
      step.current();
      if (!input.current) return;
      timer.current = setTimeout(repeat, delay);
      delay = Math.max(60, delay * 0.82);
    };
    step.current();
    timer.current = setTimeout(repeat, 400);
  };

  return (
    <button
      {...props}
      type="button"
      style={{ ...props.style, touchAction: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
      onPointerDown={(event) => {
        if (event.button !== 0 || event.isPrimary === false || input.current) return;
        pointerClick.current = true;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        start({ pointerId: event.pointerId });
      }}
      onPointerUp={(event) => {
        if (input.current?.pointerId === event.pointerId) stop();
      }}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onPointerLeave={stop}
      onBlur={stop}
      onContextMenu={(event) => { event.preventDefault(); stop(); }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') stop();
        if (event.key !== ' ' && event.key !== 'Enter') return;
        event.preventDefault();
        if (!event.repeat) start({ key: event.key });
      }}
      onKeyUp={(event) => {
        if (event.key !== ' ' && event.key !== 'Enter') return;
        event.preventDefault();
        if (input.current?.key === event.key) stop();
      }}
      onClick={(event) => {
        // Pointer presses already stepped on down. Keep synthetic/AT clicks usable.
        if (event.detail === 0 || !pointerClick.current) step.current();
        pointerClick.current = false;
      }}
    >
      {children}
    </button>
  );
}
