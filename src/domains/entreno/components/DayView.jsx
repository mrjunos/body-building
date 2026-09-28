import { useEntreno } from '../context/EntrenoContext.jsx';
import { countDay } from '../utils/entrenoHelpers.js';
import { DaySummaryCard } from './DaySummaryCard.jsx';
import { ExerciseCard } from './ExerciseCard.jsx';
import { InfoAccordion } from './InfoAccordion.jsx';

export function DayView() {
  const { log, day, iso, resetDay } = useEntreno();
  const counts = countDay(log, day, iso);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
      {/* data-pane engancha el media query que lo despega en móvil (src/index.css) */}
      <aside
        data-pane="side"
        style={{
          flex: '1 1 268px',
          maxWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          position: 'sticky',
          top: 118,
        }}
      >
        <DaySummaryCard />
      </aside>

      <section
        style={{ flex: '4 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {day.ex.length === 0 && (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 16,
              boxShadow: 'var(--shadow)',
              padding: '34px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(26px,6vw,34px)',
                lineHeight: 1,
                letterSpacing: '-.03em',
                color: 'var(--kind)',
              }}
            >
              Hoy no se entrena
            </p>
            <p style={{ margin: 0, maxWidth: '52ch', fontSize: 14, color: 'var(--ink-2)' }}>
              El sueño es tu mejor aliado anabólico: sin él, buena parte del esfuerzo de la semana se pierde.
            </p>
          </div>
        )}

        {day.ex.map((ex, i) => (
          <ExerciseCard key={ex.k + i} ex={ex} index={i} />
        ))}

        <InfoAccordion />

        {counts.total > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '2px 2px 0' }}>
            <button
              type="button"
              onClick={resetDay}
              style={{
                appearance: 'none',
                background: 'none',
                border: 0,
                padding: '6px 2px',
                fontFamily: "'DM Mono',monospace",
                fontSize: 10.5,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Reiniciar el día
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
