import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { EnergyCard } from '../components/EnergyCard';
import { NumerologyGrid } from '../components/NumerologyGrid';
import { ChakraWheel } from '../components/ChakraWheel';
import { calculateFullNumerology, getGridCount } from '../engine/numerologyEngine';
import type { NumerologyResult } from '../engine/numerologyEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import type { AstrologyResult } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import { evaluateChakras } from '../engine/chakraEngine';
import type { ChakraState } from '../engine/chakraEngine';
import { calculateKabalah } from '../engine/kabalahEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import { calculateThetaHealing } from '../engine/thetaHealingEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { calculatePartnerCompatibility, calculateParentChild } from '../engine/compatibilityEngine';
import { PartnerBodygraph } from '../components/PartnerBodygraph';
import { reduceToSingle } from '../engine/numerologyEngine';
import lifePathsData from '../data/lifePaths.json';
import { planetInSignDescriptions, cycleVibrationDescriptions } from '../data/planetSignDescriptions';
import { orvDescriptions } from '../data/orvDescriptions';
import { getGeneKeyByGate } from '../data/geneKeys';

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string }>;

interface AllResults {
  numerology: NumerologyResult;
  astrology: AstrologyResult;
  humanDesign: HumanDesignResult;
  chakras: ChakraState[];
  kabalah: KabalahResult;
  theta: ThetaHealingResult;
}

