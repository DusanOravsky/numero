import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { NumerologyMethod } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router-dom';
import { APP_VERSION } from '../components/PWAPrompts';
import { searchCities, findCity } from '../data/cities';

export function SettingsPage() {
  const navigate = useNavigate();
  const { profiles, activeProfileId, setActiveProfile, updateProfile, deleteProfile, numerologyMethod, setNumerologyMethod } = useStore();
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHour, setEditHour] = useState('');
  const [editMinute, setEditMinute] = useState('');
  const [editPlace, setEditPlace] = useState('');
  const [editName, setEditName] = useState('');
  const [editGender, setEditGender] = useState<'male' | 'female' | ''>('');
  const [citySuggestions, setCitySuggestions] = useState<{ name: string }[]>([]);

  const startEdit = (profileId: string) => {
    const p = profiles.find(pr => pr.id === profileId);
    if (!p) return;
    setEditingId(profileId);
    setEditName(p.name);
    setEditGender(p.gender || '');
    setEditHour(p.birthHour !== undefined ? String(p.birthHour) : '');
    setEditMinute(p.birthMinute !== undefined ? String(p.birthMinute) : '');
    setEditPlace(p.birthPlace || '');
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmedName = editName.trim();
    if (!trimmedName) {
      alert('Meno nesmie byť prázdne.');
      return;
    }
    const city = findCity(editPlace);
    updateProfile(editingId, {
      name: trimmedName,
      gender: editGender || undefined,
      birthHour: editHour ? parseInt(editHour) : undefined,
      birthMinute: editMinute ? parseInt(editMinute) : undefined,
      birthPlace: editPlace.trim() || undefined,
      birthLatitude: city?.lat,
      birthLongitude: city?.lon,
    });
    setEditingId(null);
  };

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
                    {profile.birthPlace && ` | ${profile.birthPlace}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(profile.id)}
                    className="px-3 py-1.5 rounded-lg text-xs text-amber-300 border border-amber-500/30 hover:bg-amber-500/10"
                  >
                    Upraviť
                  </button>
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

              {editingId === profile.id && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Meno</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Pohlavie</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setEditGender('male')} className={`py-1.5 rounded-lg text-xs border-2 ${editGender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 bg-white text-slate-600'}`}>♂ Muž</button>
                      <button type="button" onClick={() => setEditGender('female')} className={`py-1.5 rounded-lg text-xs border-2 ${editGender === 'female' ? 'border-rose-500 bg-rose-50 text-rose-700 font-medium' : 'border-slate-200 bg-white text-slate-600'}`}>♀ Žena</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Čas narodenia (24h)</label>
                    <div className="flex gap-2 items-center">
                      <input type="number" placeholder="Hod" min={0} max={23} value={editHour} onChange={e => setEditHour(e.target.value)} className="w-16 px-2 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-center text-sm" />
                      <span className="text-slate-400">:</span>
                      <input type="number" placeholder="Min" min={0} max={59} value={editMinute} onChange={e => setEditMinute(e.target.value)} className="w-16 px-2 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-center text-sm" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs text-slate-500 mb-1">Miesto narodenia</label>
                    <input type="text" placeholder="Napr. Bratislava, Praha..." value={editPlace} onChange={e => { setEditPlace(e.target.value); setCitySuggestions(searchCities(e.target.value)); }} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-sm" />
                    {citySuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg bg-white border border-slate-200 overflow-hidden shadow-lg">
                        {citySuggestions.map(city => (
                          <button key={city.name} type="button" onClick={() => { setEditPlace(city.name); setCitySuggestions([]); }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50">
                            {city.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-500">Uložiť</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg text-sm text-slate-400">Zrušiť</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {profiles.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">Žiadne profily. Vytvorte si prvý.</p>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-medium text-white mb-2">Numerologická metóda</h3>
        <p className="text-sm text-slate-500 mb-4">
          Aplikácia podporuje dve rôzne školy numerológie. Líšia sa vo výpočte mriežky aj vo významoch jednotlivých políčok. Vyber si tú, s ktorou pracuješ.
        </p>

        <div className="space-y-3">
          <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${numerologyMethod === 'characterological' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="numerology-method"
                value="characterological"
                checked={numerologyMethod === 'characterological'}
                onChange={() => setNumerologyMethod('characterological' as NumerologyMethod)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-800">Charakterová mriežka</p>
                <p className="text-xs text-slate-500 mt-1">
                  Ukazuje <strong>vrodené kvality a archetypy</strong>, ktoré človek dostal do vienka. Mriežka sa skladá z cifier dátumu narodenia + redukcií dňa, mesiaca a roku. Významy: 1 = Ja/začiatok, 2 = Intuícia, 3 = Kreativita, 4 = Stabilita, 5 = Sloboda, 6 = Láska/rodina, 7 = Duchovno, 8 = Hojnosť, 9 = Múdrosť.
                </p>
                <p className="text-[11px] text-indigo-600 mt-2 italic">Zdroj: Robin Steinová – Numerológia: Čísla Lásky</p>
              </div>
            </div>
          </label>

          <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${numerologyMethod === 'developmental' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="numerology-method"
                value="developmental"
                checked={numerologyMethod === 'developmental'}
                onChange={() => setNumerologyMethod('developmental' as NumerologyMethod)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-800">Vývojová mriežka</p>
                <p className="text-xs text-slate-500 mt-1">
                  Ukazuje <strong>životné úlohy a karmické cykly</strong>, ktoré si duša prišla riešiť. Do mriežky vstupujú aj <strong>4 "zakrúžkované" pomocné čísla</strong>. Roky 2000+ sa počítajú špeciálne (rok = 20 + zvyšok). Významy: 1 = Ego (mužské/ženské), 2 = Bioenergia tela, 3 = Vnútorná múdrosť, 4 = Sebavedomie, 5 = Intuícia, 6 = Vytrvalosť (2+ = mág), 7 = Dôvera, 8 = Škola lásky, 9 = Hmotný svet/financie.
                </p>
                <p className="text-[11px] text-indigo-600 mt-2 italic">Zdroj: kniha Lívia Mičková – Duchovná numerológia</p>
              </div>
            </div>
          </label>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-medium text-white mb-3">Inštalácia na plochu</h3>
        <p className="text-sm text-slate-400 mb-3">Aplikácia funguje aj offline. Po inštalácii ju nájdete na ploche ako bežnú appku.</p>

        {(() => {
          const ua = navigator.userAgent;
          const isIDevice = /iPad|iPhone|iPod/.test(ua) && !(/(Windows|Android)/.test(ua));
          const isIPadOS = /Macintosh/.test(ua) && 'ontouchend' in document;
          const ios = isIDevice || isIPadOS;
          const isAndroid = /Android/.test(ua);

          if (ios) {
            return (
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  <strong>iPhone / iPad (Safari):</strong>
                </p>
                <ol className="text-sm text-slate-500 list-decimal list-inside space-y-1">
                  <li>Klepnite dole na ikonu <strong>Zdieľať</strong> (štvorček so šípkou hore).</li>
                  <li>Posuňte sa nadol a zvoľte <strong>"Pridať na plochu"</strong> / "Add to Home Screen".</li>
                  <li>Potvrďte tlačidlom <strong>Pridať</strong>.</li>
                </ol>
                <p className="text-xs text-slate-400 mt-2">
                  Pozn.: iOS Safari nepodporuje automatické inštalačné okno – musí sa to spraviť ručne.
                </p>
              </div>
            );
          }

          return (
            <>
              <button
                onClick={() => {
                  if (window._deferredInstallPrompt) {
                    window._deferredInstallPrompt.prompt();
                  } else if (isAndroid) {
                    alert('Otvorte menu prehliadača (3 bodky vpravo hore) a zvoľte "Nainštalovať aplikáciu" alebo "Pridať na plochu".');
                  } else {
                    alert('V prehliadači otvorte menu (3 bodky) a zvoľte "Nainštalovať aplikáciu" / "Install app". Ak možnosť nevidíte, navštívte stránku ešte raz po pár minútach – Chrome čaká na "engagement".');
                  }
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Nainštalovať na plochu
              </button>
              {isAndroid && (
                <p className="text-xs text-slate-500 mt-3">
                  Pozn. pre Android: Ak sa okno nezobrazí, otvorte menu prehliadača (3 bodky) a vyberte <strong>"Pridať na plochu"</strong> alebo <strong>"Nainštalovať aplikáciu"</strong>.
                </p>
              )}
            </>
          );
        })()}
      </GlassCard>

      <GlassCard>
        <h3 className="font-medium text-white mb-3">O aplikácii</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <p><strong className="text-slate-300">Integrálna mapa bytia</strong></p>
          <p>Verzia: {APP_VERSION}</p>
          <p>Offline-first PWA. Všetky dáta lokálne.</p>
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
              a.download = 'integralna-mapa-backup.json';
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
