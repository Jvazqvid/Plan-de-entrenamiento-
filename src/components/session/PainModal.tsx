import { useState } from 'react';
import type { Joint } from '@/types';
import { useStore } from '@/store/useStore';
import Modal from '@/components/ui/Modal';

const JOINTS: Joint[] = ['Rodilla', 'Hombro', 'Codo', 'Muñeca', 'Cadera', 'Espalda', 'Cuello', 'Tobillo'];

export default function PainModal({ onClose }: { onClose: () => void }) {
  const addPain = useStore((s) => s.addPain);
  const [joint, setJoint] = useState<Joint>('Rodilla');
  const [intensity, setIntensity] = useState(4);
  const [note, setNote] = useState('');

  return (
    <Modal onClose={onClose} title="Registrar molestia">
      <div className="chips" style={{ flexWrap: 'wrap' }}>
        {JOINTS.map((j) => (
          <button key={j} className={`chip ${joint === j ? 'active' : ''}`} onClick={() => setJoint(j)}>
            {j}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="spread">
          <span className="muted" style={{ fontSize: 13 }}>Intensidad</span>
          <span className="num" style={{ fontWeight: 800, fontSize: 18 }}>{intensity}/10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
          style={{ width: '100%', marginTop: 8, accentColor: 'var(--accent)' }}
        />
      </div>

      <textarea
        className="field"
        style={{ marginTop: 16, minHeight: 70, resize: 'vertical' }}
        placeholder="¿Qué notas y en qué movimiento?"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        className="btn btn-primary btn-block btn-lg"
        style={{ marginTop: 16 }}
        onClick={() => {
          addPain(joint, intensity, note.trim());
          onClose();
        }}
      >
        Guardar molestia
      </button>
    </Modal>
  );
}
