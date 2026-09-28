import { useEntreno } from '../context/EntrenoContext.jsx';

export function NotesCard() {
  const { log, iso, setNotes } = useEntreno();
  const notes = (log[iso] && log[iso].notes) || '';

  return (
    <section
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '13px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <label
        htmlFor="notas"
        style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: 10,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        Notas de la sesión
      </label>
      <textarea
        id="notas"
        rows={3}
        placeholder="Cómo has llegado, qué máquina estaba ocupada, molestias…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{
          width: '100%',
          minHeight: 66,
          background: 'var(--surface-2)',
          border: '1px solid var(--line)',
          borderRadius: 10,
          padding: '9px 10px',
          fontSize: 13.5,
          color: 'var(--ink)',
        }}
      />
    </section>
  );
}
