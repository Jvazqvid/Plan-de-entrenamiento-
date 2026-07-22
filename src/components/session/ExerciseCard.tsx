import { useMemo, useState } from 'react';
import type { Exercise, HistoryEntry, Readiness, SessionId } from '@/types';
import { useStore } from '@/store/useStore';
import { historyKey, repsForWeek, setsForWeek, targetRirForWeek } from '@/lib/exercises';
import { suggestWeight } from '@/lib/progression';
import { epley, latestOneRm, oneRmTrend } from '@/lib/oneRepMax';
import { isOneRmPr } from '@/lib/records';
import { warmupRamp } from '@/lib/tools';
import { methodForExercise } from '@/data/methods';
import { Explain } from '@/components/ui/Explain';
import { fmtWeight, parseRestSeconds, parseTargetReps } from '@/lib/format';

/** Referencia estable: devolver `[]` nuevo desde un selector de zustand crea un
 *  bucle infinito de renders (cada render = nueva referencia). */
const EMPTY: HistoryEntry[] = [];

interface Props {
  ex: Exercise;
  sessionId: SessionId;
  weekIdx: number;
  readiness: Readiness;
  index: number;
  onStartRest: (seconds: number) => void;
  onOpenDetail?: (exerciseId: string) => void;
  onRemove?: (exerciseId: string) => void;
}

