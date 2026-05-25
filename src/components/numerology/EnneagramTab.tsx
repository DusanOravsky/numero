import { GlassCard } from '../GlassCard';
import type { NumerologyResult } from '../../engine/numerologyEngine';
import type { DevelopmentalNumerologyResult } from '../../engine/developmentalNumerologyEngine';
import type { EnneagramResult } from '../../engine/enneagramEngine';
import { getEnneagramType } from '../../data/enneagram';
import { useTranslation } from '../../i18n/useTranslation';

interface EnneagramTabProps {
  result: NumerologyResult;
  enneagramResult: EnneagramResult;
  devResult: DevelopmentalNumerologyResult | null;
  numerologyMethod: string;
}

export function EnneagramTab({ result, enneagramResult, devResult, numerologyMethod }: EnneagramTabProps) {
  const { t, language } = useTranslation();
  const typeData = getEnneagramType(enneagramResult.coreType, language);
  if (!typeData) return null;

  const integrationData = getEnneagramType(enneagramResult.integrationDirection, language);
  const disintegrationData = getEnneagramType(enneagramResult.disintegrationDirection, language);
  const wingData = enneagramResult.dominantWing ? getEnneagramType(enneagramResult.dominantWing, language) : null;

  return (
    <div className="space-y-6">
      <GlassCard glow>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <span className="text-3xl font-serif font-bold text-white">{enneagramResult.coreType}</span>
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="text-lg font-medium text-white">{typeData.name}</h2>
            <p className="text-sm text-emerald-300 mt-0.5">{typeData.subtitle}</p>
            <div className="flex gap-2 mt-2 flex-wrap justify-center sm:justify-start">
              {enneagramResult.dominantWing && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {language === 'sk' ? `Krídlo ${enneagramResult.dominantWing}w` : `Wing ${enneagramResult.dominantWing}w`}
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400">
                {language === 'sk'
                  ? (numerologyMethod === 'characterological' ? `z ŽČ ${result.lifePathNumber}` : `z K3 ${devResult?.circled[2].value}`)
                  : (numerologyMethod === 'characterological' ? `from LP ${result.lifePathNumber}` : `from K3 ${devResult?.circled[2].value}`)}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tvoje čítanie — personalizovaný sprievodca */}
      <GlassCard glow>
        <h3 className="font-medium text-white mb-3">{t('numerology.enneagramYourReading')}</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            {language === 'sk'
              ? <>Si typ <strong className="text-white">{enneagramResult.coreType} — {typeData.name}</strong>. Tvoja základná motivácia: <em>{typeData.motivation.toLowerCase()}</em>. Tvoj základný strach: <em>{typeData.fear.toLowerCase()}</em>.</>
              : <>You are type <strong className="text-white">{enneagramResult.coreType} — {typeData.name}</strong>. Your core motivation: <em>{typeData.motivation.toLowerCase()}</em>. Your core fear: <em>{typeData.fear.toLowerCase()}</em>.</>}
          </p>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-400 font-semibold mb-1">
              {language === 'sk'
                ? `Tvoj smer rastu → typ ${enneagramResult.integrationDirection} (${integrationData?.name})`
                : `Your growth direction → type ${enneagramResult.integrationDirection} (${integrationData?.name})`}
            </p>
            <p className="text-xs text-slate-300">
              {language === 'sk'
                ? `Keď si v pohode a vedome pracuješ na sebe, smeruješ sem. Toto je tvoja „vyššia verzia". ${typeData.growthPath.split('.')[0]}.`
                : `When you are at ease and consciously working on yourself, you move here. This is your "higher version". ${typeData.growthPath.split('.')[0]}.`}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-rose-400 font-semibold mb-1">
              {language === 'sk'
                ? `Tvoj stresový smer → typ ${enneagramResult.disintegrationDirection} (${disintegrationData?.name})`
                : `Your stress direction → type ${enneagramResult.disintegrationDirection} (${disintegrationData?.name})`}
            </p>
            <p className="text-xs text-slate-300">
              {language === 'sk'
                ? 'Pod tlakom nevedome skĺzneš sem. Nie je to zlyhanie — je to signál že niečo nie je OK. Keď si to všimneš, môžeš sa vedome vrátiť.'
                : 'Under pressure you unconsciously slide here. It is not a failure — it is a signal that something is not OK. When you notice it, you can consciously return.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
            <p className="text-[10px] text-slate-500 uppercase mb-1">{language === 'sk' ? 'Praktický tip' : 'Practical tip'}</p>
            <p className="text-xs text-slate-300">
              {language === 'sk'
                ? `Dnes si všímaj: kedy konáš z motivácie (${typeData.motivation.split('.')[0].toLowerCase()}) a kedy zo strachu (${typeData.fear.split('.')[0].toLowerCase()}). Stačí pozorovať — samotné uvedomenie je prvý krok zmeny.`
                : `Today notice: when you act from motivation (${typeData.motivation.split('.')[0].toLowerCase()}) and when from fear (${typeData.fear.split('.')[0].toLowerCase()}). Just observe — awareness itself is the first step of change.`}
            </p>
          </div>
          <p className="text-[11px] text-slate-500 italic mt-2">
            {language === 'sk'
              ? 'Enneagram typ je odvodený z numerologického profilu (nie z dotazníka). Pre presnejšie typovanie odporúčame RHETI alebo iEQ9 test. Ak poznáš svoj typ, môžeš ho nastaviť manuálne v profile.'
              : 'Enneagram type is derived from the numerological profile (not from a questionnaire). For more accurate typing we recommend the RHETI or iEQ9 test. If you know your type, you can set it manually in your profile.'}
          </p>
        </div>
      </GlassCard>

      {/* Motivácia a Strach */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
              ↑
            </div>
            <div>
              <p className="text-xs text-emerald-400 uppercase mb-1">{t('numerology.enneagramMotivation')}</p>
              <p className="text-sm text-slate-300">{typeData.motivation}</p>
              <p className="text-xs text-slate-500 mt-2 italic">
                {language === 'sk'
                  ? 'Toto ťa nevedome poháňa — vo vzťahoch, práci, rozhodnutiach.'
                  : 'This unconsciously drives you — in relationships, work, decisions.'}
              </p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-lg shrink-0">
              ↓
            </div>
            <div>
              <p className="text-xs text-rose-400 uppercase mb-1">{t('numerology.enneagramFear')}</p>
              <p className="text-sm text-slate-300">{typeData.fear}</p>
              <p className="text-xs text-slate-500 mt-2 italic">
                {language === 'sk'
                  ? 'Keď si pod tlakom, tento strach riadi tvoje reakcie.'
                  : 'When you are under pressure, this fear drives your reactions.'}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Silné a slabé stránky */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard>
          <h4 className="text-sm text-emerald-400 uppercase mb-3">{t('numerology.enneagramStrengths')}</h4>
          <ul className="space-y-2">
            {typeData.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <h4 className="text-sm text-amber-400 uppercase mb-3">{t('numerology.enneagramChallenges')}</h4>
          <ul className="space-y-2">
            {typeData.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 mt-0.5 shrink-0">!</span>
                {w}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Integrácia / Dezintegrácia — smery rastu a stresu */}
      <GlassCard>
        <h3 className="font-medium text-white mb-2">{t('numerology.enneagramGrowthDirections')}</h3>
        <p className="text-xs text-slate-500 mb-4">
          {language === 'sk'
            ? 'Enneagram nie je statický — ukazuje kam sa posúvaš keď rastieš (integrácia) a kam skĺzneš pod tlakom (dezintegrácia). Toto je mapa tvojho vnútorného pohybu.'
            : 'The Enneagram is not static — it shows where you move when you grow (integration) and where you slide under pressure (disintegration). This is a map of your inner movement.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-500/30 text-green-200 font-bold flex items-center justify-center text-sm">
                {enneagramResult.integrationDirection}
              </div>
              <div>
                <p className="text-xs text-green-400 uppercase">{language === 'sk' ? `Rast → Typ ${enneagramResult.integrationDirection}` : `Growth → Type ${enneagramResult.integrationDirection}`}</p>
                <p className="text-sm text-white">{integrationData?.name}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              {language === 'sk'
                ? `Keď si v dobrom stave a vedome pracuješ na sebe, preberáš pozitívne vlastnosti typu ${enneagramResult.integrationDirection}. Toto je tvoj smer zdravia.`
                : `When you are in a good state and consciously working on yourself, you take on the positive qualities of type ${enneagramResult.integrationDirection}. This is your direction of health.`}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-500/30 text-red-200 font-bold flex items-center justify-center text-sm">
                {enneagramResult.disintegrationDirection}
              </div>
              <div>
                <p className="text-xs text-red-400 uppercase">{language === 'sk' ? `Stres → Typ ${enneagramResult.disintegrationDirection}` : `Stress → Type ${enneagramResult.disintegrationDirection}`}</p>
                <p className="text-sm text-white">{disintegrationData?.name}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              {language === 'sk'
                ? `Pod stresom nevedome preberáš negatívne vzorce typu ${enneagramResult.disintegrationDirection}. Keď to rozpoznáš, môžeš sa vedome vrátiť.`
                : `Under stress you unconsciously adopt negative patterns of type ${enneagramResult.disintegrationDirection}. When you recognize it, you can consciously return.`}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Krídla */}
      <GlassCard>
        <h3 className="font-medium text-white mb-2">{t('numerology.enneagramWings')}</h3>
        <p className="text-xs text-slate-500 mb-4">
          {language === 'sk'
            ? `Krídla sú dva susedné typy (${enneagramResult.wing1} a ${enneagramResult.wing2}), ktoré farbia tvoj hlavný typ. Jedno krídlo je zvyčajne silnejšie — pridáva ti dodatočné vlastnosti.`
            : `Wings are two adjacent types (${enneagramResult.wing1} and ${enneagramResult.wing2}) that color your main type. One wing is usually stronger — it adds additional qualities.`}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[enneagramResult.wing1, enneagramResult.wing2].map(wingNum => {
            const wData = getEnneagramType(wingNum, language);
            const isDominant = enneagramResult.dominantWing === wingNum;
            return (
              <div
                key={wingNum}
                className={`p-3 rounded-xl border ${isDominant ? 'bg-indigo-500/15 border-indigo-500/40' : 'bg-slate-800/30 border-slate-700/30'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDominant ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-700/50 text-slate-400'}`}>
                    {wingNum}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDominant ? 'text-white' : 'text-slate-300'}`}>
                      {wData?.name}
                    </p>
                    {isDominant && <span className="text-xs text-indigo-300">{language === 'sk' ? 'Dominantné krídlo' : 'Dominant wing'}</span>}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">{wData?.subtitle}</p>
              </div>
            );
          })}
        </div>
        {wingData && (
          <p className="text-xs text-slate-500 mt-3 italic">
            {language === 'sk'
              ? `Tvoje dominantné krídlo ${enneagramResult.dominantWing} ti pridáva: ${wingData.strengths[0].toLowerCase()}, ${wingData.strengths[1].toLowerCase()}.`
              : `Your dominant wing ${enneagramResult.dominantWing} adds: ${wingData.strengths[0].toLowerCase()}, ${wingData.strengths[1].toLowerCase()}.`}
          </p>
        )}
      </GlassCard>

      {/* Cesta rastu */}
      <GlassCard>
        <h3 className="font-medium text-white mb-2">{t('numerology.enneagramGrowthPath')}</h3>
        <p className="text-sm text-slate-300">{typeData.growthPath}</p>
      </GlassCard>

      {/* Prepojenie s numerológiou */}
      <GlassCard>
        <h3 className="font-medium text-white mb-2">{t('numerology.enneagramNumerologyLink')}</h3>
        <p className="text-xs text-slate-500 mb-3">
          {language === 'sk'
            ? 'Enneagram a numerológia zdieľajú 9 základných energií. Tvoj archetyp je odvodený z tvojich numerologických čísel — nie je to náhoda, ale synergia dvoch systémov.'
            : 'Enneagram and numerology share 9 fundamental energies. Your archetype is derived from your numerological numbers — this is not a coincidence, but a synergy of two systems.'}
        </p>
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-slate-700 space-y-1">
          {numerologyMethod === 'characterological' ? (
            <>
              <p><strong>{language === 'sk' ? `Životné číslo ${result.lifePathNumber}` : `Life path number ${result.lifePathNumber}`}</strong> → {language === 'sk' ? 'Enneagram typ' : 'Enneagram type'} {enneagramResult.coreType} ({typeData.name})</p>
              <p><strong>{language === 'sk' ? 'Mriežka energií' : 'Energy grid'}</strong> → {language === 'sk' ? `Určuje dominantné krídlo (podľa zastúpenia čísel ${enneagramResult.wing1} a ${enneagramResult.wing2})` : `Determines the dominant wing (based on presence of numbers ${enneagramResult.wing1} and ${enneagramResult.wing2})`}</p>
            </>
          ) : devResult ? (
            <>
              <p><strong>{language === 'sk' ? `K3 životné poslanie (${devResult.circled[2].value})` : `K3 life purpose (${devResult.circled[2].value})`}</strong> → {language === 'sk' ? 'Enneagram typ' : 'Enneagram type'} {enneagramResult.coreType} ({typeData.name})</p>
              <p><strong>K1 ({devResult.circled[0].value}) + K4 ({devResult.circled[3].value})</strong> → {language === 'sk' ? 'Určujú dominantné krídlo' : 'Determine the dominant wing'}</p>
            </>
          ) : null}
          <p className="mt-2 italic text-slate-500">{language === 'sk' ? 'Oba systémy potvrdzujú tú istú základnú tému — numerológia cez čísla, enneagram cez motivácie.' : 'Both systems confirm the same fundamental theme — numerology through numbers, enneagram through motivations.'}</p>
        </div>
      </GlassCard>

      {/* Prehľad všetkých 9 typov */}
      <GlassCard>
        <details>
          <summary className="text-sm font-medium text-indigo-700 cursor-pointer hover:text-indigo-800 select-none">
            {t('numerology.enneagramAllTypes')}
          </summary>
          <div className="space-y-2 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
              const eType = getEnneagramType(n, language);
              const isCurrent = n === enneagramResult.coreType;
              return (
                <div
                  key={n}
                  className={`p-3 rounded-xl border ${isCurrent ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-slate-800/30 border-slate-700/30'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isCurrent ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-700/50 text-slate-400'}`}>
                      {n}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-slate-300'}`}>{eType.name}</p>
                      <p className="text-xs text-slate-400">{eType.subtitle}</p>
                    </div>
                    {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300">{t('numerology.enneagramYourType')}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      </GlassCard>
    </div>
  );
}
