import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PWAPrompts } from './components/PWAPrompts';
import { OnboardingTour } from './components/OnboardingTour';
import { useTheme } from './hooks/useTheme';
import { useStore } from './store/useStore';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';

// Lazy-load large secondary pages to keep initial bundle small.
// Dashboard stays eager since it's the landing page; everything else
// is fetched on demand and Suspense fallback shows a brief shimmer.
const NumerologyPage = lazy(() => import('./pages/NumerologyPage').then(m => ({ default: m.NumerologyPage })));
const AstrologyPage = lazy(() => import('./pages/AstrologyPage').then(m => ({ default: m.AstrologyPage })));
const HumanDesignPage = lazy(() => import('./pages/HumanDesignPage').then(m => ({ default: m.HumanDesignPage })));
const RelationshipsPage = lazy(() => import('./pages/RelationshipsPage').then(m => ({ default: m.RelationshipsPage })));
const ChakrasPage = lazy(() => import('./pages/ChakrasPage').then(m => ({ default: m.ChakrasPage })));
const KabalahPage = lazy(() => import('./pages/KabalahPage').then(m => ({ default: m.KabalahPage })));
const ThetaHealingPage = lazy(() => import('./pages/ThetaHealingPage').then(m => ({ default: m.ThetaHealingPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup').then(m => ({ default: m.ProfileSetup })));
const ClientsPage = lazy(() => import('./pages/ClientsPage').then(m => ({ default: m.ClientsPage })));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(m => ({ default: m.ComparePage })));
const SharedView = lazy(() => import('./pages/SharedView').then(m => ({ default: m.SharedView })));
const ModalityPage = lazy(() => import('./pages/ModalityPage').then(m => ({ default: m.ModalityPage })));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="text-sm text-slate-500 mt-3">Načítavam…</p>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  useTheme();
  const profiles = useStore(s => s.profiles);
  // Onboarding sa zobrazí len ak používateľ má profil A ešte tour nebol dokončený.
  // Druhú podmienku kontroluje OnboardingTour samotný cez useEffect, ale gating tu
  // šetrí mount/unmount na každú navigáciu.
  const showOnboarding = profiles.length > 0 && !localStorage.getItem('onboarding-completed');

  return (
    <AnimatePresence mode="wait">
      {showOnboarding && <OnboardingTour />}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="numerology"
            element={
              <Suspense fallback={<PageFallback />}>
                <NumerologyPage />
              </Suspense>
            }
          />
          <Route
            path="astrology"
            element={
              <Suspense fallback={<PageFallback />}>
                <AstrologyPage />
              </Suspense>
            }
          />
          <Route
            path="human-design"
            element={
              <Suspense fallback={<PageFallback />}>
                <HumanDesignPage />
              </Suspense>
            }
          />
          <Route
            path="relationships"
            element={
              <Suspense fallback={<PageFallback />}>
                <RelationshipsPage />
              </Suspense>
            }
          />
          <Route
            path="chakras"
            element={
              <Suspense fallback={<PageFallback />}>
                <ChakrasPage />
              </Suspense>
            }
          />
          <Route
            path="kabalah"
            element={
              <Suspense fallback={<PageFallback />}>
                <KabalahPage />
              </Suspense>
            }
          />
          <Route
            path="theta-healing"
            element={
              <Suspense fallback={<PageFallback />}>
                <ThetaHealingPage />
              </Suspense>
            }
          />
          <Route
            path="clients"
            element={
              <Suspense fallback={<PageFallback />}>
                <ClientsPage />
              </Suspense>
            }
          />
          <Route
            path="clients/compare"
            element={
              <Suspense fallback={<PageFallback />}>
                <ComparePage />
              </Suspense>
            }
          />
          <Route
            path="clients/:id"
            element={
              <Suspense fallback={<PageFallback />}>
                <ClientDashboard />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageFallback />}>
                <SettingsPage />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<PageFallback />}>
                <ProfileSetup />
              </Suspense>
            }
          />
          <Route
            path="shared"
            element={
              <Suspense fallback={<PageFallback />}>
                <SharedView />
              </Suspense>
            }
          />
          <Route
            path="modality"
            element={
              <Suspense fallback={<PageFallback />}>
                <ModalityPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  // Handle hash-based shared links: #/shared?data=...
  const hash = window.location.hash;
  if (hash.startsWith('#/shared')) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <SharedView />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <PWAPrompts />
        <AnimatedRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
