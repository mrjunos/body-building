import { useEntreno } from '../context/EntrenoContext.jsx';
import { DOUBLE_RULES, LEGEND } from '../data/days.js';

const mono = { fontFamily: "'DM Mono',monospace" };

const sectionTitle = {
  margin: '0 0 8px',
  ...mono,
  fontSize: 9.5,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
};

export function InfoAccordion() {
  const { day, leadOpen, toggleLead } = useEntreno();

  return (
    <section
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={toggleLead}
        aria-expanded={leadOpen}
        style={{
          width: '100%',
          appearance: 'none',
          background: 'none',
          border: 0,
          padding: '14px 15px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textAlign: 'left',
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            flexShrink: 0,
            borderRadius: '50%',
            border: '1.5px solid var(--muted)',
            color: 'var(--muted)',
            display: 'grid',
            placeItems: 'center',
            ...mono,
            fontSize: 12,
          }}
        >
          i
        </span>
        <span
          style={{
            flex: '1 1 auto',
            ...mono,
            fontSize: 10.5,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-2)',
          }}
        >
          Cómo enfocar el {day.name.toLowerCase()}
        </span>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>{leadOpen ? '▲' : '▼'}</span>
      </button>

      {leadOpen && (
        <div style={{ padding: '0 16px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-2)', textWrap: 'pretty', maxWidth: '62ch' }}>
            {day.lead}
          </p>

          {day.double && (
            <div>
              <p style={{ ...sectionTitle, color: 'var(--kind)' }}>Reglas de la jornada doble</p>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 17,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                  fontSize: 13.5,
                  color: 'var(--ink-2)',
                  maxWidth: '62ch',
                }}
              >
                {DOUBLE_RULES.map((r) => (
                  <li key={r.lead}>
                    <b style={{ color: 'var(--ink)' }}>{r.lead}</b>
                    {r.rest}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div>
            <p style={{ ...sectionTitle, color: 'var(--muted)' }}>Cómo leer la rutina</p>
            <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 11, maxWidth: '62ch' }}>
              {LEGEND.map((l) => (
                <div key={l.term}>
                  <dt
                    style={{
                      ...mono,
                      fontSize: 10,
                      letterSpacing: '.13em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                    }}
                  >
                    {l.term}
                  </dt>
                  <dd style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--ink-2)' }}>{l.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}
