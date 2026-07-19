import { useState } from 'react';
import type { Exercise, MuscleGroup } from '@/types';
import { CATALOG, MUSCLE_GROUPS } from '@/data/catalog';
import { slugify } from '@/lib/format';
import Modal from '@/components/ui/Modal';

interface Props {
  onAdd: (ex: Exercise) => void;
  onClose: () => void;
}

export default function AddExerciseModal({ onAdd, onClose }: Props) {
  const [group, setGroup] = useState<MuscleGroup>(MUSCLE_GROUPS[0]);
  const entries = CATALOG[group] ?? [];

  return (
    <Modal onClose={onClose} title="Añadir ejercicio">
      <div className="chips" style={{ flexWrap: 'wrap' }}>
        {MUSCLE_GROUPS.map((g) => (
          <button key={g} className={`chip ${group === g ? 'active' : ''}`} onClick={() => setGroup(g)}>
            {g}
          </button>
        ))}
      </div>
      <div className="card card-flush" style={{ padding: '4px 16px', marginTop: 14 }}>
        {entries.map((c) => (
          <div
            className="list-item"
            key={c.name}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const ex: Exercise = {
                id: slugify(c.name),
                name: c.name,
                sets: 3,
                reps: '10',
                rest: '75s',
                note: 'Ejercicio extra añadido a mano.',
                min: c.min,
                max: c.max,
                step: c.step,
                unit: c.unit,
                group,
                tag: 'accesorio',
                variant: 'base',
              };
              onAdd(ex);
              onClose();
            }}
          >
            <div className="grow">
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
              <div className="faint" style={{ fontSize: 11.5 }}>{c.min}–{c.max} {c.unit ?? 'kg'}</div>
            </div>
            <span className="faint" style={{ fontSize: 20 }}>+</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
