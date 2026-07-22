import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { SESSIONS_BY_ID } from '@/data/sessions';
import { weekMethod } from '@/data/methods';
import { exercisesForWeek } from '@/lib/exercises';
import { useElapsed, useRestTimer } from '@/hooks/useRestTimer';
import { fmtDuration } from '@/lib/format';
import { Explain } from '@/components/ui/Explain';
import { SESSION_GLOSSARY } from '@/data/glossary';
import ExerciseCard from './ExerciseCard';
import WarmupScreen from './WarmupScreen';
import RestTimerBar from './RestTimerBar';
import KioskMode from './KioskMode';
import PainModal from './PainModal';
import AddExerciseModal from './AddExerciseModal';
import ExerciseDetail from '@/components/progress/ExerciseDetail';

export default function ActiveSessionView() {
  const active = useStore((s) => s.active)!;
  const settings = useStore((s) => s.settings);
  const setPhase = useStore((s) => s.setPhase);
  const setSessionNote = useStore((s) => s.setSessionNote);
  const saveActiveSession = useStore((s) => s.saveActiveSession);
  const cancelActiveSession = useStore((s) => s.cancelActiveSession);
  const addExtraExercise = useStore((s) => s.addExtraExercise);
  const removeExtraExercise = useStore((s) => s.removeExtraExercise);

  const rest = useRestTimer({ sound: settings.sound, vibrate: settings.vibrate });
  const elapsed = useElapsed(active.startedAt);
  const [kiosk, setKiosk] = useState(false);
  const [showPain, setShowPain] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const session = SESSIONS_BY_ID[active.sessionId];
  const exercises = [...exercisesForWeek(session, active.weekIdx), ...active.extra];
  const isWarmup = active.phase === 'warmup';
  const doneCount = exercises.reduce((n, ex) => {
    const has = Object.keys(active.doneSets).some((k) => k.startsWith(`${ex.id}-`) && active.doneSets[k]);
    return n + (has ? 1 : 0);
  }, 0);

  if (kiosk && !isWarmup) {
    return (
      <>
        <KioskMode
          exercises={exercises}
          sessionId={active.sessionId}
          weekIdx={active.weekIdx}
          readiness={active.readiness}
          onExit={() => setKiosk(false)}
          onStartRest={rest.start}
        />
        {rest.remaining !== null && (
          <RestTimerBar remaining={rest.remaining} onAdd={rest.add} onCancel={rest.cancel} />
        )}
      </>
    );
  }

  return (
    <>
      {rest.remaining !== null && (
        <RestTimerBar remaining={rest.remaining} onAdd={rest.add} onCancel={rest.cancel} />
      )}

      <header className="topbar">
        <button className="icon-btn" onClick={() => setConfirmCancel(true)} aria-label="Cerrar sesión">✕</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{session.label} · <Explain id={SESSION_GLOSSARY[session.id]}>{session.title.split('—')[0].trim()}</Explain></div>
          <div className="num muted" style={{ fontSize: 12 }}>⏱ {fmtDuration(elapsed)} · {doneCount}/{exercises.length} ej.</div>
        </div>
        <div className="row" style={{ gap: 6 }}>
          {!isWarmup && (
            <button className="icon-btn" onClick={() => setKiosk(true)} aria-label="Modo kiosco">📺</button>
          )}
          <button className="icon-btn" onClick={() => setShowPain(true)} aria-label="Registrar molestia">🩹</button>
        </div>
      </header>

      <main className="shell" style={{ paddingTop: 8 }}>
        {isWarmup ? (
          <WarmupScreen
            sessionId={active.sessionId}
            weekIdx={active.weekIdx}
            onContinue={() => setPhase('exercises')}
          />
        ) : (
          <>
            {(() => {
              const wm = weekMethod(active.weekIdx);
              return wm && wm.appliesTo.length > 0 ? (
                <div className="card" style={{ background: 'color-mix(in srgb, var(--accent) 12%, var(--surface))', marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>🎯 Esta semana: <Explain id={`metodo-${wm.methodId}`}>{wm.label}</Explain></div>
                </div>
              ) : null;
            })()}
            <div className="stack">
              {exercises.map((ex, i) => (
                <ExerciseCard
                  key={ex.id}
                  ex={ex}
                  sessionId={active.sessionId}
                  weekIdx={active.weekIdx}
                  readiness={active.readiness}
                  index={i}
                  onStartRest={rest.start}
                  onOpenDetail={setDetailId}
                  onRemove={active.extra.some((e) => e.id === ex.id) ? removeExtraExercise : undefined}
                />
              ))}
            </div>

            <button className="btn btn-block" style={{ marginTop: 14 }} onClick={() => setShowAdd(true)}>
              + Añadir ejercicio
            </button>

            <div className="section-title">Notas de la sesión</div>
            <textarea
              className="field"
              style={{ minHeight: 64, resize: 'vertical' }}
              placeholder="Sensaciones, dolores, ajustes…"
              value={active.note}
              onChange={(e) => setSessionNote(e.target.value)}
            />

            <button
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: 18 }}
              onClick={() => { rest.cancel(); saveActiveSession(); }}
            >
              Guardar sesión
            </button>
            <button className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={() => setConfirmCancel(true)}>
              Descartar
            </button>
          </>
        )}
      </main>

      {showPain && <PainModal onClose={() => setShowPain(false)} />}
      {showAdd && <AddExerciseModal onAdd={addExtraExercise} onClose={() => setShowAdd(false)} />}
      {detailId && (
        <ExerciseDetail sessionId={active.sessionId} exerciseId={detailId} onClose={() => setDetailId(null)} />
      )}

      {confirmCancel && (
        <div className="overlay" onClick={() => setConfirmCancel(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h2 style={{ fontSize: 19 }}>¿Descartar la sesión?</h2>
            <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>
              Se perderán los pesos y reps que hayas introducido en esta sesión.
            </p>
            <button className="btn btn-block btn-lg" style={{ marginTop: 18, background: 'var(--bad)', color: '#fff' }}
              onClick={() => { rest.cancel(); cancelActiveSession(); }}>
              Sí, descartar
            </button>
            <button className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={() => setConfirmCancel(false)}>
              Seguir entrenando
            </button>
          </div>
        </div>
      )}
    </>
  );
}
