import * as Astronomy from 'astronomy-engine';
import { GlassCard } from './GlassCard';

interface Props {
  /** Koľko dní pred dnešným zobraziť (default 7). */
  daysBack?: number;
  /** Koľko dní po dnešnom zobraziť (default 7). */
  daysAhead?: number;
}

function phaseInfo(angleDeg: number): { name: string; glyph: string; advice: string } {
  if (angleDeg < 22.5) return { name: 'Nov', glyph: '🌑', advice: 'Začni nové. Setba zámerov.' };
  if (angleDeg < 67.5) return { name: 'Dorastajúci kosáčik', glyph: '🌒', advice: 'Pestuj klíčiace nápady.' };
  if (angleDeg < 112.5) return { name: 'Prvá štvrť', glyph: '🌓', advice: 'Rozhodni sa, prekonaj prekážky.' };
  if (angleDeg < 157.5) return { name: 'Dorastajúci mesiac', glyph: '🌔', advice: 'Doplň, dolaď, prelaď.' };
  if (angleDeg < 202.5) return { name: 'Spln', glyph: '🌕', advice: 'Plnosť. Zber, oslava, vrchol.' };
  if (angleDeg < 247.5) return { name: 'Ubúdajúci mesiac', glyph: '🌖', advice: 'Zdieľaj, vyjadri vďaku.' };
  if (angleDeg < 292.5) return { name: 'Posledná štvrť', glyph: '🌗', advice: 'Pusť, oddel, vyčisti.' };
  if (angleDeg < 337.5) return { name: 'Ubúdajúci kosáčik', glyph: '🌘', advice: 'Odpočinok, reflexia.' };
  return { name: 'Nov', glyph: '🌑', advice: 'Začni nové. Setba zámerov.' };
}

/**
 * 2-týždňový lunárny pás okolo dnešného dňa.
 * Pre každý deň ukazuje fázu Mesiaca (glyph + meno) a krátku radu.
 * Dnešný deň je výrazne zvýraznený.
 */
export function LunarTimeline({ daysBack = 7, daysAhead = 7 }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: { date: Date; angle: number; isToday: boolean }[] = [];
  for (let i = -daysBack; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const time = Astronomy.MakeTime(d);
    const angle = Astronomy.MoonPhase(time);
    days.push({ date: d, angle, isToday: i === 0 });
  }

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">Lunárny pás — najbližšie {daysBack + daysAhead + 1} dní</h3>
      <p className="text-xs text-slate-500 mb-3">
        Fázy Mesiaca okolo dnešného dňa. Začínajte nové projekty pri nove, dokončujte pri splne.
      </p>

      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex gap-2 min-w-max pb-2">
          {days.map(d => {
            const info = phaseInfo(d.angle);
            return (
              <div
                key={d.date.toISOString()}
                className={`shrink-0 w-24 p-2 rounded-xl border text-center ${
                  d.isToday
                    ? 'bg-indigo-500/15 border-indigo-500 ring-2 ring-indigo-500/40'
                    : 'border-slate-200'
                }`}
              >
                <p className={`text-[10px] uppercase ${d.isToday ? 'text-indigo-300 font-bold' : 'text-slate-500'}`}>
                  {d.date.toLocaleDateString('sk-SK', { weekday: 'short' })}
                </p>
                <p className={`text-xs ${d.isToday ? 'text-white font-bold' : 'text-slate-700'}`}>
                  {d.date.getDate()}. {d.date.getMonth() + 1}.
                </p>
                <div className="text-3xl my-1">{info.glyph}</div>
                <p className={`text-[10px] leading-tight ${d.isToday ? 'text-indigo-200 font-medium' : 'text-slate-500'}`}>
                  {info.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {(() => {
        const todayInfo = phaseInfo(days.find(d => d.isToday)!.angle);
        return (
          <div className="mt-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-xs text-indigo-300 uppercase mb-1">Dnešná fáza: {todayInfo.name}</p>
            <p className="text-sm text-slate-300">{todayInfo.advice}</p>
          </div>
        );
      })()}
    </GlassCard>
  );
}
