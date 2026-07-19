import { fmtDuration } from '@/lib/format';

interface Props {
  remaining: number;
  onAdd: (s: number) => void;
  onCancel: () => void;
}

export default function RestTimerBar({ remaining, onAdd, onCancel }: Props) {
  const urgent = remaining <= 5;
  return (
    <div className={`rest-timer ${urgent ? 'urgent' : ''}`}>
      <span style={{ fontSize: 18 }}>⏱️</span>
      <div className="grow">
        <div className="faint" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>DESCANSO</div>
        <div className="big num">{fmtDuration(remaining)}</div>
      </div>
      <button className="btn btn-sm" onClick={() => onAdd(15)}>+15s</button>
      <button className="btn btn-sm btn-ghost" onClick={onCancel}>Saltar</button>
    </div>
  );
}
