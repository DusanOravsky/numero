import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from './GlassCard';
import { EnergyCard } from './EnergyCard';
import { NumerologyGrid } from './NumerologyGrid';
import { ChakraWheel } from './ChakraWheel';
import { LoveLanguagesCard } from './LoveLanguagesCard';
import type { NumerologyResult } from '../engine/numerologyEngine';
import type { AstrologyResult } from '../engine/astrologyEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import type { ChakraState } from '../engine/chakraEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import lifePathsData from '../data/lifePaths.json';

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string }>;

interface ClientNumerologyProps {
  numerology: NumerologyResult;
  astrology: AstrologyResult;
  humanDesign: HumanDesignResult;
  chakras: ChakraState[];
  kabalah: KabalahResult;
  theta: ThetaHealingResult;
}

export function ClientNumerology({ numerology, astrology, humanDesign, chakras, kabalah, theta }: ClientNumerologyProps) {
  const navigate = useNavigate();
  const lpInfo = lifePaths[String(numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber)];

  return (
    <>
      {/* NUMEROLOGIA */}
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

        {/* Jazyky lásky pre klienta */}
        <div className="mt-4">
          <LoveLanguagesCard numerology={numerology} title="Jazyky lásky klienta" />
        </div>
      </motion.section>

      {/* ASTROLOGIA */}
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

      {/* CAKRY */}
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
    </>
  );
}
