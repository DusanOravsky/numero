import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import { GlassCard } from './GlassCard';
import { EnergyCard } from './EnergyCard';
import { ChakraBody } from './ChakraBody';
import type { NumerologyResult } from '../engine/numerologyEngine';
import type { DevelopmentalNumerologyResult } from '../engine/developmentalNumerologyEngine';
import type { AstrologyResult } from '../engine/astrologyEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import type { ChakraState } from '../engine/chakraEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import lifePathsData from '../data/lifePaths';

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string }>;

interface ClientNumerologyProps {
  numerology: NumerologyResult;
  devNumerology?: DevelopmentalNumerologyResult;
  astrology: AstrologyResult;
  humanDesign: HumanDesignResult;
  chakras: ChakraState[];
  kabalah: KabalahResult;
  theta: ThetaHealingResult;
  clientId?: string;
  gender?: 'male' | 'female';
}

export function ClientNumerology({ numerology, devNumerology, astrology, humanDesign, chakras, kabalah, theta, clientId, gender }: ClientNumerologyProps) {
  const navigate = useNavigate();
  const { language } = useTranslation();
  const q = clientId ? `?client=${clientId}` : '';
  const lpInfo = lifePaths[String(numerology.lifePathNumber)] || lifePaths[String(reduceToSingle(numerology.lifePathNumber))];

  return (
    <>
      {/* NUMEROLOGIA */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-indigo-600">{language === 'sk' ? 'Numerológia' : 'Numerology'}</h2>
          <button onClick={() => navigate('/numerology' + q)} className="text-xs text-slate-400 hover:text-indigo-600">{language === 'sk' ? 'Otvoriť detail →' : 'Open detail →'}</button>
        </div>
        <GlassCard>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                <span className="text-2xl font-serif font-bold text-white">{numerology.lifePathNumber}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{language === 'sk' ? 'Životné číslo' : 'Life path number'} {numerology.lifePathNumber} <span className="text-slate-400 font-normal">{language === 'sk' ? 'z' : 'from'} {numerology.lifePathFrom}</span></p>
                {lpInfo && <p className="text-xs text-slate-500">{lpInfo.title}</p>}
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <div className="text-center px-3 py-1.5 rounded-lg bg-indigo-500/10" title={language === 'sk' ? 'Osobná ročná vibrácia' : 'Personal year vibration'}>
                <p className="text-[9px] text-slate-500">ORV</p>
                <p className="text-sm font-bold text-indigo-700">{numerology.orv}</p>
              </div>
              <div className="text-center px-3 py-1.5 rounded-lg bg-purple-500/10" title={language === 'sk' ? 'Osobná mesačná vibrácia' : 'Personal month vibration'}>
                <p className="text-[9px] text-slate-500">OMV</p>
                <p className="text-sm font-bold text-purple-700">{numerology.omv}</p>
              </div>
              <div className="text-center px-3 py-1.5 rounded-lg bg-amber-500/10">
                <p className="text-[9px] text-slate-500">ODV</p>
                <p className="text-sm font-bold text-amber-700">{numerology.odv}</p>
              </div>
            </div>
          </div>

          {/* Polarita ega (vývojová metóda) */}
          {devNumerology && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">{devNumerology.egoPolarity === 'masculine' ? '♂' : devNumerology.egoPolarity === 'feminine' ? '♀' : '○'}</span>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {devNumerology.egoPolarity === 'masculine' ? (language === 'sk' ? 'Mužské ego' : 'Masculine ego') : devNumerology.egoPolarity === 'feminine' ? (language === 'sk' ? 'Ženské ego' : 'Feminine ego') : (language === 'sk' ? 'Bez polarity' : 'No polarity')}{' '}
                    <span className="text-slate-400 font-normal">({devNumerology.oneCount}× {language === 'sk' ? 'číslo' : 'number'} 1)</span>
                  </p>
                  {gender && (
                    <p className="text-xs text-slate-500">
                      {(gender === 'male' && devNumerology.egoPolarity === 'masculine') || (gender === 'female' && devNumerology.egoPolarity === 'feminine')
                        ? (language === 'sk' ? '✓ Súlad s biologickým pohlavím' : '✓ Aligned with biological sex')
                        : devNumerology.egoPolarity === 'none' ? (language === 'sk' ? 'Žiadna polarita' : 'No polarity') : (language === 'sk' ? '⟳ Opačná polarita — úloha integrácie' : '⟳ Opposite polarity — integration task')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </motion.section>

      {/* ASTROLOGIA */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-cyan-600">{language === 'sk' ? 'Astrológia' : 'Astrology'}</h2>
          <button onClick={() => navigate('/astrology' + q)} className="text-xs text-slate-400 hover:text-indigo-600">{language === 'sk' ? 'Otvoriť detail →' : 'Open detail →'}</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <EnergyCard title={language === 'sk' ? 'Slnko' : 'Sun'} value={`${astrology.sunSign.symbol} ${astrology.sunSign.name}`} subtitle={astrology.sunSign.element} color="gold" />
          <EnergyCard title={language === 'sk' ? 'Mesiac' : 'Moon'} value={`${astrology.moonSign.symbol} ${astrology.moonSign.name}`} subtitle={astrology.moonSign.element} color="purple" />
          <EnergyCard title={language === 'sk' ? 'Ascendent' : 'Ascendant'} value={`${astrology.ascendant.symbol} ${astrology.ascendant.name}`} subtitle={astrology.ascendant.element} color="cyan" />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <GlassCard className="text-center">
            <p className="text-xs text-slate-400">{language === 'sk' ? 'Živel' : 'Element'}</p>
            <p className="text-sm font-medium text-slate-800">{astrology.dominantElement}</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-xs text-slate-400">{language === 'sk' ? 'Kvalita' : 'Quality'}</p>
            <p className="text-sm font-medium text-slate-800">{astrology.dominantQuality}</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-xs text-slate-400">{language === 'sk' ? 'Mesačná fáza' : 'Moon phase'}</p>
            <p className="text-sm font-medium text-slate-800">{astrology.moonPhase}</p>
          </GlassCard>
        </div>
      </motion.section>

      {/* HUMAN DESIGN */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-purple-600">{language === 'sk' ? 'Human Design' : 'Human Design'}</h2>
          <button onClick={() => navigate('/human-design' + q)} className="text-xs text-slate-400 hover:text-indigo-600">{language === 'sk' ? 'Otvoriť detail →' : 'Open detail →'}</button>
        </div>
        <GlassCard>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400">{language === 'sk' ? 'Typ' : 'Type'}</p>
              <p className="text-sm font-bold text-slate-800">{humanDesign.type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{language === 'sk' ? 'Autorita' : 'Authority'}</p>
              <p className="text-sm font-medium text-slate-800">{humanDesign.authority}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{language === 'sk' ? 'Profil' : 'Profile'}</p>
              <p className="text-sm font-medium text-slate-800">{humanDesign.profile.line1}/{humanDesign.profile.line2} {humanDesign.profile.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{language === 'sk' ? 'Stratégia' : 'Strategy'}</p>
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
          <h2 className="font-serif text-xl font-bold text-green-600">{language === 'sk' ? 'Čakry' : 'Chakras'}</h2>
          <button onClick={() => navigate('/chakras' + q)} className="text-xs text-slate-400 hover:text-indigo-600">{language === 'sk' ? 'Otvoriť detail →' : 'Open detail →'}</button>
        </div>
        <GlassCard>
          <ChakraBody chakras={chakras} />
        </GlassCard>
      </motion.section>

      {/* KABALA */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-amber-600">{language === 'sk' ? 'Kabala' : 'Kabbalah'}</h2>
          <button onClick={() => navigate('/kabalah' + q)} className="text-xs text-slate-400 hover:text-indigo-600">{language === 'sk' ? 'Otvoriť detail →' : 'Open detail →'}</button>
        </div>
        <GlassCard>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400">{language === 'sk' ? 'Primárna sefira' : 'Primary sefira'}</p>
              <p className="text-lg font-serif font-bold text-slate-800">{kabalah.primarySefira.name}</p>
              <p className="text-sm text-amber-300">{kabalah.primarySefira.meaning}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{language === 'sk' ? 'Sekundárna sefira' : 'Secondary sefira'}</p>
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
          <h2 className="font-serif text-xl font-bold text-teal-600">{language === 'sk' ? 'Theta Healing' : 'Theta Healing'}</h2>
          <button onClick={() => navigate('/theta-healing' + q)} className="text-xs text-slate-400 hover:text-indigo-600">{language === 'sk' ? 'Otvoriť detail →' : 'Open detail →'}</button>
        </div>
        <GlassCard>
          <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Hlavné limitujúce presvedčenia:' : 'Main limiting beliefs:'}</p>
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
