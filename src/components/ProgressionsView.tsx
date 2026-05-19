import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { calculateProgressions } from '../engine/astrologyEngine';

interface Props {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour: number;
  birthMinute: number;
}

/**
 * Sekundárne progresie ("1 deň = 1 rok"). Štandardná prediktívna technika:
 * pozícia planéty N dní po narodení = pozícia v N. roku života.
 *
 * Slnko sa hýbe ~1°/rok (zmena znamenia každých ~30 rokov), Mesiac ~12°/rok.
 */
export function ProgressionsView({ birthDay, birthMonth, birthYear, birthHour, birthMinute }: Props) {
  const today = new Date();
  const ageNow = today.getFullYear() - birthYear - (
    today.getMonth() < birthMonth - 1 ||
    (today.getMonth() === birthMonth - 1 && today.getDate() < birthDay) ? 1 : 0
  );

  const [targetAge, setTargetAge] = useState(ageNow);
  const positions = calculateProgressions(birthDay, birthMonth, birthYear, birthHour, birthMinute, targetAge);

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">Sekundárne progresie</h3>
      <p className="text-xs text-slate-500 mb-3">
        Klasická prediktívna technika: pozícia planéty <strong>N dní po narodení = pozícia v N. roku života</strong>.
        Slnko sa hýbe ~1°/rok, Mesiac ~12°/rok — zmena znamenia preto signalizuje hlbokú zmenu životnej fázy.
      </p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <label className="text-sm text-slate-400">Vek:</label>
        <input
          type="number"
          min={0}
          max={120}
          value={targetAge}
          onChange={e => setTargetAge(Math.max(0, Math.min(120, parseInt(e.target.value) || 0)))}
          className="w-20 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-indigo-500/30 text-white text-sm"
        />
        <button
          onClick={() => setTargetAge(ageNow)}
          className="text-xs text-indigo-400 hover:text-indigo-300 underline"
        >
          Dnes ({ageNow} r.)
        </button>
        {[20, 30, 40, 50, 60].map(age => (
          <button
            key={age}
            onClick={() => setTargetAge(age)}
            className={`text-xs px-2 py-1 rounded-full border ${
              targetAge === age
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {age} r.
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {positions.map(p => (
          <div
            key={p.planetName}
            className={`p-3 rounded-xl border ${
              p.signChanged
                ? 'bg-amber-500/10 border-amber-500/40'
                : 'bg-indigo-500/5 border-indigo-500/20'
            }`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.symbol}</span>
                <p className="text-sm text-white font-medium">{p.planetName}</p>
              </div>
              <div className="text-right text-xs">
                <p className="text-slate-400">
                  Natal: <span className="text-white">{p.natalSign} {p.natalDegree.toFixed(1)}°</span>
                </p>
                <p className={p.signChanged ? 'text-amber-300 font-medium' : 'text-slate-300'}>
                  Progress: {p.progressedSign} {p.progressedDegree.toFixed(1)}°
                  {p.signChanged && ' ★'}
                </p>
              </div>
            </div>
            {p.signChanged && (
              <p className="text-[11px] text-amber-300 mt-2 italic">
                ★ Zmena znamenia z {p.natalSign} → {p.progressedSign}: nová fáza života v tejto oblasti.
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-500 italic mt-3">
        Najdôležitejšia je progresia <strong>Slnka</strong> (zmena znamenia ~ raz za 30 rokov = veľký životný prah)
        a <strong>Mesiaca</strong> (zmena znamenia ~ každé 2-3 roky = emocionálny cyklus).
      </p>
    </GlassCard>
  );
}
