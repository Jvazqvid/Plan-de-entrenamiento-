import type { SessionId } from '@/types';
import { SESSIONS_BY_ID } from '@/data/sessions';
import { exercisesForWeek, repsForWeek, setsForWeek, targetRirForWeek } from '@/lib/exercises';
import { weekMethod, methodForExercise } from '@/data/methods';
import { WARMUPS } from '@/data/warmups';
import Modal from '@/components/ui/Modal';
import { Explain } from '@/components/ui/Explain';

interface Props {
  sessionId: SessionId;
  weekIdx: number;
  onClose: () => void;
  onStart?: () => void;
}

/** Vista previa de una sesión: qué ejercicios toca esa semana, sin empezarla. */
export default function SessionPreview({ sessionId, weekIdx, onClose, onStart }: Props) {
  const session = SESSIONS_BY_ID[sessionId];
  const exercises = exercisesForWeek(session, weekIdx);
  const wm = weekMethod(weekIdx);
  const targetRir = targetRirForWeek(weekIdx);
  const warmup = sessionId in WARMUPS ? WARMUPS[sessionId as 'A' | 'B' | 'C' | 'D'] : null;

  // volumen por grupo dentro de la sesión
  const byGroup: Record<string, number> = {};
  for (const ex of exercises) byGroup[ex.group] = (byGroup[ex.group] ?? 0) + setsForWeek(ex, weekIdx);

  return (
    <Modal onClose={onClose} title={`${session.label} · ${session.title.split('—')[0].trim()}`}>
      <div className="row" style={{ gap: 6, flexWrap: 'wrap', marginTop: -6, marginBottom: 12 }}>
        <span className="pill" style={{ borderColor: session.color, color: session.color }}>{session.title.split('—')[1]?.trim()}</span>
        {sessionId !== 'E' && <span className="pill"><Explain id="rir">RIR</Explain> objetivo {targetRir}</span>}
        <span className="pill">{exercises.length} ejercicios</span>
      </div>

      {wm && wm.appliesTo.length > 0 && (
        <div className="card" style={{ background: 'var(--surface-2)', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5 }}>🎯 Esta semana: {wm.label}</div>
        </div>
      )}

      {warmup && (
        <div className="faint" style={{ fontSize: 12.5, marginBottom: 10 }}>
          🔥 Empieza con el calentamiento {warmup.title.replace('Calentamiento ', '')} ({warmup.duration}).
        </div>
      )}

      <div className="card card-flush" style={{ padding: '2px 14px' }}>
        {exercises.map((ex, i) => {
          const method = methodForExercise(weekIdx, ex.tag);
          return (
            <div className="list-item" key={ex.id} style={{ alignItems: 'flex-start' }}>
              <span className="faint num" style={{ fontSize: 12, fontWeight: 800, width: 18, flex: '0 0 auto', paddingTop: 2 }}>{i + 1}</span>
              <div className="grow">
                <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</span>
                  {method && <Explain id={`metodo-${method.id}`}><span className="badge" style={{ background: 'var(--accent)', color: '#fff' }}>{method.emoji} {method.name.split(' ')[0]}</span></Explain>}
                </div>
                <div className="faint" style={{ fontSize: 11.5, marginTop: 2 }}>
                  {setsForWeek(ex, weekIdx) > 0 ? `${setsForWeek(ex, weekIdx)} × ${repsForWeek(ex, weekIdx)}` : repsForWeek(ex, weekIdx)}
                  {ex.rest && ex.rest !== '—' ? ` · ${ex.rest}` : ''} · {ex.group}
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 3, fontStyle: 'italic' }}>{ex.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row" style={{ gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
        {Object.entries(byGroup).map(([g, n]) => (
          <span key={g} className="pill" style={{ fontSize: 11 }}>{g}: {n}</span>
        ))}
      </div>

      {onStart && (
        <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 16 }} onClick={onStart}>
          Empezar esta sesión
        </button>
      )}
    </Modal>
  );
}
