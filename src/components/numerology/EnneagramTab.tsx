import { GlassCard } from '../GlassCard';
import type { NumerologyResult } from '../../engine/numerologyEngine';
import type { DevelopmentalNumerologyResult } from '../../engine/developmentalNumerologyEngine';
import type { EnneagramResult } from '../../engine/enneagramEngine';
import { enneagramTypes } from '../../data/enneagram';

interface EnneagramTabProps {
  result: NumerologyResult;
  enneagramResult: EnneagramResult;
  devResult: DevelopmentalNumerologyResult | null;
  numerologyMethod: string;
}

export function EnneagramTab({ result, enneagramResult, devResult, numerologyMethod }: EnneagramTabProps) {
  const typeData = enneagramTypes[enneagramResult.coreType];
  if (!typeData) return null;

  const integrationData = enneagramTypes[enneagramResult.integrationDirection];
  const disintegrationData = enneagramTypes[enneagramResult.disintegrationDirection];
  const wingData = enneagramResult.dominantWing ? enneagramTypes[enneagramResult.dominantWing] : null;

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
                  Krídlo {enneagramResult.dominantWing}w
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400">
                {numerologyMethod === 'characterological' ? `z ŽČ ${result.lifePathNumber}` : `z K3 ${devResult?.circled[2].value}`}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tvoje čítanie — personalizovaný sprievodca */}
      <GlassCard glow>
        <h3 className="font-medium text-white mb-3">Tvoje čítanie — ako pracovať s Archetypom a Enneagramom</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            Si typ <strong className="text-white">{enneagramResult.coreType} — {typeData.name}</strong>.
            Tvoja základná motivácia: <em>{typeData.motivation.toLowerCase()}</em>.
            Tvoj základný strach: <em>{typeData.fear.toLowerCase()}</em>.
          </p>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-400 font-semibold mb-1">Tvoj smer rastu → typ {enneagramResult.integrationDirection} ({integrationData?.name})</p>
            <p className="text-xs text-slate-300">
              Keď si v pohode a vedome pracuješ na sebe, smeruješ sem. Toto je tvoja „vyššia verzia".
              {typeData.growthPath.split('.')[0]}.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-rose-400 font-semibold mb-1">Tvoj stresový smer → typ {enneagramResult.disintegrationDirection} ({disintegrationData?.name})</p>
            <p className="text-xs text-slate-300">
              Pod tlakom nevedome skĺzneš sem. Nie je to zlyhanie — je to signál že niečo nie je OK.
              Keď si to všimneš, môžeš sa vedome vrátiť.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
            <p className="text-[10px] text-slate-500 uppercase mb-1">Praktický tip</p>
            <p className="text-xs text-slate-300">
              Dnes si všímaj: kedy konáš z motivácie ({typeData.motivation.split('.')[0].toLowerCase()}) a kedy zo strachu ({typeData.fear.split('.')[0].toLowerCase()}).
              Stačí pozorovať — samotné uvedomenie je prvý krok zmeny.
            </p>
          </div>
          <p className="text-[11px] text-slate-500 italic mt-2">
            Enneagram typ je odvodený z numerologického profilu (nie z dotazníka). Pre presnejšie typovanie odporúčame RHETI alebo iEQ9 test. Ak poznáš svoj typ, môžeš ho nastaviť manuálne v profile.
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
              <p className="text-xs text-emerald-400 uppercase mb-1">Základná motivácia</p>
              <p className="text-sm text-slate-300">{typeData.motivation}</p>
              <p className="text-xs text-slate-500 mt-2 italic">Toto ťa nevedome poháňa — vo vzťahoch, práci, rozhodnutiach.</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-lg shrink-0">
              ↓
            </div>
            <div>
              <p className="text-xs text-rose-400 uppercase mb-1">Základný strach</p>
              <p className="text-sm text-slate-300">{typeData.fear}</p>
              <p className="text-xs text-slate-500 mt-2 italic">Keď si pod tlakom, tento strach riadi tvoje reakcie.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Silné a slabé stránky */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard>
          <h4 className="text-sm text-emerald-400 uppercase mb-3">Silné stránky</h4>
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
          <h4 className="text-sm text-amber-400 uppercase mb-3">Výzvy</h4>
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
        <h3 className="font-medium text-white mb-2">Smery rastu a stresu</h3>
        <p className="text-xs text-slate-500 mb-4">
          Enneagram nie je statický — ukazuje kam sa posúvaš keď rastieš (integrácia) a kam skĺzneš pod tlakom (dezintegrácia). Toto je mapa tvojho vnútorného pohybu.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-500/30 text-green-200 font-bold flex items-center justify-center text-sm">
                {enneagramResult.integrationDirection}
              </div>
              <div>
                <p className="text-xs text-green-400 uppercase">Rast → Typ {enneagramResult.integrationDirection}</p>
                <p className="text-sm text-white">{integrationData?.name}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Keď si v dobrom stave a vedome pracuješ na sebe, preberáš pozitívne vlastnosti typu {enneagramResult.integrationDirection}. Toto je tvoj smer zdravia.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-500/30 text-red-200 font-bold flex items-center justify-center text-sm">
                {enneagramResult.disintegrationDirection}
              </div>
              <div>
                <p className="text-xs text-red-400 uppercase">Stres → Typ {enneagramResult.disintegrationDirection}</p>
                <p className="text-sm text-white">{disintegrationData?.name}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Pod stresom nevedome preberáš negatívne vzorce typu {enneagramResult.disintegrationDirection}. Keď to rozpoznáš, môžeš sa vedome vrátiť.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Krídla */}
      <GlassCard>
        <h3 className="font-medium text-white mb-2">Krídla</h3>
        <p className="text-xs text-slate-500 mb-4">
          Krídla sú dva susedné typy ({enneagramResult.wing1} a {enneagramResult.wing2}), ktoré farbia tvoj hlavný typ. Jedno krídlo je zvyčajne silnejšie — pridáva ti dodatočné vlastnosti.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[enneagramResult.wing1, enneagramResult.wing2].map(wingNum => {
            const wData = enneagramTypes[wingNum];
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
                    {isDominant && <span className="text-xs text-indigo-300">Dominantné krídlo</span>}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">{wData?.subtitle}</p>
              </div>
            );
          })}
        </div>
        {wingData && (
          <p className="text-xs text-slate-500 mt-3 italic">
            Tvoje dominantné krídlo {enneagramResult.dominantWing} ti pridáva: {wingData.strengths[0].toLowerCase()}, {wingData.strengths[1].toLowerCase()}.
          </p>
        )}
      </GlassCard>

      {/* Cesta rastu */}
      <GlassCard>
        <h3 className="font-medium text-white mb-2">Praktická cesta rastu</h3>
        <p className="text-sm text-slate-300">{typeData.growthPath}</p>
      </GlassCard>

      {/* Prepojenie s numerológiou */}
      <GlassCard>
        <h3 className="font-medium text-white mb-2">Prepojenie s numerológiou</h3>
        <p className="text-xs text-slate-500 mb-3">
          Enneagram a numerológia zdieľajú 9 základných energií. Tvoj archetyp je odvodený z tvojich numerologických čísel — nie je to náhoda, ale synergia dvoch systémov.
        </p>
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-slate-700 space-y-1">
          {numerologyMethod === 'characterological' ? (
            <>
              <p><strong>Životné číslo {result.lifePathNumber}</strong> → Enneagram typ {enneagramResult.coreType} ({typeData.name})</p>
              <p><strong>Mriežka energií</strong> → Určuje dominantné krídlo (podľa zastúpenia čísel {enneagramResult.wing1} a {enneagramResult.wing2})</p>
            </>
          ) : devResult ? (
            <>
              <p><strong>K3 životné poslanie ({devResult.circled[2].value})</strong> → Enneagram typ {enneagramResult.coreType} ({typeData.name})</p>
              <p><strong>K1 ({devResult.circled[0].value}) + K4 ({devResult.circled[3].value})</strong> → Určujú dominantné krídlo</p>
            </>
          ) : null}
          <p className="mt-2 italic text-slate-500">Oba systémy potvrdzujú tú istú základnú tému — numerológia cez čísla, enneagram cez motivácie.</p>
        </div>
      </GlassCard>

      {/* Prehľad všetkých 9 typov */}
      <GlassCard>
        <details>
          <summary className="text-sm font-medium text-indigo-700 cursor-pointer hover:text-indigo-800 select-none">
            Prehľad všetkých 9 enneagram typov
          </summary>
          <div className="space-y-2 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
              const t = enneagramTypes[n];
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
                      <p className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-slate-300'}`}>{t.name}</p>
                      <p className="text-xs text-slate-400">{t.subtitle}</p>
                    </div>
                    {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300">Tvoj typ</span>}
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
