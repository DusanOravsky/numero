import { useEffect, useState, useMemo } from 'react';
import { GlassCard } from '../components/GlassCard';
import { NumerologyGrid } from '../components/NumerologyGrid';
import { ChakraWheel } from '../components/ChakraWheel';
import { calculateFullNumerology, getGridCount, reduceToSingle } from '../engine/numerologyEngine';
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
import lifePathsData from '../data/lifePaths.json';
import { orvDescriptions } from '../data/orvDescriptions';
import { getGeneKeyByGate } from '../data/geneKeys';

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string }>;

interface ClientData {
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour?: number;
  birthMinute?: number;
}

interface AllResults {
  numerology: NumerologyResult;
  astrology: AstrologyResult;
  humanDesign: HumanDesignResult;
  chakras: ChakraState[];
  kabalah: KabalahResult;
  theta: ThetaHealingResult;
}

export function SharedView() {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // setState in effect je tu zámerné: parseujeme URL hash z location pri mount.
  // Toto je sync s externým stavom (URL), nie cascading render — eslint disable.
  useEffect(() => {
    try {
      const hash = window.location.hash;
      const match = hash.match(/[?&]data=([^&]+)/);
      if (!match) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError('Chyba: chybajuce data v odkaze');
        return;
      }
      // Cap base64 dĺžku na 4KB (chráni pred OOM cez maliciózny long URL)
      if (match[1].length > 4096) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError('Chyba: prilis dlhy odkaz');
        return;
      }
      // Modern UTF-8 decode (escape() je deprecated)
      const bytes = Uint8Array.from(atob(match[1]), c => c.charCodeAt(0));
      const json = new TextDecoder('utf-8').decode(bytes);
      const decoded = JSON.parse(json);
      // Strict validácia — bránime crashom z neúplných alebo zlých dát
      const name = String(decoded.name || '').slice(0, 80).trim();
      const day = parseInt(String(decoded.birthDay), 10);
      const month = parseInt(String(decoded.birthMonth), 10);
      const year = parseInt(String(decoded.birthYear), 10);
      if (!name || !day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError('Chyba: nekompletne alebo neplatne data');
        return;
      }
      const hour = decoded.birthHour !== undefined ? parseInt(String(decoded.birthHour), 10) : undefined;
      const minute = decoded.birthMinute !== undefined ? parseInt(String(decoded.birthMinute), 10) : undefined;
      const safe = {
        name,
        birthDay: day,
        birthMonth: month,
        birthYear: year,
        birthHour: hour !== undefined && hour >= 0 && hour <= 23 ? hour : undefined,
        birthMinute: minute !== undefined && minute >= 0 && minute <= 59 ? minute : undefined,
        birthPlace: decoded.birthPlace ? String(decoded.birthPlace).slice(0, 100) : undefined,
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientData(safe);
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('Chyba: neplatny odkaz');
    }
  }, []);

  const results: AllResults | null = useMemo(() => {
    if (!clientData) return null;
    const { birthDay: d, birthMonth: m, birthYear: y, birthHour: h, birthMinute: min } = clientData;
    const numerology = calculateFullNumerology(d, m, y);
    const astrology = calculateAstrology(d, m, y, h ?? 12, min ?? 0);
    const humanDesign = calculateHumanDesign(d, m, y, h ?? 12, min ?? 0);
    const gridCounts = getGridCount(numerology.grid);
    const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement);
    const lp = numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber;
    const kabalah = calculateKabalah(lp, reduceToSingle(d));
    const theta = calculateThetaHealing(lp);
    return { numerology, astrology, humanDesign, chakras, kabalah, theta };
  }, [clientData]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard>
          <p className="text-red-500 text-center">{error}</p>
        </GlassCard>
      </div>
    );
  }

  if (!clientData || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Nacitavam...</p>
      </div>
    );
  }

  const { numerology, astrology, humanDesign, chakras, kabalah, theta } = results;
  const lpInfo = lifePaths[String(numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber)];

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-slate-800">Integralna mapa bytia</h1>
        <p className="text-slate-500 text-sm mt-1">Zdielany vyklad</p>
      </div>

      <div className="text-center">
        <h2 className="font-serif text-xl font-bold text-slate-800">{clientData.name}</h2>
        <p className="text-slate-400 text-sm">
          {clientData.birthDay}.{clientData.birthMonth}.{clientData.birthYear}
          {clientData.birthHour !== undefined ? ` ${clientData.birthHour}:${String(clientData.birthMinute || 0).padStart(2, '0')}` : ''}
        </p>
      </div>

      {/* Integralny sumar */}
      <GlassCard glow>
        <h2 className="font-serif text-xl font-bold text-indigo-600 mb-4">Integralny suhrn osobnosti</h2>
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            <strong>{clientData.name}</strong> nesie zivotne cislo <strong>{numerology.lifePathNumber}</strong> z {numerology.lifePathFrom} ({lpInfo?.title || ''}).
            {lpInfo?.description || ''}
          </p>
          <p className="border-l-2 border-indigo-200 pl-3">
            <strong>Dar:</strong> {lpInfo?.gift || '-'}.<br/>
            <strong>Tien:</strong> {lpInfo?.shadow || '-'}.
          </p>
          <p>
            <strong>Astrologia:</strong> Slnko v <strong>{astrology.sunSign.name}</strong> ({astrology.sunSign.element}),
            Mesiac v <strong>{astrology.moonSign.name}</strong> ({astrology.moonSign.element}),
            Ascendent v <strong>{astrology.ascendant.name}</strong> ({astrology.ascendant.element}).
            Dominantny zivel: <strong>{astrology.dominantElement}</strong>.
          </p>
          <p>
            V <strong>Human Design</strong> je typ <strong>{humanDesign.type}</strong> s <strong>{humanDesign.authority}</strong> autoritou.
            Strategia: <strong>{humanDesign.strategy}</strong>.
            Profil <strong>{humanDesign.profile.line1}/{humanDesign.profile.line2}</strong> ({humanDesign.profile.name}).
          </p>

          {(() => {
            const sunGate = humanDesign.personalityGates.find(g => g.planet === 'Slnko')?.gate;
            const earthGate = humanDesign.personalityGates.find(g => g.planet === 'Zem')?.gate;
            const topGeneKeys = [sunGate, earthGate].filter((g): g is number => g !== undefined).map(g => getGeneKeyByGate(g)).filter(Boolean);
            if (topGeneKeys.length === 0) return null;
            return (
              <div className="border-l-2 border-purple-200 pl-3 space-y-2">
                <p><strong>Genove kluce:</strong></p>
                {topGeneKeys.map((gk) => (
                  <p key={gk!.gate} className="text-sm">
                    <strong>Brana {gk!.gate}</strong>: {gk!.shadow} (tien) &rarr; {gk!.gift} (dar) &rarr; {gk!.siddhi} (siddhi)
                  </p>
                ))}
              </div>
            );
          })()}

          <p>
            <strong>Aktualne obdobie:</strong> Osobny rok <strong>{numerology.orv}</strong> ({orvDescriptions[numerology.orv]?.title || ''}).
            VDD: <strong>{numerology.vdd}</strong> rokov.
          </p>
          <p>
            <strong>Kabala:</strong> {kabalah.primarySefira.name} ({kabalah.primarySefira.meaning}).
          </p>
          <p>
            <strong>Theta Healing:</strong> "{theta.primaryBeliefs[0]?.belief}" ({theta.primaryBeliefs[0]?.origin}).
          </p>
        </div>
      </GlassCard>

      {/* Numerologia */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-indigo-600 mb-3">Numerologia</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400">Zivotne cislo</p>
            <p className="text-3xl font-serif font-bold">{numerology.lifePathNumber}</p>
            <p className="text-sm text-indigo-500">z {numerology.lifePathFrom}</p>
            <div className="mt-3 text-xs text-slate-500">
              <p>ORV: {numerology.orv} | OMV: {numerology.omv} | ODV: {numerology.odv}</p>
              <p>VDD: {numerology.vdd} rokov</p>
            </div>
          </div>
          <NumerologyGrid grid={numerology.grid} />
        </div>
        {numerology.fullPlanes.length > 0 && <p className="text-xs text-green-600 mt-3">Plne roviny: {numerology.fullPlanes.join(', ')}</p>}
        {numerology.emptyPlanes.length > 0 && <p className="text-xs text-amber-600 mt-1">Prazdne roviny: {numerology.emptyPlanes.join(', ')}</p>}
        {numerology.isolatedNumbers.length > 0 && <p className="text-xs text-rose-600 mt-1">Izolovane cisla: {numerology.isolatedNumbers.join(', ')}</p>}
      </GlassCard>

      {/* Astrologia */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-cyan-700 mb-3">Astrologia</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-slate-400">Slnko</p>
            <p className="text-sm font-bold">{astrology.sunSign.symbol} {astrology.sunSign.name}</p>
            <p className="text-xs text-slate-500">{astrology.sunSign.element}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Mesiac</p>
            <p className="text-sm font-bold">{astrology.moonSign.symbol} {astrology.moonSign.name}</p>
            <p className="text-xs text-slate-500">{astrology.moonSign.element}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Ascendent</p>
            <p className="text-sm font-bold">{astrology.ascendant.symbol} {astrology.ascendant.name}</p>
            <p className="text-xs text-slate-500">{astrology.ascendant.element}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">Dominantny zivel: {astrology.dominantElement} | Kvalita: {astrology.dominantQuality}</p>
      </GlassCard>

      {/* Human Design */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-purple-700 mb-3">Human Design</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div><p className="text-xs text-slate-400">Typ</p><p className="font-bold">{humanDesign.type}</p></div>
          <div><p className="text-xs text-slate-400">Autorita</p><p className="font-medium">{humanDesign.authority}</p></div>
          <div><p className="text-xs text-slate-400">Profil</p><p className="font-medium">{humanDesign.profile.line1}/{humanDesign.profile.line2}</p></div>
          <div><p className="text-xs text-slate-400">Strategia</p><p className="font-medium">{humanDesign.strategy}</p></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {humanDesign.definedCenters.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-700">{c}</span>)}
          {humanDesign.openCenters.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{c}</span>)}
        </div>
      </GlassCard>

      {/* Cakry */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-green-700 mb-3">Cakry</h3>
        <ChakraWheel chakras={chakras} />
      </GlassCard>

      {/* Kabala */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-amber-700 mb-3">Kabala</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400">Primarna sefira</p>
            <p className="font-serif font-bold">{kabalah.primarySefira.name}</p>
            <p className="text-sm text-amber-600">{kabalah.primarySefira.meaning}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Sekundarna sefira</p>
            <p className="font-serif font-bold">{kabalah.secondarySefira.name}</p>
            <p className="text-sm text-purple-600">{kabalah.secondarySefira.meaning}</p>
          </div>
        </div>
      </GlassCard>

      {/* Theta Healing */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-teal-700 mb-3">Theta Healing</h3>
        <div className="space-y-2">
          {theta.primaryBeliefs.map((b, i) => (
            <div key={i} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm">"{b.belief}"</p>
              <p className="text-xs text-slate-500 mt-1">{b.level} | {b.emotion}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="text-center pt-4 pb-8">
        <p className="text-xs text-slate-400">Integralna mapa bytia | Vygenerovane: {new Date().toLocaleDateString('sk-SK')}</p>
      </div>
    </div>
  );
}
