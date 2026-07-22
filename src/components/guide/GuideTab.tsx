import { useState } from 'react';
import {
  FORMULAS,
  MESOCYCLE_PLAN,
  PRINCIPLES,
  REST_GUIDE,
  RIR_SCALE,
  RM_ZONES,
  VOLUME_LANDMARKS,
} from '@/data/methodology';
import { TECHNIQUE } from '@/data/technique';
import { METHODS } from '@/data/methods';
import { GLOSSARY, GLOSSARY_CATEGORIES } from '@/data/glossary';
import { useGlossary } from '@/store/useGlossary';
import { brzycki, epley, loadForPercent } from '@/lib/oneRepMax';
import { fmtWeight } from '@/lib/format';

function OneRmCalculator() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const w = parseFloat(weight);
  const r = parseInt(reps, 10);
  const valid = !Number.isNaN(w) && w > 0 && !Number.isNaN(r) && r > 0;
  const oneRm = valid ? epley(w, r) : 0;
  const oneRmB = valid ? brzycki(w, r) : 0;
  const pcts = [95, 90, 85, 80, 75, 70];

  return (
    <div className="card">
      <div style={{ fontWeight: 800, fontSize: 15 }}>🧮 Calculadora de 1RM</div>
      <div className="row" style={{ marginTop: 12, gap: 8 }}>
        <input className="field grow" type="number" inputMode="decimal" placeholder="Peso (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <span className="muted">×</span>
        <input className="field grow" type="number" inputMode="numeric" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} />
      </div>
      {valid && (
        <>
          <div className="stat-grid" style={{ marginTop: 12 }}>
            <div className="stat"><div className="k">1RM Epley</div><div className="v">{Math.round(oneRm)}</div><div className="sub">kg estimados</div></div>
            <div className="stat"><div className="k">1RM Brzycki</div><div className="v">{Math.round(oneRmB)}</div><div className="sub">kg estimados</div></div>
          </div>
          <div className="faint" style={{ fontSize: 11, fontWeight: 700, margin: '14px 0 6px' }}>CARGAS POR %1RM (EPLEY)</div>
          <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
            {pcts.map((p) => (
              <span key={p} className="pill" style={{ fontSize: 11.5 }}>{p}%: <b>{fmtWeight(Math.round(loadForPercent(oneRm, p) * 2) / 2)}</b> kg</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Glosario() {
  const [q, setQ] = useState('');
  const open = useGlossary((s) => s.open);
  const needle = q.trim().toLowerCase();
  const match = (s: string) => s.toLowerCase().includes(needle);
  const filtered = GLOSSARY.filter(
    (g) => !needle || match(g.term) || match(g.title) || match(g.short),
  );

  return (
    <div>
      <p className="muted" style={{ fontSize: 12.5, marginTop: -6, marginBottom: 10, lineHeight: 1.5 }}>
        Cada abreviatura o icono <b>subrayado</b> en la app se puede tocar para ver aquí qué significa.
        Este es el listado completo.
      </p>
      <input
        className="field"
        placeholder="Buscar término (RIR, 1RM, TDEE…)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      {GLOSSARY_CATEGORIES.map((cat) => {
        const items = filtered.filter((g) => g.category === cat.id);
        if (items.length === 0) return null;
        return (
          <div key={cat.id} style={{ marginBottom: 14 }}>
            <div className="faint" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', margin: '4px 0 8px' }}>
              {cat.emoji} {cat.label.toUpperCase()}
            </div>
            <div className="card card-flush" style={{ padding: '2px 14px' }}>
              {items.map((g) => (
                <button key={g.id} className="list-item" style={{ width: '100%', textAlign: 'left' }} onClick={() => open(g.id)}>
                  <span className="glossary-term" style={{ fontSize: 15, minWidth: 60, flex: '0 0 auto' }}>{g.term}</span>
                  <div className="grow">
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{g.title}</div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 1, lineHeight: 1.4 }}>{g.short}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {filtered.length === 0 && <div className="faint" style={{ fontSize: 13 }}>Sin resultados para "{q}".</div>}
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GuideTab() {
  const [q, setQ] = useState('');
  const techFiltered = TECHNIQUE.filter(
    (t) => t.exercise.toLowerCase().includes(q.toLowerCase()) || t.muscles.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div style={{ paddingTop: 16 }}>
      <div className="card" style={{ background: 'var(--surface-2)' }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>📚 Base técnica</div>
        <p className="muted" style={{ fontSize: 13.5, marginTop: 6, lineHeight: 1.5 }}>
          Metodología y técnica extraídas de la biblioteca de entrenamiento de fuerza (Balsalobre · González-Badillo ·
          Carrasco · Vinuesa · Delavier). Es lo que sostiene las decisiones de la app.
        </p>
      </div>

      {/* Glosario */}
      <div className="section-title">Glosario · qué significa cada sigla</div>
      <Glosario />

      {/* Calculadora */}
      <div className="section-title">Herramientas</div>
      <OneRmCalculator />

      {/* Mesociclo */}
      <div className="section-title">El mesociclo de 5 semanas</div>
      <div className="card">
        <Table
          head={['Semana', 'Foco', 'Esfuerzo']}
          rows={MESOCYCLE_PLAN.map((w) => [w.week, w.focus, w.rir])}
        />
        <p className="faint" style={{ fontSize: 11.5, marginTop: 10 }}>
          Se acumula fatiga 4 semanas y se descarga en la 5ª: la supercompensación deja aflorar las adaptaciones. [Car]
        </p>
      </div>

      {/* Zonas de %1RM */}
      <div className="section-title">Zonas de intensidad (%1RM)</div>
      <div className="card">
        <Table
          head={['%1RM', 'Reps', 'Objetivo']}
          rows={RM_ZONES.map((z) => [z.pct, z.reps, z.goal])}
        />
        <p className="faint" style={{ fontSize: 11.5, marginTop: 10 }}>
          Fuerza 85-100% (1-6 reps) · Hipertrofia 65-85% (6-12) · Resistencia &lt;65%. [Bal/Bad/Vin]
        </p>
      </div>

      {/* RIR / RPE */}
      <div className="section-title">Autorregulación (RIR / RPE)</div>
      <div className="card">
        <Table
          head={['RPE', 'RIR', 'Sensación', 'Uso']}
          rows={RIR_SCALE.map((r) => [r.rpe, r.rir, r.feel, r.use])}
        />
        <p className="faint" style={{ fontSize: 11.5, marginTop: 10 }}>
          Entrena dejando reps en reserva: maximiza fuerza con la mínima fatiga. El fallo, solo puntual. [Bal]
        </p>
      </div>

      {/* Volumen */}
      <div className="section-title">Volumen semanal por grupo</div>
      <div className="card">
        <Table
          head={['Umbral', 'Series/sem', 'Significado']}
          rows={VOLUME_LANDMARKS.map((v) => [v.label, v.series, v.meaning])}
        />
      </div>

      {/* Descanso */}
      <div className="section-title">Descanso entre series</div>
      <div className="card">
        <Table
          head={['Objetivo', 'Intensidad', 'Descanso']}
          rows={REST_GUIDE.map((r) => [r.goal, r.intensity, r.rest])}
        />
      </div>

      {/* Principios */}
      <div className="section-title">Principios que aplica la app</div>
      <div className="stack">
        {PRINCIPLES.map((p) => (
          <div className="card" key={p.title}>
            <div className="spread">
              <span style={{ fontWeight: 700, fontSize: 14.5 }}>{p.title}</span>
              <span className="faint" style={{ fontSize: 11 }}>{p.source}</span>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{p.body}</p>
          </div>
        ))}
      </div>

      {/* Métodos de entrenamiento */}
      <div className="section-title">Métodos de entrenamiento</div>
      <p className="muted" style={{ fontSize: 12.5, marginTop: -6, marginBottom: 10 }}>
        Cada semana el mesociclo destaca una forma distinta de entrenar para variar el estímulo. Aquí tienes todas:
      </p>
      <div className="stack">
        {METHODS.map((m) => (
          <div className="card" key={m.id}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{m.emoji} {m.name}</div>
            <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{m.how}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>📌 {m.when}</div>
          </div>
        ))}
      </div>

      {/* Fórmulas */}
      <div className="section-title">Fórmulas</div>
      <div className="card stack">
        {FORMULAS.map((f) => (
          <div key={f.name}>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>{f.name}</div>
            <div className="num" style={{ fontSize: 13, marginTop: 3, color: 'var(--accent)' }}>{f.expr}</div>
            <div className="faint" style={{ fontSize: 12 }}>{f.note}</div>
          </div>
        ))}
      </div>

      {/* Técnica */}
      <div className="section-title">Técnica por ejercicio</div>
      <input
        className="field"
        placeholder="Buscar ejercicio o músculo…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <div className="stack">
        {techFiltered.map((t) => (
          <div className="card" key={t.exercise}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{t.exercise}</div>
            <div className="faint" style={{ fontSize: 11.5, marginTop: 3 }}>{t.muscles}</div>
            <ul style={{ margin: '10px 0 0', paddingLeft: 18, fontSize: 13, lineHeight: 1.5 }}>
              {t.cues.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
            <div style={{ fontSize: 12.5, marginTop: 8, color: 'var(--warn)' }}>⚠️ {t.mistake}</div>
          </div>
        ))}
        {techFiltered.length === 0 && (
          <div className="faint" style={{ fontSize: 13 }}>Sin resultados para "{q}".</div>
        )}
      </div>

      <p className="faint" style={{ fontSize: 11, marginTop: 24, textAlign: 'center', lineHeight: 1.5 }}>
        Fuentes en <code>docs/metodologia-fuerza.md</code> y <code>docs/tecnica-ejercicios.md</code>.
      </p>
    </div>
  );
}
