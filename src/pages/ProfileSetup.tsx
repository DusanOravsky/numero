import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { searchCities, findCity } from '../data/cities';

export function ProfileSetup() {
  const navigate = useNavigate();
  const { addProfile, setActiveProfile, profiles } = useStore();
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<{ name: string; lat: number; lon: number }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    if (!name.trim() || !d || !m || !y) return;

    const city = findCity(birthPlace);
    const id = crypto.randomUUID();
    addProfile({
      id,
      name: name.trim(),
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
            {profiles.length === 0 ? 'Vitajte v Número' : 'Nový profil'}
          </h1>
          <p className="text-slate-400 mt-2">
            Zadajte údaje pre vytvorenie osobného profilu
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
