import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { calculateProgressions } from '../engine/astrologyEngine';
import { useTranslation } from '../i18n/useTranslation';
import { displayName, ZODIAC_DISPLAY } from '../i18n/entityNames';

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
  const { language } = useTranslation();
  const today = new Date();
  const ageNow = today.getFullYear() - birthYear - (
    today.getMonth() < birthMonth - 1 ||
    (today.getMonth() === birthMonth - 1 && today.getDate() < birthDay) ? 1 : 0
  );

  const [targetAge, setTargetAge] = useState(ageNow);
  const positions = calculateProgressions(birthDay, birthMonth, birthYear, birthHour, birthMinute, targetAge);

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">
        {language === 'sk' ? 'Sekundárne progresie' : 'Secondary Progressions'}
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        {language === 'sk'
          ? <>Klasická prediktívna technika: pozícia planéty <strong>N dní po narodení = pozícia v N. roku života</strong>. Slnko sa hýbe ~1°/rok, Mesiac ~12°/rok — zmena znamenia preto signalizuje hlbokú zmenu životnej fázy.</>
          : <>Classic predictive technique: a planet's position <strong>N days after birth = position in the Nth year of life</strong>. The Sun moves ~1°/year, the Moon ~12°/year — a sign change therefore signals a deep shift in life phase.</>
        }
      </p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <label className="text-sm text-slate-400">{language === 'sk' ? 'Vek' : 'Age'}:</label>
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
          {language === 'sk' ? `Dnes (${ageNow} r.)` : `Today (${ageNow} y.)`}
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
            {age} {language === 'sk' ? 'r.' : 'y.'}
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
                  Natal: <span className="text-white">{displayName(ZODIAC_DISPLAY, p.natalSign, language)} {p.natalDegree.toFixed(1)}°</span>
                </p>
                <p className={p.signChanged ? 'text-amber-300 font-medium' : 'text-slate-300'}>
                  {language === 'sk' ? 'Progresia' : 'Progressed'}: {displayName(ZODIAC_DISPLAY, p.progressedSign, language)} {p.progressedDegree.toFixed(1)}°
                  {p.signChanged && ' ★'}
                </p>
              </div>
            </div>
            {p.signChanged && (
              <p className="text-[11px] text-amber-300 mt-2 italic">
                {language === 'sk'
                  ? `★ Zmena znamenia z ${displayName(ZODIAC_DISPLAY, p.natalSign, language)} → ${displayName(ZODIAC_DISPLAY, p.progressedSign, language)}: nová fáza života v tejto oblasti.`
                  : `★ Sign change from ${displayName(ZODIAC_DISPLAY, p.natalSign, language)} → ${displayName(ZODIAC_DISPLAY, p.progressedSign, language)}: a new life phase in this area.`
                }
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-500 italic mt-3">
        {language === 'sk'
          ? <>Najdôležitejšia je progresia <strong>Slnka</strong> (zmena znamenia ~ raz za 30 rokov = veľký životný prah) a <strong>Mesiaca</strong> (zmena znamenia ~ každé 2-3 roky = emocionálny cyklus).</>
          : <>The most important is the progression of the <strong>Sun</strong> (sign change ~ once every 30 years = major life threshold) and the <strong>Moon</strong> (sign change ~ every 2-3 years = emotional cycle).</>
        }
      </p>
    </GlassCard>
  );
}
