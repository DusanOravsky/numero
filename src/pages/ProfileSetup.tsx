import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { searchCities, findCity } from '../data/cities';
import { isValidDate } from '../engine/numerologyEngine';
import { useTranslation } from '../i18n/useTranslation';

export function ProfileSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addProfile, setActiveProfile, profiles } = useStore();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<{ name: string; lat: number; lon: number }[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    if (!name.trim()) {
      setError(t('validation.fillName'));
      return;
    }
    if (!d || !m || !y) {
      setError(t('validation.fillDate'));
      return;
    }
    if (!isValidDate(d, m, y)) {
      setError(`${t('validation.invalidDate')}: ${d}.${m}.${y}`);
      return;
    }

    const city = findCity(birthPlace);
    const id = crypto.randomUUID();
    addProfile({
      id,
      name: name.trim(),
      gender: gender || undefined,
      birthDay: d,
      birthMonth: m,
      birthYear: y,
      birthHour: hour ? parseInt(hour) : undefined,
      birthMinute: minute ? parseInt(minute) : undefined,
      birthPlace: birthPlace.trim() || undefined,
      birthLatitude: city?.lat,
      birthLongitude: city?.lon,
      createdAt: new Date().toISOString(),
    });
    setActiveProfile(id);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            {profiles.length === 0 ? t('profile.welcome') : t('profile.newProfile')}
          </h1>
          <p className="text-slate-400 mt-2">
            Stačí zadať meno a dátum narodenia – všetky sekcie sa automaticky vypočítajú. Čas a miesto narodenia sú voliteľné (spresňujú astrológiu a Human Design) a dajú sa doplniť aj neskôr.
          </p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">{t('profile.name')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('profile.namePlaceholder')}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">{t('profile.gender')} ({t('profile.genderHint')})</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setGender('male')} className={`py-2.5 rounded-xl text-sm border-2 transition-all ${gender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{t('common.male')}</button>
                <button type="button" onClick={() => setGender('female')} className={`py-2.5 rounded-xl text-sm border-2 transition-all ${gender === 'female' ? 'border-rose-500 bg-rose-50 text-rose-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{t('common.female')}</button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">{t('profile.birthDate')}</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder={t('profile.day')}
                  min={1}
                  max={31}
                  value={day}
                  onChange={e => setDay(e.target.value)}
                  className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="number"
                  placeholder={t('profile.month')}
                  min={1}
                  max={12}
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="number"
                  placeholder={t('profile.year')}
                  min={1900}
                  max={2100}
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="flex-1 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">{t('profile.birthTime')} ({t('common.optional')})</label>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  placeholder={t('profile.hour')}
                  min={0}
                  max={23}
                  value={hour}
                  onChange={e => setHour(e.target.value)}
                  className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
                />
                <span className="text-slate-500">:</span>
                <input
                  type="number"
                  placeholder={t('profile.minute')}
                  min={0}
                  max={59}
                  value={minute}
                  onChange={e => setMinute(e.target.value)}
                  className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
                />
                <span className="text-xs text-slate-500">{t('profile.timeHint')}</span>
              </div>
              {(!hour || !minute) && (
                <p className="text-[11px] text-amber-700 mt-2 leading-relaxed">
                  ⚠ {t('profile.timeWarning')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">{t('profile.birthPlace')} ({t('profile.placeHint')})</label>
              <div className="relative">
                <input
                  type="text"
                  value={birthPlace}
                  onChange={e => { setBirthPlace(e.target.value); setCitySuggestions(searchCities(e.target.value)); }}
                  placeholder={t('profile.placePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
                />
                {citySuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl bg-[#1a1545] border border-indigo-500/20 overflow-hidden">
                    {citySuggestions.map(city => (
                      <button
                        key={city.name}
                        type="button"
                        onClick={() => { setBirthPlace(city.name); setCitySuggestions([]); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-indigo-500/20"
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{t('profile.placeHint')}</p>
            </div>

            {error && (
              <p className="text-sm text-rose-600 px-1">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-lg hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 glow mt-4"
            >
              {t('profile.create')}
            </button>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-slate-500 mt-6">
          {t('profile.localData')}
        </p>
      </div>
    </div>
  );
}
