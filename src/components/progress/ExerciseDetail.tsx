import { useState } from 'react';
import type { SessionId } from '@/types';
import { useStore } from '@/store/useStore';
import { historyKey } from '@/lib/exercises';
import { EXERCISE_INDEX, oneRmSeries } from '@/lib/stats';
import { computeRecords } from '@/lib/records';
import { entryOneRm } from '@/lib/oneRepMax';
import { fmtWeight, shortDate } from '@/lib/format';
import Modal from '@/components/ui/Modal';
import Sparkline from '@/components/ui/Sparkline';

interface Props {
  sessionId: SessionId;
  exerciseId: string;
  onClose: () => void;
}

const EMPTY: never[] = [];

export default function ExerciseDetail({ sessionId, exerciseId, onClose }: Props) {
  const key = historyKey(sessionId, exerciseId);
  const history = useStore((s) => s.history[key] ?? EMPTY);
  const updateHistoryEntry = useStore((s) => s.updateHistoryEntry);
  const deleteHistoryEntry = useStore((s) => s.deleteHistoryEntry);

  const [editing, setEditing] = useState<string | null>(null);
  const [w, setW] = useState('');
  const [r, setR] = useState('');

  const name = EXERCISE_INDEX[key]?.name ?? exerciseId;
  const unit = EXERCISE_INDEX[key]?.unit ?? 'kg';
  const sorted = [...history].sort((a, b) => a.ts - b.ts);
  const series = oneRmSeries(history);
  const rec = computeRecords(history);

  return (
    <Modal onClose={onClose} title={name}>
      {history.length === 0 ? (
        <div className="faint" style={{ fontSize: 14 }}>Sin historial todavía para este ejercicio.</div>
      ) : (
        <>
          {series.length >= 2 && (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="faint" style={{ fontSize: 11, fontWeight: 700 }}>1RM ESTIMADO</div>
              <Sparkline data={series.map((p) => p.oneRm)} height={64} />
            </div>
          )}

          <div className="stat-grid" style={{ marginBottom: 14 }}>
            <div className="stat">
              <div className="k">🏆 Mejor 1RM</div>
              <div className="v">{Math.round(rec.bestOneRm)}</div>
              <div className="sub">{rec.bestOneRmDate ? shortDate(rec.bestOneRmDate) : ''}</div>
            </div>
            <div className="stat">
              <div className="k">💪 Mejor peso</div>
              <div className="v">{fmtWeight(rec.bestWeight)}</div>
              <div className="sub">× {rec.bestWeightReps} reps</div>
            </div>
          </div>

          <div className="section-title" style={{ marginTop: 0 }}>Historial ({history.length})</div>
          <div className="card card-flush" style={{ padding: '4px 16px' }}>
            {sorted.slice().reverse().map((e) => (
              <div className="list-item" key={e.date}>
                {editing === e.date ? (
                  <>
                    <input className="reps-input" style={{ width: 60 }} type="number" value={w} placeholder="kg" onChange={(ev) => setW(ev.target.value)} />
                    <span className="faint">×</span>
                    <input className="reps-input" type="number" value={r} placeholder="reps" onChange={(ev) => setR(ev.target.value)} />
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => {
                        const nw = parseFloat(w);
                        const nr = parseInt(r, 10);
                        const patch: { maxWeight?: number; reps?: number } = {};
                        if (!Number.isNaN(nw)) patch.maxWeight = nw;
                        if (!Number.isNaN(nr)) patch.reps = nr;
                        updateHistoryEntry(key, e.date, patch);
                        setEditing(null);
                      }}
                    >
                      OK
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditing(null)}>✕</button>
                  </>
                ) : (
                  <>
                    <div className="grow">
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{shortDate(e.date)}</div>
                      <div className="faint" style={{ fontSize: 11.5 }}>
                        {e.sets} series · 1RM {Math.round(entryOneRm(e))}{e.rir !== undefined ? ` · RIR ${e.rir}` : ''}
                      </div>
                    </div>
                    <span className="num" style={{ fontWeight: 700 }}>{fmtWeight(e.maxWeight)} {unit} × {e.reps}</span>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => { setEditing(e.date); setW(String(e.maxWeight)); setR(String(e.reps)); }}
                      aria-label="Editar"
                    >
                      ✎
                    </button>
                    <button
                      className="btn btn-sm btn-ghost"
                      style={{ color: 'var(--bad)' }}
                      onClick={() => { if (confirm('¿Borrar esta entrada?')) deleteHistoryEntry(key, e.date); }}
                      aria-label="Borrar"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
