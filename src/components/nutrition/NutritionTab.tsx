import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { MACROS_BASE, MEALS_BY_DAY, NUTRITION_TIPS, SHOPPING } from '@/data/nutrition';
import { WEEK_TEMPLATE } from '@/data/schedule';
import { adjustMacros } from '@/lib/tdee';
import type { Meal } from '@/types';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function todayIdx(): number {
  const js = new Date().getDay(); // 0=Dom
  return js === 0 ? 6 : js - 1;
}

function minutesOf(time: string): number {
  const [h, m] = time.split(':').map((x) => parseInt(x, 10));
  return h * 60 + (m || 0);
}

function pickHeroMeal(meals: Meal[]): { meal: Meal; label: string } | null {
  if (meals.length === 0) return null;
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  const sorted = [...meals].sort((a, b) => minutesOf(a.time) - minutesOf(b.time));
  const current = sorted.find((m) => Math.abs(minutesOf(m.time) - now) <= 90);
  if (current) return { meal: current, label: 'Ahora' };
  const next = sorted.find((m) => minutesOf(m.time) > now);
  if (next) return { meal: next, label: 'Siguiente' };
  return { meal: sorted[0], label: 'Mañana' };
}

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div className="spread" style={{ fontSize: 12.5, marginBottom: 4 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span className="num muted">{Math.round(value)} / {target}</span>
      </div>
      <div className="bar"><span style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

export default function NutritionTab() {
  const bodyWeights = useStore((s) => s.bodyWeights);
  const checkedItems = useStore((s) => s.checkedItems);
  const toggleShopItem = useStore((s) => s.toggleShopItem);
  const clearShopItems = useStore((s) => s.clearShopItems);

  const [day, setDay] = useState(todayIdx());
  const [showStrategy, setShowStrategy] = useState(false);
  const [showShopping, setShowShopping] = useState(false);

  const meals = MEALS_BY_DAY[day] ?? [];
  const dayType = WEEK_TEMPLATE[day]?.type ?? 'train';
  const base = dayType === 'rest' ? MACROS_BASE.rest : MACROS_BASE.train;
  const adj = useMemo(() => adjustMacros(base, bodyWeights), [base, bodyWeights]);
  const target = adj.macros;

  const planned = meals.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.macros.kcal,
      protein: acc.protein + m.macros.p,
      carbs: acc.carbs + m.macros.c,
      fat: acc.fat + m.macros.f,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const hero = pickHeroMeal(meals);
  const checkedCount = SHOPPING.reduce((n, sec) => n + sec.items.filter((it) => checkedItems[it.id]).length, 0);
  const totalItems = SHOPPING.reduce((n, sec) => n + sec.items.length, 0);

  return (
    <div style={{ paddingTop: 16 }}>
      {/* Selector de día */}
      <div className="chips">
        {DAYS.map((d, i) => (
          <button key={i} className={`chip ${i === day ? 'active' : ''}`} onClick={() => setDay(i)}>{d}</button>
        ))}
      </div>

      {/* Objetivo de macros */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="spread" style={{ marginBottom: 12 }}>
          <div>
            <div className="faint" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
              OBJETIVO · {dayType === 'rest' ? 'DÍA DE DESCANSO' : 'DÍA DE ENTRENO'}
            </div>
            <div className="hero-num" style={{ fontSize: 28 }}>{target.kcal} <span className="muted" style={{ fontSize: 15 }}>kcal</span></div>
          </div>
          {adj.adjusted && (
            <span className="badge" style={{ background: 'var(--accent)', color: '#fff' }}>Ajustado por TDEE</span>
          )}
        </div>
        <div className="stack" style={{ gap: 9 }}>
          <MacroBar label="Calorías" value={planned.kcal} target={target.kcal} color="var(--accent)" />
          <MacroBar label="Proteína (g)" value={planned.protein} target={target.protein} color="#22c55e" />
          <MacroBar label="Carbos (g)" value={planned.carbs} target={target.carbs} color="#f59e0b" />
          <MacroBar label="Grasa (g)" value={planned.fat} target={target.fat} color="#8b5cf6" />
        </div>
        {adj.adjusted && (
          <div className="faint" style={{ fontSize: 11.5, marginTop: 10 }}>
            Ajuste de {adj.deltaKcal > 0 ? '+' : ''}{adj.deltaKcal} kcal según tu tendencia de peso ({adj.rateKgWeek?.toFixed(2)} kg/sem).
          </div>
        )}
      </div>

      {/* Comida hero */}
      {hero && (
        <>
          <div className="section-title">{hero.label === 'Ahora' ? 'Toca ahora' : hero.label === 'Siguiente' ? 'Siguiente comida' : 'Próxima comida'}</div>
          <div className="meal-hero">
            <div className="spread">
              <div className="row" style={{ gap: 8 }}>
                <span className="pill">{hero.meal.time}</span>
                {hero.meal.highlight && <span className="badge" style={{ background: 'var(--surface-3)' }}>{hero.meal.highlight}</span>}
              </div>
              <span className="num muted" style={{ fontSize: 12 }}>{hero.meal.macros.kcal} kcal</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, marginTop: 8 }}>{hero.meal.label}</div>
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 13.5, lineHeight: 1.5 }}>
              {hero.meal.items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
            <div className="row" style={{ marginTop: 10, gap: 8, flexWrap: 'wrap' }}>
              <span className="pill" style={{ fontSize: 11 }}>P {hero.meal.macros.p}g</span>
              <span className="pill" style={{ fontSize: 11 }}>C {hero.meal.macros.c}g</span>
              <span className="pill" style={{ fontSize: 11 }}>G {hero.meal.macros.f}g</span>
            </div>
          </div>
        </>
      )}

      {/* Resto de comidas del día */}
      <div className="section-title">Comidas del día</div>
      <div className="card card-flush" style={{ padding: '4px 16px' }}>
        {meals.map((m, i) => (
          <div className="list-item" key={i}>
            <span className="pill" style={{ fontSize: 11, flex: '0 0 auto' }}>{m.time}</span>
            <div className="grow">
              <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
              <div className="faint" style={{ fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                {m.items[0]}
              </div>
            </div>
            <span className="num muted" style={{ fontSize: 12 }}>{m.macros.kcal}</span>
          </div>
        ))}
      </div>

      {/* Estrategia + Lidl */}
      <div className="section-title">Estrategia</div>
      <div className="card card-flush">
        <button className="acc-head" style={{ width: '100%' }} onClick={() => setShowStrategy(!showStrategy)}>
          <span style={{ fontWeight: 700 }}>💡 Estrategia + compra en Lidl</span>
          <span className="faint">{showStrategy ? '▲' : '▼'}</span>
        </button>
        {showStrategy && (
          <div className="acc-body stack">
            {NUTRITION_TIPS.map((t, i) => (
              <div key={i} className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{t.title}</div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{t.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de la compra */}
      <div className="section-title">Lista de la compra</div>
      <div className="card card-flush">
        <button className="acc-head" style={{ width: '100%' }} onClick={() => setShowShopping(!showShopping)}>
          <span style={{ fontWeight: 700 }}>🛒 Semanal · {checkedCount}/{totalItems}</span>
          <span className="faint">{showShopping ? '▲' : '▼'}</span>
        </button>
        {showShopping && (
          <div className="acc-body">
            <button className="btn btn-sm" style={{ marginBottom: 12 }} onClick={clearShopItems}>Desmarcar todo</button>
            {SHOPPING.map((sec) => (
              <div key={sec.section} style={{ marginBottom: 14 }}>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{sec.emoji} {sec.section}</div>
                {sec.items.map((it) => {
                  const on = !!checkedItems[it.id];
                  return (
                    <div className="list-item" key={it.id} onClick={() => toggleShopItem(it.id)} style={{ cursor: 'pointer' }}>
                      <span className={`checkbox ${on ? 'on' : ''}`}>✓</span>
                      <div className="grow">
                        <div className={`${on ? 'struck' : ''}`} style={{ fontSize: 13.5 }}>{it.name}</div>
                        <div className="faint" style={{ fontSize: 11 }}>{it.qty} · {it.price} €</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
