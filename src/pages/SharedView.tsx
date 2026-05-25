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
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import type { DevelopmentalNumerologyResult } from '../engine/developmentalNumerologyEngine';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import type { EnneagramResult } from '../engine/enneagramEngine';
import { deriveDosha } from '../engine/ayurvedaEngine';
import type { DoshaProfile } from '../data/ayurveda';
import { getDoshaInfo } from '../data/ayurveda';
import { deriveTCMElement } from '../engine/tcmEngine';
import type { TCMResult } from '../engine/tcmEngine';
import { getTCMElement } from '../data/tcm';
import lifePathsData from '../data/lifePaths';
import { getOrvDescription } from '../data/orvDescriptions';
import { getGeneKeyByGate } from '../data/geneKeys';
import { getEtikoterapiaForChakra } from '../data/etikoterapia';
import { useTranslation } from '../i18n/useTranslation';
import { displayName, ZODIAC_DISPLAY, ELEMENT_DISPLAY, HD_TYPE_DISPLAY, HD_AUTHORITY_DISPLAY, HD_CENTER_DISPLAY } from '../i18n/entityNames';
import { getEnneagramType } from '../data/enneagram';
import { getPlaneName } from '../data/planes';

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
  developmental: DevelopmentalNumerologyResult;
  enneagram: EnneagramResult;
  dosha: DoshaProfile;
  tcm: TCMResult;
}

