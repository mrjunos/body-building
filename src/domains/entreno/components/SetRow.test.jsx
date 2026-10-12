import { useState } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SetRow } from './SetRow.jsx';
import { useEntreno } from '../context/EntrenoContext.jsx';

vi.mock('../context/EntrenoContext.jsx', () => ({ useEntreno: vi.fn() }));
afterEach(() => { cleanup(); vi.useRealTimers(); });

function Harness({ initial = { w: 20.5, r: 8, done: false }, run = false }) {
  const [set, setSet] = useState(initial);
  useEntreno.mockReturnValue({
    day: { kind: 'torso' }, unit: 'kg', weightStep: 1, activeSet: '0:0',
    toggleActiveSet: vi.fn(),
    writeSet: (_key, _index, _count, patch) => setSet((previous) => ({ ...previous, ...patch })),
  });
  return <SetRow ex={{ k: 'test', s: 3, run }} exIndex={0} index={0} set={set} />;
}

describe('SetRow weight controls', () => {
  it('keeps stored decimals until adjusting, then uses whole kilos', () => {
    render(<Harness />);
    expect(screen.getByText('20.5')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Subir peso 1 kg' }));
    expect(screen.getByText('21')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bajar peso 1 kg' }));
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('snaps a fractional weight down and keeps decrementing whole kilos while held', () => {
    vi.useFakeTimers();
    render(<Harness />);
    const less = screen.getByRole('button', { name: 'Bajar peso 1 kg' });
    fireEvent.keyDown(less, { key: 'Enter' });
    expect(screen.getByText('20')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByText('19')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(250));
    expect(screen.getByText('18')).toBeInTheDocument();
    fireEvent.keyUp(less, { key: 'Enter' });
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('18')).toBeInTheDocument();
  });

  it('never makes weight negative, including repeated holds', () => {
    vi.useFakeTimers();
    render(<Harness initial={{ w: 0.5, r: 8, done: true }} />);
    const less = screen.getByRole('button', { name: 'Bajar peso 1 kg' });
    fireEvent.keyDown(less, { key: 'Enter' });
    for (let i = 0; i < 40; i++) act(() => vi.advanceTimersByTime(100));
    fireEvent.keyUp(less, { key: 'Enter' });
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Marcar serie hecha' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('accumulates one-kilo steps across rerenders and stops on closing the row', () => {
    vi.useFakeTimers();
    const { unmount } = render(<Harness />);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Subir peso 1 kg' }), { key: ' ' });
    expect(screen.getByText('21')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByText('22')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(250));
    expect(screen.getByText('23')).toBeInTheDocument();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps reps and running controls as ordinary clicks with their existing steps', () => {
    const { unmount } = render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Más' }));
    expect(screen.getByText('9')).toBeInTheDocument();
    unmount();
    render(<Harness run initial={{ min: 30, km: 5 }} />);
    const more = screen.getAllByRole('button', { name: 'Más' });
    fireEvent.click(more[0]);
    fireEvent.click(more[1]);
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('5.5')).toBeInTheDocument();
  });
});
