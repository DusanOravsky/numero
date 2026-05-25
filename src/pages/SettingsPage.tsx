import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { NumerologyMethod } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { APP_VERSION, forceUpdate, checkForUpdate, clearAIData } from '../components/PWAPrompts';
import { getErrorLog, clearErrorLog } from '../components/ErrorBoundary';
import { getPerfLog, clearPerfLog } from '../hooks/usePerformanceMetrics';
import { searchCities, findCity } from '../data/cities';
import {
  getApiKey, setApiKey, getModel, setModel, testApiKey,
  CLAUDE_MODELS, type ClaudeModel,
  getLens, setLens, INTERPRETATION_LENSES, type InterpretationLens,
} from '../engine/aiInterpretation';
import { useTranslation } from '../i18n/useTranslation';

type SettingsTab = 'profile' | 'ai' | 'data' | 'about';

const SETTINGS_TAB_IDS: { id: SettingsTab; icon: string }[] = [
  { id: 'profile', icon: '◉' },
  { id: 'ai', icon: '✦' },
  { id: 'data', icon: '⛶' },
  { id: 'about', icon: 'ⓘ' },
];

export function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as SettingsTab) || 'profile';
  const validTab: SettingsTab = SETTINGS_TAB_IDS.some(tab => tab.id === initialTab) ? initialTab : 'profile';
  const [activeTab, setActiveTabState] = useState<SettingsTab>(validTab);

  const SETTINGS_TABS = SETTINGS_TAB_IDS.map(tab => ({
    ...tab,
    label: tab.id === 'profile' ? t('settings.tabProfile')
      : tab.id === 'ai' ? t('settings.tabAi')
      : tab.id === 'data' ? t('settings.tabData')
      : t('settings.tabAbout'),
  }));
  const setActiveTab = (tab: SettingsTab) => {
    setActiveTabState(tab);
    setSearchParams({ tab }, { replace: true });
  };
  const { profiles, activeProfileId, setActiveProfile, updateProfile, deleteProfile, numerologyMethod, setNumerologyMethod, clients, reports, favorites, themeMode, setThemeMode, language, setLanguage } = useStore();
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHour, setEditHour] = useState('');
  const [editMinute, setEditMinute] = useState('');
  const [editPlace, setEditPlace] = useState('');
  const [editName, setEditName] = useState('');
  const [editGender, setEditGender] = useState<'male' | 'female' | ''>('');
  const [citySuggestions, setCitySuggestions] = useState<{ name: string }[]>([]);

  // AI integrácia
  const [aiKey, setAiKey] = useState(getApiKey());
  const [aiKeyVisible, setAiKeyVisible] = useState(false);
  const [aiModel, setAiModel] = useState<ClaudeModel>(getModel());
  const [aiLens, setAiLens] = useState<InterpretationLens>(getLens());
  const [aiTesting, setAiTesting] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSaveApiKey = () => {
    setApiKey(aiKey.trim());
    setAiTestResult({ ok: true, message: aiKey.trim() ? t('settings.aiKeySaved') : t('settings.aiKeyRemoved') });
  };

  const handleTestKey = async () => {
    setAiTesting(true);
    setAiTestResult(null);
    const result = await testApiKey(aiKey.trim());
    setAiTestResult(result);
    setAiTesting(false);
  };

  const handleModelChange = (m: ClaudeModel) => {
    setAiModel(m);
    setModel(m);
  };

  const handleLensChange = (l: InterpretationLens) => {
    setAiLens(l);
    setLens(l);
  };

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
      alert(t('validation.emptyName'));
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
        <h1 className="font-serif text-3xl font-bold text-slate-900">{t('settings.title')}</h1>
        <p className="text-slate-600 mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {SETTINGS_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
      <>
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-slate-900">{t('settings.profiles')}</h3>
          <button
            onClick={() => navigate('/profile')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"          >
            {t('settings.newProfile')}
          </button>
        </div>
        <div className="space-y-3">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className={`p-4 rounded-xl border transition-all ${
                profile.id === activeProfileId
                  ? 'border-indigo-500/50 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{profile.name}</p>
                  <p className="text-sm text-slate-600">
                    {profile.birthDay}.{profile.birthMonth}.{profile.birthYear}
                    {profile.birthHour !== undefined && ` ${profile.birthHour}:${String(profile.birthMinute || 0).padStart(2, '0')}`}
                    {profile.birthPlace && ` | ${profile.birthPlace}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(profile.id)}
                    className="px-3 py-1.5 rounded-lg text-xs text-amber-700 border border-amber-400 bg-amber-50 hover:bg-amber-100 font-medium"
                  >
                    {t('common.edit')}
                  </button>
                  {profile.id !== activeProfileId && (
                    <button
                      onClick={() => setActiveProfile(profile.id)}
                      className="px-3 py-1.5 rounded-lg text-xs text-indigo-700 border border-indigo-400 bg-indigo-50 hover:bg-indigo-100 font-medium"
                    >
                      {t('common.activate')}
                    </button>
                  )}
                  {profile.id === activeProfileId && (
                    <span className="px-3 py-1.5 rounded-lg text-xs text-green-700 bg-green-100 border border-green-300 font-medium">{t('common.active')}</span>
                  )}
                  <button
                    onClick={() => { if (confirm(t('settings.deleteProfile'))) deleteProfile(profile.id); }}
                    className="px-3 py-1.5 rounded-lg text-xs text-red-700 border border-red-300 bg-red-50 hover:bg-red-100 font-medium"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>

              {editingId === profile.id && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">{t('profile.name')}</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">{t('profile.gender')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setEditGender('male')} className={`py-1.5 rounded-lg text-xs border-2 ${editGender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 bg-white text-slate-600'}`}>{t('common.male')}</button>
                      <button type="button" onClick={() => setEditGender('female')} className={`py-1.5 rounded-lg text-xs border-2 ${editGender === 'female' ? 'border-rose-500 bg-rose-50 text-rose-700 font-medium' : 'border-slate-200 bg-white text-slate-600'}`}>{t('common.female')}</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">{t('profile.birthTime')}</label>
                    <div className="flex gap-2 items-center">
                      <input type="number" placeholder={t('profile.hour')} min={0} max={23} value={editHour} onChange={e => setEditHour(e.target.value)} className="w-16 px-2 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-center text-sm" />
                      <span className="text-slate-600 font-bold">:</span>
                      <input type="number" placeholder={t('profile.minute')} min={0} max={59} value={editMinute} onChange={e => setEditMinute(e.target.value)} className="w-16 px-2 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-center text-sm" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs text-slate-500 mb-1">{t('profile.birthPlace')}</label>
                    <input type="text" placeholder={t('profile.placePlaceholder')} value={editPlace} onChange={e => { setEditPlace(e.target.value); setCitySuggestions(searchCities(e.target.value)); }} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-sm" />
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
                    <button onClick={saveEdit} className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-500">{t('common.save')}</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg text-sm text-slate-700 border border-slate-300 bg-slate-100 hover:bg-slate-200 font-medium">{t('common.cancel')}</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {profiles.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">{t('settings.noProfiles')}</p>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-medium text-white mb-2">{t('settings.numerologyMethod')}</h3>
        <p className="text-sm text-slate-500 mb-4">
          {t('settings.methodDescription')}
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
                <p className="font-medium text-slate-800">{t('settings.methodCharacter')}</p>
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
                <p className="font-medium text-slate-800">{t('settings.methodDevelopmental')}</p>
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
        <h3 className="font-medium text-white mb-2">{t('settings.appearance')}</h3>
        <p className="text-sm text-slate-500 mb-3">{t('settings.themeDescription')}</p>
        <div className="grid grid-cols-2 gap-0 p-0.5 bg-slate-100 rounded-lg">
          {([
            { id: 'light' as const, label: t('settings.themeLight') },
            { id: 'dark' as const, label: t('settings.themeDark') },
          ]).map(opt => (
            <button
              key={opt.id}
              onClick={() => setThemeMode(opt.id)}
              className={`py-2.5 rounded-md text-sm font-medium transition-colors ${
                themeMode === opt.id || (themeMode === 'system' && opt.id === 'light')
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <h3 className="font-medium text-white mt-5 mb-2">{t('settings.language')}</h3>
        <div className="grid grid-cols-2 gap-0 p-0.5 bg-slate-100 rounded-lg">
          {([
            { id: 'sk' as const, label: t('settings.languageSk') },
            { id: 'en' as const, label: t('settings.languageEn') },
          ]).map(opt => (
            <button
              key={opt.id}
              onClick={() => setLanguage(opt.id)}
              className={`py-2.5 rounded-md text-sm font-medium transition-colors ${
                language === opt.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-medium text-white mb-3">{t('settings.installTitle')}</h3>
        <p className="text-sm text-slate-600 mb-3">{t('settings.installDescription')}</p>

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
                  {t('settings.installIos')}
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
                    alert(t('settings.installAndroid'));
                  } else {
                    alert(t('settings.installButton'));
                  }
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500"              >
                {t('settings.installButton')}
              </button>
              {isAndroid && (
                <p className="text-xs text-slate-500 mt-3">
                  {t('settings.installAndroid')}
                </p>
              )}
            </>
          );
        })()}
      </GlassCard>
      </>
      )}

      {activeTab === 'ai' && (
      <>
      {/* AI integrácia (D1) */}
      <GlassCard>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-slate-900">{t('settings.aiTitle')}</h3>
          {aiKey && <span className="text-[10px] uppercase text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">{t('settings.aiActive')}</span>}
        </div>
        <p className="text-xs text-slate-600 mb-3">
          {t('settings.aiDescription')}
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-600 mb-1">{t('settings.aiKeyLabel')}</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={aiKeyVisible ? 'text' : 'password'}
                  value={aiKey}
                  onChange={(e) => setAiKey(e.target.value)}
                  placeholder="sk-ant-api03-…"
                  className="w-full px-3 py-2 pr-10 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setAiKeyVisible(v => !v)}
                  title={aiKeyVisible ? t('common.hide') : t('common.show')}
                  aria-label={aiKeyVisible ? t('common.hide') : t('common.show')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-sm px-1"
                >
                  {aiKeyVisible ? '🙈' : '👁'}
                </button>
              </div>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500"              >
                {t('common.save')}
              </button>
              <button
                onClick={handleTestKey}
                disabled={aiTesting || !aiKey.trim()}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm disabled:opacity-40"
              >
                {aiTesting ? '⋯' : 'Test'}
              </button>
            </div>
            {aiTestResult && (
              <p className={`text-xs mt-2 ${aiTestResult.ok ? 'text-emerald-300' : 'text-rose-300'}`}>
                {aiTestResult.ok ? '✓' : '✗'} {aiTestResult.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">{t('settings.aiModel')}</label>
            <div className="space-y-1">
              {CLAUDE_MODELS.map(m => (
                <label key={m.id} className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                  aiModel === m.id
                    ? 'bg-indigo-500/15 border-indigo-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="claude-model"
                    checked={aiModel === m.id}
                    onChange={() => handleModelChange(m.id)}
                    className="accent-indigo-600"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-800">{m.label}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{m.id} · {m.cost}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">{t('settings.aiLens')}</label>
            <p className="text-[11px] text-slate-500 mb-2">
              {t('settings.aiLensDescription')}
            </p>
            <div className="space-y-1">
              {INTERPRETATION_LENSES.map(l => (
                <label key={l.id} className={`flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                  aiLens === l.id
                    ? 'bg-violet-50 border-violet-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="claude-lens"
                    checked={aiLens === l.id}
                    onChange={() => handleLensChange(l.id)}
                    className="accent-violet-600 mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-800">{l.label}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{l.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-[10px] text-amber-400 mt-2">
              💡 {t('settings.aiLensTip')}
            </p>
          </div>

          {aiKey && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/30">
              <button
                onClick={() => {
                  if (!confirm(t('settings.aiKeyRemoveConfirm'))) return;
                  setApiKey('');
                  setAiKey('');
                  setAiTestResult({ ok: true, message: t('settings.aiKeyRemoved') });
                }}
                className="text-xs text-rose-400 hover:text-rose-300 underline text-left"
              >
                {t('settings.aiKeyRemove')}
              </button>
              <button
                onClick={() => {
                  if (!confirm(t('settings.aiClearAllConfirm'))) return;
                  clearAIData();
                  setAiKey('');
                  setAiTestResult({ ok: true, message: t('settings.aiClearAllDone') });
                  setTimeout(() => window.location.reload(), 1500);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 underline text-left"
              >
                {t('settings.aiClearAll')}
              </button>
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-medium text-white mb-3">{t('settings.reminderTitle')}</h3>
        <p className="text-xs text-slate-600 mb-3">
          {t('settings.reminderDescription')}
        </p>
        <button
          onClick={() => {
            const current = localStorage.getItem('daily-notification') === 'true';
            if (!current) {
              if (typeof Notification === 'undefined') {
                alert(t('settings.reminderNotSupported'));
                return;
              }
              Notification.requestPermission().then(perm => {
                if (perm === 'granted') {
                  localStorage.setItem('daily-notification', 'true');
                  alert(t('settings.reminderOn'));
                } else {
                  alert(t('settings.reminderDenied'));
                }
              });
            } else {
              localStorage.removeItem('daily-notification');
              alert(t('settings.reminderOff'));
            }
          }}
          className={`w-full py-2.5 rounded-xl text-sm font-medium ${
            localStorage.getItem('daily-notification') === 'true'
              ? 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
                 >
          {localStorage.getItem('daily-notification') === 'true' ? t('settings.reminderDisable') : t('settings.reminderEnable')}
        </button>
      </GlassCard>
      </>
      )}

      {activeTab === 'about' && (
      <>
      <GlassCard>
        <h3 className="font-medium text-white mb-3">{t('settings.aboutTitle')}</h3>
        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <p><strong className="text-slate-800">{t('settings.aboutDescription')}</strong></p>
          <p>{t('settings.version')}: {APP_VERSION}</p>
          <p>© 2026 Dušan Oravský</p>
          <p className="text-[11px] text-slate-500">Co-created with Claude Code (Anthropic)</p>
          <p className="text-[11px] text-slate-500 mt-1">Offline-first PWA.</p>
        </div>
        <div className="space-y-2">
          <button
            onClick={async () => {
              const result = await checkForUpdate();
              if (!result.online) {
                alert(t('settings.githubOffline'));
              }
              // Ak je online, app sa už reload-ne sama z checkForUpdate()
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500"          >
            {t('settings.checkUpdate')}
          </button>
          <p className="text-[11px] text-slate-500">
            {t('settings.checkUpdateDesc')}
          </p>
        </div>
        <details className="mt-4">
          <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300 select-none">{t('settings.forceCache')}</summary>
          <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs text-slate-600 mb-2">
              {t('settings.forceCacheDesc')}
            </p>
            <button
              onClick={async () => {
                if (!confirm(t('settings.forceCacheConfirm'))) return;
                const result = await forceUpdate();
                if (!result.online) {
                  alert(t('settings.githubOffline'));
                }
              }}
              className="w-full py-2 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-100 text-xs font-medium"
            >
              {t('settings.forceCache')}
            </button>
          </div>
        </details>
      </GlassCard>

      {/* Performance metrics (C9) */}
      {(() => {
        const log = getPerfLog();
        if (log.length === 0) return null;
        const lcp = log.find(e => e.name === 'LCP');
        const cls = log.find(e => e.name === 'CLS');
        return (
          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">{t('settings.perfMetrics')}</h3>
              <button
                onClick={() => { clearPerfLog(); window.location.reload(); }}
                className="text-xs text-rose-500 hover:text-rose-300 underline"
              >
                {t('settings.clearLog')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {lcp && (
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <p className="text-[10px] text-cyan-300 uppercase">LCP (Largest Contentful Paint)</p>
                  <p className="text-lg text-white font-mono">{lcp.duration}<span className="text-xs text-slate-400 ml-1">ms</span></p>
                  <p className="text-[10px] text-slate-500">cieľ: &lt; 2500ms</p>
                </div>
              )}
              {cls && (
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <p className="text-[10px] text-purple-300 uppercase">CLS (Cumulative Layout Shift)</p>
                  <p className="text-lg text-white font-mono">{cls.duration}</p>
                  <p className="text-[10px] text-slate-500">cieľ: &lt; 0.1</p>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {log.length} záznamov v logu. Najnovších 10 mount-time súborov:
            </p>
            <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
              {log.filter(e => !['LCP', 'CLS'].includes(e.name)).slice(0, 10).map((e, i) => (
                <div key={i} className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">{e.name}</span>
                  <span className="text-slate-300">{e.duration}ms</span>
                </div>
              ))}
            </div>
          </GlassCard>
        );
      })()}

      {/* Diagnostika — error log (C8) */}
      {(() => {
        const log = getErrorLog();
        if (log.length === 0) return null;
        return (
          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">{t('settings.diagnostics')}</h3>
              <button
                onClick={() => { clearErrorLog(); window.location.reload(); }}
                className="text-xs text-rose-500 hover:text-rose-300 underline"
              >
                {t('settings.clearLog')}
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {log.length} chýb v lokálnom logu (max {20}). Užitočné pri reportovaní problémov.
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {log.slice(0, 5).map((e, i) => (
                <div key={i} className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs">
                  <p className="text-rose-300 font-mono break-all">{e.message}</p>
                  <p className="text-slate-500 text-[10px] mt-1">
                    {new Date(e.timestamp).toLocaleString('sk-SK')} · {e.url.split('/').slice(-1)[0] || '/'}
                  </p>
                </div>
              ))}
              {log.length > 5 && (
                <p className="text-[11px] text-slate-500 text-center">… a ďalších {log.length - 5}</p>
              )}
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(log, null, 2));
              }}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              {t('settings.copyLog')}
            </button>
          </GlassCard>
        );
      })()}
      </>
      )}

      {activeTab === 'data' && (
      <>
      {activeProfile && (
        <GlassCard>
          <h3 className="font-medium text-white mb-3">{t('settings.backup')}</h3>
          <p className="text-xs text-slate-500 mb-3">
            {t('settings.backupDesc')}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const data = JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), profiles, activeProfileId, clients, reports, favorites, numerologyMethod, themeMode, language }, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `integralna-mapa-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium glass text-indigo-300 hover:text-white"
            >
              {t('settings.exportBtn')}
            </button>
            <label className="px-4 py-2 rounded-xl text-sm font-medium glass text-emerald-300 hover:text-white cursor-pointer">
              {t('settings.importBtn')}
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      const parsed = JSON.parse(reader.result as string);
                      if (!parsed.profiles || !Array.isArray(parsed.profiles)) {
                        alert(t('settings.importError'));
                        return;
                      }
                      const importedProfiles = parsed.profiles.length;
                      const importedClients = parsed.clients?.length || 0;
                      if (!confirm(`${t('settings.importConfirm')} (${importedProfiles} profilov, ${importedClients} klientov)`)) return;
                      const store = useStore.getState();
                      if (parsed.profiles) useStore.setState({ profiles: parsed.profiles });
                      if (parsed.activeProfileId) useStore.setState({ activeProfileId: parsed.activeProfileId });
                      if (parsed.clients) useStore.setState({ clients: parsed.clients });
                      if (parsed.reports) useStore.setState({ reports: parsed.reports });
                      if (parsed.favorites) useStore.setState({ favorites: parsed.favorites });
                      if (parsed.numerologyMethod) store.setNumerologyMethod(parsed.numerologyMethod);
                      if (parsed.themeMode) store.setThemeMode(parsed.themeMode);
                      if (parsed.language) store.setLanguage(parsed.language);
                      alert(`${t('settings.importSuccess')} ${importedProfiles} profilov, ${importedClients} klientov.`);
                    } catch {
                      alert(t('settings.importError'));
                    }
                  };
                  reader.readAsText(file);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </GlassCard>
      )}
      </>
      )}
    </div>
  );
}
