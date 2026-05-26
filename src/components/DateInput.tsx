import { useState } from 'react';
import { searchCities, findCity } from '../data/cities';
import { isValidDate } from '../engine/numerologyEngine';
import { useSessionState } from '../hooks/useSessionState';
import { useTranslation } from '../i18n/useTranslation';

interface DateInputProps {
  onSubmit: (day: number, month: number, year: number, hour?: number, minute?: number, lat?: number, lon?: number) => void;
  showTime?: boolean;
  showPlace?: boolean;
  label?: string;
  /** Voliteľný kľúč pre uloženie do sessionStorage (aby vstupy prežili prepnutie stránok) */
  persistKey?: string;
}

export function DateInput({ onSubmit, showTime = false, showPlace = false, label, persistKey }: DateInputProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('profile.birthDate');
  const [day, setDay] = useSessionState<string>(persistKey ? `${persistKey}:day` : 'date-input:day', '');
  const [month, setMonth] = useSessionState<string>(persistKey ? `${persistKey}:month` : 'date-input:month', '');
  const [year, setYear] = useSessionState<string>(persistKey ? `${persistKey}:year` : 'date-input:year', '');
  const [hour, setHour] = useSessionState<string>(persistKey ? `${persistKey}:hour` : 'date-input:hour', '12');
  const [minute, setMinute] = useSessionState<string>(persistKey ? `${persistKey}:minute` : 'date-input:minute', '0');
  const [birthPlace, setBirthPlace] = useSessionState<string>(persistKey ? `${persistKey}:place` : 'date-input:place', '');
  const [citySuggestions, setCitySuggestions] = useState<{ name: string }[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || m < 1 || y < 1) {
      setError(t('validation.fillDate'));
      return;
    }
    if (!isValidDate(d, m, y)) {
      setError(`${t('validation.invalidDate')}: ${d}.${m}.${y}`);
      return;
    }
    const city = findCity(birthPlace);
    onSubmit(
      d, m, y,
      showTime ? parseInt(hour) : undefined,
      showTime ? parseInt(minute) : undefined,
      city?.lat,
      city?.lon
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm text-slate-400">{resolvedLabel}</label>
      <div className="flex gap-3">
        <input type="number" placeholder={t('profile.day')} aria-label={t('profile.day')} min={1} max={31} value={day} onChange={e => setDay(e.target.value)} className="w-20 px-3 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-400" />
        <input type="number" placeholder={t('profile.month')} aria-label={t('profile.month')} min={1} max={12} value={month} onChange={e => setMonth(e.target.value)} className="w-24 px-3 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-400" />
        <input type="number" placeholder={t('profile.year')} aria-label={t('profile.year')} min={1900} max={2100} value={year} onChange={e => setYear(e.target.value)} className="w-28 px-3 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-400" />
      </div>
      {showTime && (
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('profile.birthTime')} (24h)</label>
            <div className="flex gap-2 items-center">
              <input type="number" placeholder={t('profile.hour')} min={0} max={23} value={hour} onChange={e => setHour(e.target.value)} className="w-20 px-3 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-400" />
              <span className="text-slate-400 font-bold">:</span>
              <input type="number" placeholder={t('profile.minute')} min={0} max={59} value={minute} onChange={e => setMinute(e.target.value)} className="w-20 px-3 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-400" />
            </div>
            {(hour === '' || minute === '') && (
              <p className="text-[11px] text-amber-700 mt-2 leading-relaxed">
                ⚠ {t('profile.timeWarning')}
              </p>
            )}
          </div>
          <div className="relative">
            <label className="block text-xs text-slate-500 mb-1">{t('profile.birthPlace')}</label>
            <input
              type="text"
              placeholder={t('profile.placePlaceholder')}
              value={birthPlace}
              onChange={e => { setBirthPlace(e.target.value); setCitySuggestions(searchCities(e.target.value)); }}
              className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-400"
            />
            {citySuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg bg-white border border-slate-200 overflow-hidden shadow-lg">
                {citySuggestions.map(city => (
                  <button key={city.name} type="button" onClick={() => { setBirthPlace(city.name); setCitySuggestions([]); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50">
                    {city.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {showPlace && !showTime && (
        <div className="relative">
          <input
            type="text"
            placeholder={`${t('profile.birthPlace')} (${t('profile.placeHint')})`}
            value={birthPlace}
            onChange={e => { setBirthPlace(e.target.value); setCitySuggestions(searchCities(e.target.value)); }}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
          />
          {citySuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-lg">
              {citySuggestions.map(city => (
                <button key={city.name} type="button" onClick={() => { setBirthPlace(city.name); setCitySuggestions([]); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50">
                  {city.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {error && (
        <p className="text-sm text-rose-600 px-1">{error}</p>
      )}
      <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 glow">
        {t('common.calculate')}
      </button>
    </form>
  );
}
