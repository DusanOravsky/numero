import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from './GlassCard';
import { EnergyCard } from './EnergyCard';
import { NumerologyGrid } from './NumerologyGrid';
import { ChakraBody } from './ChakraBody';
import { LoveLanguagesCard } from './LoveLanguagesCard';
import { DevelopmentalNumerologyView } from './DevelopmentalNumerologyView';
import type { NumerologyResult } from '../engine/numerologyEngine';
import type { DevelopmentalNumerologyResult } from '../engine/developmentalNumerologyEngine';
import type { AstrologyResult } from '../engine/astrologyEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import type { ChakraState } from '../engine/chakraEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import { useStore } from '../store/useStore';
import lifePathsData from '../data/lifePaths.json';
import isolatedData from '../data/isolatedNumbers.json';

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string }>;
const isolatedInfo = isolatedData as Record<string, { type: string; effect: string; description: string; theme: string; shadow: string; recommendation: string; body: string }>;

interface ClientNumerologyProps {
  numerology: NumerologyResult;
  devNumerology?: DevelopmentalNumerologyResult;
  astrology: AstrologyResult;
  humanDesign: HumanDesignResult;
  chakras: ChakraState[];
  kabalah: KabalahResult;
  theta: ThetaHealingResult;
  /** ID klienta — ak je definované, "Otvoriť detail" linky pridajú ?client=ID */
  clientId?: string;
  gender?: 'male' | 'female';
}

