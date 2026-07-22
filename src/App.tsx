import { useEffect, useState } from 'react';
import { useStore, type Tab } from '@/store/useStore';
import { SESSIONS_BY_ID } from '@/data/sessions';
import TabBar from '@/components/TabBar';
import Onboarding from '@/components/Onboarding';
import DashboardTab from '@/components/home/DashboardTab';
import PlanTab from '@/components/plan/PlanTab';
import ProgressTab from '@/components/progress/ProgressTab';
import NutritionTab from '@/components/nutrition/NutritionTab';
import GuideTab from '@/components/guide/GuideTab';
import ActiveSessionView from '@/components/session/ActiveSessionView';
import SaveSummary from '@/components/session/SaveSummary';
import ReadinessModal from '@/components/plan/ReadinessModal';
import { GlossarySheet } from '@/components/ui/Explain';
import { primeAudio } from '@/lib/sound';

const TAB_TITLES: Record<Tab, string> = {
  home: 'Fuerza',
  plan: 'Entreno',
  progress: 'Progreso',
  nutrition: 'Nutrición',
  guide: 'Guía',
};

export default function App() {
  const darkMode = useStore((s) => s.darkMode);
  const toggleDark = useStore((s) => s.toggleDark);
  const onboarded = useStore((s) => s.onboarded);
  const active = useStore((s) => s.active);
  const lastVerdict = useStore((s) => s.lastVerdict);
  const dismissVerdict = useStore((s) => s.dismissVerdict);
  const pendingStart = useStore((s) => s.pendingStart);
  const startSession = useStore((s) => s.startSession);
  const cancelStart = useStore((s) => s.cancelStart);
  const [tab, setTab] = useState<Tab>('home');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', darkMode ? '#0d0d11' : '#f3f3f7');
  }, [darkMode]);

  useEffect(() => {
    const unlock = () => primeAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  if (!onboarded) return <Onboarding />;

  if (active) {
    return (
      <div className="app">
        <ActiveSessionView />
        <GlossarySheet />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">F</span>
          <span>{TAB_TITLES[tab]}</span>
        </div>
        <button className="icon-btn" onClick={toggleDark} aria-label="Cambiar tema">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="shell">
        {tab === 'home' && <DashboardTab onNavigate={setTab} />}
        {tab === 'plan' && <PlanTab />}
        {tab === 'progress' && <ProgressTab />}
        {tab === 'nutrition' && <NutritionTab />}
        {tab === 'guide' && <GuideTab />}
      </main>

      <TabBar tab={tab} onChange={setTab} />

      {pendingStart && (
        <ReadinessModal
          sessionTitle={SESSIONS_BY_ID[pendingStart.sessionId].title.split('—')[0].trim()}
          onConfirm={(r) => startSession({ ...pendingStart, readiness: r })}
          onClose={cancelStart}
        />
      )}

      {lastVerdict && <SaveSummary verdict={lastVerdict} onClose={dismissVerdict} />}

      <GlossarySheet />
    </div>
  );
}
