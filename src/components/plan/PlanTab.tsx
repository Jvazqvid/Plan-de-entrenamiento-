import { useStore, currentWeekFromStart } from '@/store/useStore';
import { SESSIONS_BY_ID } from '@/data/sessions';
import { WEEK_TEMPLATE, MESOCYCLE_WEEKS } from '@/data/schedule';
import { exercisesForWeek, isDeloadWeek, targetRirForWeek } from '@/lib/exercises';
import { MESOCYCLE_PLAN } from '@/data/methodology';

export default function PlanTab() {
  const weekIdx = useStore((s) => s.weekIdx);
  const setWeek = useStore((s) => s.setWeek);
  const schedule = useStore((s) => s.schedule);
  const startDate = useStore((s) => s.startDate);
  const requestStart = useStore((s) => s.requestStart);
  const reopenSlot = useStore((s) => s.reopenSlot);

  const suggestedWeek = currentWeekFromStart(startDate);
  const weekPlan = MESOCYCLE_PLAN[weekIdx];

  const slotFor = (dayId: number) => schedule.find((s) => s.id === `w${weekIdx}-d${dayId}`);
  const trainingDays = WEEK_TEMPLATE.filter((d) => d.session);
  const doneThisWeek = trainingDays.filter((d) => slotFor(d.id)?.status === 'done').length;

  return (
    <>
      {/* Selector de semana */}
      <div style={{ paddingTop: 12 }}>
        <div className="chips">
          {Array.from({ length: MESOCYCLE_WEEKS }, (_, i) => (
            <button
              key={i}
              className={`chip ${i === weekIdx ? 'active' : ''}`}
              onClick={() => setWeek(i)}
            >
              Sem {i + 1}
              {isDeloadWeek(i) && <span className="deload-dot"> ·descarga</span>}
              {i === suggestedWeek && i !== weekIdx ? ' •' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Cabecera de fase */}
      <div className="card" style={{ marginTop: 12, background: 'var(--surface-2)' }}>
        <div className="spread">
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{weekPlan.focus}</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
              Objetivo de esfuerzo: {weekPlan.rir} en los básicos
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="hero-num" style={{ fontSize: 24 }}>
              {doneThisWeek}/{trainingDays.length}
            </div>
            <div className="faint" style={{ fontSize: 11 }}>sesiones</div>
          </div>
        </div>
        <div className="bar" style={{ marginTop: 12 }}>
          <span style={{ width: `${(doneThisWeek / trainingDays.length) * 100}%` }} />
        </div>
      </div>

      {/* Días de la semana */}
      <div className="section-title">Semana {weekIdx + 1}</div>
      <div className="stack">
        {WEEK_TEMPLATE.map((day) => {
          if (!day.session) {
            return (
              <div key={day.id} className="row" style={{ padding: '4px 14px', opacity: 0.6 }}>
                <span style={{ width: 40, fontWeight: 700, color: 'var(--faint)' }}>{day.label.slice(0, 3)}</span>
                <span className="faint" style={{ fontSize: 14 }}>Descanso</span>
              </div>
            );
          }
          const session = SESSIONS_BY_ID[day.session];
          const slot = slotFor(day.id);
          const done = slot?.status === 'done';
          const exCount = exercisesForWeek(session, weekIdx).length;
          const targetRir = targetRirForWeek(weekIdx);

          return (
            <div key={day.id} className="card ex-card" style={{ borderColor: done ? session.color : undefined }}>
              <span className="ex-accent" style={{ background: session.color }} />
              <div className="spread" style={{ paddingLeft: 6 }}>
                <div className="grow">
                  <div className="row" style={{ gap: 8 }}>
                    <span className="pill" style={{ borderColor: session.color, color: session.color }}>
                      {day.label} · {session.id}
                    </span>
                    {done && <span className="badge" style={{ background: 'var(--good)', color: '#fff' }}>Hecho</span>}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, marginTop: 8 }}>{session.title}</div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>
                    {exCount} ejercicios
                    {session.id !== 'E' && ` · RIR ${targetRir}`}
                    {done && slot?.durationMin ? ` · ${slot.durationMin} min · ${slot.completionPct}%` : ''}
                  </div>
                </div>
              </div>
              <div className="row" style={{ marginTop: 14, paddingLeft: 6 }}>
                {done ? (
                  <button className="btn btn-block" onClick={() => reopenSlot(slot!.id)}>
                    Ver / editar
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => requestStart({ sessionId: session.id, slotId: slot!.id, weekIdx })}
                  >
                    Empezar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
