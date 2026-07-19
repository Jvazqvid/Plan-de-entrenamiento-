import { useMemo } from 'react';
import { useStore, currentWeekFromStart, type Tab } from '@/store/useStore';
import { SESSIONS_BY_ID } from '@/data/sessions';
import { WEEK_TEMPLATE } from '@/data/schedule';
import { exercisesForWeek, isDeloadWeek } from '@/lib/exercises';
import { MESOCYCLE_PLAN } from '@/data/methodology';
import { currentStreak, totalSessionsDone } from '@/lib/tools';
import { weeklyVolumeByGroup, sessionsCompleted, EXERCISE_INDEX } from '@/lib/stats';
import { prsThisWeek } from '@/lib/records';
import { bodyWeightRate } from '@/lib/tdee';
import { fmtWeight } from '@/lib/format';
import Sparkline from '@/components/ui/Sparkline';

function Ring({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <svg width={92} height={92} viewBox="0 0 92 92">
      <circle cx={46} cy={46} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={8} />
      <circle cx={46} cy={46} r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 46 46)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x={46} y={44} textAnchor="middle" fontSize={22} fontWeight={800} fill="var(--text)">{value}</text>
      <text x={46} y={60} textAnchor="middle" fontSize={9} fill="var(--muted)">{label}</text>
    </svg>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Buenas noches';
  if (h < 14) return 'Buenos días';
  if (h < 21) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function DashboardTab({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const weekIdx = useStore((s) => s.weekIdx);
  const schedule = useStore((s) => s.schedule);
  const startDate = useStore((s) => s.startDate);
  const history = useStore((s) => s.history);
  const bodyWeights = useStore((s) => s.bodyWeights);
  const requestStart = useStore((s) => s.requestStart);
  const reopenSlot = useStore((s) => s.reopenSlot);

  const todayId = (new Date().getDay() + 6) % 7; // 0 = lunes
  const dayTpl = WEEK_TEMPLATE[todayId];
  const todaySlot = schedule.find((s) => s.id === `w${weekIdx}-d${todayId}`);
  const suggestedWeek = currentWeekFromStart(startDate);

  const streak = useMemo(() => currentStreak(schedule), [schedule]);
  const totalDone = useMemo(() => totalSessionsDone(schedule), [schedule]);
  const volume = useMemo(() => weeklyVolumeByGroup(history, 7), [history]);
  const totalSeries = Object.values(volume).reduce((a, b) => a + b, 0);
  const sessionsWeek = sessionsCompleted(schedule, 7, 0);
  const prs = useMemo(() => prsThisWeek(history, 7), [history]);
  const rate = bodyWeightRate(bodyWeights);
  const bwSeries = bodyWeights.slice(-12).map((b) => b.v);

  const weekPlan = MESOCYCLE_PLAN[weekIdx];
  const todaySession = dayTpl.session ? SESSIONS_BY_ID[dayTpl.session] : null;

  return (
    <div style={{ paddingTop: 16 }}>
      <div style={{ marginBottom: 6 }}>
        <div className="faint" style={{ fontSize: 13 }}>{greeting()},</div>
        <h1 style={{ fontSize: 24, marginTop: 2 }}>
          {weekPlan.focus}{' '}
          {isDeloadWeek(weekIdx) && <span className="badge" style={{ background: 'var(--warn)', color: '#000' }}>Descarga</span>}
        </h1>
      </div>

      {/* Sesión de hoy */}
      {todaySession ? (
        <div className="card ex-card" style={{ borderColor: todaySession.color }}>
          <span className="ex-accent" style={{ background: todaySession.color }} />
          <div style={{ paddingLeft: 6 }}>
            <div className="row" style={{ gap: 8 }}>
              <span className="pill" style={{ borderColor: todaySession.color, color: todaySession.color }}>
                Hoy · {dayTpl.label}
              </span>
              {todaySlot?.status === 'done' && <span className="badge" style={{ background: 'var(--good)', color: '#fff' }}>Hecho</span>}
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, marginTop: 8 }}>{todaySession.title}</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>
              {exercisesForWeek(todaySession, weekIdx).length} ejercicios · {weekPlan.rir}
            </div>
            {todaySlot?.status === 'done' ? (
              <button className="btn btn-block" style={{ marginTop: 14 }} onClick={() => reopenSlot(todaySlot.id)}>
                Ver / editar sesión
              </button>
            ) : (
              <button
                className="btn btn-primary btn-block btn-lg"
                style={{ marginTop: 14 }}
                onClick={() => requestStart({ sessionId: todaySession.id, slotId: todaySlot?.id ?? null, weekIdx })}
              >
                Empezar entreno
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 36 }}>😴</div>
          <div style={{ fontWeight: 800, fontSize: 18, marginTop: 6 }}>Hoy descansas</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            La recuperación es cuando el músculo crece. Cuida el sueño y la proteína.
          </div>
          <button className="btn btn-block" style={{ marginTop: 14 }} onClick={() => onNavigate('plan')}>
            Ver el plan de la semana
          </button>
        </div>
      )}

      {suggestedWeek !== weekIdx && (
        <div className="card" style={{ marginTop: 12, background: 'var(--surface-2)', fontSize: 13 }}>
          💡 Por fecha te tocaría la <b>semana {suggestedWeek + 1}</b> del mesociclo.{' '}
          <button className="btn btn-sm" style={{ marginLeft: 6 }} onClick={() => useStore.getState().setWeek(suggestedWeek)}>
            Ir a esa semana
          </button>
        </div>
      )}

      {/* Métricas */}
      <div className="stat-grid" style={{ marginTop: 16 }}>
        <div className="stat">
          <div className="k">🔥 Racha</div>
          <div className="v">{streak}</div>
          <div className="sub">{streak === 1 ? 'sesión seguida' : 'sesiones seguidas'}</div>
        </div>
        <div className="stat">
          <div className="k">🏆 Total</div>
          <div className="v">{totalDone}</div>
          <div className="sub">sesiones completadas</div>
        </div>
      </div>

      {/* Semana */}
      <div className="section-title">Esta semana</div>
      <div className="card row" style={{ gap: 16 }}>
        <Ring value={sessionsWeek} max={5} color="var(--accent)" label="sesiones" />
        <div className="grow">
          <div className="spread" style={{ fontSize: 14 }}>
            <span className="muted">Series totales</span>
            <span className="num" style={{ fontWeight: 800 }}>{totalSeries}</span>
          </div>
          <div className="divider" style={{ margin: '10px 0' }} />
          <div className="spread" style={{ fontSize: 14 }}>
            <span className="muted">Grupos entrenados</span>
            <span className="num" style={{ fontWeight: 800 }}>{Object.keys(volume).length}</span>
          </div>
        </div>
      </div>

      {/* PRs de la semana */}
      {prs.length > 0 && (
        <>
          <div className="section-title">Récords de esta semana 🎉</div>
          <div className="card card-flush" style={{ padding: '4px 16px' }}>
            {prs.slice(0, 5).map((pr) => (
              <div className="list-item" key={pr.key}>
                <span style={{ fontSize: 18 }}>🏅</span>
                <div className="grow">
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{EXERCISE_INDEX[pr.key]?.name ?? pr.key}</div>
                  <div className="faint" style={{ fontSize: 11.5 }}>Nuevo 1RM estimado</div>
                </div>
                <span className="num" style={{ fontWeight: 800 }}>{pr.oneRm} kg</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Peso corporal */}
      {bwSeries.length >= 2 && (
        <>
          <div className="section-title">Peso corporal</div>
          <div className="card">
            <div className="spread">
              <div className="hero-num" style={{ fontSize: 26 }}>
                {fmtWeight(bwSeries[bwSeries.length - 1])} <span className="muted" style={{ fontSize: 14 }}>kg</span>
              </div>
              {rate !== null && (
                <span className="muted num" style={{ fontSize: 13 }}>
                  {rate >= 0 ? '↗' : '↘'} {Math.abs(rate).toFixed(2)} kg/sem
                </span>
              )}
            </div>
            <div style={{ marginTop: 6 }}>
              <Sparkline data={bwSeries} height={48} color="var(--accent)" />
            </div>
          </div>
        </>
      )}

      <div className="row" style={{ marginTop: 18, gap: 10 }}>
        <button className="btn grow" onClick={() => onNavigate('progress')}>📈 Progreso</button>
        <button className="btn grow" onClick={() => onNavigate('guide')}>📚 Guía</button>
      </div>
    </div>
  );
}
