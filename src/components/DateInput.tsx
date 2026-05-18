import { useState } from 'react';
import { searchCities, findCity } from '../data/cities';

interface DateInputProps {
  onSubmit: (day: number, month: number, year: number, hour?: number, minute?: number, lat?: number, lon?: number) => void;
  showTime?: boolean;
  showPlace?: boolean;
  label?: string;
}

export function DateInput({ onSubmit, showTime = false, showPlace = false, label = 'Dátum narodenia' }: DateInputProps) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('0');
  const [birthPlace, setBirthPlace] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<{ name: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    if (d && m && y && d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100) {
      const city = findCity(birthPlace);
      onSubmit(
        d, m, y,
        showTime ? parseInt(hour) : undefined,
        showTime ? parseInt(minute) : undefined,
        city?.lat,
        city?.lon
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm text-slate-400">{label}</label>
      <div className="flex gap-3">
        <input type="number" placeholder="Deň" min={1} max={31} value={day} onChange={e => setDay(e.target.value)} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
        <input type="number" placeholder="Mesiac" min={1} max={12} value={month} onChange={e => setMonth(e.target.value)} className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
        <input type="number" placeholder="Rok" min={1900} max={2100} value={year} onChange={e => setYear(e.target.value)} className="w-28 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
      </div>
      {showTime && (
        <div>
          <label className="block text-xs text-slate-500 mb-1">Čas narodenia (24h formát)</label>
          <div className="flex gap-2 items-center">
            <div className="flex flex-col items-center">
              <input type="number" placeholder="Hod" min={0} max={23} value={hour} onChange={e => setHour(e.target.value)} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
              <span className="text-[10px] text-slate-400 mt-0.5">Hodina</span>
            </div>
            <span className="text-slate-400 text-lg font-bold">:</span>
            <div className="flex flex-col items-center">
              <input type="number" placeholder="Min" min={0} max={59} value={minute} onChange={e => setMinute(e.target.value)} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
              <span className="text-[10px] text-slate-400 mt-0.5">Minúta</span>
            </div>
          </div>
        </div>
      )}
      {(showPlace || showTime) && (
        <div className="relative">
          <input
            type="text"
            placeholder="Miesto narodenia (pre astrológiu)"
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
      <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 glow">
        Vypočítať
      </button>
    </form>
  );
}
