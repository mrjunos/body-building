import { useAuth } from '../../../auth/AuthContext.jsx';

export function SessionFooter() {
  const { currentUser, logout } = useAuth();

  return (
    <p
      style={{
        margin: '14px 0 0',
        fontFamily: "'DM Mono',monospace",
        fontSize: 10,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        textAlign: 'center',
      }}
    >
      {currentUser.email} ·{' '}
      <button
        type="button"
        onClick={logout}
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          color: 'var(--kind)',
          font: 'inherit',
          letterSpacing: 'inherit',
          textTransform: 'inherit',
          textDecoration: 'underline',
          textUnderlineOffset: 2,
        }}
      >
        Salir
      </button>
    </p>
  );
}
