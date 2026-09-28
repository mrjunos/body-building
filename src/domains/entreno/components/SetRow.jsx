import { useEntreno } from '../context/EntrenoContext.jsx';
import { KINDVAR } from '../data/days.js';
import { paceOf } from '../utils/entrenoHelpers.js';

const mono = { fontFamily: "'DM Mono',monospace" };

const stepper = {
  width: 48,
  height: 48,
  flexShrink: 0,
  borderRadius: 12,
  border: '1px solid var(--line)',
  background: 'var(--surface)',
  display: 'grid',
  placeItems: 'center',
  fontSize: 22,
  lineHeight: 1,
  color: 'var(--ink-2)',
};

export function SetRow({ ex, exIndex, set, index }) {
  const { day, unit, weightStep, activeSet, toggleActiveSet, writeSet } = useEntreno();
  const kind = KINDVAR[day.kind];
  const id = `${exIndex}:${index}`;
  const active = activeSet === id;

  const put = (patch) => writeSet(ex.k, index, ex.s, patch);

  const fields = ex.run
    ? [
        {
          label: 'Min',
          display: String(set.min),
          dec: () => put({ min: Math.max(1, set.min - 5), km: set.km }),
          inc: () => put({ min: set.min + 5, km: set.km }),
        },
        {
          label: 'Km',
          display: set.km.toFixed(1),
          dec: () => put({ km: Math.max(0.5, Math.round((set.km - 0.5) * 10) / 10), min: set.min }),
          inc: () => put({ km: Math.round((set.km + 0.5) * 10) / 10, min: set.min }),
        },
      ]
    : [
        {
          label: unit,
          display: String(set.w),
          dec: () => put({ w: Math.max(0, Math.round((set.w - weightStep) * 100) / 100), r: set.r }),
          inc: () => put({ w: Math.round((set.w + weightStep) * 100) / 100, r: set.r }),
        },
        {
          label: 'Reps',
          display: String(set.r),
          dec: () => put({ r: Math.max(1, set.r - 1), w: set.w }),
          inc: () => put({ r: set.r + 1, w: set.w }),
        },
      ];

  const mainLabel = ex.run ? `${set.km} km · ${set.min} min` : `${set.w} ${unit} × ${set.r}`;
  const subLabel = ex.run ? paceOf(set.min, set.km) : `Serie ${index + 1} de ${ex.s}`;

  const toggleDone = () => {
    const next = !set.done;
    put(ex.run ? { min: set.min, km: set.km, done: next } : { w: set.w, r: set.r, done: next });
    toggleActiveSet(next && index + 1 < ex.s ? `${exIndex}:${index + 1}` : null);
  };

  return (
    <div
      style={{
        border: `1px solid ${set.done ? `color-mix(in srgb, ${kind} 40%, var(--line))` : 'var(--line)'}`,
        background: set.done
          ? `color-mix(in srgb, ${kind} 9%, var(--surface))`
          : active
            ? 'var(--surface-2)'
            : 'var(--surface)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px 7px 9px' }}>
        <span
          style={{
            width: 24,
            height: 24,
            flexShrink: 0,
            borderRadius: 7,
            background: set.done ? kind : 'var(--surface-2)',
            color: set.done ? 'var(--on-kind)' : 'var(--muted)',
            display: 'grid',
            placeItems: 'center',
            ...mono,
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          {index + 1}
        </span>

        <button
          type="button"
          onClick={() => toggleActiveSet(id)}
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            appearance: 'none',
            border: 0,
            background: 'none',
            padding: '6px 2px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'baseline',
            gap: 9,
            ...mono,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 500, color: set.done ? 'var(--ink)' : 'var(--ink-2)' }}>
            {mainLabel}
          </span>
          <span
            style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}
          >
            {subLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={toggleDone}
          aria-pressed={set.done}
          aria-label="Marcar serie hecha"
          style={{
            width: 46,
            height: 46,
            flexShrink: 0,
            borderRadius: 13,
            border: `1.5px solid ${set.done ? kind : 'var(--line)'}`,
            background: set.done ? kind : 'var(--surface-2)',
            color: set.done ? 'var(--on-kind)' : 'var(--muted)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 19,
            lineHeight: 1,
            transition: 'background .14s,border-color .14s',
          }}
        >
          {set.done ? '✓' : ''}
        </button>
      </div>

      {active && (
        <div style={{ padding: '2px 9px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {fields.map((f) => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span
                style={{
                  width: 52,
                  flexShrink: 0,
                  ...mono,
                  fontSize: 9.5,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                {f.label}
              </span>
              <button type="button" onClick={f.dec} aria-label="Menos" style={stepper}>
                −
              </button>
              <span
                style={{
                  flex: '1 1 auto',
                  textAlign: 'center',
                  ...mono,
                  fontSize: 20,
                  fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--ink)',
                }}
              >
                {f.display}
              </span>
              <button type="button" onClick={f.inc} aria-label="Más" style={stepper}>
                +
              </button>
            </div>
          ))}
          {ex.run && (
            <p
              style={{
                margin: '2px 0 0',
                ...mono,
                fontSize: 11,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              Ritmo medio {paceOf(set.min, set.km)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
