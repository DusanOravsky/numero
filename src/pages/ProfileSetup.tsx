import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { searchCities, findCity } from '../data/cities';
import { isValidDate } from '../engine/numerologyEngine';

export function ProfileSetup() {
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
      setError('Zadajte meno.');
      return;
    }
    if (!d || !m || !y) {
      setError('Vyplňte celý dátum narodenia.');
      return;
    }
    if (!isValidDate(d, m, y)) {
      setError(`Neplatný dátum: ${d}.${m}.${y}.`);
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
            {profiles.length === 0 ? 'Vitajte' : 'Nový profil'}
          </h1>
          <p className="text-slate-400 mt-2">
            Stačí zadať meno a dátum narodenia – všetky sekcie sa automaticky vypočítajú. Čas a miesto narodenia sú voliteľné (spresňujú astrológiu a Human Design) a dajú sa doplniť aj neskôr.
          </p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Meno</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Vaše meno"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Pohlavie (pre presný výklad polarity ega)</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setGender('male')} className={`py-2.5 rounded-xl text-sm border-2 transition-all ${gender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>♂ Muž</button>
                <button type="button" onClick={() => setGender('female')} className={`py-2.5 rounded-xl text-sm border-2 transition-all ${gender === 'female' ? 'border-rose-500 bg-rose-50 text-rose-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>♀ Žena</button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Dátum narodenia</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Deň"
                  min={1}
                  max={31}
                  value={day}
                  onChange={e => setDay(e.target.value)}
                  className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="number"
                  placeholder="Mesiac"
                  min={1}
                  max={12}
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="number"
                  placeholder="Rok"
                  min={1900}
                  max={2100}
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="flex-1 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Čas narodenia (voliteľné)</label>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  placeholder="Hod"
                  min={0}
                  max={23}
                  value={hour}
                  onChange={e => setHour(e.target.value)}
                  className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
                />
                <span className="text-slate-500">:</span>
                <input
                  type="number"
                  placeholder="Min"
                  min={0}
                  max={59}
                  value={minute}
                  onChange={e => setMinute(e.target.value)}
                  className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
                />
                <span className="text-xs text-slate-500">Pre presnejší HD a ascendent</span>
              </div>
              {(!hour || !minute) && (
                <p className="text-[11px] text-amber-700 mt-2 leading-relaxed">
                  ⚠ Bez presného času sa Mesiac môže pohnúť o znamenie a ascendent o ~1 znamenie za 2 hodiny. Ak nepoznáš čas, použi <strong>12:00</strong>.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Miesto narodenia (pre astrológiu)</label>
              <div className="relative">
                <input
                  type="text"
                  value={birthPlace}
                  onChange={e => { setBirthPlace(e.target.value); setCitySuggestions(searchCities(e.target.value)); }}
                  placeholder="Napr. Bratislava, Praha..."
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
              <p className="text-xs text-slate-500 mt-1">Dôležité pre presný ascendent a astrologické domy</p>
            </div>

            {error && (
              <p className="text-sm text-rose-600 px-1">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-lg hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 glow mt-4"
            >
              Vytvoriť profil
            </button>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-slate-500 mt-6">
          Všetky údaje zostávajú lokálne vo vašom zariadení.
        </p>
      </div>
    </div>
  );
}
