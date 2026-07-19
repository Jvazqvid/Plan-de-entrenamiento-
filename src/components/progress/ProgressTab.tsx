import { useMemo, useRef, useState } from 'react';
import type { MeasurementKind, SessionId } from '@/types';
import { useStore } from '@/store/useStore';
import Sparkline from '@/components/ui/Sparkline';
import Heatmap from './Heatmap';
import ExerciseDetail from './ExerciseDetail';
import { latestOneRm, oneRmTrend } from '@/lib/oneRepMax';
import { isStalled } from '@/lib/progression';
import { bodyWeightRate } from '@/lib/tdee';
import {
  keyLifts,
  oneRmSeries,
  projectNext,
  recentHistory,
  sessionsCompleted,
  weeklyVolumeByGroup,
  trainingDayCounts,
  historyToCsv,
} from '@/lib/stats';
import { fmtWeight, shortDate } from '@/lib/format';
import { VOLUME_LANDMARKS } from '@/data/methodology';

const MEASUREMENT_KINDS: MeasurementKind[] = ['Cuello', 'Pecho', 'Brazo', 'Cintura', 'Cadera', 'Muslo', 'Gemelo'];

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button className="spread" style={{ width: '100%', padding: '4px 0' }} onClick={() => onChange(!on)}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <span style={{
        width: 42, height: 24, borderRadius: 999, flex: '0 0 auto', position: 'relative',
        background: on ? 'var(--accent)' : 'var(--surface-3)', transition: 'background 0.2s',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
        }} />
      </span>
    </button>
  );
}

