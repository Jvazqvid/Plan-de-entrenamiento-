import type { Tab } from '@/store/useStore';

const TABS: { id: Tab; ico: string; label: string }[] = [
  { id: 'home', ico: '🏠', label: 'Hoy' },
  { id: 'plan', ico: '🏋️', label: 'Entreno' },
  { id: 'progress', ico: '📈', label: 'Progreso' },
  { id: 'nutrition', ico: '🍽️', label: 'Nutrición' },
  { id: 'guide', ico: '📚', label: 'Guía' },
];

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
}

export default function TabBar({ tab, onChange }: Props) {
  return (
    <nav className="tabbar">
      <div className="tabbar-inner">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => onChange(t.id)}
          >
            <span className="ico">{t.ico}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
