import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const mono = { fontFamily: "'DM Mono',monospace", letterSpacing: '.14em', textTransform: 'uppercase' };

/** Pantalla de carga mientras Firebase resuelve la sesión guardada. */
export function AuthSplash() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
      <span style={{ ...mono, fontSize: 10, color: 'var(--muted)' }}>Cargando…</span>
    </div>
  );
}

export function Login() {
  const { loginWithGoogle, loginError } = useAuth();
  const [pending, setPending] = useState(false);
  const [popupError, setPopupError] = useState('');

  const handleLogin = async () => {
    setPopupError('');
    setPending(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        console.error(err);
        setPopupError('No se pudo iniciar sesión. Inténtalo de nuevo.');
      }
      setPending(false);
    }
  };

  const error = loginError || popupError;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 16px calc(32px + env(safe-area-inset-bottom))',
      }}
    >
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/icons/icon-192.png" alt="" width={44} height={44} style={{ borderRadius: 12, display: 'block' }} />
          <div>
            <div
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontWeight: 800,
                fontSize: 26,
                letterSpacing: '-.02em',
                lineHeight: 1.1,
              }}
            >
              Entreno
            </div>
            <div style={{ ...mono, fontSize: 10, color: 'var(--muted)' }}>Torso · Pierna · Running</div>
          </div>
        </div>

        <p style={{ margin: 0, color: 'var(--ink-2)', lineHeight: 1.55 }}>
          Entra con tu cuenta de Google para tener el historial de series en todos tus dispositivos.
        </p>

        {error && (
          <div
            role="alert"
            style={{
              background: 'color-mix(in srgb, var(--clay) 12%, var(--surface))',
              border: '1px solid color-mix(in srgb, var(--clay) 40%, var(--line))',
              color: 'var(--ink)',
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: 13.5,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={pending}
          style={{
            height: 52,
            borderRadius: 14,
            border: 'none',
            background: 'var(--clay)',
            color: 'var(--on-kind)',
            fontWeight: 600,
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: 'var(--shadow)',
            opacity: pending ? 0.7 : 1,
            cursor: pending ? 'wait' : 'pointer',
          }}
        >
          {pending ? 'Conectando…' : 'Entrar con Google'}
        </button>

        <p style={{ ...mono, margin: 0, fontSize: 9.5, color: 'var(--muted)', textAlign: 'center' }}>
          Acceso restringido a cuentas autorizadas
        </p>
      </div>
    </div>
  );
}
