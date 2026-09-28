import { useEntreno } from '../context/EntrenoContext.jsx';
import { KINDLBL } from '../data/days.js';
import { countDay, runInfo, shortDate } from '../utils/entrenoHelpers.js';

const mono = { fontFamily: "'DM Mono',monospace" };

export function DaySummaryCard() {
  const { log, day, iso, current, todayKey } = useEntreno();
  const isToday = current === todayKey;
  const counts = countDay(log, day, iso);
  const r = runInfo(day);

  return (
    <section
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
      }}
    >
      <div style={{ height: 4, background: 'var(--kind)' }} />
      <div style={{ padding: '15px 16px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
          <span
            style={{
              ...mono,
              fontSize: 9.5,
              fontWeight: 500,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              padding: '4px 8px',
              borderRadius: 6,
              background: isToday ? 'var(--kind)' : 'color-mix(in srgb, var(--kind) 13%, transparent)',
              color: isToday ? 'var(--on-kind)' : 'var(--kind)',
            }}
          >
            {isToday ? 'Hoy' : day.name}
          </span>
          <span
            style={{
              ...mono,
              fontSize: 9.5,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            {KINDLBL[day.kind]} · {shortDate(iso)}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(30px,7vw,40px)',
              lineHeight: 1,
              letterSpacing: '-.035em',
              textWrap: 'balance',
            }}
          >
            {day.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--kind)', fontWeight: 600 }}>{day.focus}</p>
            {r.mixes && (
              <span
                title={r.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 9px',
                  borderRadius: 999,
                  background: 'color-mix(in srgb, var(--sage) 15%, transparent)',
                  flexShrink: 0,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sage)' }} />
                <span
                  style={{
                    ...mono,
                    fontSize: 9.5,
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: 'var(--sage)',
                  }}
                >
                  + Running
                </span>
              </span>
            )}
          </div>
        </div>

        {counts.total > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 5 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                ...mono,
                fontSize: 10.5,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              <span>
                {day.ex.length} {day.ex.length === 1 ? 'ejercicio' : 'ejercicios'} · {counts.total} series
              </span>
              <span>
                {counts.done}/{counts.total} hechas
              </span>
            </div>
            <div style={{ height: 7, borderRadius: 4, background: 'var(--surface-2)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--kind)',
                  width: `${counts.total ? Math.round((counts.done / counts.total) * 100) : 0}%`,
                  transition: 'width .25s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
