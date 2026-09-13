import { useEntreno } from '../context/EntrenoContext.jsx';
import { DAYS, KINDVAR } from '../data/days.js';
import { countDay, dateForKey, isoOf, runInfo, shortDate } from '../utils/entrenoHelpers.js';

const mono = { fontFamily: "'DM Mono',monospace" };

function weekRange() {
  const today = new Date();
  const offset = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date();
  monday.setDate(monday.getDate() - offset);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return `${shortDate(isoOf(monday))} – ${shortDate(isoOf(sunday))}`;
}

export function WeekView() {
  const { log, todayKey, selectDay } = useEntreno();

  return (
    <section>
      <p
        style={{
          margin: '0 0 12px',
          ...mono,
          fontSize: 10,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        Semana · {weekRange()}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
          gap: 12,
        }}
      >
        {DAYS.map((d) => {
          const dIso = dateForKey(d.key);
          const c = countDay(log, d, dIso);
          const color = KINDVAR[d.kind];
          const r = runInfo(d);
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => selectDay(d.key)}
              style={{
                textAlign: 'left',
                appearance: 'none',
                padding: 0,
                overflow: 'hidden',
                border: `1px solid ${d.key === todayKey ? 'var(--ink-2)' : 'var(--line)'}`,
                borderRadius: 14,
                background: 'var(--surface)',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ height: 4, background: color, display: 'block' }} />
              <span
                style={{
                  padding: '13px 14px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                  flex: '1 1 auto',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ ...mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color }}>
                    {d.name}
                  </span>
                  <span style={{ ...mono, fontSize: 10, letterSpacing: '.08em', color: 'var(--muted)' }}>
                    {shortDate(dIso)}
                  </span>
                </span>

                <span
                  style={{
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    letterSpacing: '-.02em',
                    lineHeight: 1.1,
                  }}
                >
                  {d.title}
                </span>

                <span style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{d.focus}</span>
                  {r.mixes && (
                    <span
                      title={r.label}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: 'color-mix(in srgb, var(--sage) 15%, transparent)',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--sage)' }} />
                      <span
                        style={{
                          ...mono,
                          fontSize: 9,
                          letterSpacing: '.12em',
                          textTransform: 'uppercase',
                          color: 'var(--sage)',
                        }}
                      >
                        + Running
                      </span>
                    </span>
                  )}
                </span>

                <span
                  style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 'auto', paddingTop: 3 }}
                >
                  <span
                    style={{
                      flex: '1 1 auto',
                      height: 5,
                      borderRadius: 3,
                      background: 'var(--surface-2)',
                      overflow: 'hidden',
                      display: 'block',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        height: '100%',
                        width: `${c.total ? Math.round((c.done / c.total) * 100) : 0}%`,
                        background: color,
                      }}
                    />
                  </span>
                  <span style={{ ...mono, fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {c.total ? `${c.done}/${c.total}` : '—'}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
