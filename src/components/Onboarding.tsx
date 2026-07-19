import { useState } from 'react';
import { useStore } from '@/store/useStore';

const STEPS = [
  {
    icon: '🏋️',
    title: 'Fuerza',
    body: 'Tu mesociclo de fuerza periodizado. 5 sesiones (Push · Pull · Legs · Upper · Cardio) a lo largo de 5 semanas, con la última de descarga.',
  },
  {
    icon: '📊',
    title: 'Progresión inteligente',
    body: 'La app te sugiere el peso de cada serie según tu historial: sube cuando progresas, descarga cuando te estancas y ajusta si llegas cansado.',
  },
  {
    icon: '📚',
    title: 'Con base técnica',
    body: 'Cada decisión se apoya en metodología de entrenamiento de fuerza (autorregulación por RIR, %1RM, volumen y descarga) y en técnica de ejercicios contrastada.',
  },
  {
    icon: '🔒',
    title: 'Tus datos, tuyos',
    body: 'Todo se guarda en tu dispositivo, funciona sin conexión y puedes exportarlo cuando quieras. Instálala como app desde el navegador.',
  },
];

export default function Onboarding() {
  const complete = useStore((s) => s.completeOnboarding);
  const addBodyWeight = useStore((s) => s.addBodyWeight);
  const [i, setI] = useState(0);
  const [bw, setBw] = useState('');
  const last = i === STEPS.length - 1;
  const step = STEPS[i];

  return (
    <div className="app">
      <div className="shell" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 40 }}>
        <div className="slide-in" key={i} style={{ textAlign: 'center', padding: '0 8px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>{step.icon}</div>
          <h1 style={{ fontSize: 30, marginBottom: 14 }}>{step.title}</h1>
          <p className="muted" style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 420, margin: '0 auto' }}>
            {step.body}
          </p>

          {last && (
            <div className="card" style={{ marginTop: 28, textAlign: 'left' }}>
              <label className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
                Tu peso corporal hoy (opcional)
              </label>
              <div className="row" style={{ marginTop: 10 }}>
                <input
                  className="field grow"
                  type="number"
                  inputMode="decimal"
                  placeholder="p. ej. 78.5"
                  value={bw}
                  onChange={(e) => setBw(e.target.value)}
                />
                <span className="muted">kg</span>
              </div>
              <p className="faint" style={{ fontSize: 12, marginTop: 8 }}>
                Sirve para adaptar los macros a tu TDEE y correlacionar peso con fuerza.
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: 32 }}>
          <div className="row" style={{ justifyContent: 'center', gap: 7, marginBottom: 18 }}>
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                style={{
                  width: idx === i ? 22 : 7,
                  height: 7,
                  borderRadius: 999,
                  background: idx === i ? 'var(--accent)' : 'var(--border)',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={() => {
              if (last) {
                const v = parseFloat(bw);
                if (!Number.isNaN(v) && v > 0) addBodyWeight(v);
                complete();
              } else {
                setI(i + 1);
              }
            }}
          >
            {last ? 'Empezar' : 'Siguiente'}
          </button>
          {!last && (
            <button className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={complete}>
              Saltar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