export default function ExerciseCard({ ex, sessionId, weekIdx, readiness, index, onStartRest, onOpenDetail, onRemove }: Props) {
  const history = useStore((s) => s.history[historyKey(sessionId, ex.id)] ?? EMPTY);
  const active = useStore((s) => s.active);
  const trackRir = useStore((s) => s.settings.trackRir);
  const restAutoStart = useStore((s) => s.settings.restAutoStart);
  const setWeight = useStore((s) => s.setWeight);
  const setReps = useStore((s) => s.setReps);
  const setRir = useStore((s) => s.setRir);
  const toggleSetDone = useStore((s) => s.toggleSetDone);

  const [showWarmup, setShowWarmup] = useState(false);

  const nSets = setsForWeek(ex, weekIdx);
  const targetReps = repsForWeek(ex, weekIdx);
  const targetRir = targetRirForWeek(weekIdx);
  const isBodyweight = ex.step === 0 && ex.max === 0;
  const suggestion = useMemo(
    () => suggestWeight(history, ex, weekIdx, readiness),
    [history, ex, weekIdx, readiness],
  );

  const weights = active?.weights ?? {};
  const repsData = active?.reps ?? {};
  const rirData = active?.rir ?? {};
  const touched = active?.touched ?? {};
  const doneSets = active?.doneSets ?? {};
  const key = (i: number) => `${ex.id}-${i}`;

  const restSec = (parseRestSeconds(ex.rest) ?? 60) + (readiness === 'tired' ? 15 : 0);
  const ramp = useMemo(() => (isBodyweight ? [] : warmupRamp(suggestion.weight, ex.step, ex.min)), [isBodyweight, suggestion.weight, ex.step, ex.min]);

  // 1RM: en vivo desde las series tocadas, o el último del historial.
  const liveOneRm = useMemo(() => {
    let best = 0;
    for (let i = 0; i < nSets; i++) {
      if (!touched[key(i)]) continue;
      const w = weights[key(i)] ?? 0;
      const rRaw = repsData[key(i)];
      const r = rRaw && rRaw.trim() ? parseInt(rRaw, 10) : parseTargetReps(targetReps);
      best = Math.max(best, epley(w, Number.isNaN(r) ? parseTargetReps(targetReps) : r));
    }
    return best;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weights, repsData, touched, nSets, targetReps]);

  const shownOneRm = liveOneRm > 0 ? liveOneRm : latestOneRm(history);
  const trend = oneRmTrend(history);
  const isPr = liveOneRm > 0 && isOneRmPr(history, liveOneRm);
  const method = methodForExercise(weekIdx, ex.tag);

  const bump = (i: number, dir: 1 | -1) => {
    const base = touched[key(i)] ? weights[key(i)] ?? 0 : suggestion.weight;
    const step = ex.step > 0 ? ex.step : 1;
    const next = Math.max(ex.min, Math.min(ex.max || 999, base + dir * step));
    setWeight(ex.id, i, Number(next.toFixed(2)));
  };

  return (
    <div className="card ex-card">
      <span className="ex-accent" style={{ background: isPr ? 'var(--good)' : 'var(--accent)' }} />
      <div style={{ paddingLeft: 6 }}>
        <div className="spread">
          <div className="grow" onClick={() => onOpenDetail?.(ex.id)} style={{ cursor: onOpenDetail ? 'pointer' : 'default' }}>
            <div className="row" style={{ gap: 8 }}>
              <span className="faint num" style={{ fontSize: 12, fontWeight: 800 }}>{index + 1}</span>
              <span style={{ fontWeight: 800, fontSize: 15.5, lineHeight: 1.2 }}>{ex.name}</span>
              {isPr && (
                <Explain id="pr">
                  <span className="badge" style={{ background: 'var(--good)', color: '#fff' }}>PR</span>
                </Explain>
              )}
            </div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 5 }}>
              {nSets > 0 ? `${nSets} × ${targetReps}` : targetReps}
              {ex.rest && ex.rest !== '—' ? ` · descanso ${ex.rest}` : ''} · {ex.group}
            </div>
          </div>
          {shownOneRm > 0 && (
            <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
              <div className="num" style={{ fontWeight: 800, fontSize: 17 }}>
                {fmtWeight(Math.round(shownOneRm))}
              </div>
              <div className="faint" style={{ fontSize: 10 }}>
                <Explain id="one-rm">1RM est.</Explain>{' '}
                <Explain id="icon-trend" plain>
                  <span className={trend === '↑' ? 'trend-up' : trend === '↓' ? 'trend-down' : 'trend-flat'}>
                    {trend}
                  </span>
                </Explain>
              </div>
            </div>
          )}
        </div>

        <div className="muted" style={{ fontSize: 12.5, marginTop: 8, fontStyle: 'italic' }}>
          <Explain id="icon-note" plain>💬</Explain> {ex.note}
        </div>

        {method && (
          <div className="row" style={{ marginTop: 8, gap: 8, padding: '7px 10px', borderRadius: 8, background: 'color-mix(in srgb, var(--accent) 12%, var(--surface-2))', fontSize: 12 }}>
            <span style={{ fontSize: 14 }}>{method.emoji}</span>
            <span><Explain id={`metodo-${method.id}`}><b>{method.name}</b></Explain>: <span className="muted">{method.how}</span></span>
          </div>
        )}

        {!isBodyweight && (
          <div
            className="row"
            style={{ marginTop: 10, padding: '7px 10px', borderRadius: 8, background: 'var(--surface-2)', fontSize: 12.5 }}
          >
            <Explain id="sugerencia-peso" plain><span style={{ fontSize: 14 }}>{suggestion.icon}</span></Explain>
            <span style={{ fontWeight: 700 }}>{fmtWeight(suggestion.weight)} <Explain id="kg">{ex.unit ?? 'kg'}</Explain></span>
            <span className="muted grow" style={{ fontSize: 12 }}>{suggestion.reason}</span>
          </div>
        )}

        {/* Series de aproximación */}
        {ramp.length > 0 && (
          <div style={{ marginTop: 6 }}>
            <button className="btn btn-sm btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setShowWarmup(!showWarmup)}>
              🔥 Aproximación {showWarmup ? '▲' : '▼'}
            </button>
            {showWarmup && (
              <div className="row" style={{ gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                {ramp.map((r, i) => (
                  <span key={i} className="pill" style={{ fontSize: 11 }}>
                    {fmtWeight(r.weight)} kg × {r.reps}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Series */}
        <div style={{ marginTop: 6 }}>
          {Array.from({ length: nSets }, (_, i) => {
            const isTouched = !!touched[key(i)];
            const wVal = weights[key(i)];
            const done = !!doneSets[key(i)];
            return (
              <div className="set-row" key={i}>
                <div className="set-num">
                  <div className="n num">{i + 1}</div>
                  {!isBodyweight && <div className="set-hint"><Explain id="icon-bulb" plain>💡</Explain> {fmtWeight(suggestion.weight)}</div>}
                </div>

                {!isBodyweight && (
                  <div className="stepper">
                    <button className="step-btn" onClick={() => bump(i, -1)} aria-label="Menos">−</button>
                    <input
                      className={`weight-input ${isTouched ? '' : 'blank'}`}
                      type="number"
                      inputMode="decimal"
                      placeholder="—"
                      value={isTouched && wVal !== undefined ? wVal : ''}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === '') return;
                        setWeight(ex.id, i, parseFloat(v));
                      }}
                    />
                    <button className="step-btn" onClick={() => bump(i, 1)} aria-label="Más">+</button>
                  </div>
                )}

                <span className="set-field">
                  <input
                    className="reps-input"
                    type="number"
                    inputMode="numeric"
                    placeholder={String(parseTargetReps(targetReps))}
                    value={repsData[key(i)] ?? ''}
                    onChange={(e) => setReps(ex.id, i, e.target.value)}
                    aria-label="Repeticiones"
                  />
                  <span className="faint" style={{ fontSize: 11 }}><Explain id="reps">reps</Explain></span>
                </span>

                {trackRir && !isBodyweight && (
                  <span className="set-field">
                    <input
                      className="reps-input"
                      type="number"
                      inputMode="numeric"
                      placeholder={String(targetRir)}
                      value={rirData[key(i)] ?? ''}
                      onChange={(e) => setRir(ex.id, i, e.target.value)}
                      aria-label="RIR"
                      style={{ width: 38 }}
                    />
                    <span className="faint" style={{ fontSize: 10 }}><Explain id="rir">RIR</Explain></span>
                  </span>
                )}

                <button
                  className={`set-check ${done ? 'done' : ''}`}
                  style={{ marginLeft: 'auto' }}
                  onClick={() => {
                    const willBeDone = !done;
                    toggleSetDone(ex.id, i);
                    if (willBeDone && restAutoStart) onStartRest(restSec);
                  }}
                  aria-label="Marcar serie"
                >
                  ✓
                </button>
              </div>
            );
          })}
        </div>

        {onRemove && (
          <button className="btn btn-sm btn-ghost" style={{ marginTop: 10, color: 'var(--bad)' }} onClick={() => onRemove(ex.id)}>
            Quitar ejercicio extra
          </button>
        )}
      </div>
    </div>
  );
}
