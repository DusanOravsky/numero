import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { calculateSolarReturn } from '../engine/astrologyEngine';
import { useTranslation } from '../i18n/useTranslation';
import { displayName, ZODIAC_DISPLAY, ELEMENT_DISPLAY } from '../i18n/entityNames';

interface Props {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour: number;
  birthMinute: number;
  latitude?: number;
  longitude?: number;
}

/**
 * Solar Return — výročný horoskop pre presný okamih, kedy Slnko opäť
 * dosiahne natálnu longitúdu. Tradičná prediktívna astrológia: ascendent,
 * Mesiac a domové pozície tohto solárneho návratu opisujú kvalitu
 * nadchádzajúceho roku života.
 */
export function SolarReturnView({ birthDay, birthMonth, birthYear, birthHour, birthMinute, latitude, longitude }: Props) {
  const { language } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const sr = calculateSolarReturn(
    birthDay, birthMonth, birthYear, birthHour, birthMinute,
    latitude, longitude, year
  );

  if (!sr) {
    return (
      <GlassCard>
        <p className="text-sm text-slate-500 italic">
          {language === 'sk' ? `Solar Return pre rok ${year} sa nepodarilo vyrátať.` : `Solar Return for year ${year} could not be calculated.`}
        </p>
      </GlassCard>
    );
  }

  const sun = sr.result.planets.find(p => p.name === 'Slnko');
  const moon = sr.result.planets.find(p => p.name === 'Mesiac');

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">
        {language === 'sk' ? 'Solar Return — výročný horoskop' : 'Solar Return — Birthday Chart'}
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        {language === 'sk'
          ? <>Presný moment, kedy Slnko opäť dosiahne svoju natálnu longitúdu. <strong>Ascendent</strong> a <strong>Mesiac</strong> tohto solárneho návratu opisujú kvalitu nadchádzajúceho roku života.</>
          : <>The exact moment when the Sun again reaches its natal longitude. The <strong>Ascendant</strong> and <strong>Moon</strong> of this solar return describe the quality of the upcoming year of life.</>
        }
      </p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <label className="text-sm text-slate-400">{language === 'sk' ? 'Rok' : 'Year'}:</label>
        <input
          type="number"
          min={birthYear}
          max={birthYear + 120}
          value={year}
          onChange={e => setYear(Math.max(birthYear, Math.min(birthYear + 120, parseInt(e.target.value) || currentYear)))}
          className="w-24 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-indigo-500/30 text-white text-sm"
        />
        {[currentYear - 1, currentYear, currentYear + 1].map(y => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`text-xs px-2 py-1 rounded-full border ${
              year === y
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-xs text-amber-300 uppercase mb-1">{language === 'sk' ? 'Dátum návratu' : 'Return date'}</p>
          <p className="text-sm text-white font-medium">
            {sr.date.toLocaleDateString(language === 'sk' ? 'sk-SK' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-[11px] text-slate-400">
            {language === 'sk' ? `Vek pri návrate: ${sr.ageAtReturn} r.` : `Age at return: ${sr.ageAtReturn} y.`} · {language === 'sk' ? 'čas' : 'time'}: {sr.date.toLocaleTimeString(language === 'sk' ? 'sk-SK' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-xs text-cyan-300 uppercase mb-1">{language === 'sk' ? 'Ascendent SR' : 'SR Ascendant'}</p>
          <p className="text-sm text-white font-medium">
            {sr.result.ascendant.symbol} {displayName(ZODIAC_DISPLAY, sr.result.ascendant.name, language)} {sr.result.ascendantDegree.toFixed(1)}°
          </p>
          <p className="text-[11px] text-slate-400">
            {language === 'sk' ? 'Téma celého roka' : 'Theme of the year'} — {displayName(ELEMENT_DISPLAY, sr.result.ascendant.element, language)}, {sr.result.ascendant.quality}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sun && (
          <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-xs text-yellow-300 uppercase mb-1">{language === 'sk' ? 'Slnko SR' : 'Sun SR'}</p>
            <p className="text-sm text-white">{sun.symbol} {sun.sign.symbol} {sun.sign.name} {sun.degree.toFixed(1)}°</p>
            <p className="text-[11px] text-slate-400">
              {sr.result.planetHouses.Slnko
                ? (language === 'sk' ? `${sr.result.planetHouses.Slnko}. dom` : `${sr.result.planetHouses.Slnko}th house`)
                : ''} — {language === 'sk' ? 'kde žiari vaša identita tento rok.' : 'where your identity shines this year.'}
            </p>
          </div>
        )}
        {moon && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <p className="text-xs text-indigo-300 uppercase mb-1">{language === 'sk' ? 'Mesiac SR' : 'Moon SR'}</p>
            <p className="text-sm text-white">{moon.symbol} {moon.sign.symbol} {moon.sign.name} {moon.degree.toFixed(1)}°</p>
            <p className="text-[11px] text-slate-400">
              {sr.result.planetHouses.Mesiac
                ? (language === 'sk' ? `${sr.result.planetHouses.Mesiac}. dom` : `${sr.result.planetHouses.Mesiac}th house`)
                : ''} — {language === 'sk' ? 'kde sú vaše emocionálne potreby.' : 'where your emotional needs lie.'}
            </p>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 italic mt-3">
        {language === 'sk'
          ? 'Solar Return má najsilnejšiu výpovednú hodnotu pre rok od narodenín do narodenín. Niektoré školy odporúčajú tráviť narodeniny na špecifickom mieste — tým možno "preladiť" SR ascendent.'
          : 'A Solar Return is most meaningful for the year from birthday to birthday. Some schools recommend spending your birthday in a specific location — thereby "retuning" the SR ascendant.'}
      </p>
    </GlassCard>
  );
}
