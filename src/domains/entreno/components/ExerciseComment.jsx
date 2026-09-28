import { useRef } from 'react';

const line = {
  display: 'block',
  width: '100%',
  margin: 0,
  padding: '0 13px 10px',
  fontSize: 12.5,
  fontStyle: 'italic',
  lineHeight: 1.35,
  color: 'var(--muted)',
};

/** Bocadillo de la cabecera: abre el comentario. Sin borde, para no pesar. */
export function CommentToggle({ hasComment, onClick, name }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Comentario"
      aria-label={`Comentario de ${name}`}
      style={{
        appearance: 'none',
        width: 28,
        height: 34,
        flexShrink: 0,
        padding: 0,
        border: 0,
        background: 'none',
        display: 'grid',
        placeItems: 'center',
        color: hasComment ? 'var(--kind)' : 'var(--muted)',
        opacity: hasComment ? 1 : 0.65,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M2.5 3.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7l-3 2.5v-2.5h-.5a1 1 0 0 1-1-1z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill={hasComment ? 'currentColor' : 'none'}
          fillOpacity={hasComment ? 0.18 : 0}
        />
      </svg>
    </button>
  );
}

/**
 * El comentario del ejercicio: una línea en gris si lo hay, un campo de una
 * línea mientras se edita, y nada si no hay. Se guarda al salir del campo o con
 * Enter, no en cada tecla; Escape descarta.
 */
export function ExerciseComment({ value, editing, onEdit, onDone }) {
  const cancelled = useRef(false);

  if (editing) {
    return (
      <div style={{ padding: '0 13px 10px' }}>
        <input
          type="text"
          autoFocus
          defaultValue={value}
          placeholder="Comentario: agarre, molestias, máquina…"
          enterKeyHint="done"
          maxLength={280}
          onBlur={(e) => {
            if (cancelled.current) {
              cancelled.current = false;
              onDone(null);
            } else onDone(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
            if (e.key === 'Escape') {
              cancelled.current = true;
              e.currentTarget.blur();
            }
          }}
          style={{
            width: '100%',
            height: 32,
            padding: '0 10px',
            border: '1px solid var(--line)',
            borderRadius: 8,
            background: 'var(--surface-2)',
            fontSize: 13,
            color: 'var(--ink)',
          }}
        />
      </div>
    );
  }

  if (!value) return null;

  return (
    <button
      type="button"
      onClick={onEdit}
      title="Editar comentario"
      style={{
        ...line,
        appearance: 'none',
        border: 0,
        background: 'none',
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      “{value}”
    </button>
  );
}
