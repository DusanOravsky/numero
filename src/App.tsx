import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="numerology" element={<NumerologyPage />} />
            <Route path="astrology" element={<AstrologyPage />} />
            <Route path="human-design" element={<HumanDesignPage />} />
            <Route path="relationships" element={<RelationshipsPage />} />
            <Route path="chakras" element={<ChakrasPage />} />
            <Route path="kabalah" element={<KabalahPage />} />
            <Route path="theta-healing" element={<ThetaHealingPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfileSetup />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
