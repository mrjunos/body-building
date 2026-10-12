/** Move to the next/previous weight step only when the user adjusts a value. */
export function stepWeight(weight, direction, step = 1) {
  const position = weight / step;
  const next = direction > 0 ? Math.floor(position) + 1 : Math.ceil(position) - 1;
  return Math.max(0, Math.round(next * step * 100) / 100);
}
