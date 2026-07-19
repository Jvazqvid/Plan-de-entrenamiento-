import { useState } from 'react';
import type { Exercise, Readiness, SessionId } from '@/types';
import ExerciseCard from './ExerciseCard';

interface Props {
  exercises: Exercise[];
  sessionId: SessionId;
  weekIdx: number;
  readiness: Readiness;
  onExit: () => void;
  onStartRest: (s: number) => void;
}

/** Modo kiosco: un ejercicio a la vez, a pantalla completa. */
export default function KioskMode({ exercises, sessionId, weekIdx, readiness, onExit, onStartRest }: Props) {
  const [i, setI] = useState(0);
  const ex = exercises[i];
  const atEnd = i === exercises.length - 1;

  return (
    <div className="kiosk">
      <div className="spread" style={{ marginBottom: 12 }}>
        <div className="row" style={{ gap: 6 }}>
          {exercises.map((_, idx) => (
            <span
              key={idx}
              style={{
                width: idx === i ? 20 : 7, height: 7, borderRadius: 999,
                background: idx === i ? 'var(--accent)' : idx < i ? 'var(--good)' : 'var(--border)',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
        <button className="icon-btn" onClick={onExit} aria-label="Salir del kiosco">✕</button>
      </div>

      <div className="grow" style={{ overflowY: 'auto' }}>
        <div className="faint" style={{ fontSize: 12, marginBottom: 8 }}>
          Ejercicio {i + 1} de {exercises.length}
        </div>
        <ExerciseCard
          key={ex.id}
          ex={ex}
          sessionId={sessionId}
          weekIdx={weekIdx}
          readiness={readiness}
          index={i}
          onStartRest={onStartRest}
        />
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn grow" disabled={i === 0} onClick={() => setI(i - 1)}>← Anterior</button>
        {atEnd ? (
          <button className="btn btn-primary grow" onClick={onExit}>Terminar →</button>
        ) : (
          <button className="btn btn-primary grow" onClick={() => setI(i + 1)}>Siguiente →</button>
        )}
      </div>
    </div>
  );
}
