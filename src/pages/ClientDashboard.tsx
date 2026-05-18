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
import { reduceToSingle } from '../engine/numerologyEngine';
import lifePathsData from '../data/lifePaths.json';

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
              <div className="text-center p-2 rounded-lg bg-indigo-500/10">
                <p className="text-xs text-slate-400">ORV</p>
                <p className="text-lg font-bold text-white">{numerology.orv}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-purple-500/10">
                <p className="text-xs text-slate-400">OMV</p>
                <p className="text-lg font-bold text-white">{numerology.omv}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-amber-500/10">
                <p className="text-xs text-slate-400">ODV</p>
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
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold text-rose-300">Vzťahy</h2>
          <button onClick={() => navigate('/relationships')} className="text-xs text-slate-400 hover:text-white">Plný výklad →</button>
        </div>

        {/* Partner */}
        <GlassCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white">Partner</h4>
            {!client.partnerId && (
              <button onClick={() => setShowPartnerSelect(true)} className="text-xs px-3 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-500">
                + Priradiť partnera
              </button>
            )}
          </div>
          {client.partnerId && (() => {
            const partner = clients.find(c => c.id === client.partnerId);
            if (!partner) return <p className="text-xs text-slate-500">Partner nebol nájdený</p>;
            const partnerNum = calculateFullNumerology(partner.birthDay, partner.birthMonth, partner.birthYear);
            const compat = calculatePartnerCompatibility(numerology, partnerNum, client.name, partner.name);
            return (
              <div>
                <div className="flex items-center justify-between p-3 rounded-xl glass-light">
                  <div>
                    <p className="text-sm font-medium text-white">{partner.name}</p>
                    <p className="text-xs text-slate-400">{partner.birthDay}.{partner.birthMonth}.{partner.birthYear}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-rose-300">{compat.overallScore}%</p>
                    <p className="text-xs text-slate-400">kompatibilita</p>
                  </div>
                </div>
                <button onClick={() => updateClient(client.id, { partnerId: undefined })} className="text-xs text-red-400 mt-2 hover:text-red-300">
                  Odstrániť partnera
                </button>
              </div>
            );
          })()}
          {showPartnerSelect && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-slate-400">Vyberte klienta ako partnera:</p>
              {clients.filter(c => c.id !== client.id && c.id !== client.partnerId).map(c => (
                <button key={c.id} onClick={() => { updateClient(client.id, { partnerId: c.id }); setShowPartnerSelect(false); }}
                  className="w-full text-left p-2 rounded-lg glass-light text-sm text-white hover:bg-indigo-500/20">
                  {c.name} ({c.birthDay}.{c.birthMonth}.{c.birthYear})
                </button>
              ))}
              <button onClick={() => setShowPartnerSelect(false)} className="text-xs text-slate-400">Zrušiť</button>
            </div>
          )}
        </GlassCard>

        {/* Deti */}
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white">Deti</h4>
            <button onClick={() => setShowChildSelect(true)} className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-500">
              + Pridať dieťa
            </button>
          </div>
          {(client.childrenIds || []).length > 0 && (
            <div className="space-y-2">
              {(client.childrenIds || []).map(childId => {
                const child = clients.find(c => c.id === childId);
                if (!child) return null;
                const childNum = calculateFullNumerology(child.birthDay, child.birthMonth, child.birthYear);
                const pcResult = calculateParentChild(numerology, childNum);
                return (
                  <div key={childId} className="flex items-center justify-between p-3 rounded-xl glass-light">
                    <div>
                      <p className="text-sm font-medium text-white">{child.name}</p>
                      <p className="text-xs text-slate-400">{child.birthDay}.{child.birthMonth}.{child.birthYear}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-lg font-bold text-green-300">{pcResult.compatibility}%</p>
                        <p className="text-xs text-slate-400">kompatibilita</p>
                      </div>
                      <button onClick={() => updateClient(client.id, { childrenIds: (client.childrenIds || []).filter(i => i !== childId) })}
                        className="text-red-400 hover:text-red-300 text-xs">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {showChildSelect && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-slate-400">Vyberte klienta ako dieťa:</p>
              {clients.filter(c => c.id !== client.id && !(client.childrenIds || []).includes(c.id)).map(c => (
                <button key={c.id} onClick={() => { updateClient(client.id, { childrenIds: [...(client.childrenIds || []), c.id] }); setShowChildSelect(false); }}
                  className="w-full text-left p-2 rounded-lg glass-light text-sm text-white hover:bg-indigo-500/20">
                  {c.name} ({c.birthDay}.{c.birthMonth}.{c.birthYear})
                </button>
              ))}
              <button onClick={() => setShowChildSelect(false)} className="text-xs text-slate-400">Zrušiť</button>
            </div>
          )}
        </GlassCard>
      </motion.section>
    </div>
  );
}
