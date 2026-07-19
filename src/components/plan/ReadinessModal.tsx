import type { Readiness } from '@/types';
import Modal from '@/components/ui/Modal';

const OPTIONS: { id: Readiness; emoji: string; label: string; effect: string }[] = [
  { id: 'fresh', emoji: '⚡', label: 'Fresco', effect: 'Peso sugerido +5%' },
  { id: 'normal', emoji: '👍', label: 'Normal', effect: 'Carga de trabajo habitual' },
  { id: 'tired', emoji: '🥱', label: 'Cansado', effect: 'Peso −10% · +15 s de descanso' },
];

interface Props {
  sessionTitle: string;
  onConfirm: (r: Readiness) => void;
  onClose: () => void;
}

export default function ReadinessModal({ sessionTitle, onConfirm, onClose }: Props) {
  return (
    <Modal onClose={onClose} title="¿Cómo llegas hoy?">
      <p className="muted" style={{ marginTop: -8, marginBottom: 18, fontSize: 14 }}>
        Ajustaremos el peso sugerido de {sessionTitle} a tu estado de hoy.
      </p>
      <div className="stack">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            className="card row"
            style={{ textAlign: 'left', width: '100%' }}
            onClick={() => onConfirm(o.id)}
          >
            <span style={{ fontSize: 30 }}>{o.emoji}</span>
            <span className="grow">
              <div style={{ fontWeight: 700, fontSize: 16 }}>{o.label}</div>
              <div className="muted" style={{ fontSize: 13 }}>{o.effect}</div>
            </span>
            <span className="faint" style={{ fontSize: 20 }}>›</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
