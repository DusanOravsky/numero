import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import type { NumerologyResult } from '../engine/numerologyEngine';
import type { AstrologyResult } from '../engine/astrologyEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import { enneagramTypes } from '../data/enneagram';
import { useStore } from '../store/useStore';
import { planetInSignDescriptions } from '../data/planetSignDescriptions';
import { orvDescriptions } from '../data/orvDescriptions';
import { getGeneKeyByGate } from '../data/geneKeys';
import { developmentalMeanings } from '../data/developmentalMeanings';
import { loveLanguageDescriptions } from '../data/orvDescriptions';
import lifePathsData from '../data/lifePaths.json';

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string }>;

interface ClientSummaryProps {
  clientName: string;
  /** Deň narodenia — pre výpočet Vývojovej mriežky. Ak chýba, fallback na regex z formuly. */
  birthDay?: number;
  birthMonth?: number;
  birthYear?: number;
  numerology: NumerologyResult;
  astrology: AstrologyResult;
  humanDesign: HumanDesignResult;
  kabalah: KabalahResult;
  theta: ThetaHealingResult;
  /** Ak true (default), zobrazí len pohľad pre aktuálnu zvolenú metódu.
   *  Ak false, zobrazí oba pohľady bez ohľadu na nastavenie (Dashboard). */
  respectMethodPreference?: boolean;
}