export function ClientNumerology({ numerology, devNumerology, astrology, humanDesign, chakras, kabalah, theta, clientId, gender }: ClientNumerologyProps) {
  const navigate = useNavigate();
  const numerologyMethod = useStore(s => s.numerologyMethod);
  const q = clientId ? `?client=${clientId}` : '';
  const lpInfo = lifePaths[String(numerology.lifePathNumber)] || lifePaths[String(reduceToSingle(numerology.lifePathNumber))];

  return (
    <>
      {/* NUMEROLOGIA */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-indigo-600">Numerológia</h2>
          <button onClick={() => navigate('/numerology' + q)} className="text-xs text-slate-400 hover:text-indigo-600">Otvoriť detail →</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard>
            <div className="text-center">
              <p className="text-xs text-slate-400">Životné číslo</p>
              <p className="text-4xl font-serif font-bold text-slate-800 mt-1">{numerology.lifePathNumber}</p>
              <p className="text-sm text-indigo-600">z {numerology.lifePathFrom}</p>
              {lpInfo && <p className="text-sm text-slate-500 mt-2">{lpInfo.title}</p>}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center p-2 rounded-lg bg-indigo-500/10" title="Osobná ročná vibrácia – energia celého roka od narodenín do narodenín">
                <p className="text-[10px] text-slate-500">ORV (rok)</p>
                <p className="text-lg font-bold text-indigo-700">{numerology.orv}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-purple-500/10" title="Osobná mesačná vibrácia – energia tohto mesiaca">
                <p className="text-[10px] text-slate-500">OMV (mesiac)</p>
                <p className="text-lg font-bold text-purple-700">{numerology.omv}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-amber-500/10">
                <p className="text-[10px] text-slate-500">ODV (deň)</p>
                <p className="text-lg font-bold text-amber-700">{numerology.odv}</p>
              </div>
            </div>
            {/* Roviny (len charakterová) */}
            {numerologyMethod === 'characterological' && (numerology.fullPlanes.length > 0 || numerology.emptyPlanes.length > 0) && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                {numerology.fullPlanes.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-green-600 font-medium mb-1">Plné roviny</p>
                    {numerology.fullPlanes.map(p => <p key={p} className="text-xs text-slate-600">{p}</p>)}
                  </div>
                )}
                {numerology.emptyPlanes.length > 0 && (
                  <div>
                    <p className="text-xs text-amber-600 font-medium mb-1">Prázdne roviny</p>
                    {numerology.emptyPlanes.map(p => <p key={p} className="text-xs text-slate-600">{p}</p>)}
                  </div>
                )}
              </div>
            )}
          </GlassCard>
          <GlassCard>
            {numerologyMethod === 'developmental' && devNumerology ? (
              <DevelopmentalNumerologyView result={devNumerology} gender={gender} />
            ) : (
              <NumerologyGrid grid={numerology.grid} />
            )}
          </GlassCard>
        </div>

        {/* Izolované čísla — full width pod mriežkou */}
        {(() => {
          const isolated = numerologyMethod === 'developmental' && devNumerology
            ? devNumerology.isolatedNumbers
            : numerology.isolatedNumbers;
          return isolated.length > 0 ? (
            <GlassCard className="mt-4">
              <h3 className="text-sm font-semibold text-rose-700 mb-1">Izolované čísla</h3>
              <p className="text-xs text-slate-500 mb-3">Obklopené prázdnymi políčkami v mriežke — blokovaná energia, frustrácia alebo napätie.</p>
              <div className="space-y-3">
                {isolated.map(n => {
                  const info = isolatedInfo[String(n)];
                  return (
                    <div key={n} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-700 text-sm font-bold flex items-center justify-center">{n}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{info?.theme || `Izolované číslo ${n}`}</p>
                          <p className="text-[10px] text-rose-600">{info?.type === 'nepárne' ? 'Nepárne – napätie, agresivita' : 'Párne – pasivita, utiahnutosť'}</p>
                        </div>
                      </div>
                      {info && (
                        <>
                          <p className="text-xs text-slate-600 mb-2">{info.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 rounded-lg bg-red-500/10">
                              <p className="text-red-600 font-medium">Tieň</p>
                              <p className="text-slate-600">{info.shadow}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-amber-500/10">
                              <p className="text-amber-600 font-medium">Telo</p>
                              <p className="text-slate-600">{info.body}</p>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-indigo-500/10 mt-2 text-[11px]">
                            <p className="text-indigo-600 font-medium">Odporúčanie</p>
                            <p className="text-slate-600">{info.recommendation}</p>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          ) : null;
        })()}

        {/* Jazyky lásky pre klienta */}
        <div className="mt-4">
          <LoveLanguagesCard numerology={numerology} title="Jazyky lásky klienta" />
        </div>
      </motion.section>

      {/* ASTROLOGIA */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-cyan-600">Astrológia</h2>
          <button onClick={() => navigate('/astrology' + q)} className="text-xs text-slate-400 hover:text-indigo-600">Otvoriť detail →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <EnergyCard title="Slnko" value={`${astrology.sunSign.symbol} ${astrology.sunSign.name}`} subtitle={astrology.sunSign.element} color="gold" />
          <EnergyCard title="Mesiac" value={`${astrology.moonSign.symbol} ${astrology.moonSign.name}`} subtitle={astrology.moonSign.element} color="purple" />
          <EnergyCard title="Ascendent" value={`${astrology.ascendant.symbol} ${astrology.ascendant.name}`} subtitle={astrology.ascendant.element} color="cyan" />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <GlassCard className="text-center">
            <p className="text-xs text-slate-400">Živel</p>
            <p className="text-sm font-medium text-slate-800">{astrology.dominantElement}</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-xs text-slate-400">Kvalita</p>
            <p className="text-sm font-medium text-slate-800">{astrology.dominantQuality}</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-xs text-slate-400">Mesačná fáza</p>
            <p className="text-sm font-medium text-slate-800">{astrology.moonPhase}</p>
          </GlassCard>
        </div>
      </motion.section>

      {/* HUMAN DESIGN */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-purple-600">Human Design</h2>
          <button onClick={() => navigate('/human-design' + q)} className="text-xs text-slate-400 hover:text-indigo-600">Otvoriť detail →</button>
        </div>
        <GlassCard>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400">Typ</p>
              <p className="text-sm font-bold text-slate-800">{humanDesign.type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Autorita</p>
              <p className="text-sm font-medium text-slate-800">{humanDesign.authority}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Profil</p>
              <p className="text-sm font-medium text-slate-800">{humanDesign.profile.line1}/{humanDesign.profile.line2} {humanDesign.profile.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Stratégia</p>
              <p className="text-sm font-medium text-slate-800">{humanDesign.strategy}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1">
            {humanDesign.definedCenters.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">{c}</span>)}
            {humanDesign.openCenters.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400">{c}</span>)}
          </div>
        </GlassCard>
      </motion.section>

      {/* CAKRY */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-green-600">Čakry</h2>
          <button onClick={() => navigate('/chakras' + q)} className="text-xs text-slate-400 hover:text-indigo-600">Otvoriť detail →</button>
        </div>
        <GlassCard>
          <ChakraBody chakras={chakras} />
        </GlassCard>
      </motion.section>

      {/* KABALA */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-amber-600">Kabala</h2>
          <button onClick={() => navigate('/kabalah' + q)} className="text-xs text-slate-400 hover:text-indigo-600">Otvoriť detail →</button>
        </div>
        <GlassCard>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400">Primárna sefira</p>
              <p className="text-lg font-serif font-bold text-slate-800">{kabalah.primarySefira.name}</p>
              <p className="text-sm text-amber-300">{kabalah.primarySefira.meaning}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Sekundárna sefira</p>
              <p className="text-lg font-serif font-bold text-slate-800">{kabalah.secondarySefira.name}</p>
              <p className="text-sm text-purple-300">{kabalah.secondarySefira.meaning}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">{kabalah.malchutAction}</p>
        </GlassCard>
      </motion.section>

      {/* THETA HEALING */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-teal-600">Theta Healing</h2>
          <button onClick={() => navigate('/theta-healing' + q)} className="text-xs text-slate-400 hover:text-indigo-600">Otvoriť detail →</button>
        </div>
        <GlassCard>
          <p className="text-xs text-slate-400 mb-3">Hlavné limitujúce presvedčenia:</p>
          <div className="space-y-2">
            {theta.primaryBeliefs.map((b, i) => (
              <div key={i} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-slate-700">"{b.belief}"</p>
                <p className="text-xs text-slate-400 mt-1">{b.level} | {b.emotion}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.section>
    </>
  );
}
