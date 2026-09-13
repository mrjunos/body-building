import { useEntreno } from '../context/EntrenoContext.jsx';
import { DayChips } from './DayChips.jsx';

export function Header() {
  const { view, awake, toggleAwake, toggleTheme, toggleView } = useEntreno();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        style={{
          maxWidth: 1060,
          margin: '0 auto',
          padding: '12px 16px 11px',
          display: 'flex',
          flexDirection: 'column',
          gap: 11,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, minWidth: 0 }}>
            <span
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: '-.02em',
                whiteSpace: 'nowrap',
              }}
            >
              Entreno
            </span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 10,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Torso · Pierna · Running
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              type="button"
              onClick={toggleAwake}
              title="Mantener la pantalla encendida"
              aria-pressed={awake}
              style={{
                height: 34,
                padding: '0 11px',
                borderRadius: 99,
                border: '1px solid var(--line)',
                background: awake ? 'var(--ink)' : 'var(--surface)',
                color: awake ? 'var(--bg)' : 'var(--muted)',
                fontFamily: "'DM Mono',monospace",
                fontSize: 10,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', opacity: 0.75 }}
              />
              Pantalla
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              title="Cambiar tema"
              aria-label="Cambiar tema"
              style={{
                width: 34,
                height: 34,
                borderRadius: 99,
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: '1.5px solid var(--ink)',
                  background: 'linear-gradient(90deg, var(--ink) 50%, transparent 50%)',
                }}
              />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <DayChips />
          <button
            type="button"
            onClick={toggleView}
            style={{
              height: 46,
              padding: '0 13px',
              borderRadius: 11,
              border: '1px solid var(--line)',
              background: view === 'week' ? 'var(--ink)' : 'var(--surface)',
              color: view === 'week' ? 'var(--bg)' : 'var(--ink-2)',
              fontFamily: "'DM Mono',monospace",
              fontSize: 10.5,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            {view === 'week' ? 'Hoy' : 'Semana'}
          </button>
        </div>
      </div>
    </header>
  );
}
