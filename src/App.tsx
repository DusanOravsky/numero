import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PWAPrompts } from './components/PWAPrompts';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { NumerologyPage } from './pages/NumerologyPage';
import { AstrologyPage } from './pages/AstrologyPage';
import { HumanDesignPage } from './pages/HumanDesignPage';
import { RelationshipsPage } from './pages/RelationshipsPage';
import { ChakrasPage } from './pages/ChakrasPage';
import { KabalahPage } from './pages/KabalahPage';
import { ThetaHealingPage } from './pages/ThetaHealingPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfileSetup } from './pages/ProfileSetup';
import { ClientsPage } from './pages/ClientsPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { SharedView } from './pages/SharedView';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="numerology" element={<NumerologyPage />} />
          <Route path="astrology" element={<AstrologyPage />} />
          <Route path="human-design" element={<HumanDesignPage />} />
          <Route path="relationships" element={<RelationshipsPage />} />
          <Route path="chakras" element={<ChakrasPage />} />
          <Route path="kabalah" element={<KabalahPage />} />
          <Route path="theta-healing" element={<ThetaHealingPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDashboard />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfileSetup />} />
          <Route path="shared" element={<SharedView />} />
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
        <SharedView />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <PWAPrompts />
        <AnimatedRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
