import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { MACROS_BASE, NUTRITION_TIPS, SHOPPING } from '@/data/nutrition';
import { WEEK_TEMPLATE } from '@/data/schedule';
import { adjustMacros } from '@/lib/tdee';
import { dayMacros, pickHero, planForDay, weekBucket } from '@/lib/mealPlan';
import { Explain } from '@/components/ui/Explain';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function todayIdx(): number {
  const js = new Date().getDay();
  return js === 0 ? 6 : js - 1;
}

function MacroBar({ label, explainId, value, target, color }: { label: string; explainId?: string; value: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div className="spread" style={{ fontSize: 12.5, marginBottom: 4 }}>
        <span style={{ fontWeight: 600 }}>{explainId ? <Explain id={explainId}>{label}</Explain> : label}</span>
        <span className="num muted">{Math.round(value)} / {target}</span>
      </div>
      <div className="bar"><span style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

export default function NutritionTab() {
  const bodyWeights = useStore((s) => s.bodyWeights);
  const checkedItems = useStore((s) => s.checkedItems);
  const mealOverrides = useStore((s) => s.mealOverrides);
  const toggleShopItem = useStore((s) => s.toggleShopItem);
  const clearShopItems = useStore((s) => s.clearShopItems);
  const setMealOverride = useStore((s) => s.setMealOverride);

  const [day, setDay] = useState(todayIdx());
  const [showStrategy, setShowStrategy] = useState(false);
  const [showShopping, setShowShopping] = useState(false);

  const bucket = weekBucket();
  const meals = useMemo(() => planForDay(day, bucket, mealOverrides), [day, bucket, mealOverrides]);
  const dayType = WEEK_TEMPLATE[day]?.type ?? 'train';
  const base = dayType === 'rest' ? MACROS_BASE.rest : MACROS_BASE.train;
  const adj = useMemo(() => adjustMacros(base, bodyWeights), [base, bodyWeights]);
  const target = adj.macros;

  const planned = dayMacros(meals);
  const hero = pickHero(meals);

  const checkedCount = SHOPPING.reduce((n, sec) => n + sec.items.filter((it) => checkedItems[it.id]).length, 0);
  const totalItems = SHOPPING.reduce((n, sec) => n + sec.items.length, 0);

  const swap = (key: string, poolIndex: number, poolLength: number) =>
    setMealOverride(key, (poolIndex + 1) % poolLength);

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
            <div className="hero-num" style={{ fontSize: 28 }}>{target.kcal} <span className="muted" style={{ fontSize: 15 }}><Explain id="kcal">kcal</Explain></span></div>
          </div>
          {adj.adjusted && <Explain id="tdee"><span className="badge" style={{ background: 'var(--accent)', color: '#fff' }}>Ajustado por TDEE</span></Explain>}
        </div>
        <div className="stack" style={{ gap: 9 }}>
          <MacroBar label="Calorías" explainId="kcal" value={planned.kcal} target={target.kcal} color="var(--accent)" />
          <MacroBar label="Proteína (g)" explainId="proteina" value={planned.protein} target={target.protein} color="#22c55e" />
          <MacroBar label="Carbos (g)" explainId="carbohidratos" value={planned.carbs} target={target.carbs} color="#f59e0b" />
          <MacroBar label="Grasa (g)" explainId="grasa" value={planned.fat} target={target.fat} color="#8b5cf6" />
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
                <span className="faint" style={{ fontSize: 12 }}>{hero.meal.slotLabel}</span>
              </div>
              <span className="num muted" style={{ fontSize: 12 }}>{hero.meal.meal.macros.kcal} kcal</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, marginTop: 8 }}>{hero.meal.meal.label}</div>
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 13.5, lineHeight: 1.5 }}>
              {hero.meal.meal.items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
            <div className="spread" style={{ marginTop: 10 }}>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <span className="pill" style={{ fontSize: 11 }}><Explain id="proteina">P</Explain> {hero.meal.meal.macros.p}g</span>
                <span className="pill" style={{ fontSize: 11 }}><Explain id="carbohidratos">C</Explain> {hero.meal.meal.macros.c}g</span>
                <span className="pill" style={{ fontSize: 11 }}><Explain id="grasa">G</Explain> {hero.meal.meal.macros.f}g</span>
              </div>
              <button className="btn btn-sm" onClick={() => swap(hero.meal.key, hero.meal.poolIndex, hero.meal.poolLength)}>🔄 Cambiar</button>
            </div>
          </div>
        </>
      )}

      {/* Comidas del día (todas, con opción de cambiar) */}
      <div className="section-title">Comidas del día</div>
      <div className="stack">
        {meals.map((pm) => (
          <div className="card" key={pm.key}>
            <div className="spread">
              <div className="row" style={{ gap: 8 }}>
                <span className="pill" style={{ fontSize: 11 }}>{pm.time}</span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{pm.slotLabel}</span>
              </div>
              <span className="num muted" style={{ fontSize: 12 }}>{pm.meal.macros.kcal} kcal</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 6 }}>{pm.meal.label}</div>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 13, lineHeight: 1.45 }}>
              {pm.meal.items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
            {pm.meal.note && <div className="faint" style={{ fontSize: 11.5, marginTop: 6, fontStyle: 'italic' }}>{pm.meal.note}</div>}
            <div className="spread" style={{ marginTop: 10 }}>
              <div className="row" style={{ gap: 6 }}>
                <span className="pill" style={{ fontSize: 10.5 }}><Explain id="proteina">P</Explain> {pm.meal.macros.p}</span>
                <span className="pill" style={{ fontSize: 10.5 }}><Explain id="carbohidratos">C</Explain> {pm.meal.macros.c}</span>
                <span className="pill" style={{ fontSize: 10.5 }}><Explain id="grasa">G</Explain> {pm.meal.macros.f}</span>
              </div>
              <button className="btn btn-sm btn-ghost" onClick={() => swap(pm.key, pm.poolIndex, pm.poolLength)}>
                🔄 Cambiar ({pm.poolIndex + 1}/{pm.poolLength})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estrategia */}
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