export function SharedView() {
  const { t, language } = useTranslation();
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
        setError(language === 'sk' ? 'Chyba: chybajuce data v odkaze' : 'Error: missing data in link');
        return;
      }
      // Cap base64 dĺžku na 4KB (chráni pred OOM cez maliciózny long URL)
      if (match[1].length > 4096) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(language === 'sk' ? 'Chyba: prilis dlhy odkaz' : 'Error: link too long');
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
        setError(language === 'sk' ? 'Chyba: nekompletne alebo neplatne data' : 'Error: incomplete or invalid data');
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
      setError(language === 'sk' ? 'Chyba: neplatny odkaz' : 'Error: invalid link');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const theta = calculateThetaHealing(lp, language);
    const developmental = calculateDevelopmentalNumerology(d, m, y);
    const enneagram = deriveEnneagramType(numerology, developmental, 'characterological');
    const dosha = deriveDosha(numerology, astrology, humanDesign);
    const tcm = deriveTCMElement(numerology, astrology);
    return { numerology, astrology, humanDesign, chakras, kabalah, theta, developmental, enneagram, dosha, tcm };
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
        <p className="text-slate-400">{t('common.loading')}</p>
      </div>
    );
  }

  const { numerology, astrology, humanDesign, chakras, kabalah, theta, developmental, enneagram, dosha, tcm } = results;
  const lpInfo = lifePaths[String(numerology.lifePathNumber)] || lifePaths[String(reduceToSingle(numerology.lifePathNumber))];

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-slate-800">{t('summary.integralMap')}</h1>
        <p className="text-slate-500 text-sm mt-1">{t('summary.sharedReading')}</p>
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
        <h2 className="font-serif text-xl font-bold text-indigo-600 mb-4">{t('summary.title')}</h2>
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            <strong>{clientData.name}</strong> nesie zivotne cislo <strong>{numerology.lifePathNumber}</strong> z {numerology.lifePathFrom} ({lpInfo?.title || ''}).
            {lpInfo?.description || ''}
          </p>
          <p className="border-l-2 border-indigo-200 pl-3">
            <strong>{t('summary.gift')}:</strong> {lpInfo?.gift || '-'}.<br/>
            <strong>{t('summary.shadowLabel')}:</strong> {lpInfo?.shadow || '-'}.
          </p>
          <p>
            <strong>{language === 'sk' ? 'Astrológia:' : 'Astrology:'}</strong> {language === 'sk' ? 'Slnko v' : 'Sun in'} <strong>{astrology.sunSign.name}</strong> ({astrology.sunSign.element}),
            {language === 'sk' ? 'Mesiac v' : 'Moon in'} <strong>{astrology.moonSign.name}</strong> ({astrology.moonSign.element}),
            {language === 'sk' ? 'Ascendent v' : 'Ascendant in'} <strong>{astrology.ascendant.name}</strong> ({astrology.ascendant.element}).
            {language === 'sk' ? 'Dominantný živel' : 'Dominant element'}: <strong>{astrology.dominantElement}</strong>.
          </p>
          <p>
            {language === 'sk'
              ? <>V <strong>Human Design</strong> je typ <strong>{humanDesign.type}</strong> s <strong>{humanDesign.authority}</strong> autoritou.</>
              : <>In <strong>Human Design</strong>, the type is <strong>{humanDesign.type}</strong> with <strong>{humanDesign.authority}</strong> authority.</>
            }
            {' '}{language === 'sk' ? 'Stratégia' : 'Strategy'}: <strong>{humanDesign.strategy}</strong>.
            {language === 'sk' ? 'Profil' : 'Profile'} <strong>{humanDesign.profile.line1}/{humanDesign.profile.line2}</strong> ({humanDesign.profile.name}).
          </p>

          {(() => {
            const sunGate = humanDesign.personalityGates.find(g => g.planet === 'Slnko')?.gate;
            const earthGate = humanDesign.personalityGates.find(g => g.planet === 'Zem')?.gate;
            const topGeneKeys = [sunGate, earthGate].filter((g): g is number => g !== undefined).map(g => getGeneKeyByGate(g, language)).filter(Boolean);
            if (topGeneKeys.length === 0) return null;
            return (
              <div className="border-l-2 border-purple-200 pl-3 space-y-2">
                <p><strong>{language === 'sk' ? 'Génové kľúče:' : 'Gene Keys:'}</strong></p>
                {topGeneKeys.map((gk) => (
                  <p key={gk!.gate} className="text-sm">
                    <strong>{language === 'sk' ? 'Brána' : 'Gate'} {gk!.gate}</strong>: {gk!.shadow} ({language === 'sk' ? 'tieň' : 'shadow'}) &rarr; {gk!.gift} ({language === 'sk' ? 'dar' : 'gift'}) &rarr; {gk!.siddhi} (siddhi)
                  </p>
                ))}
              </div>
            );
          })()}

          <p>
            <strong>{language === 'sk' ? 'Aktuálne obdobie:' : 'Current period:'}</strong> {language === 'sk' ? 'Osobný rok' : 'Personal year'} <strong>{numerology.orv}</strong> ({getOrvDescription(numerology.orv, language)?.title || ''}).
            VDD: <strong>{numerology.vdd}</strong> {language === 'sk' ? 'rokov' : 'years'}.
          </p>
          <p>
            <strong>{language === 'sk' ? 'Kabala:' : 'Kabbalah:'}</strong> {kabalah.primarySefira.name} ({kabalah.primarySefira.meaning}).
          </p>
          <p>
            <strong>Theta Healing:</strong> "{theta.primaryBeliefs[0]?.belief}" ({theta.primaryBeliefs[0]?.origin}).
          </p>
        </div>
      </GlassCard>

      {/* Numerologia */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-indigo-600 mb-3">{t('numerology.title')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400">{t('numerology.lifePath')}</p>
            <p className="text-3xl font-serif font-bold">{numerology.lifePathNumber}</p>
            <p className="text-sm text-indigo-500">z {numerology.lifePathFrom}</p>
            <div className="mt-3 text-xs text-slate-500">
              <p>ORV: {numerology.orv} | OMV: {numerology.omv} | ODV: {numerology.odv}</p>
              <p>VDD: {numerology.vdd} rokov</p>
            </div>
          </div>
          <NumerologyGrid grid={numerology.grid} />
        </div>
        {numerology.fullPlanes.length > 0 && <p className="text-xs text-green-600 mt-3">{t('numerology.fullPlanes')}: {numerology.fullPlanes.map(p => getPlaneName(p, language)).join(', ')}</p>}
        {numerology.emptyPlanes.length > 0 && <p className="text-xs text-amber-600 mt-1">{t('numerology.emptyPlanes')}: {numerology.emptyPlanes.map(p => getPlaneName(p, language)).join(', ')}</p>}
        {numerology.isolatedNumbers.length > 0 && <p className="text-xs text-rose-600 mt-1">{t('numerology.isolated')}: {numerology.isolatedNumbers.join(', ')}</p>}
      </GlassCard>

      {/* Astrologia */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-cyan-700 mb-3">{t('astrology.title')}</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-slate-400">{t('astrology.sun')}</p>
            <p className="text-sm font-bold">{astrology.sunSign.symbol} {displayName(ZODIAC_DISPLAY, astrology.sunSign.name, language)}</p>
            <p className="text-xs text-slate-500">{displayName(ELEMENT_DISPLAY, astrology.sunSign.element, language)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">{t('astrology.moon')}</p>
            <p className="text-sm font-bold">{astrology.moonSign.symbol} {displayName(ZODIAC_DISPLAY, astrology.moonSign.name, language)}</p>
            <p className="text-xs text-slate-500">{displayName(ELEMENT_DISPLAY, astrology.moonSign.element, language)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">{t('astrology.ascendant')}</p>
            <p className="text-sm font-bold">{astrology.ascendant.symbol} {displayName(ZODIAC_DISPLAY, astrology.ascendant.name, language)}</p>
            <p className="text-xs text-slate-500">{displayName(ELEMENT_DISPLAY, astrology.ascendant.element, language)}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">{t('astrology.dominantElement')}: {displayName(ELEMENT_DISPLAY, astrology.dominantElement, language)} | {t('astrology.dominantQuality')}: {astrology.dominantQuality}</p>
      </GlassCard>

      {/* Human Design */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-purple-700 mb-3">{t('hd.title')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div><p className="text-xs text-slate-400">{t('hd.type')}</p><p className="font-bold">{displayName(HD_TYPE_DISPLAY, humanDesign.type, language)}</p></div>
          <div><p className="text-xs text-slate-400">{t('hd.authority')}</p><p className="font-medium">{displayName(HD_AUTHORITY_DISPLAY, humanDesign.authority, language)}</p></div>
          <div><p className="text-xs text-slate-400">{t('hd.profile')}</p><p className="font-medium">{humanDesign.profile.line1}/{humanDesign.profile.line2}</p></div>
          <div><p className="text-xs text-slate-400">{t('hd.strategy')}</p><p className="font-medium">{humanDesign.strategy}</p></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {humanDesign.definedCenters.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-700">{displayName(HD_CENTER_DISPLAY, c, language)}</span>)}
          {humanDesign.openCenters.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{displayName(HD_CENTER_DISPLAY, c, language)}</span>)}
        </div>
      </GlassCard>

      {/* Cakry + Etikoterapia */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-green-700 mb-3">{t('chakras.title')}</h3>
        <ChakraWheel chakras={chakras} />
        {(() => {
          const blocked = chakras.filter(c => c.status === 'blocked');
          if (blocked.length === 0) return null;
          return (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-slate-500 font-medium uppercase">Etikoterapia — blokované čakry</p>
              {blocked.map(c => {
                const etiko = getEtikoterapiaForChakra(c.chakra.number, language);
                if (!etiko) return null;
                return (
                  <div key={c.chakra.number} className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                    <p className="text-xs text-rose-700 font-medium">{c.chakra.number}. čakra — {etiko.ethicalTheme}</p>
                    <p className="text-[11px] text-slate-700 mt-0.5">Cnosť: <strong>{etiko.liberatingVirtue}</strong></p>
                    <p className="text-[11px] text-slate-500 italic mt-0.5">„{etiko.reflectionQuestions[0]}"</p>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </GlassCard>

      {/* Kabala */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-amber-700 mb-3">{t('kabalah.title')}</h3>
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
        <h3 className="font-serif text-lg font-bold text-teal-700 mb-3">{t('theta.title')}</h3>
        <div className="space-y-2">
          {theta.primaryBeliefs.map((b, i) => (
            <div key={i} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm">"{b.belief}"</p>
              <p className="text-xs text-slate-500 mt-1">{b.level} | {b.emotion}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Vyvojova numerologia (K1-K4) */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-violet-700 mb-3">{t('dev.title')} (K1-K4)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="p-3 rounded-xl bg-violet-50 border border-violet-200">
            <p className="text-xs text-violet-700 font-semibold">K1 — Psychika</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{developmental.circled[0].value}</p>
            <p className="text-xs text-slate-500">0–{Math.round(numerology.vdd / 4)} r.</p>
          </div>
          <div className="p-3 rounded-xl bg-violet-50 border border-violet-200">
            <p className="text-xs text-violet-700 font-semibold">K2 — Materialna</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{developmental.circled[1].value}</p>
            <p className="text-xs text-slate-500">{Math.round(numerology.vdd / 4)}–{Math.round(numerology.vdd / 2)} r.</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
            <p className="text-xs text-amber-700 font-semibold">K3 — Poslanie ★</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{developmental.circled[2].value}</p>
            <p className="text-xs text-slate-500">{Math.round(numerology.vdd / 2)}–{Math.round(3 * numerology.vdd / 4)} r.</p>
          </div>
          <div className="p-3 rounded-xl bg-violet-50 border border-violet-200">
            <p className="text-xs text-violet-700 font-semibold">K4 — Sny</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{developmental.circled[3].value}</p>
            <p className="text-xs text-slate-500">{Math.round(3 * numerology.vdd / 4)}+ r.</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Polarita ega: <strong>{developmental.egoPolarity === 'masculine' ? 'muzska' : developmental.egoPolarity === 'feminine' ? 'zenska' : 'ziadna'}</strong>
          {' '}({developmental.oneCount}× jednotka v mriezke)
        </p>
      </GlassCard>

      {/* Enneagram */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-emerald-700 mb-3">{t('numerology.enneagramTitle')}</h3>
        {(() => {
          const type = getEnneagramType(enneagram.coreType, language);
          if (!type) return <p className="text-sm text-slate-500">Typ nedostupny</p>;
          return (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">{t('hd.yourType')}</p>
                <p className="text-xl font-bold text-slate-800">{enneagram.coreType} — {type.name}</p>
                <p className="text-xs text-slate-500 italic mt-0.5">{type.subtitle}</p>
                <p className="text-sm text-slate-600 mt-1"><strong>{t('numerology.enneagramMotivation')}:</strong> {type.motivation}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-xs text-emerald-700 font-semibold">{t('numerology.enneagramIntegration')}</p>
                  <p className="text-sm">→ Typ {enneagram.integrationDirection} ({getEnneagramType(enneagram.integrationDirection, language)?.name})</p>
                </div>
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                  <p className="text-xs text-rose-700 font-semibold">{t('numerology.enneagramDisintegration')}</p>
                  <p className="text-sm">→ Typ {enneagram.disintegrationDirection} ({getEnneagramType(enneagram.disintegrationDirection, language)?.name})</p>
                </div>
              </div>
              {enneagram.dominantWing && (
                <p className="text-xs text-slate-500">{t('numerology.enneagramWing')}: <strong>{enneagram.coreType}w{enneagram.dominantWing}</strong></p>
              )}
            </div>
          );
        })()}
      </GlassCard>

      {/* Ayurveda */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-orange-700 mb-3">Ayurveda — dosa</h3>
        {(() => {
          const primary = getDoshaInfo(dosha.primary, language);
          const secondary = dosha.secondary ? getDoshaInfo(dosha.secondary, language) : null;
          return (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Primarna dosa</p>
                <p className="text-xl font-bold text-slate-800">{primary.name} ({primary.element})</p>
                <p className="text-sm text-slate-600 mt-1">Typ tela: {primary.bodyType.toLowerCase()}. Mysl: {primary.mind.toLowerCase()}</p>
              </div>
              {secondary && (
                <div>
                  <p className="text-xs text-slate-400">Sekundarna dosa</p>
                  <p className="text-base font-medium text-slate-700">{secondary.name} ({secondary.element})</p>
                </div>
              )}
              <div className="p-2 rounded-lg bg-orange-50 border border-orange-200">
                <p className="text-xs text-orange-700"><strong>Tip:</strong> {primary.balanceTips[0]}</p>
              </div>
            </div>
          );
        })()}
      </GlassCard>

      {/* TCM */}
      <GlassCard>
        <h3 className="font-serif text-lg font-bold text-emerald-700 mb-3">TCM — 5 elementov</h3>
        {(() => {
          const primary = getTCMElement(tcm.primary, language);
          return (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Tvoj element</p>
                <p className="text-xl font-bold text-slate-800">{primary.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-slate-400">Organ</p><p className="text-slate-700 font-medium">{primary.organ}</p></div>
                <div><p className="text-slate-400">Emocia</p><p className="text-slate-700 font-medium">{primary.emotion}</p></div>
                <div><p className="text-slate-400">Cnost</p><p className="text-slate-700 font-medium">{primary.virtue}</p></div>
                <div><p className="text-slate-400">Sezona</p><p className="text-slate-700 font-medium">{primary.season}</p></div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-xs text-emerald-700"><strong>Tip:</strong> {primary.balanceTip}</p>
              </div>
            </div>
          );
        })()}
      </GlassCard>

      {/* Jazyky lasky */}
      {numerology.loveLanguages.length > 0 && (
        <GlassCard>
          <h3 className="font-serif text-lg font-bold text-pink-700 mb-3">{t('summary.loveLanguages')}</h3>
          <div className="space-y-2">
            {numerology.loveLanguages.slice(0, 3).map((ll, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-pink-50 border border-pink-200">
                <span className="text-xs font-bold text-pink-700 w-5">{i + 1}.</span>
                <span className="text-sm text-slate-800 flex-1">{ll.language}</span>
                <span className="text-xs text-slate-500">{ll.score}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="text-center pt-4 pb-8">
        <p className="text-xs text-slate-400">{t('summary.integralMap')} | {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'sk-SK')}</p>
      </div>
    </div>
  );
}