export function ClientDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, updateClient, addReport } = useStore();
  const client = clients.find(c => c.id === id);
  const [results, setResults] = useState<AllResults | null>(null);
  const [showPartnerSelect, setShowPartnerSelect] = useState(false);
  const [showChildSelect, setShowChildSelect] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    if (!client) return;
    const { birthDay: d, birthMonth: m, birthYear: y, birthHour: h, birthMinute: min } = client;

    const numerology = calculateFullNumerology(d, m, y);
    const astrology = calculateAstrology(d, m, y, h || 12, min || 0);
    const humanDesign = calculateHumanDesign(d, m, y, h || 12, min || 0);
    const gridCounts = getGridCount(numerology.grid);
    const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement);
    const lp = numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber;
    const kabalah = calculateKabalah(lp, reduceToSingle(d));
    const theta = calculateThetaHealing(lp);

    setResults({ numerology, astrology, humanDesign, chakras, kabalah, theta });

    addReport({
      id: crypto.randomUUID(),
      profileId: '',
      clientId: client.id,
      type: 'Kompletný výklad',
      title: `Výklad pre ${client.name}`,
      data: { lifePathNumber: numerology.lifePathNumber, hdType: humanDesign.type },
      createdAt: new Date().toISOString(),
    });
  }, [client]);

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Klient nebol nájdený</p>
        <button onClick={() => navigate('/clients')} className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white">Späť na klientov</button>
      </div>
    );
  }

  if (!results) return <div className="text-center py-20"><p className="text-slate-400">Počítam...</p></div>;

  const { numerology, astrology, humanDesign, chakras, kabalah, theta } = results;
  const lpInfo = lifePaths[String(numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber)];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/clients')} className="text-slate-400 hover:text-white text-sm">← Klienti</button>
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-white">{client.name}</h1>
          <p className="text-slate-400 text-sm">{client.birthDay}.{client.birthMonth}.{client.birthYear}{client.birthHour !== undefined ? ` ${client.birthHour}:${String(client.birthMinute || 0).padStart(2, '0')}` : ''}</p>
        </div>
      </div>

      {/* INTEGRALNY SUMAR - NA ZACIATKU */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <GlassCard glow>
          <h2 className="font-serif text-xl font-bold text-indigo-600 mb-4">Integrálny súhrn osobnosti</h2>
          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            <p>
              <strong>{client.name}</strong> nesie životné číslo <strong>{numerology.lifePathNumber}</strong> z {numerology.lifePathFrom} ({lpInfo?.title || ''}).
              {lpInfo?.description || ''} Toto číslo definuje jadro osobnosti, hlavnú životnú lekciu a smer rastu.
            </p>

            <p className="border-l-2 border-indigo-200 pl-3">
              <strong>Dar:</strong> {lpInfo?.gift || '-'}.<br/>
              <strong>Tieň:</strong> {lpInfo?.shadow || '-'}.
            </p>

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

            <p>
              <strong>Vo vzťahoch</strong> je primárny jazyk lásky <strong>{numerology.loveLanguages[0]?.language || '-'}</strong> –
              {numerology.loveLanguages[0]?.language === 'Fyzický dotyk' ? ' najhlbšie prijíma a vyjadruje lásku cez fyzickú blízkosť, objatie, dotyk. Bez fyzického kontaktu sa cíti odpojený.' :
               numerology.loveLanguages[0]?.language === 'Slová uistenia' ? ' potrebuje počuť slová uznania, ocenenia a potvrdenia. Kritika ho hlboko zraňuje.' :
               numerology.loveLanguages[0]?.language === 'Kvalitný čas' ? ' najdôležitejšia je plná pozornosť a spoločne strávený čas. Rozptýlenie partnera vníma ako nezáujem.' :
               numerology.loveLanguages[0]?.language === 'Obdarovávanie' ? ' oceňuje premyslené dary a zdieľanie. Nie je to materializmus – ide o symbol: "myslel som na teba."' :
               ' najhlbšie vníma lásku cez praktickú pomoc a službu. Keď mu niekto uľahčí život, cíti sa milovaný.'}
            </p>

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

            <div className="border-t border-slate-200 pt-3 mt-3">
              <p className="text-xs text-slate-500">
                <strong>Prepojenia naprieč systémami:</strong>{' '}
                {numerology.lifePathNumber === 1 && humanDesign.type === 'Projektor' ? 'ŽČ 1 (vodcovstvo) + HD Projektor (čakať na pozvanie) = kľúčová lekcia je viesť cez múdrosť, nie silu. ' : ''}
                {numerology.lifePathNumber === 7 && astrology.dominantElement === 'Voda' ? 'ŽČ 7 (mystik) + vodný živel = silná intuícia a potreba hĺbky vo všetkom. ' : ''}
                {numerology.isolatedNumbers.includes(1) && humanDesign.openCenters.includes('G') ? 'Izolovaná 1 + otvorené G centrum = hľadanie identity je celoživotná téma. ' : ''}
                {astrology.dominantElement === 'Oheň' && numerology.fullPlanes.some(p => p.includes('Energia')) ? 'Ohnivý živel + plná Rovina energie = obrovská životná sila a akčnosť. ' : ''}
                {astrology.dominantElement === 'Zem' && numerology.fullPlanes.some(p => p.includes('Vytrvalosť')) ? 'Zemský živel + Rovina vytrvalosti = vynikajúca schopnosť dotiahnuť veci do konca. ' : ''}
                ŽČ {numerology.lifePathNumber} + {astrology.sunSign.name} + HD {humanDesign.type} tvoria unikátnu kombináciu, ktorá definuje cestu tejto osobnosti.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.section>

      {/* NUMEROLÓGIA */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-indigo-300">Numerológia</h2>
          <button onClick={() => navigate('/numerology')} className="text-xs text-slate-400 hover:text-white">Otvoriť detail →</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GlassCard className="lg:col-span-1">
            <div className="text-center">
              <p className="text-xs text-slate-400">Životné číslo</p>
              <p className="text-4xl font-serif font-bold text-white mt-1">{numerology.lifePathNumber}</p>
              <p className="text-sm text-indigo-300">z {numerology.lifePathFrom}</p>
              {lpInfo && <p className="text-sm text-slate-300 mt-2">{lpInfo.title}</p>}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center p-2 rounded-lg bg-indigo-500/10" title="Osobná ročná vibrácia – energia celého roka od narodenín do narodenín">
                <p className="text-[10px] text-slate-500">ORV (rok)</p>
                <p className="text-lg font-bold text-white">{numerology.orv}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-purple-500/10" title="Osobná mesačná vibrácia – energia tohto mesiaca">
                <p className="text-[10px] text-slate-500">OMV (mesiac)</p>
                <p className="text-lg font-bold text-white">{numerology.omv}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-amber-500/10">
                <p className="text-[10px] text-slate-500">ODV (deň)</p>
                <p className="text-lg font-bold text-white">{numerology.odv}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="lg:col-span-1">
            <NumerologyGrid grid={numerology.grid} />
          </GlassCard>
          <GlassCard className="lg:col-span-1">
            {numerology.fullPlanes.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-green-400 mb-1">Plné roviny</p>
                {numerology.fullPlanes.map(p => <p key={p} className="text-xs text-slate-300">{p}</p>)}
              </div>
            )}
            {numerology.emptyPlanes.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-amber-400 mb-1">Prázdne roviny</p>
                {numerology.emptyPlanes.map(p => <p key={p} className="text-xs text-slate-300">{p}</p>)}
              </div>
            )}
            {numerology.isolatedNumbers.length > 0 && (
              <div>
                <p className="text-xs text-rose-400 mb-1">Izolované čísla</p>
                <div className="flex gap-1">{numerology.isolatedNumbers.map(n => <span key={n} className="w-6 h-6 rounded bg-rose-500/20 text-rose-300 text-xs flex items-center justify-center">{n}</span>)}</div>
              </div>
            )}
          </GlassCard>
        </div>
      </motion.section>

      {/* ASTROLÓGIA */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-cyan-300">Astrológia</h2>
          <button onClick={() => navigate('/astrology')} className="text-xs text-slate-400 hover:text-white">Otvoriť detail →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <EnergyCard title="Slnko" value={`${astrology.sunSign.symbol} ${astrology.sunSign.name}`} subtitle={astrology.sunSign.element} color="gold" />
          <EnergyCard title="Mesiac" value={`${astrology.moonSign.symbol} ${astrology.moonSign.name}`} subtitle={astrology.moonSign.element} color="purple" />
          <EnergyCard title="Ascendent" value={`${astrology.ascendant.symbol} ${astrology.ascendant.name}`} subtitle={astrology.ascendant.element} color="cyan" />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <GlassCard className="text-center">
            <p className="text-xs text-slate-400">Živel</p>
            <p className="text-sm font-medium text-white">{astrology.dominantElement}</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-xs text-slate-400">Kvalita</p>
            <p className="text-sm font-medium text-white">{astrology.dominantQuality}</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-xs text-slate-400">Mesačná fáza</p>
            <p className="text-sm font-medium text-white">{astrology.moonPhase}</p>
          </GlassCard>
        </div>
      </motion.section>

      {/* HUMAN DESIGN */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-purple-300">Human Design</h2>
          <button onClick={() => navigate('/human-design')} className="text-xs text-slate-400 hover:text-white">Otvoriť detail →</button>
        </div>
        <GlassCard>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400">Typ</p>
              <p className="text-sm font-bold text-white">{humanDesign.type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Autorita</p>
              <p className="text-sm font-medium text-white">{humanDesign.authority}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Profil</p>
              <p className="text-sm font-medium text-white">{humanDesign.profile.line1}/{humanDesign.profile.line2} {humanDesign.profile.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Stratégia</p>
              <p className="text-sm font-medium text-white">{humanDesign.strategy}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1">
            {humanDesign.definedCenters.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">{c}</span>)}
            {humanDesign.openCenters.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400">{c}</span>)}
          </div>
        </GlassCard>
      </motion.section>

      {/* ČAKRY */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-green-300">Čakry</h2>
          <button onClick={() => navigate('/chakras')} className="text-xs text-slate-400 hover:text-white">Otvoriť detail →</button>
        </div>
        <GlassCard>
          <ChakraWheel chakras={chakras} />
        </GlassCard>
      </motion.section>

      {/* KABALA */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-amber-300">Kabala</h2>
          <button onClick={() => navigate('/kabalah')} className="text-xs text-slate-400 hover:text-white">Otvoriť detail →</button>
        </div>
        <GlassCard>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400">Primárna sefira</p>
              <p className="text-lg font-serif font-bold text-white">{kabalah.primarySefira.name}</p>
              <p className="text-sm text-amber-300">{kabalah.primarySefira.meaning}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Sekundárna sefira</p>
              <p className="text-lg font-serif font-bold text-white">{kabalah.secondarySefira.name}</p>
              <p className="text-sm text-purple-300">{kabalah.secondarySefira.meaning}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">{kabalah.malchutAction}</p>
        </GlassCard>
      </motion.section>

      {/* THETA HEALING */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-teal-300">Theta Healing</h2>
          <button onClick={() => navigate('/theta-healing')} className="text-xs text-slate-400 hover:text-white">Otvoriť detail →</button>
        </div>
        <GlassCard>
          <p className="text-xs text-slate-400 mb-3">Hlavné limitujúce presvedčenia:</p>
          <div className="space-y-2">
            {theta.primaryBeliefs.map((b, i) => (
              <div key={i} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-white">"{b.belief}"</p>
                <p className="text-xs text-slate-400 mt-1">{b.level} | {b.emotion}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.section>

      {/* PARTNER A DETI */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <h2 className="font-serif text-xl font-bold text-rose-300 mb-3">Vzťahy a rodina</h2>

        {/* Partner */}
        <div className="space-y-4 mb-6">
          <GlassCard>
            <p className="text-xs text-slate-400">
              <strong className="text-rose-300">Partnerská kompatibilita</strong> hodnotí harmonickú zhodu – spoločné hodnoty, rovnaké jazyky lásky a energetickú rezonanciu. Porovnáva životné čísla, spoločné roviny v mriežke, jazyky lásky a ORV prepojenie.
            </p>
          </GlassCard>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Partner</h3>
            {!client.partnerId ? (
              <button onClick={() => setShowPartnerSelect(true)} className="text-xs px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500">+ Priradiť partnera</button>
            ) : (
              <button onClick={() => updateClient(client.id, { partnerId: undefined })} className="text-xs text-red-400 hover:text-red-300">Odstrániť</button>
            )}
          </div>

          {showPartnerSelect && (
            <GlassCard>
              <p className="text-xs text-slate-400 mb-2">Vyberte klienta ako partnera:</p>
              <div className="space-y-1">
                {clients.filter(c => c.id !== client.id).map(c => (
                  <button key={c.id} onClick={() => { updateClient(client.id, { partnerId: c.id }); setShowPartnerSelect(false); }}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                    {c.name} ({c.birthDay}.{c.birthMonth}.{c.birthYear})
                  </button>
                ))}
              </div>
              <button onClick={() => setShowPartnerSelect(false)} className="text-xs text-slate-400 mt-2">Zrušiť</button>
            </GlassCard>
          )}

          {client.partnerId && (() => {
            const partner = clients.find(c => c.id === client.partnerId);
            if (!partner) return null;
            const partnerNum = calculateFullNumerology(partner.birthDay, partner.birthMonth, partner.birthYear);
            const compat = calculatePartnerCompatibility(numerology, partnerNum, client.name, partner.name);
            const partnerHD = calculateHumanDesign(partner.birthDay, partner.birthMonth, partner.birthYear, partner.birthHour || 12, partner.birthMinute || 0);
            return (
              <div className="space-y-3">
                <GlassCard glow>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium text-white">{client.name} & {partner.name}</p>
                      <p className="text-xs text-slate-400">ŽČ {numerology.lifePathNumber} + ŽČ {partnerNum.lifePathNumber} | Cieľ vzťahu: {reduceToSingle(numerology.lifePathNumber + partnerNum.lifePathNumber)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-serif font-bold text-rose-300">{compat.overallScore}%</p>
                      <p className="text-xs text-slate-400">kompatibilita</p>
                    </div>
                  </div>
                </GlassCard>
                <div className="grid grid-cols-2 gap-3">
                  <GlassCard><p className="text-xs text-slate-400">Životné čísla</p><p className="text-sm text-white font-medium">{compat.lifePathCompatibility.score}%</p><p className="text-xs text-slate-300 mt-1">{compat.lifePathCompatibility.description}</p></GlassCard>
                  <GlassCard><p className="text-xs text-slate-400">Jazyky lásky</p><p className="text-sm text-white font-medium">{compat.loveLanguageMatch.score}%</p>{compat.loveLanguageMatch.matched.length > 0 && <p className="text-xs text-green-300 mt-1">{compat.loveLanguageMatch.matched.join(', ')}</p>}</GlassCard>
                </div>
                {compat.strengths.length > 0 && (
                  <GlassCard>
                    <p className="text-xs text-green-400 uppercase mb-2">Silné stránky</p>
                    {compat.strengths.map((s, i) => <p key={i} className="text-xs text-slate-300 mb-1">+ {s}</p>)}
                  </GlassCard>
                )}
                {compat.challenges.length > 0 && (
                  <GlassCard>
                    <p className="text-xs text-amber-400 uppercase mb-2">Výzvy</p>
                    {compat.challenges.map((c, i) => <p key={i} className="text-xs text-slate-300 mb-1">! {c}</p>)}
                  </GlassCard>
                )}
                <GlassCard>
                  <h3 className="text-sm font-medium text-purple-300 mb-3">Human Design kompatibilita</h3>
                  <PartnerBodygraph result1={humanDesign} result2={partnerHD} name1={client.name} name2={partner.name} />
                </GlassCard>
                <GlassCard>
                  <p className="text-xs text-indigo-400 uppercase mb-2">Odporúčania</p>
                  {compat.recommendations.map((r, i) => <p key={i} className="text-xs text-slate-300 mb-1">→ {r}</p>)}
                </GlassCard>
                <GlassCard>
                  <p className="text-xs text-rose-400 uppercase mb-2">Rituály pre pár</p>
                  {compat.rituals.map((r, i) => <p key={i} className="text-xs text-slate-300 mb-1">♡ {r}</p>)}
                </GlassCard>
              </div>
            );
          })()}
        </div>

        {/* Deti */}
        <div className="space-y-4">
          <GlassCard>
            <p className="text-xs text-slate-400">
              <strong className="text-green-300">Rodič-dieťa kompatibilita</strong> hodnotí doplnkovosť – ako rodič dopĺňa dieťa. Vyšší % znamená že rodič má energie, ktoré dieťa potrebuje rozvíjať. Porovnáva mriežky, VDD, ΣT, cieľ vzťahu a spoločné roviny.
            </p>
          </GlassCard>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Deti</h3>
            <button onClick={() => setShowChildSelect(true)} className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-500">+ Pridať dieťa</button>
          </div>

          {showChildSelect && (
            <GlassCard>
              <p className="text-xs text-slate-400 mb-2">Vyberte klienta ako dieťa:</p>
              <div className="space-y-1">
                {clients.filter(c => c.id !== client.id && !(client.childrenIds || []).includes(c.id)).map(c => (
                  <button key={c.id} onClick={() => { updateClient(client.id, { childrenIds: [...(client.childrenIds || []), c.id] }); setShowChildSelect(false); }}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                    {c.name} ({c.birthDay}.{c.birthMonth}.{c.birthYear})
                  </button>
                ))}
              </div>
              <button onClick={() => setShowChildSelect(false)} className="text-xs text-slate-400 mt-2">Zrušiť</button>
            </GlassCard>
          )}

          {(client.childrenIds || []).map(childId => {
            const child = clients.find(c => c.id === childId);
            if (!child) return null;
            const childNum = calculateFullNumerology(child.birthDay, child.birthMonth, child.birthYear);
            const pcResult = calculateParentChild(numerology, childNum);
            return (
              <div key={childId} className="space-y-3">
                <GlassCard glow>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium text-white">{child.name}</p>
                      <p className="text-xs text-slate-400">ŽČ {childNum.lifePathNumber} | {pcResult.parentRole}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-2xl font-serif font-bold text-green-300">{pcResult.compatibility}%</p>
                        <p className="text-xs text-slate-400">kompatibilita</p>
                      </div>
                      <button onClick={() => updateClient(client.id, { childrenIds: (client.childrenIds || []).filter(i => i !== childId) })}
                        className="text-red-400 hover:text-red-300 text-lg">✕</button>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard>
                  <p className="text-xs text-cyan-400 uppercase mb-2">Komunikácia</p>
                  <p className="text-sm text-slate-300">{pcResult.communicationStyle}</p>
                </GlassCard>
                <GlassCard>
                  <p className="text-xs text-purple-400 uppercase mb-2">Emocionálne potreby dieťaťa</p>
                  {pcResult.emotionalNeeds.map((n, i) => <p key={i} className="text-xs text-slate-300 mb-1">• {n}</p>)}
                </GlassCard>
                <GlassCard>
                  <p className="text-xs text-amber-400 uppercase mb-2">Hranice a potreby</p>
                  {pcResult.childNeeds.map((n, i) => <p key={i} className="text-xs text-slate-300 mb-1">★ {n}</p>)}
                  {pcResult.boundaries.map((b, i) => <p key={i} className="text-xs text-slate-300 mb-1">⊡ {b}</p>)}
                </GlassCard>
                <GlassCard>
                  <p className="text-xs text-indigo-400 uppercase mb-2">Odporúčania</p>
                  {pcResult.recommendations.map((r, i) => <p key={i} className="text-xs text-slate-300 mb-1">→ {r}</p>)}
                </GlassCard>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* KOMPLETNY PROFIL EXPORT */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <h2 className="font-serif text-xl font-bold text-slate-300 mb-3">Kompletný profil</h2>
        <GlassCard>
          <p className="text-sm text-slate-400 mb-4">Exportujte kompletný profil klienta so všetkými výsledkami.</p>
          <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => {
              import('jspdf').then(({ jsPDF }) => {
                const doc = new jsPDF();
                const lpKey = String(numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber);
                const lpTitle = lifePaths[lpKey]?.title || '';
                const lpDesc = lifePaths[lpKey]?.description || '';
                let y = 20;

                const addTitle = (text: string) => { doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.text(text, 105, y, { align: 'center' }); y += 10; };
                const addSection = (text: string) => { if (y > 260) { doc.addPage(); y = 20; } doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.text(text, 14, y); y += 8; };
                const addLine = (text: string) => { if (y > 270) { doc.addPage(); y = 20; } doc.setFontSize(10); doc.setFont('helvetica', 'normal'); const lines = doc.splitTextToSize(text, 180); doc.text(lines, 14, y); y += lines.length * 5 + 2; };
                const addSpace = () => { y += 5; };

                addTitle('INTEGRALNY PROFIL');
                doc.setFontSize(11); doc.setFont('helvetica', 'normal');
                doc.text(`${client.name} | ${client.birthDay}.${client.birthMonth}.${client.birthYear}`, 105, y, { align: 'center' }); y += 15;

                addSection('NUMEROLOGIA');
                addLine(`Zivotne cislo: ${numerology.lifePathNumber} z ${numerology.lifePathFrom} - ${lpTitle}`);
                addLine(lpDesc);
                addLine(`ORV: ${numerology.orv} | OMV: ${numerology.omv} | ODV: ${numerology.odv}`);
                addLine(`VDD: ${numerology.vdd} rokov | Plne roviny: ${numerology.fullPlanes.join(', ') || 'ziadne'}`);
                addLine(`Prazdne roviny: ${numerology.emptyPlanes.join(', ') || 'ziadne'}`);
                if (numerology.isolatedNumbers.length > 0) addLine(`Izolovane cisla: ${numerology.isolatedNumbers.join(', ')}`);
                addSpace();

                addSection('KARMICKE CYKLY');
                numerology.karmicTriangles.forEach(t => {
                  addLine(`${t.label}: ${t.fromAge}-${t.toAge || '∞'} r. | Vibracia ${t.vibration} - ${cycleVibrationDescriptions[t.vibration] || ''}`);
                });
                addSpace();

                addSection('ASTROLOGIA');
                addLine(`Slnko: ${astrology.sunSign.name} (${astrology.sunSign.element}) - ${planetInSignDescriptions['Slnko']?.[astrology.sunSign.name] || ''}`);
                addLine(`Mesiac: ${astrology.moonSign.name} (${astrology.moonSign.element}) - ${planetInSignDescriptions['Mesiac']?.[astrology.moonSign.name] || ''}`);
                addLine(`Ascendent: ${astrology.ascendant.name} (${astrology.ascendant.element})`);
                addLine(`Dominantny zivel: ${astrology.dominantElement} | Kvalita: ${astrology.dominantQuality}`);
                addSpace();

                addSection('HUMAN DESIGN');
                addLine(`Typ: ${humanDesign.type} | Autorita: ${humanDesign.authority}`);
                addLine(`Strategia: ${humanDesign.strategy}`);
                addLine(`Profil: ${humanDesign.profile.line1}/${humanDesign.profile.line2} - ${humanDesign.profile.name}: ${humanDesign.profile.description}`);
                addLine(`Inkarnacny kriz: ${humanDesign.incarnationCross}`);
                addLine(`Definovane centra: ${humanDesign.definedCenters.join(', ')}`);
                addLine(`Otvorene centra: ${humanDesign.openCenters.join(', ')}`);
                addSpace();

                addSection('JAZYKY LASKY');
                numerology.loveLanguages.forEach((l, i) => addLine(`${i + 1}. ${l.language}: ${l.score} bodov`));
                addSpace();

                addSection('THETA HEALING - Limitujuce presvedcenia');
                theta.primaryBeliefs.forEach(b => addLine(`"${b.belief}" (${b.level}, ${b.emotion})`));
                addSpace();

                addSection('KABALA');
                addLine(`Primarna sefira: ${kabalah.primarySefira.name} (${kabalah.primarySefira.meaning})`);
                addLine(`Cin v Malchut: ${kabalah.malchutAction}`);

                doc.setFontSize(8); doc.setFont('helvetica', 'italic');
                doc.text(`Vygenerovane: ${new Date().toLocaleDateString('sk-SK')} | Integralna mapa bytia`, 105, 285, { align: 'center' });

                doc.save(`profil-${client.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
              });
            }}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            Exportovať PDF
          </button>
          <button
            onClick={() => {
              const gridNumbers: string[] = [];
              for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                  const cell = numerology.grid[row][col];
                  if (cell.value > 0) {
                    const count = numerology.gridNumbers.filter(g => g.value === cell.value).length;
                    gridNumbers.push(`${cell.value} (${count}x)`);
                  }
                }
              }

              const lpKey = String(numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber);
              const lpDescription = lifePaths[lpKey]?.description || '';
              const lpTitle = lifePaths[lpKey]?.title || '';

              const orvInfo = orvDescriptions[numerology.orv];

              const sunDesc = planetInSignDescriptions['Slnko']?.[astrology.sunSign.name] || '';
              const moonDesc = planetInSignDescriptions['Mesiac']?.[astrology.moonSign.name] || '';
              const ascDesc = `Vystupujuci znak na horizonte pri narodeni - urcuje vonkajsi prejav a prvy dojem`;

              const primaryLoveLang = numerology.loveLanguages[0];

              const primaryBelief = theta.primaryBeliefs[0];

              const text = [
                '═══════════════════════════════════════════',
                '         KOMPLETNY PROFIL',
                '═══════════════════════════════════════════',
                '',
                `Meno: ${client.name}`,
                `Datum narodenia: ${client.birthDay}.${client.birthMonth}.${client.birthYear}${client.birthHour !== undefined ? ` ${client.birthHour}:${String(client.birthMinute || 0).padStart(2, '0')}` : ''}`,
                '',
                '───────────────────────────────────────────',
                '  NUMEROLOGIA',
                '───────────────────────────────────────────',
                '',
                `Zivotne cislo: ${numerology.lifePathNumber} (z ${numerology.lifePathFrom})`,
                `Nazov: ${lpTitle}`,
                `Popis: ${lpDescription}`,
                '',
                `Mriezka 3x3 - pritomne cisla: ${gridNumbers.join(', ')}`,
                '',
                `Plne roviny: ${numerology.fullPlanes.length > 0 ? numerology.fullPlanes.join(', ') : 'ziadne'}`,
                `Prazdne roviny: ${numerology.emptyPlanes.length > 0 ? numerology.emptyPlanes.join(', ') : 'ziadne'}`,
                `Izolovane cisla: ${numerology.isolatedNumbers.length > 0 ? numerology.isolatedNumbers.join(', ') : 'ziadne'}`,
                '',
                `ORV (Osobna rocna vibracia): ${numerology.orv}${orvInfo ? ` - ${orvInfo.title}: ${orvInfo.theme}` : ''}`,
                `OMV (Osobna mesacna vibracia): ${numerology.omv}`,
                `ODV (Osobna denna vibracia): ${numerology.odv}`,
                '',
                `VDD (Vek duchovnej dospelosti): ${numerology.vdd} rokov`,
                '',
                'Karmicke cykly:',
                ...numerology.karmicTriangles.map(t =>
                  `  ${t.label}: ${t.fromAge}-${t.toAge || '∞'} r. | Vibracia ${t.vibration} | ${t.description}${cycleVibrationDescriptions[t.vibration] ? ' | ' + cycleVibrationDescriptions[t.vibration] : ''}`
                ),
                '',
                '───────────────────────────────────────────',
                '  ASTROLOGIA',
                '───────────────────────────────────────────',
                '',
                `Slnko: ${astrology.sunSign.name} (${astrology.sunSign.element})`,
                `  ${sunDesc}`,
                '',
                `Mesiac: ${astrology.moonSign.name} (${astrology.moonSign.element})`,
                `  ${moonDesc}`,
                '',
                `Ascendent: ${astrology.ascendant.name} (${astrology.ascendant.element})`,
                `  ${ascDesc}`,
                '',
                `Dominantny zivel: ${astrology.dominantElement}`,
                `Dominantna kvalita: ${astrology.dominantQuality}`,
                `Dominantna planeta: ${astrology.dominantPlanet}`,
                `Mesacna faza: ${astrology.moonPhase}`,
                '',
                '───────────────────────────────────────────',
                '  HUMAN DESIGN',
                '───────────────────────────────────────────',
                '',
                `Typ: ${humanDesign.type}`,
                `Autorita: ${humanDesign.authority}`,
                `Strategia: ${humanDesign.strategy}`,
                `Profil: ${humanDesign.profile.line1}/${humanDesign.profile.line2} - ${humanDesign.profile.name}`,
                `Inkarnacny kriz: ${humanDesign.incarnationCross}`,
                `Definovane centra: ${humanDesign.definedCenters.join(', ')}`,
                `Otvorene centra: ${humanDesign.openCenters.join(', ')}`,
                '',
                '───────────────────────────────────────────',
                '  JAZYKY LASKY',
                '───────────────────────────────────────────',
                '',
                `Primarny jazyk lasky: ${primaryLoveLang?.language || '-'} (skore: ${primaryLoveLang?.score || 0})`,
                ...numerology.loveLanguages.map((l, i) => `  ${i + 1}. ${l.language}: ${l.score} bodov`),
                '',
                '───────────────────────────────────────────',
                '  THETA HEALING',
                '───────────────────────────────────────────',
                '',
                `Primarne limitujuce presvedcenie: "${primaryBelief?.belief || '-'}"`,
                `  Uroven: ${primaryBelief?.level || '-'}`,
                `  Emocionalny naboj: ${primaryBelief?.emotion || '-'}`,
                '',
                'Dalsie presvedcenia:',
                ...theta.primaryBeliefs.slice(1).map(b => `  - "${b.belief}" (${b.level}, ${b.emotion})`),
                '',
                '═══════════════════════════════════════════',
                `Vygenerovane: ${new Date().toLocaleDateString('sk-SK')} ${new Date().toLocaleTimeString('sk-SK')}`,
                '═══════════════════════════════════════════',
              ].join('\n');

              const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `profil-${client.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            Exportovať TXT
          </button>
          </div>
        </GlassCard>

        {/* Stary sumar odstranny - presunute na zaciatok */}
        <GlassCard className="hidden">
          <h3 className="font-serif text-lg font-bold text-slate-800 mb-3">Integrálny súhrn osobnosti</h3>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-800">{client.name}</strong> je osobnosť s životným číslom <strong>{numerology.lifePathNumber}</strong> ({lpInfo?.title || ''}).
              {lpInfo?.description ? ` ${lpInfo.description.split('.').slice(0, 2).join('.')}.` : ''}
            </p>

            <p>
              Z pohľadu astrológie je Slnko v <strong>{astrology.sunSign.name}</strong> ({astrology.sunSign.element}),
              čo prináša {planetInSignDescriptions['Slnko']?.[astrology.sunSign.name]?.split('.')[0] || 'unikátnu energiu'}.
              Mesiac v <strong>{astrology.moonSign.name}</strong> ukazuje, že emocionálne {planetInSignDescriptions['Mesiac']?.[astrology.moonSign.name]?.split('.')[0]?.toLowerCase() || 'má hlboký vnútorný svet'}.
              Ascendent v <strong>{astrology.ascendant.name}</strong> určuje prvý dojem, ktorý na ostatných robí.
            </p>

            <p>
              V systéme Human Design je <strong>{humanDesign.type}</strong> s <strong>{humanDesign.authority}</strong> autoritou.
              Stratégia "{humanDesign.strategy}" naznačuje, ako by mal správne vstupovať do rozhodnutí.
              Profil {humanDesign.profile.line1}/{humanDesign.profile.line2} ({humanDesign.profile.name}) – {humanDesign.profile.description}
            </p>

            <p>
              {numerology.fullPlanes.length > 0 && `Silné stránky (plné roviny): ${numerology.fullPlanes.join(', ')}. `}
              {numerology.emptyPlanes.length > 0 && `Oblasti rastu (prázdne roviny): ${numerology.emptyPlanes.join(', ')}. `}
              {numerology.isolatedNumbers.length > 0 && `Izolované energie (${numerology.isolatedNumbers.join(', ')}) naznačujú oblasti vyžadujúce vedomú integráciu. `}
            </p>

            <p>
              Primárny jazyk lásky je <strong>{numerology.loveLanguages[0]?.language || '-'}</strong> –
              {numerology.loveLanguages[0]?.language === 'Fyzický dotyk' ? ' potrebuje fyzickú blízkosť a dotyky na vyjadrenie a prijímanie lásky.' :
               numerology.loveLanguages[0]?.language === 'Slová uistenia' ? ' potrebuje počuť slová uznania, ocenenia a lásky.' :
               numerology.loveLanguages[0]?.language === 'Kvalitný čas' ? ' potrebuje plnú pozornosť a spoločne strávený čas.' :
               numerology.loveLanguages[0]?.language === 'Obdarovávanie' ? ' oceňuje premyslené dary a zdieľanie materiálnych hodnôt.' :
               ' oceňuje praktické skutky služby a pomoci.'}
            </p>

            <p>
              Aktuálne sa nachádza v osobnom roku <strong>{numerology.orv}</strong> ({orvDescriptions[numerology.orv]?.title || ''}) –
              {orvDescriptions[numerology.orv]?.theme || ''}. VDD nastáva v {numerology.vdd} rokoch.
            </p>

            <p>
              Hlavná kabalastická energia: <strong>{kabalah.primarySefira.name}</strong> ({kabalah.primarySefira.meaning}) –
              dar: {kabalah.primarySefira.gift?.split('.')[0]}. Tieň: {kabalah.primarySefira.shadow?.split('.')[0]}.
            </p>

            <p>
              Na hlbšej úrovni (Theta Healing) môže niesť presvedčenie: <em>"{theta.primaryBeliefs[0]?.belief}"</em>
              ({theta.primaryBeliefs[0]?.level}). Transformácia cez uvedomenie a nahradenie novým presvedčením.
            </p>
          </div>
        </GlassCard>
      </motion.section>
    </div>
  );
}
