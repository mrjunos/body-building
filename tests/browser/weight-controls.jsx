// PR-preview-only harness. Import the real button, never the app/Firebase provider.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { WeightButton } from '../../src/domains/entreno/components/WeightButton.jsx';

const buttonStyle = { width: 100, height: 72, fontSize: 26, borderRadius: 12 };

export function WeightControlsTest() {
  const [weight, setWeight] = useState(20.5);
  const [visible, setVisible] = useState(true);
  const [steps, setSteps] = useState([]);
  const change = (delta) => {
    setWeight((value) => Math.max(0, Math.round((value + delta) * 100) / 100));
    setSteps((values) => [...values.slice(-99), Math.round(performance.now())]);
  };
  const reset = (value) => { setWeight(value); setSteps([]); };
  return (
    <main style={{ maxWidth: 600, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Prueba aislada de peso</h1>
      <p>Datos ficticios en memoria. No inicia Firebase ni guarda tu historial.</p>
      <output style={{ display: 'block', fontSize: 36, margin: '24px 0' }}>Peso: {weight} kg</output>
      {visible && <div style={{ display: 'flex', gap: 24 }}>
        <WeightButton aria-label="Bajar peso 1 kg" style={buttonStyle} onStep={() => change(-1)}>−</WeightButton>
        <WeightButton aria-label="Subir peso 1 kg" style={buttonStyle} onStep={() => change(1)}>+</WeightButton>
      </div>}
      <p>Pulsaciones registradas: {steps.length}</p>
      <p>Intervalos recientes (ms): {steps.slice(1).map((time, i) => time - steps[i]).slice(-12).join(', ') || '—'}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={() => reset(20.5)}>Restablecer 20.5 kg</button>
        <button onClick={() => reset(0.5)}>Restablecer 0.5 kg</button>
        <button onClick={() => setVisible((value) => !value)}>{visible ? 'Ocultar controles' : 'Mostrar controles'}</button>
      </div>
      <p>Prueba un toque, una pulsación larga y suelta. Enter/Espacio también funcionan; Escape cancela.</p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<WeightControlsTest />);
