import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const navigate = useNavigate();
  const { profiles, activeProfileId, setActiveProfile, deleteProfile } = useStore();
  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Nastavenia</h1>
        <p className="text-slate-400 mt-1">Správa profilov a preferencií</p>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-white">Profily</h3>
          <button
            onClick={() => navigate('/profile')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            + Nový profil
          </button>
        </div>
        <div className="space-y-3">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className={`p-4 rounded-xl border transition-all ${
                profile.id === activeProfileId
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-white/5 bg-white/5 hover:border-indigo-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{profile.name}</p>
                  <p className="text-sm text-slate-400">
                    {profile.birthDay}.{profile.birthMonth}.{profile.birthYear}
                    {profile.birthHour !== undefined && ` ${profile.birthHour}:${String(profile.birthMinute || 0).padStart(2, '0')}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {profile.id !== activeProfileId && (
                    <button
                      onClick={() => setActiveProfile(profile.id)}
                      className="px-3 py-1.5 rounded-lg text-xs text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/10"
                    >
                      Aktivovať
                    </button>
                  )}
                  {profile.id === activeProfileId && (
                    <span className="px-3 py-1.5 rounded-lg text-xs text-green-300 bg-green-500/10">Aktívny</span>
                  )}
                  <button
                    onClick={() => { if (confirm('Naozaj vymazať profil?')) deleteProfile(profile.id); }}
                    className="px-3 py-1.5 rounded-lg text-xs text-red-300 border border-red-500/30 hover:bg-red-500/10"
                  >
                    Zmazať
                  </button>
                </div>
              </div>
            </div>
          ))}
          {profiles.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">Žiadne profily. Vytvorte si prvý.</p>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-medium text-white mb-3">O aplikácii</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <p><strong className="text-slate-300">Número</strong> – Duchovno-analytická aplikácia</p>
          <p>Verzia: 1.0.0</p>
          <p>Všetky údaje sú uložené lokálne vo vašom zariadení.</p>
          <p>Žiadne dáta nie sú odosielané na server.</p>
          <p>Aplikácia funguje kompletne offline.</p>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-medium text-white mb-3">Súkromie</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Žiadne sledovanie</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Žiadne cookies tretích strán</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Offline-first architektúra</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Lokálne šifrovanie dát</span>
          </div>
        </div>
      </GlassCard>

      {activeProfile && (
        <GlassCard>
          <h3 className="font-medium text-white mb-3">Export dát</h3>
          <button
            onClick={() => {
              const data = JSON.stringify({ profiles, activeProfileId }, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'numero-backup.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium glass text-indigo-300 hover:text-white"
          >
            Exportovať zálohu (JSON)
          </button>
        </GlassCard>
      )}
    </div>
  );
}
