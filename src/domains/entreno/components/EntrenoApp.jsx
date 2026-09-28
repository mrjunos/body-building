import { useEntreno } from '../context/EntrenoContext.jsx';
import { KINDVAR } from '../data/days.js';
import { Header } from './Header.jsx';
import { WeekView } from './WeekView.jsx';
import { DayView } from './DayView.jsx';
import { Credits } from './Credits.jsx';
import { SessionFooter } from './SessionFooter.jsx';
import { AuthSplash } from '../../../auth/Login.jsx';

export function EntrenoApp() {
  const { day, view, ready } = useEntreno();

  // Hasta el primer snapshot el log está vacío: pintar ya enseñaría ceros.
  if (!ready) return <AuthSplash />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 56 }}>
      <Header />
      <main
        style={{
          maxWidth: 1060,
          margin: '0 auto',
          padding: '18px 16px 0',
          '--kind': KINDVAR[day.kind],
        }}
      >
        {view === 'week' ? <WeekView /> : <DayView />}
        <Credits />
        <SessionFooter />
      </main>
    </div>
  );
}
