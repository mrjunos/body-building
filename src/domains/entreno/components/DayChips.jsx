import { useEntreno } from '../context/EntrenoContext.jsx';
import { DAYS, KINDVAR, LETTER } from '../data/days.js';

export function DayChips() {
  const { current, view, todayKey, selectDay } = useEntreno();

  return (
    <nav
      aria-label="Día de la semana"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7,1fr)',
        gap: 5,
        flex: '1 1 auto',
        minWidth: 0,
      }}
    >
      {DAYS.map((d) => {
        const on = d.key === current && view === 'day';
        const isToday = d.key === todayKey;
        return (
          <button
            key={d.key}
            type="button"
            onClick={() => selectDay(d.key)}
            aria-current={on ? 'true' : 'false'}
            title={`${d.name} · ${d.title}`}
            style={{
              appearance: 'none',
              height: 46,
              borderRadius: 11,
              border: `1px solid ${on ? KINDVAR[d.kind] : isToday ? 'var(--ink-2)' : 'var(--line)'}`,
              background: on ? KINDVAR[d.kind] : 'var(--surface)',
              color: on ? 'var(--on-kind)' : isToday ? 'var(--ink)' : 'var(--ink-2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: 0,
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: '.02em',
              transition: 'background .15s,border-color .15s',
            }}
          >
            {LETTER[d.key]}
            <span
              style={{
                width: 14,
                height: 3,
                borderRadius: 2,
                background: on ? 'var(--on-kind)' : KINDVAR[d.kind],
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
