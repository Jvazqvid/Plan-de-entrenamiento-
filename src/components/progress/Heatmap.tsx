import { todayISO } from '@/lib/format';

const WEEKS = 13;
const DAY = 86_400_000;
const ROW_LABELS = ['L', '', 'X', '', 'V', '', 'D'];

function shade(count: number | undefined): string {
  if (!count) return 'var(--surface-3)';
  if (count >= 8) return 'var(--good)';
  if (count >= 5) return 'color-mix(in srgb, var(--good) 75%, var(--surface-3))';
  if (count >= 3) return 'color-mix(in srgb, var(--good) 50%, var(--surface-3))';
  return 'color-mix(in srgb, var(--good) 30%, var(--surface-3))';
}

/** Heatmap de constancia estilo GitHub: últimas 13 semanas, coloreado por volumen del día. */
export default function Heatmap({ counts }: { counts: Map<string, number> }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const todayW = (today.getDay() + 6) % 7; // 0 = lunes
  const mondayThisWeek = todayMs - todayW * DAY;
  const startMonday = mondayThisWeek - (WEEKS - 1) * 7 * DAY;

  const cols: { ms: number; iso: string; count: number | undefined; future: boolean }[][] = [];
  for (let c = 0; c < WEEKS; c++) {
    const col: { ms: number; iso: string; count: number | undefined; future: boolean }[] = [];
    for (let r = 0; r < 7; r++) {
      const ms = startMonday + (c * 7 + r) * DAY;
      const iso = todayISO(new Date(ms));
      col.push({ ms, iso, count: counts.get(iso), future: ms > todayMs });
    }
    cols.push(col);
  }

  return (
    <div className="tbl-wrap">
      <div style={{ display: 'flex', gap: 3 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 2 }}>
          {ROW_LABELS.map((l, i) => (
            <div key={i} className="faint" style={{ fontSize: 8, height: 13, lineHeight: '13px' }}>{l}</div>
          ))}
        </div>
        {cols.map((col, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {col.map((cell, ri) => (
              <div
                key={ri}
                title={cell.future ? '' : `${cell.iso}${cell.count ? ` · ${cell.count} ejercicios` : ''}`}
                style={{
                  width: 13, height: 13, borderRadius: 3,
                  background: cell.future ? 'transparent' : shade(cell.count),
                  border: cell.future ? 'none' : '1px solid var(--border-soft)',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
