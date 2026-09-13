import { useEntreno } from '../context/EntrenoContext.jsx';
import { KINDVAR } from '../data/days.js';
import { MAP, NAMES, gifFor, shot } from '../data/exercises.js';
import { prFor, sessionsFor, setsFor, shortDate } from '../utils/entrenoHelpers.js';
import { SetRow } from './SetRow.jsx';

const mono = { fontFamily: "'DM Mono',monospace" };

/** Miniatura: la animación si la hay, si no la secuencia inicio/final. */
function Thumb({ gif, photoStart, photoEnd }) {
  if (gif) {
    return (
      <img
        src={gif}
        alt=""
        crossOrigin="anonymous"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    );
  }
  return (
    <span className="mv" style={{ width: '100%', height: '100%' }}>
      <img src={photoStart} alt="" />
      <img className="f2" src={photoEnd} alt="" />
    </span>
  );
}

export function ExerciseCard({ ex, index }) {
  const { log, day, iso, unit, openEx, toggleOpenEx, frames, cycleFrame } = useEntreno();
  const kind = KINDVAR[day.kind];
  const m = MAP[ex.k];
  const open = openEx === index;
  const fr = frames[index] || 0;

  const gif = gifFor(ex.k);
  const photoStart = shot(m.p, 0);
  const photoEnd = shot(m.p, 1);

  const sets = setsFor(log, ex, iso);
  const doneCount = sets.filter((s) => s.done).length;
  const sessions = sessionsFor(log, ex.k, iso);
  const prev = sessions[0];
  const pr = prFor(log, ex.k, iso);

  const lastLine = prev
    ? ex.run
      ? 'Última vez · ' +
        prev.sets.filter((x) => x && x.done).map((x) => `${x.km} km en ${x.min} min`).join(' · ')
      : 'Última vez · ' +
        prev.sets.filter((x) => x && x.done).map((x) => `${x.w} × ${x.r}`).join(', ') + ' ' + unit
    : '';

  const infoBorder = open ? kind : 'var(--line)';
  const target = ex.run ? ex.r : `${ex.s} × ${ex.r}`;

  const frameLabel =
    fr === 0
      ? gif
        ? 'Animación · toca para ver las fotos'
        : 'Secuencia · toca para ver los extremos'
      : fr === 1
        ? 'Inicio · toca para el final'
        : gif
          ? 'Final · toca para la animación'
          : 'Final · toca para la secuencia';

  return (
    <article
      style={{
        background: 'var(--surface)',
        border: `1px solid ${doneCount === ex.s ? kind : 'var(--line)'}`,
        borderRadius: 16,
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '12px 13px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <button
          type="button"
          onClick={() => toggleOpenEx(index)}
          title="Técnica y alternativas"
          aria-label={`Técnica y alternativas de ${ex.n}`}
          style={{
            appearance: 'none',
            padding: 0,
            margin: 0,
            width: 54,
            height: 54,
            flexShrink: 0,
            borderRadius: 10,
            overflow: 'hidden',
            border: `1px solid ${infoBorder}`,
            background: 'var(--surface-2)',
            display: 'block',
          }}
        >
          <Thumb gif={gif} photoStart={photoStart} photoEnd={photoEnd} />
        </button>

        <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span
            style={{
              ...mono,
              fontSize: 9.5,
              fontWeight: 500,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--kind)',
            }}
          >
            {ex.g}
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: '-.02em',
              lineHeight: 1.18,
              textWrap: 'pretty',
            }}
          >
            {ex.n}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 3 }}>
            <span style={{ ...mono, fontSize: 11.5, color: 'var(--ink-2)', fontVariantNumeric: 'tabular-nums' }}>
              {target}
            </span>
            <span
              style={{
                ...mono,
                fontSize: 9.5,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                border: '1px solid var(--line)',
                borderRadius: 5,
                padding: '1px 5px',
              }}
            >
              {ex.rir}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleOpenEx(index)}
          title="Técnica y alternativas"
          style={{
            width: 34,
            height: 34,
            flexShrink: 0,
            borderRadius: '50%',
            border: `1.5px solid ${infoBorder}`,
            background: open ? kind : 'var(--surface)',
            color: open ? 'var(--on-kind)' : 'var(--muted)',
            display: 'grid',
            placeItems: 'center',
            ...mono,
            fontSize: 13,
          }}
        >
          i
        </button>
      </div>

      {(lastLine || pr) && (
        <p
          style={{
            margin: 0,
            padding: '0 13px 10px',
            ...mono,
            fontSize: 11,
            color: 'var(--muted)',
            fontVariantNumeric: 'tabular-nums',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <span>{lastLine || 'Primera vez registrada'}</span>
          {pr && <span style={{ color: 'var(--kind)' }}>{`· PR ${pr.w} ${unit} × ${pr.r}`}</span>}
        </p>
      )}

      {open && (
        <div
          style={{
            margin: '0 13px 12px',
            padding: 13,
            background: 'var(--surface-2)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 13,
          }}
        >
          <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              type="button"
              onClick={() => cycleFrame(index)}
              title="Tocar para ver inicio y final"
              style={{
                appearance: 'none',
                padding: 0,
                margin: 0,
                width: '100%',
                aspectRatio: '4/3',
                border: '1px solid var(--line)',
                borderRadius: 10,
                overflow: 'hidden',
                background: 'var(--surface)',
                display: 'block',
              }}
            >
              {fr === 0 && gif && (
                <img
                  src={gif}
                  alt={ex.n}
                  crossOrigin="anonymous"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    background: 'var(--surface-2)',
                  }}
                />
              )}
              {fr === 0 && !gif && (
                <span className="mv" style={{ width: '100%', height: '100%' }}>
                  <img src={photoStart} alt={ex.n} />
                  <img className="f2" src={photoEnd} alt="" />
                </span>
              )}
              {fr !== 0 && (
                <img
                  src={shot(m.p, fr === 2 ? 1 : 0)}
                  alt={fr === 2 ? 'Posición final' : 'Posición inicial'}
                  style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </button>
            <figcaption
              style={{
                ...mono,
                fontSize: 9.5,
                letterSpacing: '.13em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              {frameLabel}
            </figcaption>
          </figure>

          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-2)', maxWidth: '62ch', textWrap: 'pretty' }}>
            {ex.cue}
          </p>
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)' }}>{ex.alt}</p>

          {m.a.length > 0 && (
            <div>
              <p
                style={{
                  margin: '0 0 8px',
                  ...mono,
                  fontSize: 9.5,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                Si está ocupado
              </p>
              <div style={{ display: 'flex', gap: 9, overflowX: 'auto', paddingBottom: 4 }}>
                {m.a.map((a) => (
                  <figure
                    key={a}
                    style={{ margin: 0, flex: '0 0 128px', display: 'flex', flexDirection: 'column', gap: 5 }}
                  >
                    <img
                      src={shot(a, 0)}
                      alt={NAMES[a] || a}
                      style={{
                        width: '100%',
                        aspectRatio: '4/3',
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '1px solid var(--line)',
                        background: 'var(--surface)',
                      }}
                    />
                    <figcaption style={{ fontSize: 12, lineHeight: 1.25, color: 'var(--ink-2)' }}>
                      {NAMES[a] || a}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {sessions.length > 0 && (
            <div>
              <p
                style={{
                  margin: '0 0 7px',
                  ...mono,
                  fontSize: 9.5,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                Historial
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {sessions.slice(0, 6).map((s) => (
                  <div
                    key={s.iso}
                    style={{
                      display: 'flex',
                      gap: 10,
                      justifyContent: 'space-between',
                      ...mono,
                      fontSize: 11.5,
                      fontVariantNumeric: 'tabular-nums',
                      paddingBottom: 5,
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    <span style={{ color: 'var(--muted)' }}>{shortDate(s.iso)}</span>
                    <span style={{ color: 'var(--ink-2)', textAlign: 'right' }}>
                      {ex.run
                        ? s.sets.filter((x) => x && x.done).map((x) => `${x.km} km / ${x.min} min`).join(' · ')
                        : s.sets.filter((x) => x && x.done).map((x) => `${x.w}×${x.r}`).join('  ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '0 13px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sets.map((set, j) => (
          <SetRow key={j} ex={ex} exIndex={index} set={set} index={j} />
        ))}
      </div>
    </article>
  );
}
