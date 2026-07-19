import type { CoachVerdict } from '@/types';

interface Props {
  verdict: CoachVerdict;
  onClose: () => void;
}

/** Anillo de score en SVG. */
function ScoreRing({ score }: { score: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const off = c * (1 - score / 100);
  const color = score >= 75 ? 'var(--good)' : score >= 50 ? 'var(--warn)' : 'var(--bad)';
  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      <circle cx={60} cy={60} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={10} />
      <circle
        cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x={60} y={58} textAnchor="middle" fontSize={30} fontWeight={800} fill="var(--text)">{score}</text>
      <text x={60} y={78} textAnchor="middle" fontSize={11} fill="var(--muted)">/ 100</text>
    </svg>
  );
}

export default function SaveSummary({ verdict, onClose }: Props) {
  return (
    <div className="overlay" style={{ alignItems: 'center' }}>
      <div className="sheet slide-in" style={{ borderRadius: 'var(--r-lg)', margin: '0 12px', maxHeight: '90vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <ScoreRing score={verdict.score} />
          </div>
          <h2 style={{ fontSize: 22, marginTop: 8 }}>{verdict.headline}</h2>
        </div>

        {verdict.highlights.length > 0 && (
          <div className="stack" style={{ marginTop: 18 }}>
            {verdict.highlights.map((h, i) => (
              <div key={i} className="row" style={{ gap: 10 }}>
                <span style={{ color: 'var(--good)' }}>✓</span>
                <span style={{ fontSize: 14 }}>{h}</span>
              </div>
            ))}
          </div>
        )}

        <div className="card" style={{ marginTop: 16, background: 'var(--surface-2)' }}>
          <div className="faint" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>A MEJORAR</div>
          <div style={{ fontSize: 14, marginTop: 6 }}>{verdict.improvement}</div>
        </div>
        <div className="card" style={{ marginTop: 10, background: 'var(--surface-2)' }}>
          <div className="faint" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>PRÓXIMA VEZ</div>
          <div style={{ fontSize: 14, marginTop: 6 }}>{verdict.nextSuggestion}</div>
        </div>

        <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 20 }} onClick={onClose}>
          Hecho
        </button>
      </div>
    </div>
  );
}
