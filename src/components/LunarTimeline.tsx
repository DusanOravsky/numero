import * as Astronomy from 'astronomy-engine';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../i18n/useTranslation';
import { displayName, MOON_PHASE_DISPLAY } from '../i18n/entityNames';
import type { Language } from '../store/useStore';

interface Props {
  /** Koľko dní pred dnešným zobraziť (default 7). */
  daysBack?: number;
  /** Koľko dní po dnešnom zobraziť (default 7). */
  daysAhead?: number;
}

const MOON_ADVICE: Record<string, Record<Language, string>> = {
  'Nov': { sk: 'Začni nové. Setba zámerov.', en: 'Start fresh. Seed intentions.' },
  'Dorastajúci kosáčik': { sk: 'Pestuj klíčiace nápady.', en: 'Nurture sprouting ideas.' },
  'Prvá štvrť': { sk: 'Rozhodni sa, prekonaj prekážky.', en: 'Make decisions, overcome obstacles.' },
  'Dorastajúci mesiac': { sk: 'Doplň, dolaď, prelaď.', en: 'Refine, adjust, fine-tune.' },
  'Spln': { sk: 'Plnosť. Zber, oslava, vrchol.', en: 'Fullness. Harvest, celebrate, peak.' },
  'Ubúdajúci mesiac': { sk: 'Zdieľaj, vyjadri vďaku.', en: 'Share, express gratitude.' },
  'Posledná štvrť': { sk: 'Pusť, oddel, vyčisti.', en: 'Let go, separate, cleanse.' },
  'Ubúdajúci kosáčik': { sk: 'Odpočinok, reflexia.', en: 'Rest, reflection.' },
};

function phaseInfo(angleDeg: number): { name: string; glyph: string } {
  if (angleDeg < 22.5) return { name: 'Nov', glyph: '🌑' };
  if (angleDeg < 67.5) return { name: 'Dorastajúci kosáčik', glyph: '🌒' };
  if (angleDeg < 112.5) return { name: 'Prvá štvrť', glyph: '🌓' };
  if (angleDeg < 157.5) return { name: 'Dorastajúci mesiac', glyph: '🌔' };
  if (angleDeg < 202.5) return { name: 'Spln', glyph: '🌕' };
  if (angleDeg < 247.5) return { name: 'Ubúdajúci mesiac', glyph: '🌖' };
  if (angleDeg < 292.5) return { name: 'Posledná štvrť', glyph: '🌗' };
  if (angleDeg < 337.5) return { name: 'Ubúdajúci kosáčik', glyph: '🌘' };
  return { name: 'Nov', glyph: '🌑' };
}

/**
 * 2-týždňový lunárny pás okolo dnešného dňa.
 * Pre každý deň ukazuje fázu Mesiaca (glyph + meno) a krátku radu.
 * Dnešný deň je výrazne zvýraznený.
 */
export function LunarTimeline({ daysBack = 7, daysAhead = 7 }: Props) {
  const { language } = useTranslation();
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
      <h3 className="font-medium text-white mb-1">
        {language === 'sk'
          ? `Lunárny pás — ${daysBack} dní dozadu, ${daysAhead} dopredu`
          : `Lunar band — ${daysBack} days back, ${daysAhead} ahead`}
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        {language === 'sk'
          ? 'Fázy Mesiaca okolo dnešného dňa. Začínajte nové projekty pri nove, dokončujte pri splne.'
          : 'Moon phases around today. Start new projects at the New Moon, finish them at the Full Moon.'}
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
                  {d.date.toLocaleDateString(language === 'sk' ? 'sk-SK' : 'en-US', { weekday: 'short' })}
                </p>
                <p className={`text-xs ${d.isToday ? 'text-white font-bold' : 'text-slate-700'}`}>
                  {d.date.getDate()}. {d.date.getMonth() + 1}.
                </p>
                <div className="text-3xl my-1">{info.glyph}</div>
                <p className={`text-[10px] leading-tight ${d.isToday ? 'text-indigo-200 font-medium' : 'text-slate-500'}`}>
                  {displayName(MOON_PHASE_DISPLAY, info.name, language)}
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
            <p className="text-xs text-indigo-300 uppercase mb-1">
              {language === 'sk' ? 'Dnešná fáza' : "Today's phase"}: {displayName(MOON_PHASE_DISPLAY, todayInfo.name, language)}
            </p>
            <p className="text-sm text-slate-300">{MOON_ADVICE[todayInfo.name]?.[language] ?? todayInfo.name}</p>
          </div>
        );
      })()}
    </GlassCard>
  );
}
