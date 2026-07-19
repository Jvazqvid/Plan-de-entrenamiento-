import type { SessionId } from '@/types';
import { WARMUPS, WARMUPS_ALT } from '@/data/warmups';

interface Props {
  sessionId: SessionId;
  weekIdx: number;
  onContinue: () => void;
}

/** Calentamiento integrado. Desde la semana 2, un paso rota con una variación. */
export default function WarmupScreen({ sessionId, weekIdx, onContinue }: Props) {
  const warmup = sessionId in WARMUPS ? WARMUPS[sessionId as 'A' | 'B' | 'C' | 'D'] : null;
  if (!warmup) {
    onContinue();
    return null;
  }

  const steps = [...warmup.steps];
  const alt = WARMUPS_ALT[sessionId as 'A' | 'B' | 'C' | 'D'];
  if (weekIdx >= 1 && alt && alt.length > 0 && steps.length > 0) {
    const idx = steps.length - 2 >= 0 ? steps.length - 2 : 0;
    steps[idx] = alt[(weekIdx - 1) % alt.length];
  }

  return (
    <div className="slide-in">
      <div className="card" style={{ background: `color-mix(in srgb, ${warmup.color} 12%, var(--surface))`, borderColor: warmup.color }}>
        <div className="row" style={{ gap: 10 }}>
          <span style={{ fontSize: 26 }}>🔥</span>
          <div>
            <h2 style={{ fontSize: 19 }}>{warmup.title}</h2>
            <div className="muted" style={{ fontSize: 13 }}>{warmup.duration} · prepara la articulación y el sistema nervioso</div>
          </div>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 14 }}>
        {steps.map((step, i) => (
          <div className="card row" key={i} style={{ gap: 12, alignItems: 'flex-start' }}>
            <span
              className="num"
              style={{
                width: 30, height: 30, flex: '0 0 auto', borderRadius: 9,
                background: 'var(--surface-3)', display: 'grid', placeItems: 'center', fontWeight: 800,
              }}
            >
              {i + 1}
            </span>
            <div className="grow">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 14.5 }}>{step.name}</span>
                <span className="pill" style={{ fontSize: 11 }}>{step.sets}</span>
              </div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{step.note}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18 }} onClick={onContinue}>
        Continuar al entreno →
      </button>
      <button className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={onContinue}>
        Saltar calentamiento
      </button>
    </div>
  );
}