export function ClientSummary({ clientName, birthDay, birthMonth, birthYear, numerology, astrology, humanDesign, kabalah, theta, respectMethodPreference = true }: ClientSummaryProps) {
  const storedMethod = useStore(s => s.numerologyMethod);
  const showBoth = !respectMethodPreference;
  const showCharacter = showBoth || storedMethod === 'characterological';
  const showDevelopmental = showBoth || storedMethod === 'developmental';
  const lpInfo = lifePaths[String(numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber)];

  // Vývojová mriežka — používame explicit props ak sú dostupné,
  // inak (legacy callers) sfallback-ujeme cez regex z formuly.
  const m = numerology.formula.match(/\((\d+)→\d+\)\s*\+\s*\((\d+)→\d+\)\s*\+\s*\((\d+)→\d+\)/);
  const day = birthDay ?? (m ? parseInt(m[1], 10) : 1);
  const month = birthMonth ?? (m ? parseInt(m[2], 10) : 1);
  const year = birthYear ?? (m ? parseInt(m[3], 10) : 1900);
  const devNumerology = calculateDevelopmentalNumerology(day, month, year);

  // Z Vývojovej mriežky vyberieme top 3 najsilnejšie (najviac výskytov) a top 3 chýbajúce
  const devSorted = Object.entries(devNumerology.counts)
    .map(([k, v]) => ({ num: parseInt(k, 10), count: v }))
    .sort((a, b) => b.count - a.count);
  const devStrong = devSorted.filter(x => x.count >= 2).slice(0, 3);
  const devMissing = devSorted.filter(x => x.count === 0).slice(0, 3);

  const enneagram = deriveEnneagramType(numerology, devNumerology, storedMethod);
  const enneagramType = enneagramTypes[enneagram.coreType];
  const enneagramIntegration = enneagramTypes[enneagram.integrationDirection];
  const enneagramDisintegration = enneagramTypes[enneagram.disintegrationDirection];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
      <GlassCard glow>
        <h2 className="font-serif text-xl font-bold text-indigo-600 mb-4">Integrálny súhrn osobnosti</h2>

        {/* Quick takeaway — 3 najdôležitejšie veci */}
        <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200">
          <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wide mb-3">Najdôležitejšie na prvý pohľad</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-indigo-700">{numerology.lifePathNumber}</p>
              <p className="text-xs text-slate-700 font-medium">{lpInfo?.title || 'Životné číslo'}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Kto si v jadre</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-indigo-700">{humanDesign.type}</p>
              <p className="text-xs text-slate-700 font-medium">{humanDesign.strategy}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Ako správne fungovať</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-indigo-700">{astrology.sunSign.symbol}</p>
              <p className="text-xs text-slate-700 font-medium">{astrology.sunSign.name} / {astrology.moonSign.name} / {astrology.ascendant.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Slnko / Mesiac / Asc</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            <strong>{clientName}</strong> nesie životné číslo <strong>{numerology.lifePathNumber}</strong> z {numerology.lifePathFrom} ({lpInfo?.title || ''}).
            {lpInfo?.description || ''} Toto číslo definuje jadro osobnosti, hlavnú životnú lekciu a smer rastu.
          </p>

          <p className="border-l-2 border-indigo-200 pl-3">
            <strong>Dar:</strong> {lpInfo?.gift || '-'}.<br/>
            <strong>Tieň:</strong> {lpInfo?.shadow || '-'}.
          </p>

          {/* Enneagram archetyp */}
          {enneagramType && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">
                Enneagram — Typ {enneagram.coreType}: {enneagramType.name}
              </p>
              <p className="text-xs text-slate-700">
                {enneagramType.subtitle}.{' '}
                <strong>Motivácia:</strong> {enneagramType.motivation.toLowerCase()}.{' '}
                <strong>Strach:</strong> {enneagramType.fear.toLowerCase()}.
                {enneagram.dominantWing && (
                  <> Dominantné krídlo: <strong>{enneagram.dominantWing}w</strong> ({enneagramTypes[enneagram.dominantWing]?.name}).</>
                )}
              </p>
              <p className="text-xs text-slate-700">
                <strong>Rast (→{enneagram.integrationDirection}):</strong> {enneagramIntegration?.name} — {enneagramType.growthPath.split('.')[0]}.{' '}
                <strong>Stres (→{enneagram.disintegrationDirection}):</strong> {enneagramDisintegration?.name}.
              </p>
            </div>
          )}

          {/* Pohľad na mriežku — len pre aktívnu metódu */}
          {showCharacter && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-2">
              <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">
                Charakterová mriežka (vrodené kvality)
              </p>
              <p className="text-xs text-slate-700">
                {numerology.fullPlanes.length > 0 && (
                  <><strong>Plné roviny:</strong> {numerology.fullPlanes.join(', ')}. Tieto kvality má od narodenia. </>
                )}
                {numerology.emptyPlanes.length > 0 && (
                  <><strong>Prázdne roviny:</strong> {numerology.emptyPlanes.join(', ')}. Tu sa učí. </>
                )}
                {numerology.isolatedNumbers.length > 0 && (
                  <><strong>Izolované:</strong> {numerology.isolatedNumbers.join(', ')} – energie odrezané od zvyšku, vyžadujú vedomú integráciu. </>
                )}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                Zdroj: Robin Steinová – Numerológia: Čísla Lásky
              </p>
            </div>
          )}

          {showDevelopmental && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-2">
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">
                Vývojová mriežka (životné úlohy)
              </p>
              <p className="text-xs text-slate-700">
                {devStrong.length > 0 && (
                  <>
                    <strong>Silné oblasti:</strong>{' '}
                    {devStrong.map(s => `${s.num} (${developmentalMeanings[s.num]?.theme.split(' – ')[0]}, ${s.count}×)`).join('; ')}.{' '}
                  </>
                )}
                {devMissing.length > 0 && (
                  <>
                    <strong>Životné úlohy (chýbajúce):</strong>{' '}
                    {devMissing.map(s => developmentalMeanings[s.num]?.theme.split(' – ')[0]).filter(Boolean).join(', ')}.{' '}
                  </>
                )}
                {devNumerology.circled.length > 0 && (
                  <>
                    <strong>Karmické cykly:</strong> 1.={devNumerology.circled[0].value},{' '}
                    2.={devNumerology.circled[1].value},{' '}
                    3.={devNumerology.circled[2].value},{' '}
                    4.={devNumerology.circled[3].value}.{' '}
                  </>
                )}
                {devNumerology.oneCount > 0 && (
                  <>
                    <strong>Polarita ega:</strong>{' '}
                    {devNumerology.egoPolarity === 'masculine' ? '♂ mužské' : '♀ ženské'}
                    {' '}({devNumerology.oneCount}× číslo 1, {devNumerology.egoPolarity === 'masculine' ? 'nepárny' : 'párny'} počet){' '}
                    – {devNumerology.egoPolarity === 'masculine'
                        ? 'energia dávania, vymedzovania, akcie.'
                        : 'energia prijímania, otvorenia, trpezlivosti.'}{' '}
                  </>
                )}
                {devNumerology.isPost2000 && (
                  <em>Rok ≥ 2000 sa počíta špeciálne (20 + zvyšok).</em>
                )}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                Zdroj: kniha Lívia Mičková – Duchovná numerológia
              </p>
            </div>
          )}

          <p>
            <strong>Astrológia</strong> dopĺňa tento obraz: Slnko v <strong>{astrology.sunSign.name}</strong> ({astrology.sunSign.element}) –
            {planetInSignDescriptions['Slnko']?.[astrology.sunSign.name] || ''}{' '}
            Mesiac v <strong>{astrology.moonSign.name}</strong> ({astrology.moonSign.element}) odhaľuje emočný svet –
            {planetInSignDescriptions['Mesiac']?.[astrology.moonSign.name] || ''}{' '}
            Ascendent v <strong>{astrology.ascendant.name}</strong> určuje, ako ho vnímajú ostatní pri prvom kontakte.
            Dominantný živel je <strong>{astrology.dominantElement}</strong>, čo {
              astrology.dominantElement === 'Oheň' ? 'prináša dynamiku, vášeň a akčnosť' :
              astrology.dominantElement === 'Zem' ? 'prináša praktickosť, spoľahlivosť a zmysel pre realitu' :
              astrology.dominantElement === 'Vzduch' ? 'prináša intelekt, komunikačný talent a slobodomyseľnosť' :
              'prináša emočnú hĺbku, intuíciu a empatiu'
            }.
          </p>

          <p>
            V <strong>Human Design</strong> je typ <strong>{humanDesign.type}</strong> s <strong>{humanDesign.authority}</strong> autoritou.
            {humanDesign.type === 'Generátor' ? ' Ako Generátor má obrovskú životnú energiu, ale musí čakať na správne podnety – nie iniciovať z hlavy. Keď reaguje na to, čo ho naozaj "zapne", je neúnavný.' :
             humanDesign.type === 'Manifestujúci Generátor' ? ' Kombinuje energiu Generátora s iniciatívou Manifestora – je rýchly, multi-talentovaný, ale musí reagovať AJ informovať okolie.' :
             humanDesign.type === 'Manifestor' ? ' Ako Manifestor je tu aby začínal a inicioval. Musí informovať ostatných pred konaním, čím redukuje odpor okolia.' :
             humanDesign.type === 'Projektor' ? ' Ako Projektor nemá konzistentnú vlastnú energiu, ale vidí systémy a ľudí hlboko. Musí čakať na pozvanie do veľkých životných rozhodnutí.' :
             ' Ako Reflektor odráža prostredie okolo seba a musí čakať 28 dní pred veľkými rozhodnutiami.'}
            {' '}Stratégia: <strong>{humanDesign.strategy}</strong>.
            Profil <strong>{humanDesign.profile.line1}/{humanDesign.profile.line2}</strong> ({humanDesign.profile.name}) – {humanDesign.profile.description}
          </p>

          <p>
            <strong>Energetická mapa:</strong>{' '}
            {humanDesign.definedCenters.length >= 6 ? 'Väčšina centier je definovaná – má konzistentnú a spoľahlivú energiu vo väčšine oblastí života.' :
             humanDesign.definedCenters.length >= 4 ? 'Vyvážený počet definovaných a otvorených centier – kombinácia stability a flexibility.' :
             'Väčšina centier je otvorená – je vysoko adaptabilný a citlivý na prostredie, ale musí rozlišovať čo je jeho a čo absorbuje od iných.'}
            {' '}Definované: {humanDesign.definedCenters.join(', ')}.
            Otvorené (oblasti múdrosti): {humanDesign.openCenters.join(', ')}.
          </p>

          {(() => {
            const sunGate = humanDesign.personalityGates.find(g => g.planet === 'Slnko')?.gate;
            const earthGate = humanDesign.personalityGates.find(g => g.planet === 'Zem')?.gate;
            const topGeneKeys = [sunGate, earthGate].filter((g): g is number => g !== undefined).map(g => getGeneKeyByGate(g)).filter(Boolean);
            if (topGeneKeys.length === 0) return null;
            return (
              <div className="border-l-2 border-purple-200 pl-3 space-y-3">
                <p><strong>Génové kľúče – cesta transformácie:</strong></p>
                {topGeneKeys.map((gk) => (
                  <div key={gk!.gate} className="space-y-1">
                    <p className="text-sm">
                      <strong>Brána {gk!.gate}</strong>: <span className="text-red-600">{gk!.shadow}</span> (tieň) →
                      <span className="text-amber-600"> {gk!.gift}</span> (dar) →
                      <span className="text-green-600"> {gk!.siddhi}</span> (siddhi)
                    </p>
                    <p className="text-xs text-slate-500">{gk!.shadowDescription}</p>
                    <p className="text-xs text-slate-500">Dar: {gk!.giftDescription}</p>
                    <p className="text-xs text-slate-600">
                      <strong>NLP: {gk!.nlpTechnique}</strong> – {gk!.nlpDescription}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}

          <p>
            {numerology.fullPlanes.length > 0 && <><strong>Silné stránky</strong> (plné roviny): {numerology.fullPlanes.join(', ')}. Tieto schopnosti dostal do vienka a môže sa na ne spoliehať. </>}
            {numerology.emptyPlanes.length > 0 && <><strong>Oblasti rastu</strong> (prázdne roviny): {numerology.emptyPlanes.join(', ')}. Tu sa učí a rastie – nie je to slabosť, ale smer rozvoja. </>}
            {numerology.isolatedNumbers.length > 0 && <>Izolované čísla ({numerology.isolatedNumbers.join(', ')}) naznačujú energie, ktoré sú odrezané od zvyšku – vyžadujú vedomú pozornosť a integráciu.</>}
          </p>

          {/* Jazyky lásky – bohatý blok */}
          {numerology.loveLanguages && numerology.loveLanguages.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 space-y-3">
              <p className="font-medium text-slate-800 flex items-center gap-2">
                <span className="text-rose-500">♡</span> Jazyky lásky
              </p>
              <p className="text-xs text-slate-600">
                Numerologický rebríček toho, ako <strong>{clientName}</strong> najhlbšie prijíma
                a prejavuje lásku. Skóre vyplýva z numerologickej mriežky (napr. čím viac čísel z roviny
                3-6-9 Empatia, tým silnejšie „Slová uistenia"; rovina 7-8-9 Energia podporuje „Fyzický dotyk").
              </p>

              {/* Primárny jazyk – detailne */}
              {numerology.loveLanguages[0] && (() => {
                const top = numerology.loveLanguages[0];
                const info = loveLanguageDescriptions[top.language];
                return (
                  <div className="p-3 rounded-lg bg-white border border-rose-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wide text-rose-700 font-semibold">
                        Primárny jazyk – {top.score} bodov
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 text-base">{top.language}</p>
                    {info && (
                      <>
                        <p className="text-xs text-slate-700 mt-1.5">{info.description}</p>
                        <p className="text-xs text-slate-600 mt-1.5">
                          <strong className="text-slate-800">Príklady prejavu:</strong> {info.examples}
                        </p>
                        <p className="text-xs text-rose-700 mt-1">
                          <strong>Ako lásku prejaviť tomuto človeku:</strong> {info.howToShow}
                        </p>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Sekundárny jazyk – stručne */}
              {numerology.loveLanguages[1] && (() => {
                const second = numerology.loveLanguages[1];
                const info = loveLanguageDescriptions[second.language];
                return (
                  <div className="p-3 rounded-lg bg-white border border-indigo-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wide text-indigo-700 font-semibold">
                        Sekundárny jazyk – {second.score} bodov
                      </span>
                    </div>
                    <p className="font-medium text-slate-800">{second.language}</p>
                    {info && <p className="text-xs text-slate-600 mt-1">{info.description}</p>}
                  </div>
                );
              })()}

              {/* Rebríček ostatných */}
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                  Celý rebríček
                </p>
                {numerology.loveLanguages.map((lang, idx) => {
                  const widthPct = Math.max(0, Math.min(100, (lang.score + 5) * 8));
                  return (
                    <div key={lang.language}>
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className={idx === 0 ? 'text-slate-800 font-medium' : 'text-slate-600'}>
                          {idx + 1}. {lang.language}
                        </span>
                        <span className="text-slate-500">{lang.score}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            idx === 0
                              ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                              : 'bg-gradient-to-r from-indigo-400 to-violet-400'
                          }`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 italic">
                Pozn.: Záporné skóre neznamená neschopnosť — len to, že tento jazyk vyžaduje vedomé úsilie.
                Vo vzťahu je dôležité poznať jazyk lásky partnera a vedome ho používať.
              </p>
            </div>
          )}

          <p>
            <strong>Aktuálne obdobie:</strong> Nachádza sa v osobnom roku <strong>{numerology.orv}</strong> ({orvDescriptions[numerology.orv]?.title || ''}).
            {orvDescriptions[numerology.orv]?.description || ''}{' '}
            Vek duchovnej dospelosti (VDD) nastáva v <strong>{numerology.vdd}</strong> rokoch – zlomové obdobie, kedy sa menia priority a životné hodnoty.
          </p>

          <p>
            <strong>Duchovná rovina</strong> (Kabala): Primárna sefira <strong>{kabalah.primarySefira.name}</strong> ({kabalah.primarySefira.meaning}).
            {' '}{kabalah.primarySefira.gift}. Tieňová stránka: {kabalah.primarySefira.shadow}.
            Denný čin: {kabalah.malchutAction}
          </p>

          <p>
            <strong>Podvedomé vzorce</strong> (Theta Healing): Na najhlbšej úrovni môže niesť presvedčenie
            <em> "{theta.primaryBeliefs[0]?.belief}"</em> (pôvod: {theta.primaryBeliefs[0]?.origin}).
            Toto presvedčenie sa drží v oblasti: {theta.primaryBeliefs[0]?.bodyArea}. Emócia: {theta.primaryBeliefs[0]?.emotion}.
            Cesta k transformácii vedie cez uvedomenie a nahradenie novým presvedčením.
          </p>

          {/* Ako to všetko súvisí — koherentný cross-system príbeh */}
          <div className="border-t border-violet-200 pt-4 mt-4">
            <p className="text-xs text-violet-700 font-semibold uppercase tracking-wide mb-3">Ako to všetko súvisí — jeden príbeh z rôznych uhlov</p>
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>
                Všetky systémy hovoria o tom istom človeku — len každý iným jazykom. Tu je to prepojené:
              </p>

              <p>
                <strong>Tvoja hlavná téma</strong> je
                {' '}{enneagramType ? enneagramType.motivation.toLowerCase() : lpInfo?.title?.toLowerCase() || 'rast'}.
                Numerológia to vyjadruje cez životné číslo <strong>{numerology.lifePathNumber}</strong> ({lpInfo?.title || ''}).
                Enneagram to vidí ako typ <strong>{enneagram.coreType}</strong> ({enneagramType?.name}) — rovnaká energia, len pomenovaná cez motiváciu a strach.
                Kabala na to poukazuje cez sefiru <strong>{kabalah.primarySefira.name}</strong> ({kabalah.primarySefira.meaning}) — tá istá téma, ale v duchovnom jazyku.
              </p>

              <p>
                <strong>Ako to prejavuješ vo svete:</strong>{' '}
                Astrológia ukazuje, že tvoje vedomé ja ({astrology.sunSign.name}, element {astrology.sunSign.element.toLowerCase()})
                {astrology.sunSign.element === 'Oheň' ? ' ti dáva akčnosť a vášeň' :
                 astrology.sunSign.element === 'Zem' ? ' ti dáva praktickosť a vytrvalosť' :
                 astrology.sunSign.element === 'Vzduch' ? ' ti dáva komunikačný talent a analytické myslenie' :
                 ' ti dáva emočnú hĺbku a intuíciu'} —
                a Human Design dopĺňa <em>ako</em> túto energiu správne používať: si <strong>{humanDesign.type}</strong>,
                čiže tvoja stratégia je „{humanDesign.strategy.toLowerCase()}".
                {humanDesign.type === 'Generátor' || humanDesign.type === 'Manifestujúci Generátor'
                  ? ' Máš obrovskú energiu, ale musíš čakať na správny podnet — nie iniciovať z hlavy.'
                  : humanDesign.type === 'Projektor'
                  ? ' Nemáš nekonečnú energiu, ale máš dar vidieť do hĺbky — tvoja sila je múdrosť, nie výkon.'
                  : humanDesign.type === 'Manifestor'
                  ? ' Si tu aby si inicioval — ale vždy informuj okolie, inak narazíš na odpor.'
                  : ' Odrážaš prostredie okolo seba — tvoja sila je v trpezlivosti a rozlišovaní.'}
              </p>

              <p>
                <strong>Kde rastieš a kde sa bráníš:</strong>{' '}
                Enneagram ukazuje, že keď si v pohode, preberáš vlastnosti typu {enneagram.integrationDirection} ({enneagramIntegration?.name}) — to je tvoj smer zdravia.
                Pod stresom skĺzneš k typu {enneagram.disintegrationDirection} ({enneagramDisintegration?.name}).
                {theta.primaryBeliefs[0] && (
                  <> Theta Healing dopĺňa, že na podvedomej úrovni ti môže brániť presvedčenie <em>„{theta.primaryBeliefs[0].belief}"</em> — to je koreň, nie symptóm.</>
                )}
              </p>

              <p>
                <strong>Červená niť:</strong>{' '}
                {astrology.dominantElement === 'Oheň' && enneagram.coreType <= 3
                  ? 'Ohnivý element + nízky enneagram typ = silná akčná energia s túžbou po výsledkoch. Lekcia: spomaľ a počúvaj (HD autorita).'
                  : astrology.dominantElement === 'Voda' && (enneagram.coreType === 4 || enneagram.coreType === 2)
                  ? 'Vodný element + citovo orientovaný enneagram = hlboká empatia, ale riziko strácanin sa v emóciách iných. Lekcia: hranice.'
                  : astrology.dominantElement === 'Vzduch' && (enneagram.coreType === 5 || enneagram.coreType === 7)
                  ? 'Vzdušný element + mentálny enneagram = brilantný intelekt, ale riziko odpojenia od tela. Lekcia: grounding.'
                  : astrology.dominantElement === 'Zem' && (enneagram.coreType === 6 || enneagram.coreType === 9)
                  ? 'Zemský element + stabilizujúci enneagram = spoľahlivosť, ale riziko stagnácie. Lekcia: odvaha riskovať.'
                  : `Element ${astrology.dominantElement.toLowerCase()} + enneagram ${enneagram.coreType} + HD ${humanDesign.type} = unikátna kombinácia. Tvoja lekcia je nájsť rovnováhu medzi tým, čo ťa poháňa (motivácia) a tým, čo ťa brzdí (strach).`}
                {' '}Všetky systémy ukazujú tú istú cestu — len rôznymi slovami.
              </p>
            </div>
          </div>

          {/* Praktický záver — čo s tým */}
          <div className="border-t border-indigo-200 pt-4 mt-4">
            <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wide mb-3">Prakticky — čo s tým robiť</p>
            <div className="space-y-2 text-xs text-slate-700">
              <p>
                <strong>1. Rozhodovanie:</strong> Používaj svoju HD autoritu (<strong>{humanDesign.authority}</strong>) —
                {humanDesign.authority === 'Emocionálna' ? ' nikdy sa nerozhoduj v emočnom výkyve, čakaj na jasnosť.' :
                 humanDesign.authority === 'Sakrálna' ? ' počúvaj reakciu z brucha (uh-huh / unh-unh).' :
                 humanDesign.authority === 'Slezinová' ? ' dôveruj prvému impulzu, ak ho ignoruješ, stratíš ho.' :
                 ' dôveruj svojmu vnútornému kompasu.'}
              </p>
              <p>
                <strong>2. Energia:</strong> Ako {humanDesign.type} je tvoja stratégia „{humanDesign.strategy.toLowerCase()}". Keď cítiš {humanDesign.notSelfTheme.toLowerCase()} — je to signál, že niečo nie je pre teba.
              </p>
              <p>
                <strong>3. Rast:</strong> Tvoj dar je {lpInfo?.gift?.toLowerCase() || 'v tvojom životnom čísle'}. Tvoja výzva je {lpInfo?.shadow?.toLowerCase() || 'v tieni tvojho čísla'}. Vedomá práca s tieňom je cesta k daru.
              </p>
              <p>
                <strong>4. Dnes:</strong> {kabalah.malchutAction}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