export default function ProgressTab() {
  const history = useStore((s) => s.history);
  const bodyWeights = useStore((s) => s.bodyWeights);
  const bodyWeightGoal = useStore((s) => s.bodyWeightGoal);
  const measurements = useStore((s) => s.measurements);
  const schedule = useStore((s) => s.schedule);
  const pain = useStore((s) => s.pain);
  const settings = useStore((s) => s.settings);
  const addBodyWeight = useStore((s) => s.addBodyWeight);
  const setBodyWeightGoal = useStore((s) => s.setBodyWeightGoal);
  const addMeasurement = useStore((s) => s.addMeasurement);
  const removePain = useStore((s) => s.removePain);
  const updateSettings = useStore((s) => s.updateSettings);
  const exportState = useStore((s) => s.exportState);
  const importState = useStore((s) => s.importState);
  const resetMesocycle = useStore((s) => s.resetMesocycle);

  const [bwInput, setBwInput] = useState('');
  const [goalInput, setGoalInput] = useState(bodyWeightGoal ? String(bodyWeightGoal) : '');
  const [mKind, setMKind] = useState<MeasurementKind>('Brazo');
  const [mVal, setMVal] = useState('');
  const [detail, setDetail] = useState<{ sessionId: SessionId; exerciseId: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const lifts = useMemo(() => keyLifts(), []);
  const rate = bodyWeightRate(bodyWeights);
  const bwSeries = bodyWeights.map((b) => b.v);
  const currentBw = bodyWeights.length ? bodyWeights[bodyWeights.length - 1].v : null;

  const volume = useMemo(() => weeklyVolumeByGroup(history, 7), [history]);
  const volumeGroups = Object.entries(volume).sort((a, b) => b[1] - a[1]);
  const maxVol = Math.max(12, ...volumeGroups.map(([, v]) => v));
  const dayCounts = useMemo(() => trainingDayCounts(history), [history]);

  const thisWeek = sessionsCompleted(schedule, 7, 0);
  const lastWeek = sessionsCompleted(schedule, 14, 7);
  const recent = useMemo(() => recentHistory(history, 12), [history]);

  const latestMeasure = (kind: MeasurementKind) => {
    const list = measurements.filter((m) => m.kind === kind).sort((a, b) => a.ts - b.ts);
    return list.length ? list[list.length - 1] : null;
  };

  const download = (content: string, name: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };
  const stamp = new Date().toISOString().slice(0, 10);

  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => alert(importState(String(reader.result)) ? 'Datos importados.' : 'No se pudo leer el archivo.');
    reader.readAsText(file);
  };

  return (
    <div style={{ paddingTop: 16 }}>
      {/* Peso corporal */}
      <div className="card">
        <div className="spread">
          <div>
            <div className="faint" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>PESO CORPORAL</div>
            <div className="hero-num">{currentBw !== null ? fmtWeight(currentBw) : '—'} <span style={{ fontSize: 16 }} className="muted">kg</span></div>
            {rate !== null && (
              <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                {rate >= 0 ? '↗' : '↘'} {Math.abs(rate).toFixed(2)} kg/sem
                {bodyWeightGoal ? ` · objetivo ${bodyWeightGoal} kg` : ''}
              </div>
            )}
          </div>
        </div>
        {bwSeries.length >= 2 && <div style={{ marginTop: 8 }}><Sparkline data={bwSeries} color="var(--accent)" height={54} /></div>}
        <div className="row" style={{ marginTop: 12 }}>
          <input className="field grow" type="number" inputMode="decimal" placeholder="Peso de hoy (kg)" value={bwInput} onChange={(e) => setBwInput(e.target.value)} />
          <button className="btn btn-primary" onClick={() => { const v = parseFloat(bwInput); if (!Number.isNaN(v) && v > 0) { addBodyWeight(v); setBwInput(''); } }}>Registrar</button>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <input className="field grow" type="number" inputMode="decimal" placeholder="Objetivo de peso (kg)" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} />
          <button className="btn" onClick={() => { const v = parseFloat(goalInput); setBodyWeightGoal(Number.isNaN(v) ? null : v, null); }}>Fijar</button>
        </div>
      </div>

      {/* Constancia */}
      <div className="section-title">Constancia</div>
      <div className="card">
        <Heatmap counts={dayCounts} />
        <div className="faint" style={{ fontSize: 11, marginTop: 10 }}>Últimas 13 semanas · color = volumen del día</div>
      </div>

      {/* Fuerza — 1RM de básicos */}
      <div className="section-title">Fuerza · 1RM estimado</div>
      <div className="stack">
        {lifts.map((lift) => {
          const h = history[lift.key] ?? [];
          const series = oneRmSeries(h);
          const latest = latestOneRm(h);
          const trend = oneRmTrend(h);
          const proj = projectNext(series);
          const stalled = isStalled(h);
          return (
            <button className="card ex-card" key={lift.key} style={{ textAlign: 'left', width: '100%' }}
              onClick={() => setDetail({ sessionId: lift.sessionId, exerciseId: lift.exercise.id })}>
              <span className="ex-accent" style={{ background: lift.color }} />
              <div style={{ paddingLeft: 6 }}>
                <div className="spread">
                  <div>
                    <div className="pill" style={{ borderColor: lift.color, color: lift.color, fontSize: 11 }}>{lift.sessionId} · {lift.sessionTitle}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginTop: 6 }}>{lift.exercise.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="hero-num" style={{ fontSize: 26 }}>{latest > 0 ? Math.round(latest) : '—'}</div>
                    <div className="faint" style={{ fontSize: 10 }}>kg <span className={trend === '↑' ? 'trend-up' : trend === '↓' ? 'trend-down' : 'trend-flat'}>{trend}</span></div>
                  </div>
                </div>
                {series.length >= 2 ? (
                  <div style={{ marginTop: 8 }}><Sparkline data={series.map((p) => p.oneRm)} color={lift.color} projection={proj ?? undefined} height={56} /></div>
                ) : (
                  <div className="faint" style={{ fontSize: 12.5, marginTop: 8 }}>Toca para ver el detalle. Registra 2+ sesiones para la tendencia.</div>
                )}
                {stalled && <div className="row" style={{ marginTop: 8, fontSize: 12, color: 'var(--warn)' }}>⚠️ Estancado 3 sesiones — baja 5% y resetea.</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Comparativa semanal */}
      <div className="section-title">Esta semana vs anterior</div>
      <div className="stat-grid">
        <div className="stat">
          <div className="k">Sesiones (7 días)</div>
          <div className="v">{thisWeek}</div>
          <div className="sub">{lastWeek === 0 ? 'sin referencia previa' : thisWeek >= lastWeek ? `↑ vs ${lastWeek}` : `↓ vs ${lastWeek}`}</div>
        </div>
        <div className="stat">
          <div className="k">Series totales (7 días)</div>
          <div className="v">{Object.values(volume).reduce((a, b) => a + b, 0)}</div>
          <div className="sub">volumen de fuerza</div>
        </div>
      </div>

      {/* Volumen por grupo */}
      <div className="section-title">Volumen semanal por grupo</div>
      <div className="card">
        {volumeGroups.length === 0 ? (
          <div className="faint" style={{ fontSize: 13 }}>Aún no hay series registradas esta semana.</div>
        ) : (
          <div className="stack" style={{ gap: 10 }}>
            {volumeGroups.map(([group, v]) => (
              <div key={group}>
                <div className="spread" style={{ fontSize: 12.5, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{group}</span>
                  <span className="num muted">{v} series</span>
                </div>
                <div className="bar"><span style={{ width: `${Math.min(100, (v / maxVol) * 100)}%`, background: v >= 10 ? 'var(--good)' : 'var(--accent)' }} /></div>
              </div>
            ))}
            <div className="faint" style={{ fontSize: 11, marginTop: 4 }}>Referencia: MEV {VOLUME_LANDMARKS[1].series} · óptimo {VOLUME_LANDMARKS[2].series} series/sem.</div>
          </div>
        )}
      </div>

      {/* Medidas corporales */}
      <div className="section-title">Medidas corporales (cm)</div>
      <div className="card">
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          {MEASUREMENT_KINDS.map((k) => {
            const m = latestMeasure(k);
            return (
              <div key={k} className="pill" style={{ fontSize: 11.5 }}>
                {k}: <b>{m ? m.value : '—'}</b>
              </div>
            );
          })}
        </div>
        <div className="row" style={{ marginTop: 12, gap: 8 }}>
          <select className="field" style={{ width: 120 }} value={mKind} onChange={(e) => setMKind(e.target.value as MeasurementKind)}>
            {MEASUREMENT_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <input className="field grow" type="number" inputMode="decimal" placeholder="cm" value={mVal} onChange={(e) => setMVal(e.target.value)} />
          <button className="btn btn-primary" onClick={() => { const v = parseFloat(mVal); if (!Number.isNaN(v) && v > 0) { addMeasurement(mKind, v); setMVal(''); } }}>Añadir</button>
        </div>
      </div>

      {/* Historial reciente */}
      <div className="section-title">Historial reciente</div>
      <div className="card card-flush" style={{ padding: '4px 16px' }}>
        {recent.length === 0 ? (
          <div className="faint" style={{ fontSize: 13, padding: '12px 0' }}>Sin entradas todavía.</div>
        ) : (
          recent.map((r, i) => (
            <div className="list-item" key={i} style={{ cursor: 'pointer' }} onClick={() => setDetail({ sessionId: r.sessionId, exerciseId: r.exerciseId })}>
              <div className="grow">
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                <div className="faint" style={{ fontSize: 11.5 }}>{shortDate(r.date)} · {r.group}{r.rir !== undefined ? ` · RIR ${r.rir}` : ''}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="num" style={{ fontWeight: 700 }}>{fmtWeight(r.maxWeight)} {r.unit ?? 'kg'} × {r.reps}</div>
                <div className="faint" style={{ fontSize: 11 }}>1RM {r.oneRm}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Molestias */}
      {pain.length > 0 && (
        <>
          <div className="section-title">Molestias registradas</div>
          <div className="card card-flush" style={{ padding: '4px 16px' }}>
            {pain.slice().reverse().slice(0, 8).map((p) => (
              <div className="list-item" key={p.id}>
                <div className="grow">
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.joint} · {p.intensity}/10</div>
                  <div className="faint" style={{ fontSize: 11.5 }}>{shortDate(p.date)}{p.note ? ` · ${p.note}` : ''}</div>
                </div>
                <button className="btn btn-sm btn-ghost" onClick={() => removePain(p.id)}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Ajustes */}
      <div className="section-title">Ajustes</div>
      <div className="card stack" style={{ gap: 2 }}>
        <Toggle on={settings.trackRir} onChange={(v) => updateSettings({ trackRir: v })} label="Registrar RIR por serie" />
        <Toggle on={settings.restAutoStart} onChange={(v) => updateSettings({ restAutoStart: v })} label="Timer de descanso automático" />
        <Toggle on={settings.sound} onChange={(v) => updateSettings({ sound: v })} label="Sonido del timer" />
        <Toggle on={settings.vibrate} onChange={(v) => updateSettings({ vibrate: v })} label="Vibración del timer" />
      </div>

      {/* Datos */}
      <div className="section-title">Datos</div>
      <div className="card stack">
        <div className="row">
          <button className="btn grow" onClick={() => download(exportState(), `fuerza-backup-${stamp}.json`, 'application/json')}>⬇ Backup JSON</button>
          <button className="btn grow" onClick={() => download(historyToCsv(history), `fuerza-historial-${stamp}.csv`, 'text/csv')}>⬇ CSV</button>
        </div>
        <button className="btn" onClick={() => fileRef.current?.click()}>⬆ Importar backup</button>
        <input ref={fileRef} type="file" accept="application/json" style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) doImport(f); e.target.value = ''; }} />
        <button className="btn btn-ghost" onClick={() => { if (confirm('¿Reiniciar el mesociclo? Se genera un calendario nuevo (el historial se conserva).')) resetMesocycle(); }}>
          🔄 Reiniciar mesociclo (5 semanas)
        </button>
      </div>

      {detail && <ExerciseDetail sessionId={detail.sessionId} exerciseId={detail.exerciseId} onClose={() => setDetail(null)} />}
    </div>
  );
}
