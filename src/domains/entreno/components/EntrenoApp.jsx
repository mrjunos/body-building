import { useEntreno } from '../context/EntrenoContext.jsx';
import { KINDVAR } from '../data/days.js';
import { Header } from './Header.jsx';
import { WeekView } from './WeekView.jsx';
import { DayView } from './DayView.jsx';
import { Credits } from './Credits.jsx';

export function EntrenoApp() {
  const { day, view } = useEntreno();

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
      </main>
    </div>
  );
}
