import { useState } from 'react';

interface DateInputProps {
  onSubmit: (day: number, month: number, year: number, hour?: number, minute?: number) => void;
  showTime?: boolean;
  label?: string;
}

export function DateInput({ onSubmit, showTime = false, label = 'Dátum narodenia' }: DateInputProps) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    if (d && m && y && d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100) {
      onSubmit(d, m, y, showTime ? parseInt(hour) : undefined, showTime ? parseInt(minute) : undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm text-slate-400">{label}</label>
      <div className="flex gap-3">
        <input
          type="number"
          placeholder="Deň"
          min={1}
          max={31}
          value={day}
          onChange={e => setDay(e.target.value)}
          className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
        />
        <input
          type="number"
          placeholder="Mesiac"
          min={1}
          max={12}
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
        />
        <input
          type="number"
          placeholder="Rok"
          min={1900}
          max={2100}
          value={year}
          onChange={e => setYear(e.target.value)}
          className="w-28 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
        />
      </div>
      {showTime && (
        <div className="flex gap-3 items-center">
          <input
            type="number"
            placeholder="Hodina"
            min={0}
            max={23}
            value={hour}
            onChange={e => setHour(e.target.value)}
            className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
          />
          <span className="text-slate-400">:</span>
          <input
            type="number"
            placeholder="Min"
            min={0}
            max={59}
            value={minute}
            onChange={e => setMinute(e.target.value)}
            className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50"
          />
          <span className="text-xs text-slate-500">(pre presný ascendent)</span>
        </div>
      )}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 glow"
      >
        Vypočítať
      </button>
    </form>
  );
}
