import { describe, expect, it } from 'vitest';
import { stepWeight } from './stepWeight.js';

describe('stepWeight', () => {
  it.each([20.1, 20.5, 20.9, 20.25, 20.75])('snaps %s to the next or previous integer', (weight) => {
    expect(stepWeight(weight, 1)).toBe(21);
    expect(stepWeight(weight, -1)).toBe(20);
  });
  it.each([1, 20, 100])('changes integer %s by exactly one', (weight) => {
    expect(stepWeight(weight, 1)).toBe(weight + 1);
    expect(stepWeight(weight, -1)).toBe(weight - 1);
  });
  it.each([0, 0.1, 0.5, 0.9])('never decrements %s below zero', (weight) => {
    expect(stepWeight(weight, -1)).toBe(0);
    expect(stepWeight(weight, 1)).toBe(1);
  });
  it('uses the same snapping logic for consecutive hold steps', () => {
    let up = 20.5;
    let down = 20.5;
    for (let i = 0; i < 5; i++) {
      up = stepWeight(up, 1);
      down = stepWeight(down, -1);
      expect(up).toBe(21 + i);
      expect(down).toBe(20 - i);
    }
  });
});
