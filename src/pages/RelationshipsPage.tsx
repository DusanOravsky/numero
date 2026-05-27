import { useEffect, useMemo, useRef, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import type { Client, Language, UserProfile } from '../store/useStore';
import { getAppUrl } from '../utils/constants';
import { useTranslation } from '../i18n/useTranslation';
import { displayName, ELEMENT_DISPLAY, HD_TYPE_DISPLAY, HD_AUTHORITY_DISPLAY, HD_CENTER_DISPLAY, HD_STRATEGY_DISPLAY, LOVE_LANGUAGE_DISPLAY, ZODIAC_DISPLAY } from '../i18n/entityNames';
import { calculateFullNumerology, reduceToSingle, isValidDate } from '../engine/numerologyEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import { calculatePartnerCompatibility, calculateParentChild } from '../engine/compatibilityEngine';
import type { CompatibilityResult, ParentChildResult } from '../engine/compatibilityEngine';
import { calculateAstrology, calculateSynastryAspects, summarizeSynastry } from '../engine/astrologyEngine';
import type { AstrologyResult, SynastryAspect } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { PartnerBodygraph } from '../components/PartnerBodygraph';
import { getGeneKeyByGate } from '../data/geneKeys';
import { findCity, getTimezoneFromCoords } from '../data/cities';
import { motion } from 'framer-motion';

type Mode = 'partner' | 'family' | 'astro' | 'constellation';

interface PersonInput {
  name: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  birthPlace: string;
}

const emptyPerson = (): PersonInput => ({ name: '', day: '', month: '', year: '', hour: '', minute: '', birthPlace: '' });

function clientToPerson(c: Client): PersonInput {
  return {
    name: c.name,
    day: String(c.birthDay),
    month: String(c.birthMonth),
    year: String(c.birthYear),
    hour: c.birthHour !== undefined ? String(c.birthHour) : '',
    minute: c.birthMinute !== undefined ? String(c.birthMinute) : '',
    birthPlace: c.birthPlace ?? '',
  };
}

function profileToPerson(p: UserProfile): PersonInput {
  return {
    name: p.name,
    day: String(p.birthDay),
    month: String(p.birthMonth),
    year: String(p.birthYear),
    hour: p.birthHour !== undefined ? String(p.birthHour) : '',
    minute: p.birthMinute !== undefined ? String(p.birthMinute) : '',
    birthPlace: p.birthPlace ?? '',
  };
}

function ClientPickerButton({ onPick, includeProfile = true }: { onPick: (p: PersonInput) => void; includeProfile?: boolean }) {
  const { clients, profiles, activeProfileId } = useStore(
    useShallow(s => ({ clients: s.clients, profiles: s.profiles, activeProfileId: s.activeProfileId }))
  );
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeProfile = profiles.find(p => p.id === activeProfileId);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Render aj keď nemá klientov ani profil — používateľ vidí že feature existuje

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors text-indigo-800 bg-indigo-50 border-indigo-300"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>📋</span>
        <span>{t('rel.pickFromClients').replace('📋 ', '')}</span>
        <span className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-64 max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-1 mobile-sheet text-slate-800">
          {includeProfile && activeProfile && (
            <button
              type="button"
              onClick={() => { onPick(profileToPerson(activeProfile)); setOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-indigo-50 flex items-center gap-2 text-slate-800"
            >
              <span className="text-indigo-600">◉</span>
              <span className="flex-1 truncate text-slate-800">{activeProfile.name}</span>
              <span className="text-[10px] uppercase text-slate-500">{t('rel.myProfile')}</span>
            </button>
          )}
          {clients.length > 0 && includeProfile && activeProfile && (
            <div className="border-t border-slate-100 my-1" />
          )}
          {clients.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => { onPick(clientToPerson(c)); setOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-indigo-50 flex items-center gap-2 text-slate-800"
            >
              <span className="text-amber-600">♟</span>
              <span className="flex-1 truncate text-slate-800">{c.name}</span>
              <span className="text-[10px] text-slate-500">{c.birthDay}.{c.birthMonth}.{c.birthYear}</span>
            </button>
          ))}
          {clients.length === 0 && (!includeProfile || !activeProfile) && (
            <div className="px-3 py-3 text-xs text-center text-slate-500">
              {!activeProfile && !clients.length
                ? t('rel.noClientsNoProfile')
                : t('rel.noClients')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PersonForm({ person, onChange, label }: { person: PersonInput; onChange: (p: PersonInput) => void; label: string }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      {label && <p className="text-sm text-slate-700 font-medium">{label}</p>}
      <input
        type="text"
        placeholder={t('profile.name')}
        value={person.name}
        onChange={e => onChange({ ...person, name: e.target.value })}
        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-500"
      />
      <div className="flex gap-2">
        <input type="number" placeholder={t('profile.day')} min={1} max={31} value={person.day} onChange={e => onChange({ ...person, day: e.target.value })} className="w-20 px-3 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-500" />
        <input type="number" placeholder={t('profile.month')} min={1} max={12} value={person.month} onChange={e => onChange({ ...person, month: e.target.value })} className="w-24 px-3 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-500" />
        <input type="number" placeholder={t('profile.year')} min={1900} max={2100} value={person.year} onChange={e => onChange({ ...person, year: e.target.value })} className="flex-1 px-3 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-500" />
      </div>
      <div className="flex gap-2 items-center">
        <input type="number" placeholder={t('profile.hour')} min={0} max={23} value={person.hour} onChange={e => onChange({ ...person, hour: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-center text-sm focus:outline-none focus:border-indigo-500" />
        <span className="text-slate-600 font-bold">:</span>
        <input type="number" placeholder={t('profile.minute')} min={0} max={59} value={person.minute} onChange={e => onChange({ ...person, minute: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-center text-sm focus:outline-none focus:border-indigo-500" />
        <span className="text-[10px] text-slate-600">{t('rel.time24h')}</span>
      </div>
      <input type="text" placeholder={t('profile.birthPlace')} value={person.birthPlace} onChange={e => onChange({ ...person, birthPlace: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-indigo-500" />
    </div>
  );
}

function isPersonValid(p: PersonInput): boolean {
  const d = parseInt(p.day, 10), m = parseInt(p.month, 10), y = parseInt(p.year, 10);
  return !!(p.name.trim() && d >= 1 && m >= 1 && y >= 1900 && isValidDate(d, m, y));
}

const emptyAstroPerson = emptyPerson;

function isAstroPersonValid(p: PersonInput): boolean {
  return isPersonValid(p);
}

interface SynastryResult {
  person1: { name: string; result: AstrologyResult };
  person2: { name: string; result: AstrologyResult };
  sunCompatibility: { score: number; description: string };
  moonCompatibility: { score: number; description: string };
  venusCompatibility: { score: number; description: string };
  marsCompatibility: { score: number; description: string };
  elementBalance: { person1: string; person2: string; compatible: boolean };
  overallScore: number;
}

function getElementCompatibility(el1: string, el2: string, lang: Language = 'sk'): { score: number; description: string } {
  if (el1 === el2) return { score: 95, description: lang === 'sk' ? 'Rovnaký živel -- prirodzená harmónia a vzájomné pochopenie.' : 'Same element — natural harmony and mutual understanding.' };
  // Komplementárne (trigón v astrológii): Oheň-Vzduch a Zem-Voda
  const compatible: Record<string, string> = { 'Oheň': 'Vzduch', 'Vzduch': 'Oheň', 'Zem': 'Voda', 'Voda': 'Zem' };
  if (compatible[el1] === el2) return { score: 80, description: lang === 'sk' ? 'Komplementárne živly -- vzájomne sa posilňujete a inšpirujete.' : 'Complementary elements — you strengthen and inspire each other.' };
  // Opozičné (kvadratúra): Oheň-Voda, Zem-Vzduch
  const opposite: Record<string, string> = { 'Oheň': 'Voda', 'Voda': 'Oheň', 'Zem': 'Vzduch', 'Vzduch': 'Zem' };
  if (opposite[el1] === el2) return { score: 45, description: lang === 'sk' ? 'Protichodné živly -- silná príťažlivosť, ale aj napätie a výzvy.' : 'Opposing elements — strong attraction, but also tension and challenges.' };
  // Neutrálne (kvadratúra menej intenzívna): Oheň-Zem, Vzduch-Voda
  return { score: 55, description: lang === 'sk' ? 'Neutrálna kombinácia -- vyžaduje vedomú prácu na pochopení odlišností.' : 'Neutral combination — requires conscious effort to understand differences.' };
}

function getPlanetByName(result: AstrologyResult, name: string) {
  return result.planets.find(p => p.name === name);
}

/**
 * Davison chart — REÁLNY astrologický výpočet pre stredný čas a stredné miesto narodenia páru.
 * Používa sa keď chcete vidieť "tretiu osobu", ktorá symbolizuje samotný vzťah.
 * Stredný moment: priemer JD oboch dátumov.
 */
function calculateDavison(
  d1: number, m1: number, y1: number, h1: number, min1: number, lat1: number, lon1: number,
  d2: number, m2: number, y2: number, h2: number, min2: number, lat2: number, lon2: number
): AstrologyResult {
  const t1 = new Date(Date.UTC(y1, m1 - 1, d1, h1, min1)).getTime();
  const t2 = new Date(Date.UTC(y2, m2 - 1, d2, h2, min2)).getTime();
  const midTime = new Date((t1 + t2) / 2);
  const midLat = (lat1 + lat2) / 2;
  // Priemer longitúdy s wraparound — pre páry na opačných stranách Zeme
  let lonDiff = lon2 - lon1;
  if (lonDiff > 180) lonDiff -= 360;
  if (lonDiff < -180) lonDiff += 360;
  const midLon = ((lon1 + lonDiff / 2) % 360 + 360) % 360;
  return calculateAstrology(
    midTime.getUTCDate(),
    midTime.getUTCMonth() + 1,
    midTime.getUTCFullYear(),
    midTime.getUTCHours(),
    midTime.getUTCMinutes(),
    midLat,
    midLon - (midLon > 180 ? 360 : 0),
    0
  );
}

/**
 * Composite chart — pre každú planétu zoberieme midpoint longitúd dvoch ľudí
 * (so správnym wraparound cez 0/360°). Toto NIE JE skutočný horoskop —
 * je to symbolický graf vzťahu samotného.
 */
function calculateComposite(
  r1: AstrologyResult,
  r2: AstrologyResult
): { planets: { name: string; symbol: string; longitude: number; signName: string; signSymbol: string; degree: number }[] } {
  const planets = r1.planets.map(p1 => {
    const p2 = r2.planets.find(p => p.name === p1.name);
    if (!p2) return null;
    // Midpoint with shorter-arc convention: ak |Δ| > 180°, pridáme 360°/2
    let diff = p2.longitude - p1.longitude;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const mid = ((p1.longitude + diff / 2) % 360 + 360) % 360;
    const signIdx = Math.floor(mid / 30);
    const ZODIAC = ['Baran', 'Býk', 'Blíženci', 'Rak', 'Lev', 'Panna', 'Váhy', 'Škorpión', 'Strelec', 'Kozorožec', 'Vodnár', 'Ryby'];
    const SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    return {
      name: p1.name,
      symbol: p1.symbol,
      longitude: mid,
      signName: ZODIAC[signIdx],
      signSymbol: SYMBOLS[signIdx],
      degree: mid - signIdx * 30,
    };
  }).filter((x): x is NonNullable<typeof x> => x !== null);
  return { planets };
}

function calculateSynastry(
  name1: string, day1: number, month1: number, year1: number, hour1: number, minute1: number, lat1: number, lon1: number,
  name2: string, day2: number, month2: number, year2: number, hour2: number, minute2: number, lat2: number, lon2: number,
  lang: Language = 'sk'
): SynastryResult {
  const tz1 = getTimezoneFromCoords(lat1, lon1);
  const tz2 = getTimezoneFromCoords(lat2, lon2);
  const r1 = calculateAstrology(day1, month1, year1, hour1, minute1, lat1, lon1, tz1);
  const r2 = calculateAstrology(day2, month2, year2, hour2, minute2, lat2, lon2, tz2);

  const sunCompat = getElementCompatibility(r1.sunSign.element, r2.sunSign.element, lang);
  const moonCompat = getElementCompatibility(r1.moonSign.element, r2.moonSign.element, lang);

  const venus1 = getPlanetByName(r1, 'Venuša');
  const venus2 = getPlanetByName(r2, 'Venuša');
  const venusCompat = venus1 && venus2
    ? getElementCompatibility(venus1.sign.element, venus2.sign.element, lang)
    : { score: 70, description: lang === 'sk' ? 'Nedá sa presne určiť.' : 'Cannot be precisely determined.' };

  const mars1 = getPlanetByName(r1, 'Mars');
  const mars2 = getPlanetByName(r2, 'Mars');
  const marsCompat = mars1 && mars2
    ? getElementCompatibility(mars1.sign.element, mars2.sign.element, lang)
    : { score: 70, description: lang === 'sk' ? 'Nedá sa presne určiť.' : 'Cannot be precisely determined.' };

  const complementary: Record<string, string> = { 'Oheň': 'Vzduch', 'Vzduch': 'Oheň', 'Zem': 'Voda', 'Voda': 'Zem' };
  const elBalance = {
    person1: r1.dominantElement,
    person2: r2.dominantElement,
    compatible: r1.dominantElement === r2.dominantElement || complementary[r1.dominantElement] === r2.dominantElement,
  };

  const overallScore = Math.round(
    sunCompat.score * 0.3 + moonCompat.score * 0.3 + venusCompat.score * 0.2 + marsCompat.score * 0.2
  );

  return {
    person1: { name: name1, result: r1 },
    person2: { name: name2, result: r2 },
    sunCompatibility: sunCompat,
    moonCompatibility: moonCompat,
    venusCompatibility: venusCompat,
    marsCompatibility: marsCompat,
    elementBalance: elBalance,
    overallScore,
  };
}

function getAspectMeaning(planet1: string, planet2: string, nature: string, lang: Language = 'sk'): string {
  const key = [planet1, planet2].sort().join('-');
  const sk: Record<string, Record<string, string>> = {
    'Slnko-Mesiac': { harmonic: 'Hlboké vzájomné porozumenie — identita jedného živí emócie druhého.', tense: 'Napätie medzi tým, čo chcete a čo cítite. Vyžaduje kompromis.', neutral: 'Silné prepojenie identity a emócií — intenzívny vzťah.' },
    'Slnko-Venuša': { harmonic: 'Prirodzená náklonnosť a obdiv. Vzťah plný láskavosti.', tense: 'Rozdielne hodnoty v láske. Treba hľadať spoločný jazyk.', neutral: 'Silná príťažlivosť — jeden obdivuje druhého.' },
    'Slnko-Mars': { harmonic: 'Vzájomné motivovanie a energia. Dobrý tím.', tense: 'Rivalizácia a konflikty ega. Motor rastu ak sa zvládne.', neutral: 'Intenzívna dynamika — buď spolupráca alebo súťaž.' },
    'Slnko-Jupiter': { harmonic: 'Vzájomná podpora rastu a optimizmus. Vzťah rozširuje obzory.', tense: 'Prehnané očakávania. Jeden sľubuje viac než dodá.', neutral: 'Expanzívna energia — spoločne mierite vysoko.' },
    'Slnko-Saturn': { harmonic: 'Stabilita a vzájomný rešpekt. Vzťah s hĺbkou a zodpovednosťou.', tense: 'Jeden obmedzuje druhého. Pocit povinnosti namiesto radosti.', neutral: 'Karmický vzťah — lekcie a zodpovednosť.' },
    'Mesiac-Venuša': { harmonic: 'Emocionálna harmónia a nežnosť. Cítite sa spolu bezpečne.', tense: 'Emočné potreby narážajú na spôsob prejavovania lásky.', neutral: 'Silné citové prepojenie — hlboká intimita.' },
    'Mesiac-Mars': { harmonic: 'Vášeň a emočná intenzita. Vzťah je živý a dynamický.', tense: 'Emócie sa menia na konflikty. Reaktívnosť.', neutral: 'Intenzívne emócie — vášeň aj búrky.' },
    'Mesiac-Jupiter': { harmonic: 'Vzájomná starostlivosť a štedrá emočná podpora.', tense: 'Emočné prejedanie — príliš veľa sľubov.', neutral: 'Rozšírenie emočného sveta.' },
    'Mesiac-Saturn': { harmonic: 'Emočná bezpečnosť a spoľahlivosť. Dlhodobý vzťah.', tense: 'Emočné potlačenie. Jeden sa cíti obmedzovaný.', neutral: 'Karmické emočné prepojenie — lekcie v citoch.' },
    'Venuša-Mars': { harmonic: 'Silná fyzická a romantická príťažlivosť.', tense: 'Túžba vs. frustrácia. Intenzita ktorá môže byť aj deštruktívna.', neutral: 'Magnetická príťažlivosť — erotická iskra.' },
    'Venuša-Jupiter': { harmonic: 'Štedrá, radostná láska. Vzájomné obohacovanie.', tense: 'Nadmerné míňanie alebo prehnaný idealizmus v láske.', neutral: 'Láska rozširuje obzory oboch.' },
    'Venuša-Saturn': { harmonic: 'Verná, stabilná láska s hĺbkou. Vzťah na celý život.', tense: 'Láska vs. povinnosť. Chlad namiesto nežnosti.', neutral: 'Vážne a zodpovedné citové puto.' },
    'Mars-Jupiter': { harmonic: 'Spoločné dobrodružstvá a vzájomná motivácia konať.', tense: 'Prehnané ambície alebo konflikt hodnôt v akcii.', neutral: 'Expanzívna energia — spoločne dosahujete veľa.' },
    'Mars-Saturn': { harmonic: 'Disciplinovaná spolupráca. Spoločne prekonávate prekážky.', tense: 'Frustrácia — jeden brzdí, druhý tlačí. Mocenské hry.', neutral: 'Napätie medzi akciou a opatrnosťou.' },
    'Jupiter-Saturn': { harmonic: 'Rovnováha expanzie a štruktúry. Múdre spoločné rozhodnutia.', tense: 'Konflikt optimizmu a realizmu. Rôzne tempo.', neutral: 'Učiteľ a žiak — vzájomná výmena múdrosti.' },
  };
  const en: Record<string, Record<string, string>> = {
    'Slnko-Mesiac': { harmonic: 'Deep mutual understanding — one\'s identity nourishes the other\'s emotions.', tense: 'Tension between what you want and what you feel. Requires compromise.', neutral: 'Strong connection of identity and emotions — an intense relationship.' },
    'Slnko-Venuša': { harmonic: 'Natural affection and admiration. A relationship full of kindness.', tense: 'Different values in love. Need to find a common language.', neutral: 'Strong attraction — one admires the other.' },
    'Slnko-Mars': { harmonic: 'Mutual motivation and energy. A great team.', tense: 'Rivalry and ego conflicts. A growth engine if managed well.', neutral: 'Intense dynamics — either cooperation or competition.' },
    'Slnko-Jupiter': { harmonic: 'Mutual support of growth and optimism. The relationship broadens horizons.', tense: 'Exaggerated expectations. One promises more than they deliver.', neutral: 'Expansive energy — together you aim high.' },
    'Slnko-Saturn': { harmonic: 'Stability and mutual respect. A relationship with depth and responsibility.', tense: 'One restricts the other. A sense of duty instead of joy.', neutral: 'Karmic relationship — lessons and responsibility.' },
    'Mesiac-Venuša': { harmonic: 'Emotional harmony and tenderness. You feel safe together.', tense: 'Emotional needs clash with the way love is expressed.', neutral: 'Strong emotional connection — deep intimacy.' },
    'Mesiac-Mars': { harmonic: 'Passion and emotional intensity. The relationship is alive and dynamic.', tense: 'Emotions turn into conflicts. Reactivity.', neutral: 'Intense emotions — passion and storms.' },
    'Mesiac-Jupiter': { harmonic: 'Mutual care and generous emotional support.', tense: 'Emotional overindulgence — too many promises.', neutral: 'Expansion of the emotional world.' },
    'Mesiac-Saturn': { harmonic: 'Emotional safety and reliability. A long-term relationship.', tense: 'Emotional suppression. One feels restricted.', neutral: 'Karmic emotional connection — lessons in feelings.' },
    'Venuša-Mars': { harmonic: 'Strong physical and romantic attraction.', tense: 'Desire vs. frustration. Intensity that can be destructive.', neutral: 'Magnetic attraction — erotic spark.' },
    'Venuša-Jupiter': { harmonic: 'Generous, joyful love. Mutual enrichment.', tense: 'Excessive spending or exaggerated idealism in love.', neutral: 'Love broadens horizons for both.' },
    'Venuša-Saturn': { harmonic: 'Faithful, stable love with depth. A lifelong relationship.', tense: 'Love vs. duty. Coldness instead of tenderness.', neutral: 'Serious and responsible emotional bond.' },
    'Mars-Jupiter': { harmonic: 'Shared adventures and mutual motivation to act.', tense: 'Exaggerated ambitions or conflict of values in action.', neutral: 'Expansive energy — together you achieve a lot.' },
    'Mars-Saturn': { harmonic: 'Disciplined cooperation. Together you overcome obstacles.', tense: 'Frustration — one brakes, the other pushes. Power games.', neutral: 'Tension between action and caution.' },
    'Jupiter-Saturn': { harmonic: 'Balance of expansion and structure. Wise joint decisions.', tense: 'Conflict of optimism and realism. Different pace.', neutral: 'Teacher and student — mutual exchange of wisdom.' },
  };
  const meanings = lang === 'en' ? en : sk;
  const pair = meanings[key];
  if (pair) return pair[nature] || pair.neutral || '';
  if (nature === 'harmonic') return lang === 'sk' ? 'Harmonický tok energie medzi týmito oblasťami vášho vzťahu.' : 'Harmonious energy flow between these areas of your relationship.';
  if (nature === 'tense') return lang === 'sk' ? 'Napätie ktoré vyžaduje vedomú prácu, ale je motorom rastu.' : 'Tension that requires conscious effort, but drives growth.';
  return '';
}

function loadSavedPartners(): { p1: PersonInput; p2: PersonInput } | null {
  try {
    const raw = localStorage.getItem('relationships-partners');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function RelationshipsPage() {
  const saved = loadSavedPartners();
  const savedFamily = (() => { try { const r = localStorage.getItem('relationships-family'); return r ? JSON.parse(r) : null; } catch { return null; } })();
  const savedAstro = (() => { try { const r = localStorage.getItem('relationships-astro'); return r ? JSON.parse(r) : null; } catch { return null; } })();
  const [mode, setModeState] = useState<Mode>(() => {
    const savedMode = localStorage.getItem('relationships-mode');
    return (savedMode === 'partner' || savedMode === 'family' || savedMode === 'astro' || savedMode === 'constellation') ? savedMode : 'partner';
  });
  const setMode = (m: Mode) => { setModeState(m); localStorage.setItem('relationships-mode', m); };
  const [partner1, setPartner1] = useState<PersonInput>(saved?.p1 || emptyPerson());
  const [partner2, setPartner2] = useState<PersonInput>(saved?.p2 || emptyPerson());
  const [parent, setParent] = useState<PersonInput>(savedFamily?.parent || emptyPerson());
  const [children, setChildren] = useState<PersonInput[]>(savedFamily?.children?.length ? savedFamily.children : [emptyPerson()]);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(() => {
    if (saved?.p1 && saved?.p2 && isPersonValid(saved.p1) && isPersonValid(saved.p2)) {
      const p1 = calculateFullNumerology(parseInt(saved.p1.day, 10), parseInt(saved.p1.month, 10), parseInt(saved.p1.year, 10));
      const p2 = calculateFullNumerology(parseInt(saved.p2.day, 10), parseInt(saved.p2.month, 10), parseInt(saved.p2.year, 10));
      return calculatePartnerCompatibility(p1, p2, useStore.getState().language);
    }
    return null;
  });
  const [familyResults, setFamilyResults] = useState<{ child: PersonInput; result: ParentChildResult }[] | null>(() => {
    if (savedFamily?.parent && isPersonValid(savedFamily.parent) && savedFamily.children?.length) {
      const validChildren = savedFamily.children.filter(isPersonValid);
      if (validChildren.length === 0) return null;
      const parentNum = calculateFullNumerology(parseInt(savedFamily.parent.day, 10), parseInt(savedFamily.parent.month, 10), parseInt(savedFamily.parent.year, 10));
      const initFamilyLang = useStore.getState().language;
      return validChildren.map((child: PersonInput) => {
        const childNum = calculateFullNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
        return { child, result: calculateParentChild(parentNum, childNum, initFamilyLang) };
      });
    }
    return null;
  });
  const [astroPartner1, setAstroPartner1] = useState<PersonInput>(savedAstro?.p1 || emptyAstroPerson());
  const [astroPartner2, setAstroPartner2] = useState<PersonInput>(savedAstro?.p2 || emptyAstroPerson());
  const [synastryResult, setSynastryResult] = useState<SynastryResult | null>(() => {
    if (savedAstro?.p1 && savedAstro?.p2 && isAstroPersonValid(savedAstro.p1) && isAstroPersonValid(savedAstro.p2)) {
      const city1 = findCity(savedAstro.p1.birthPlace);
      const city2 = findCity(savedAstro.p2.birthPlace);
      const initLang = useStore.getState().language;
      return calculateSynastry(
        savedAstro.p1.name,
        parseInt(savedAstro.p1.day, 10), parseInt(savedAstro.p1.month, 10), parseInt(savedAstro.p1.year, 10),
        savedAstro.p1.hour ? parseInt(savedAstro.p1.hour, 10) : 12,
        savedAstro.p1.minute ? parseInt(savedAstro.p1.minute, 10) : 0,
        city1?.lat || 48.15, city1?.lon || 17.11,
        savedAstro.p2.name,
        parseInt(savedAstro.p2.day, 10), parseInt(savedAstro.p2.month, 10), parseInt(savedAstro.p2.year, 10),
        savedAstro.p2.hour ? parseInt(savedAstro.p2.hour, 10) : 12,
        savedAstro.p2.minute ? parseInt(savedAstro.p2.minute, 10) : 0,
        city2?.lat || 48.15, city2?.lon || 17.11,
        initLang
      );
    }
    return null;
  });

  // Rodinná konštelácia
  const [editing, setEditing] = useState(false);

  const savedConst = (() => { try { const r = localStorage.getItem('relationships-constellation'); return r ? JSON.parse(r) : null; } catch { return null; } })();
  const [constFather, setConstFather] = useState<PersonInput>(savedConst?.father || emptyPerson());
  const [constMother, setConstMother] = useState<PersonInput>(savedConst?.mother || emptyPerson());
  const [constChildren, setConstChildren] = useState<PersonInput[]>(savedConst?.children?.length ? savedConst.children : [emptyPerson()]);
  const [constellationResult, setConstellationResult] = useState<{
    partnerCompat: CompatibilityResult;
    fatherChildren: { child: PersonInput; result: ParentChildResult }[];
    motherChildren: { child: PersonInput; result: ParentChildResult }[];
    siblingCompats: { child1: PersonInput; child2: PersonInput; compat: CompatibilityResult }[];
    familyNumbers: number[];
  } | null>(() => {
    if (!savedConst?.father || !savedConst?.mother || !isPersonValid(savedConst.father) || !isPersonValid(savedConst.mother)) return null;
    const validKids = (savedConst.children || []).filter(isPersonValid);
    if (validKids.length === 0) return null;
    const initConstLang = useStore.getState().language;
    const fatherNum = calculateFullNumerology(parseInt(savedConst.father.day, 10), parseInt(savedConst.father.month, 10), parseInt(savedConst.father.year, 10));
    const motherNum = calculateFullNumerology(parseInt(savedConst.mother.day, 10), parseInt(savedConst.mother.month, 10), parseInt(savedConst.mother.year, 10));
    const partnerCompat = calculatePartnerCompatibility(fatherNum, motherNum, initConstLang);
    const fatherChildren = validKids.map((child: PersonInput) => {
      const childNum = calculateFullNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
      return { child, result: calculateParentChild(fatherNum, childNum, initConstLang) };
    });
    const motherChildren = validKids.map((child: PersonInput) => {
      const childNum = calculateFullNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
      return { child, result: calculateParentChild(motherNum, childNum, initConstLang) };
    });
    const siblingCompats: { child1: PersonInput; child2: PersonInput; compat: CompatibilityResult }[] = [];
    for (let i = 0; i < validKids.length; i++) {
      for (let j = i + 1; j < validKids.length; j++) {
        const n1 = calculateFullNumerology(parseInt(validKids[i].day, 10), parseInt(validKids[i].month, 10), parseInt(validKids[i].year, 10));
        const n2 = calculateFullNumerology(parseInt(validKids[j].day, 10), parseInt(validKids[j].month, 10), parseInt(validKids[j].year, 10));
        siblingCompats.push({ child1: validKids[i], child2: validKids[j], compat: calculatePartnerCompatibility(n1, n2, initConstLang) });
      }
    }
    const familyNumbers = [fatherNum.lifePathNumber, motherNum.lifePathNumber, ...validKids.map((k: PersonInput) => calculateFullNumerology(parseInt(k.day, 10), parseInt(k.month, 10), parseInt(k.year, 10)).lifePathNumber)];
    return { partnerCompat, fatherChildren, motherChildren, siblingCompats, familyNumbers };
  });

  const handleConstellationCalc = () => {
    if (!isPersonValid(constFather) || !isPersonValid(constMother)) return;
    const validKids = constChildren.filter(isPersonValid);
    if (validKids.length === 0) return;

    const currentLangConst = useStore.getState().language;
    const fatherNum = calculateFullNumerology(parseInt(constFather.day, 10), parseInt(constFather.month, 10), parseInt(constFather.year, 10));
    const motherNum = calculateFullNumerology(parseInt(constMother.day, 10), parseInt(constMother.month, 10), parseInt(constMother.year, 10));
    const partnerCompat = calculatePartnerCompatibility(fatherNum, motherNum, currentLangConst);

    const fatherChildren = validKids.map(child => {
      const childNum = calculateFullNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
      return { child, result: calculateParentChild(fatherNum, childNum, currentLangConst) };
    });

    const motherChildren = validKids.map(child => {
      const childNum = calculateFullNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
      return { child, result: calculateParentChild(motherNum, childNum, currentLangConst) };
    });

    const siblingCompats: { child1: PersonInput; child2: PersonInput; compat: CompatibilityResult }[] = [];
    for (let i = 0; i < validKids.length; i++) {
      for (let j = i + 1; j < validKids.length; j++) {
        const n1 = calculateFullNumerology(parseInt(validKids[i].day, 10), parseInt(validKids[i].month, 10), parseInt(validKids[i].year, 10));
        const n2 = calculateFullNumerology(parseInt(validKids[j].day, 10), parseInt(validKids[j].month, 10), parseInt(validKids[j].year, 10));
        siblingCompats.push({ child1: validKids[i], child2: validKids[j], compat: calculatePartnerCompatibility(n1, n2, currentLangConst) });
      }
    }

    const familyNumbers = [
      fatherNum.lifePathNumber,
      motherNum.lifePathNumber,
      ...validKids.map(k => calculateFullNumerology(parseInt(k.day, 10), parseInt(k.month, 10), parseInt(k.year, 10)).lifePathNumber),
    ];

    setConstellationResult({ partnerCompat, fatherChildren, motherChildren, siblingCompats, familyNumbers });
    localStorage.setItem('relationships-constellation', JSON.stringify({ father: constFather, mother: constMother, children: validKids }));
  };

  const handlePartnerCalc = () => {
    if (!isPersonValid(partner1) || !isPersonValid(partner2)) return;
    const p1 = calculateFullNumerology(parseInt(partner1.day, 10), parseInt(partner1.month, 10), parseInt(partner1.year, 10));
    const p2 = calculateFullNumerology(parseInt(partner2.day, 10), parseInt(partner2.month, 10), parseInt(partner2.year, 10));
    setCompatibility(calculatePartnerCompatibility(p1, p2, useStore.getState().language));
    localStorage.setItem('relationships-partners', JSON.stringify({ p1: partner1, p2: partner2 }));
  };

  const handleAstroCalc = () => {
    if (!isAstroPersonValid(astroPartner1) || !isAstroPersonValid(astroPartner2)) return;
    const city1 = findCity(astroPartner1.birthPlace);
    const city2 = findCity(astroPartner2.birthPlace);
    const currentLang = useStore.getState().language;
    const result = calculateSynastry(
      astroPartner1.name,
      parseInt(astroPartner1.day, 10), parseInt(astroPartner1.month, 10), parseInt(astroPartner1.year, 10),
      astroPartner1.hour ? parseInt(astroPartner1.hour, 10) : 12,
      astroPartner1.minute ? parseInt(astroPartner1.minute, 10) : 0,
      city1?.lat || 48.15, city1?.lon || 17.11,
      astroPartner2.name,
      parseInt(astroPartner2.day, 10), parseInt(astroPartner2.month, 10), parseInt(astroPartner2.year, 10),
      astroPartner2.hour ? parseInt(astroPartner2.hour, 10) : 12,
      astroPartner2.minute ? parseInt(astroPartner2.minute, 10) : 0,
      city2?.lat || 48.15, city2?.lon || 17.11,
      currentLang
    );
    setSynastryResult(result);
    localStorage.setItem('relationships-astro', JSON.stringify({ p1: astroPartner1, p2: astroPartner2 }));
  };

  const handleFamilyCalc = () => {
    if (!isPersonValid(parent)) return;
    const validChildren = children.filter(isPersonValid);
    if (validChildren.length === 0) return;

    const currentLangFamily = useStore.getState().language;
    const parentNum = calculateFullNumerology(parseInt(parent.day, 10), parseInt(parent.month, 10), parseInt(parent.year, 10));
    const results = validChildren.map(child => {
      const childNum = calculateFullNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
      return { child, result: calculateParentChild(parentNum, childNum, currentLangFamily) };
    });
    setFamilyResults(results);
    localStorage.setItem('relationships-family', JSON.stringify({ parent, children: validChildren }));
  };

  const addChild = () => setChildren([...children, emptyPerson()]);
  const removeChild = (idx: number) => setChildren(children.filter((_, i) => i !== idx));

  const reset = () => {
    if (mode === 'partner') {
      setPartner1(emptyPerson()); setPartner2(emptyPerson()); setCompatibility(null);
      localStorage.removeItem('relationships-partners');
    } else if (mode === 'family') {
      setParent(emptyPerson()); setChildren([emptyPerson()]); setFamilyResults(null);
      localStorage.removeItem('relationships-family');
    } else if (mode === 'astro') {
      setAstroPartner1(emptyAstroPerson()); setAstroPartner2(emptyAstroPerson()); setSynastryResult(null);
      localStorage.removeItem('relationships-astro');
    } else if (mode === 'constellation') {
      setConstFather(emptyPerson()); setConstMother(emptyPerson()); setConstChildren([emptyPerson()]); setConstellationResult(null);
      localStorage.removeItem('relationships-constellation');
    }
  };

  const partner1Num = useMemo(() => {
    if (!isPersonValid(partner1)) return null;
    return calculateFullNumerology(parseInt(partner1.day, 10), parseInt(partner1.month, 10), parseInt(partner1.year, 10));
  }, [partner1]);

  const partner2Num = useMemo(() => {
    if (!isPersonValid(partner2)) return null;
    return calculateFullNumerology(parseInt(partner2.day, 10), parseInt(partner2.month, 10), parseInt(partner2.year, 10));
  }, [partner2]);

  const partnerAstroHD = useMemo(() => {
    if (!isPersonValid(partner1) || !isPersonValid(partner2)) return null;
    const c1 = findCity(partner1.birthPlace);
    const c2 = findCity(partner2.birthPlace);
    const lat1 = c1?.lat ?? 48.15, lon1 = c1?.lon ?? 17.11;
    const lat2 = c2?.lat ?? 48.15, lon2 = c2?.lon ?? 17.11;
    const pTz1 = getTimezoneFromCoords(lat1, lon1);
    const pTz2 = getTimezoneFromCoords(lat2, lon2);
    const a1 = calculateAstrology(parseInt(partner1.day, 10), parseInt(partner1.month, 10), parseInt(partner1.year, 10), partner1.hour ? parseInt(partner1.hour, 10) : 12, partner1.minute ? parseInt(partner1.minute, 10) : 0, lat1, lon1, pTz1);
    const a2 = calculateAstrology(parseInt(partner2.day, 10), parseInt(partner2.month, 10), parseInt(partner2.year, 10), partner2.hour ? parseInt(partner2.hour, 10) : 12, partner2.minute ? parseInt(partner2.minute, 10) : 0, lat2, lon2, pTz2);
    const hd1 = calculateHumanDesign(parseInt(partner1.day, 10), parseInt(partner1.month, 10), parseInt(partner1.year, 10), partner1.hour ? parseInt(partner1.hour, 10) : 12, partner1.minute ? parseInt(partner1.minute, 10) : 0, pTz1);
    const hd2 = calculateHumanDesign(parseInt(partner2.day, 10), parseInt(partner2.month, 10), parseInt(partner2.year, 10), partner2.hour ? parseInt(partner2.hour, 10) : 12, partner2.minute ? parseInt(partner2.minute, 10) : 0, pTz2);
    return { a1, a2, hd1, hd2, pTz1, pTz2 };
  }, [partner1, partner2]);

  const partnerDevNum = useMemo(() => {
    if (!isPersonValid(partner1) || !isPersonValid(partner2)) return null;
    const d1 = calculateDevelopmentalNumerology(parseInt(partner1.day, 10), parseInt(partner1.month, 10), parseInt(partner1.year, 10));
    const d2 = calculateDevelopmentalNumerology(parseInt(partner2.day, 10), parseInt(partner2.month, 10), parseInt(partner2.year, 10));
    return { d1, d2 };
  }, [partner1, partner2]);

  const { t, language } = useTranslation();
  const { profiles, activeProfileId } = useStore(
    useShallow(s => ({ profiles: s.profiles, activeProfileId: s.activeProfileId }))
  );
  const profile = profiles.find(p => p.id === activeProfileId);

  const handleShareCompare = () => {
    if (!profile) return;
    const payload = JSON.stringify({
      name: profile.name,
      birthDay: profile.birthDay,
      birthMonth: profile.birthMonth,
      birthYear: profile.birthYear,
      birthHour: profile.birthHour,
      birthMinute: profile.birthMinute,
    });
    const encoded = btoa(unescape(encodeURIComponent(payload)));
    const url = `${getAppUrl()}share?data=${encoded}`;
    if (navigator.share) {
      navigator.share({
        title: language === 'sk' ? 'Integrálna mapa bytia' : 'Integral Map of Being',
        text: language === 'sk' ? 'Porovnaj sa so mnou — zisti náš vzťahový potenciál!' : 'Compare with me — discover our relationship potential!',
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-900">{t('rel.title')}</h1>
        <p className="text-slate-600 mt-1">{t('rel.subtitle')}</p>
      </div>

      {/* Share CTA */}
      {profile && (
        <button
          onClick={handleShareCompare}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors text-left"
        >
          <span className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm">📤</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-indigo-900">
              {language === 'sk' ? 'Porovnaj sa s partnerom' : 'Compare with partner'}
            </p>
            <p className="text-[10px] text-indigo-600">
              {language === 'sk' ? 'Pošli odkaz a zisti vzťahovú kompatibilitu' : 'Send a link and discover relationship compatibility'}
            </p>
          </div>
          <span className="text-indigo-400 text-sm">→</span>
        </button>
      )}

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setMode('partner')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'partner' ? 'bg-indigo-600 text-white glow' : 'border border-slate-300 bg-slate-100 text-slate-700'}`}
        >
          {t('rel.modePartner')}
        </button>
        <button
          onClick={() => setMode('family')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'family' ? 'bg-indigo-600 text-white glow' : 'border border-slate-300 bg-slate-100 text-slate-700'}`}
        >
          {t('rel.modeFamily')}
        </button>
        <button
          onClick={() => setMode('astro')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'astro' ? 'bg-indigo-600 text-white glow' : 'border border-slate-300 bg-slate-100 text-slate-700'}`}
        >
          {t('rel.modeAstro')}
        </button>
        <button
          onClick={() => setMode('constellation')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'constellation' ? 'bg-indigo-600 text-white glow' : 'border border-slate-300 bg-slate-100 text-slate-700'}`}
        >
          {t('rel.modeConstellation')}
        </button>
      </div>

      {/* PARTNERSKÝ MÓD */}
      {mode === 'partner' && (!compatibility || editing) && (
        <GlassCard>
          {!compatibility && (
            <p className="text-sm text-slate-600 mb-4">
              <strong className="text-slate-900">{t('rel.modePartner')}</strong> {t('rel.partnerModeDesc').slice(t('rel.modePartner').length + 1)}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-700 font-medium">{t('rel.partner1')}</p>
                <ClientPickerButton onPick={setPartner1} />
              </div>
              <PersonForm person={partner1} onChange={setPartner1} label="" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-700 font-medium">{t('rel.partner2')}</p>
                <ClientPickerButton onPick={setPartner2} />
              </div>
              <PersonForm person={partner2} onChange={setPartner2} label="" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { handlePartnerCalc(); setEditing(false); }}
              disabled={!isPersonValid(partner1) || !isPersonValid(partner2)}
              className="flex-1 py-3.5 rounded-2xl font-semibold tracking-wide enabled:bg-gradient-to-r enabled:from-indigo-600 enabled:via-violet-600 enabled:to-purple-600 enabled:text-white enabled:shadow-lg enabled:shadow-indigo-500/30 enabled:hover:shadow-xl enabled:hover:shadow-indigo-500/40 enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 enabled:active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-800 disabled:cursor-not-allowed transition-all duration-200 ease-out"
            >
              {compatibility ? t('rel.recalculate') : t('rel.calculateCompatibility')}
            </button>
            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
              >
                {t('common.cancel')}
              </button>
            )}
          </div>
        </GlassCard>
      )}

      {mode === 'partner' && compatibility && !editing && (
        <div className="space-y-6">
          {/* Tvoje čítanie */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">{t('rel.partnerReadingTitle')}</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                {t('rel.overallCompatibility')} <strong className="text-slate-900">{compatibility.overallScore}%</strong> {t('rel.partnerReadingCompatNote')}
                <strong> {t('rel.strengths')}</strong> ({compatibility.strengths.length}) {language === 'sk' ? 'sú to, čo vás drží spolu bez námahy.' : 'are what keeps you together effortlessly.'}
                <strong> {t('rel.challenges')}</strong> ({compatibility.challenges.length}) {language === 'sk' ? 'sú oblasti kde rastieme spoločne.' : 'are areas where you grow together.'}
              </p>
              <p>
                <strong>{t('rel.characterSynastry')}</strong> {t('rel.partnerReadingCharSyn')}
              </p>
              <p>
                <strong>{t('rel.developmentalSynastry')}</strong> {t('rel.partnerReadingDevSyn')}
              </p>
              <p>
                <strong>Human Design</strong> {t('rel.partnerReadingHD')}
              </p>
              <p>
                <strong>{t('rel.sharedGKLabel')}</strong> {t('rel.partnerReadingGK')}
              </p>
              <p className="text-xs text-slate-500 italic">
                {t('rel.partnerReadingDisclaimer')}
              </p>
            </div>
          </GlassCard>

          <GlassCard glow>
            <div className="text-center">
              <p className="text-sm text-slate-600">{partner1.name} & {partner2.name}</p>
              <div className="relative w-32 h-32 mx-auto my-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="45" fill="none" stroke="url(#grad)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${compatibility.overallScore * 2.83} ${283 - compatibility.overallScore * 2.83}`}
                    initial={{ strokeDasharray: '0 283' }}
                    animate={{ strokeDasharray: `${compatibility.overallScore * 2.83} ${283 - compatibility.overallScore * 2.83}` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs><linearGradient id="grad"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-serif font-bold text-slate-900">{compatibility.overallScore}%</span>
                </div>
              </div>
              <p className="text-sm text-slate-600">{t('rel.overallCompatibility')}</p>
            </div>
          </GlassCard>

          {/* Cieľ vzťahu */}
          {(() => {
            if (!partner1Num || !partner2Num) return null;
            const relationshipGoal = reduceToSingle(partner1Num.lifePathNumber + partner2Num.lifePathNumber);
            const goalDescriptions: Record<number, string> = {
              1: t('rel.goalDesc1'),
              2: t('rel.goalDesc2'),
              3: t('rel.goalDesc3'),
              4: t('rel.goalDesc4'),
              5: t('rel.goalDesc5'),
              6: t('rel.goalDesc6'),
              7: t('rel.goalDesc7'),
              8: t('rel.goalDesc8'),
              9: t('rel.goalDesc9'),
            };
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-2">{t('rel.relationshipGoal')}</h3>
                <p className="text-xs text-slate-600 mb-3">{t('rel.goalExplain')}</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">{language === 'sk' ? 'ŽČ' : 'LP'}({partner1.name}):</span>
                    <span className="text-lg font-bold text-indigo-300">{partner1Num.lifePathNumber}</span>
                  </div>
                  <span className="text-slate-500">+</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">{language === 'sk' ? 'ŽČ' : 'LP'}({partner2.name}):</span>
                    <span className="text-lg font-bold text-indigo-300">{partner2Num.lifePathNumber}</span>
                  </div>
                  <span className="text-slate-500">=</span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                    <span className="text-lg font-serif font-bold text-slate-900">{relationshipGoal}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-300">{goalDescriptions[relationshipGoal]}</p>
              </GlassCard>
            );
          })()}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassCard>
              <h4 className="text-sm text-slate-400 mb-2">{t('rel.lifePathNumbers')}</h4>
              <p className="text-lg font-medium text-slate-800">{compatibility.lifePathCompatibility.score}%</p>
              <p className="text-sm text-slate-300 mt-1">{compatibility.lifePathCompatibility.description}</p>
            </GlassCard>
            <GlassCard>
              <h4 className="text-sm text-slate-400 mb-2">{t('rel.loveLanguages')}</h4>
              <p className="text-lg font-medium text-slate-800">{compatibility.loveLanguageMatch.score}%</p>
              {compatibility.loveLanguageMatch.matched.length > 0 && (
                <p className="text-sm text-green-300 mt-1">{t('rel.matched')}: {compatibility.loveLanguageMatch.matched.map(m => displayName(LOVE_LANGUAGE_DISPLAY, m, language)).join(', ')}</p>
              )}
            </GlassCard>
          </div>

          {/* Čo máte spoločné — zhody medzi partnermi */}
          {(() => {
            if (!partner1Num || !partner2Num || !partnerAstroHD) return null;
            const { a1, a2, hd1, hd2 } = partnerAstroHD;

            const matches: { label: string; value: string }[] = [];
            if (partner1Num.lifePathNumber === partner2Num.lifePathNumber) matches.push({ label: t('rel.lifePathNumbers'), value: String(partner1Num.lifePathNumber) });
            if (hd1.type === hd2.type) matches.push({ label: language === 'sk' ? 'HD typ' : 'HD type', value: displayName(HD_TYPE_DISPLAY, hd1.type, language) });
            if (hd1.authority === hd2.authority) matches.push({ label: language === 'sk' ? 'Autorita' : 'Authority', value: displayName(HD_AUTHORITY_DISPLAY, hd1.authority, language) });
            if (a1.dominantElement === a2.dominantElement) matches.push({ label: t('rel.dominantElement'), value: a1.dominantElement });
            if (a1.sunSign === a2.sunSign) matches.push({ label: language === 'sk' ? 'Slnko' : 'Sun', value: String(a1.sunSign) });
            if (a1.moonSign === a2.moonSign) matches.push({ label: language === 'sk' ? 'Mesiac' : 'Moon', value: String(a1.moonSign) });
            const sharedIso = partner1Num.isolatedNumbers.filter(n => partner2Num.isolatedNumbers.includes(n));
            if (sharedIso.length > 0) matches.push({ label: t('rel.isolatedNumbers'), value: sharedIso.join(', ') });

            if (matches.length === 0) return null;
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-1">{t('rel.whatYouShare')}</h3>
                <p className="text-xs text-slate-600 mb-3">{t('rel.whatYouShareDesc')}</p>
                <div className="flex flex-wrap gap-2">
                  {matches.map(m => (
                    <div key={m.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
                      <span className="text-green-600">✓</span>
                      <span className="text-xs text-slate-700"><strong>{m.label}:</strong> {m.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })()}

          {/* Jazyky lásky — plný profil oboch partnerov */}
          {(() => {
            if (!partner1Num || !partner2Num) return null;
            const langs1 = partner1Num.loveLanguages;
            const langs2 = partner2Num.loveLanguages;
            if (!langs1?.length || !langs2?.length) return null;
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-1">{t('rel.loveLanguagesDetail')}</h3>
                <p className="text-xs text-slate-600 mb-3">{language === 'sk' ? 'Ako každý z vás prijíma a dáva lásku. Primárny jazyk partnera je kľúč k tomu, aby sa cítil milovaný.' : 'How each of you receives and gives love. The partner\'s primary language is the key to making them feel loved.'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ name: partner1.name, langs: langs1 }, { name: partner2.name, langs: langs2 }].map(({ name, langs }) => (
                    <div key={name}>
                      <p className="text-xs font-semibold text-slate-700 mb-2">{name}</p>
                      <div className="space-y-1.5">
                        {langs.map((ll, idx) => {
                          const widthPct = Math.max(0, Math.min(100, (ll.score + 5) * 8));
                          return (
                            <div key={ll.language}>
                              <div className="flex items-center justify-between text-[11px] mb-0.5">
                                <span className={idx === 0 ? 'text-rose-700 font-medium' : 'text-slate-600'}>
                                  {idx + 1}. {displayName(LOVE_LANGUAGE_DISPLAY, ll.language, language)}
                                </span>
                                <span className="text-slate-500">{ll.score}</span>
                              </div>
                              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${idx === 0 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-indigo-400'}`}
                                  style={{ width: `${widthPct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                {compatibility.loveLanguageMatch.mismatched.length > 0 && (
                  <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-[11px] text-amber-700">
                      <strong>{t('rel.mismatch')}:</strong> {compatibility.loveLanguageMatch.mismatched.map(m => displayName(LOVE_LANGUAGE_DISPLAY, m, language)).join(', ')} — {language === 'sk' ? 'tu jeden z vás potrebuje niečo, čo druhému nepríde prirodzene. Komunikácia je kľúč.' : 'here one of you needs something that doesn\'t come naturally to the other. Communication is key.'}
                    </p>
                  </div>
                )}
              </GlassCard>
            );
          })()}

          {/* Charakterová synastria — porovnanie mriežok */}
          {(() => {
            if (!partner1Num || !partner2Num) return null;
            const sharedFull = partner1Num.fullPlanes.filter(p => partner2Num.fullPlanes.includes(p));
            const sharedEmpty = partner1Num.emptyPlanes.filter(p => partner2Num.emptyPlanes.includes(p));
            const sharedIsolated = partner1Num.isolatedNumbers.filter(n => partner2Num.isolatedNumbers.includes(n));
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-1">{t('rel.characterSynastry')}</h3>
                <p className="text-xs text-slate-600 mb-3">{t('rel.characterSynastryDesc')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-[11px] text-indigo-300 font-semibold">{partner1.name}: {language === 'sk' ? 'ŽČ' : 'LP'} {partner1Num.lifePathNumber}</p>
                    <p className="text-[11px] text-slate-600">{t('rel.fullPlanes')}: {partner1Num.fullPlanes.length > 0 ? partner1Num.fullPlanes.join(', ') : t('rel.none')}</p>
                    <p className="text-[11px] text-slate-600">{t('rel.emptyPlanes')}: {partner1Num.emptyPlanes.length > 0 ? partner1Num.emptyPlanes.join(', ') : t('rel.none')}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <p className="text-[11px] text-violet-300 font-semibold">{partner2.name}: {language === 'sk' ? 'ŽČ' : 'LP'} {partner2Num.lifePathNumber}</p>
                    <p className="text-[11px] text-slate-600">{t('rel.fullPlanes')}: {partner2Num.fullPlanes.length > 0 ? partner2Num.fullPlanes.join(', ') : t('rel.none')}</p>
                    <p className="text-[11px] text-slate-600">{t('rel.emptyPlanes')}: {partner2Num.emptyPlanes.length > 0 ? partner2Num.emptyPlanes.join(', ') : t('rel.none')}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {sharedFull.length > 0 && (
                    <p className="text-[11px] text-emerald-300">{t('rel.sharedStrongPlanes')}: <strong>{sharedFull.join(', ')}</strong> — {language === 'sk' ? 'tu si rozumiete bez slov, spoločná energia.' : 'you understand each other without words here, shared energy.'}</p>
                  )}
                  {sharedEmpty.length > 0 && (
                    <p className="text-[11px] text-amber-300">{t('rel.sharedEmptyPlanes')}: <strong>{sharedEmpty.join(', ')}</strong> — {language === 'sk' ? 'spoločné slepé miesta, nikto z vás tu nepomôže druhému.' : 'shared blind spots, neither of you can help the other here.'}</p>
                  )}
                  {sharedIsolated.length > 0 && (
                    <p className="text-[11px] text-rose-300">{t('rel.sharedIsolated')}: <strong>{sharedIsolated.join(', ')}</strong> — {language === 'sk' ? 'spoločné napätie, môže zosilnieť vo vzťahu.' : 'shared tension, can intensify in relationship.'}</p>
                  )}
                  {sharedFull.length === 0 && sharedEmpty.length === 0 && sharedIsolated.length === 0 && (
                    <p className="text-[11px] text-slate-500 italic">{t('rel.veryDifferentGrids')}</p>
                  )}
                </div>
              </GlassCard>
            );
          })()}

          {/* Vývojová synastria (B20) — porovnanie K1-K4 a egoPolarity */}
          {(() => {
            if (!partnerDevNum) return null;
            const { d1: dev1, d2: dev2 } = partnerDevNum;

            const k3Match = dev1.circled[2].value === dev2.circled[2].value;
            const k1Match = dev1.circled[0].value === dev2.circled[0].value;
            const egoComplementary = (dev1.egoPolarity === 'masculine' && dev2.egoPolarity === 'feminine') ||
                                      (dev1.egoPolarity === 'feminine' && dev2.egoPolarity === 'masculine');
            const egoSame = dev1.egoPolarity === dev2.egoPolarity && dev1.egoPolarity !== 'none';

            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-1">{t('rel.developmentalSynastry')}</h3>
                <p className="text-xs text-slate-600 mb-3">
                  {t('rel.developmentalSynastryDesc')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-700 uppercase mb-1">{partner1.name}</p>
                    <p className="text-sm text-slate-800 font-mono">
                      K1={dev1.circled[0].value} · K2={dev1.circled[1].value} · K3={dev1.circled[2].value} · K4={dev1.circled[3].value}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Ego: {dev1.egoPolarity === 'masculine' ? t('rel.egoMasculine') : dev1.egoPolarity === 'feminine' ? t('rel.egoFeminine') : t('rel.egoNone')} ({dev1.oneCount}× 1)
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
                    <p className="text-xs text-violet-700 uppercase mb-1">{partner2.name}</p>
                    <p className="text-sm text-slate-800 font-mono">
                      K1={dev2.circled[0].value} · K2={dev2.circled[1].value} · K3={dev2.circled[2].value} · K4={dev2.circled[3].value}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Ego: {dev2.egoPolarity === 'masculine' ? t('rel.egoMasculine') : dev2.egoPolarity === 'feminine' ? t('rel.egoFeminine') : t('rel.egoNone')} ({dev2.oneCount}× 1)
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {k3Match && (
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-xs text-emerald-300">
                        {language === 'sk' ? <>★ <strong>K3 zhoda ({dev1.circled[2].value})</strong> — máte rovnaké životné poslanie. Vaše duše sa stretli pre tú istú misiu — buď vás to spája hlboko, alebo súťažíte o tú istú lekciu.</> : <>★ <strong>K3 match ({dev1.circled[2].value})</strong> — you share the same life purpose. Your souls met for the same mission — either it connects you deeply, or you compete for the same lesson.</>}
                      </p>
                    </div>
                  )}
                  {k1Match && (
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <p className="text-xs text-blue-300">
                        {language === 'sk' ? `K1 zhoda (${dev1.circled[0].value}) — máte rovnakú psychickú konštrukciu, takže si rozumiete „bez slov", ale zdieľate aj rovnaké slabé miesta.` : `K1 match (${dev1.circled[0].value}) — you share the same psychic structure, so you understand each other "without words", but you also share the same weak spots.`}
                      </p>
                    </div>
                  )}
                  {egoComplementary && (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
                      <p className="text-xs text-rose-300">
                        ☯ {t('rel.egoComplementary')}
                      </p>
                    </div>
                  )}
                  {egoSame && (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <p className="text-xs text-amber-700">
                        ⚹ {t('rel.egoSame')}
                      </p>
                    </div>
                  )}
                  {!k3Match && !k1Match && !egoComplementary && !egoSame && (
                    <p className="text-xs text-slate-500 italic">
                      {t('rel.devDifferent')}
                    </p>
                  )}
                </div>
              </GlassCard>
            );
          })()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compatibility.strengths.length > 0 && (
              <GlassCard>
                <h3 className="font-medium text-green-300 mb-3">{t('rel.strengths')}</h3>
                {compatibility.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1"><span className="text-green-400">+</span><span className="text-xs text-slate-300">{s}</span></div>
                ))}
              </GlassCard>
            )}

            {compatibility.challenges.length > 0 && (
              <GlassCard>
                <h3 className="font-medium text-amber-300 mb-3">{t('rel.challenges')}</h3>
                {compatibility.challenges.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1"><span className="text-amber-400">!</span><span className="text-xs text-slate-300">{c}</span></div>
                ))}
              </GlassCard>
            )}

            <GlassCard>
              <h3 className="font-medium text-indigo-300 mb-3">{t('rel.recommendations')}</h3>
              {compatibility.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 mb-1"><span className="text-indigo-400">→</span><span className="text-xs text-slate-300">{r}</span></div>
              ))}
            </GlassCard>

            <GlassCard>
              <h3 className="font-medium text-rose-300 mb-3">{t('rel.rituals')}</h3>
              {compatibility.rituals.map((r, i) => (
                <div key={i} className="flex items-start gap-2 mb-1"><span className="text-rose-400">♡</span><span className="text-xs text-slate-300">{r}</span></div>
              ))}
            </GlassCard>
          </div>

          {/* Human Design composite comparison + Gene Keys */}
          {(() => {
            const pCity1 = findCity(partner1.birthPlace);
            const pCity2 = findCity(partner2.birthPlace);
            const pTz1 = getTimezoneFromCoords(pCity1?.lat ?? 48.15, pCity1?.lon ?? 17.11);
            const pTz2 = getTimezoneFromCoords(pCity2?.lat ?? 48.15, pCity2?.lon ?? 17.11);
            const hd1 = calculateHumanDesign(parseInt(partner1.day, 10), parseInt(partner1.month, 10), parseInt(partner1.year, 10), partner1.hour !== '' ? parseInt(partner1.hour, 10) : 12, partner1.minute !== '' ? parseInt(partner1.minute, 10) : 0, pTz1);
            const hd2 = calculateHumanDesign(parseInt(partner2.day, 10), parseInt(partner2.month, 10), parseInt(partner2.year, 10), partner2.hour !== '' ? parseInt(partner2.hour, 10) : 12, partner2.minute !== '' ? parseInt(partner2.minute, 10) : 0, pTz2);
            return (
              <>
              <GlassCard>
                <h3 className="font-medium text-purple-300 mb-3">{t('rel.hdCompatibility')}</h3>
                <PartnerBodygraph result1={hd1} result2={hd2} name1={partner1.name} name2={partner2.name} />
              </GlassCard>
              </>
            );
          })()}

          <div className="flex justify-end">
            <button
              onClick={() => setEditing(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1 shadow-sm"
            >
              <span>✎</span> {t('rel.editData')}
            </button>
          </div>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">{t('common.newCalculation')}</button>
        </div>
      )}

      {/* RODINNÝ MÓD */}
      {mode === 'family' && (!familyResults || editing) && (
        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-700 font-medium">{t('rel.parent')}</span>
              <ClientPickerButton onPick={setParent} />
            </div>
            <PersonForm person={parent} onChange={setParent} label="" />
          </GlassCard>

          {children.map((child, idx) => (
            <GlassCard key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">{t('rel.child')} {idx + 1}</span>
                <div className="flex items-center gap-2">
                  <ClientPickerButton onPick={(p) => { const next = [...children]; next[idx] = p; setChildren(next); }} includeProfile={false} />
                  {children.length > 1 && (
                    <button onClick={() => removeChild(idx)} className="text-xs text-red-600 hover:text-red-800 font-medium">{t('rel.removeChild')}</button>
                  )}
                </div>
              </div>
              <PersonForm person={child} onChange={(p) => { const next = [...children]; next[idx] = p; setChildren(next); }} label="" />
            </GlassCard>
          ))}

          <button
            type="button"
            onClick={addChild}
            className="group w-full py-3.5 rounded-2xl border-2 border-dashed border-indigo-400/70 text-sm font-bold bg-gradient-to-br from-indigo-50 to-violet-50/60 text-indigo-700 hover:border-indigo-500 hover:from-indigo-100 hover:to-violet-100 hover:shadow-md hover:shadow-indigo-500/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 ease-out flex items-center justify-center gap-2"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-base font-bold leading-none transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110">+</span>
            <span className="text-indigo-800">{t('rel.addChild')}</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => { handleFamilyCalc(); setEditing(false); }}
              disabled={!isPersonValid(parent) || !children.some(isPersonValid)}
              className="flex-1 py-3.5 rounded-2xl font-semibold tracking-wide enabled:bg-gradient-to-r enabled:from-indigo-600 enabled:via-violet-600 enabled:to-purple-600 enabled:text-white enabled:shadow-lg enabled:shadow-indigo-500/30 enabled:hover:shadow-xl enabled:hover:shadow-indigo-500/40 enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 enabled:active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-800 disabled:cursor-not-allowed transition-all duration-200 ease-out"
            >
              {familyResults ? t('rel.recalculate') : t('rel.calculateCompatibility')}
            </button>
            {editing && (
              <button onClick={() => setEditing(false)} className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200">{t('common.cancel')}</button>
            )}
          </div>
        </div>
      )}

      {mode === 'family' && familyResults && !editing && (
        <div className="space-y-6">
          {/* Tvoje čítanie */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">{t('rel.familyReadingTitle')}</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                {t('rel.parent')} <strong className="text-slate-900">{parent.name}</strong> a <strong className="text-slate-900">{familyResults.length}</strong> {familyResults.length === 1 ? t('rel.child').toLowerCase() : (language === 'sk' ? 'deti' : 'children')}.
                {t('rel.familyReadingIntro')}
              </p>
              <p>
                {t('rel.familyReadingRoles')}
              </p>
              <p>
                {t('rel.familyReadingHD')}
              </p>
              <p>
                {t('rel.familyReadingGK')}
              </p>
              <p className="text-xs text-slate-500 italic">
                {t('rel.familyReadingDisclaimer')}
              </p>
            </div>
          </GlassCard>

          <p className="text-sm text-slate-600">{t('rel.parent')}: <span className="text-white font-medium">{parent.name}</span></p>

          {familyResults.map(({ child, result }, idx) => {
            const childNum = calculateFullNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
            const childDev = calculateDevelopmentalNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
            return (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900">{child.name}</h3>
                  <span className="text-lg font-serif font-bold text-indigo-300">{result.compatibility}%</span>
                </div>

                <div className="space-y-3">
                  {/* Profil dieťaťa — kto je */}
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-xs text-violet-700 font-semibold uppercase mb-1">{t('rel.childProfile')}</p>
                    <p className="text-xs text-slate-300">
                      <strong>{language === 'sk' ? 'ŽČ' : 'LP'} {childNum.lifePathNumber}</strong> {language === 'sk' ? 'z' : 'from'} {childNum.lifePathFrom}.{' '}
                      <strong>{t('rel.lifePathMission')}:</strong> {childDev.circled[2].value}.{' '}
                      <strong>{t('rel.cosmicAge')}:</strong> {childNum.age === 'aquarius' ? t('rel.cosmicAgeAquarius') : t('rel.cosmicAgePisces')}.{' '}
                      <strong>{t('rel.egoPolarity')}:</strong> {childDev.egoPolarity === 'masculine' ? t('rel.egoPolarityMasc') : childDev.egoPolarity === 'feminine' ? t('rel.egoPolarityFem') : t('rel.egoPolarityNeutral')}.
                    </p>
                    {childNum.karmicTriangles.length > 0 && (
                      <p className="text-xs text-indigo-300 mt-1">
                        <strong>{t('rel.karmicCycles')}:</strong> {childNum.karmicTriangles.map(kt => `${kt.label} (${kt.fromAge}–${kt.toAge ?? '∞'} ${language === 'sk' ? 'r.' : 'y.'}, ${language === 'sk' ? 'vibrácia' : 'vibration'} ${kt.vibration})`).join(' → ')}
                      </p>
                    )}
                    {childNum.karmicDebts.length > 0 && (
                      <p className="text-xs text-rose-300 mt-1">
                        <strong>{t('rel.karmicDebts')}:</strong> {childNum.karmicDebts.map(d => `${d.number} (${d.theme})`).join(', ')} — {language === 'sk' ? 'oblasti kde dieťa nesie hlbšiu lekciu z minulosti.' : 'areas where the child carries a deeper lesson from the past.'}
                      </p>
                    )}
                    {childNum.isolatedNumbers.length > 0 && (
                      <p className="text-xs text-amber-700 mt-1">
                        <strong>{t('rel.isolatedNumbers')}:</strong> {childNum.isolatedNumbers.join(', ')} — {language === 'sk' ? 'energie kde potrebuje vašu pozornosť a podporu.' : 'energies where they need your attention and support.'}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-slate-600 mb-1">{t('rel.parentRole')}</p>
                    <p className="text-sm text-slate-300">{result.parentRole}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">{t('rel.communication')}</p>
                    <p className="text-sm text-slate-300">{result.communicationStyle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">{t('rel.emotionalNeeds')}</p>
                    {result.emotionalNeeds.map((n, i) => (
                      <p key={i} className="text-xs text-cyan-300">• {n}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">{t('rel.childNeeds')}</p>
                    {result.childNeeds.map((n, i) => (
                      <p key={i} className="text-xs text-purple-300">• {n}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">{t('rel.recommendations')}</p>
                    {result.recommendations.map((r, i) => (
                      <p key={i} className="text-xs text-indigo-300">→ {r}</p>
                    ))}
                  </div>

                  {/* Jazyky lásky rodič↔dieťa — komunikačný štýl */}
                  {(() => {
                    const parentNum = calculateFullNumerology(parseInt(parent.day, 10), parseInt(parent.month, 10), parseInt(parent.year, 10));
                    const parentLangs = parentNum.loveLanguages;
                    const childLangs = childNum.loveLanguages;
                    if (!parentLangs?.length || !childLangs?.length) return null;
                    const parentTop = parentLangs[0].language;
                    const childTop = childLangs[0].language;
                    const same = parentTop === childTop;
                    return (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <p className="text-xs text-rose-700 font-semibold uppercase mb-1">{t('rel.loveLanguagesComStyle')}</p>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          <div>
                            <p className="text-[10px] text-slate-500">{parent.name}</p>
                            <p className="text-xs text-slate-800 font-medium">{displayName(LOVE_LANGUAGE_DISPLAY, parentTop, language)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500">{child.name}</p>
                            <p className="text-xs text-slate-800 font-medium">{displayName(LOVE_LANGUAGE_DISPLAY, childTop, language)}</p>
                          </div>
                        </div>
                        {same ? (
                          <p className="text-[11px] text-green-700">{language === 'sk' ? '✓ Rovnaký primárny jazyk — komunikácia je prirodzená. Dieťa sa cíti milované tým, čo robíte intuitívne.' : '✓ Same primary language — communication is natural. The child feels loved by what you do intuitively.'}</p>
                        ) : (
                          <p className="text-[11px] text-amber-700">{language === 'sk' ? `Rôzne jazyky: vy dávate lásku cez „${displayName(LOVE_LANGUAGE_DISPLAY, parentTop, language)}", ale dieťa ju najlepšie prijíma cez „${displayName(LOVE_LANGUAGE_DISPLAY, childTop, language)}". Skúste vedome pridať jeho jazyk.` : `Different languages: you give love through "${displayName(LOVE_LANGUAGE_DISPLAY, parentTop, language)}", but the child receives it best through "${displayName(LOVE_LANGUAGE_DISPLAY, childTop, language)}". Try to consciously add their language.`}</p>
                        )}
                      </div>
                    );
                  })()}

                  {/* HD porovnanie rodič↔dieťa */}
                  {(() => {
                    const parentCityHd = findCity(parent.birthPlace);
                    const childCityHd = findCity(child.birthPlace);
                    const parentTzHd = getTimezoneFromCoords(parentCityHd?.lat ?? 48.15, parentCityHd?.lon ?? 17.11);
                    const childTzHd = getTimezoneFromCoords(childCityHd?.lat ?? 48.15, childCityHd?.lon ?? 17.11);
                    const parentHd = calculateHumanDesign(parseInt(parent.day, 10), parseInt(parent.month, 10), parseInt(parent.year, 10), parent.hour ? parseInt(parent.hour, 10) : 12, parent.minute ? parseInt(parent.minute, 10) : 0, parentTzHd);
                    const childHd = calculateHumanDesign(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10), child.hour ? parseInt(child.hour, 10) : 12, child.minute ? parseInt(child.minute, 10) : 0, childTzHd);
                    const sharedDefined = parentHd.definedCenters.filter(c => childHd.definedCenters.includes(c));
                    const parentOnly = parentHd.definedCenters.filter(c => !childHd.definedCenters.includes(c));
                    const childOnly = childHd.definedCenters.filter(c => !parentHd.definedCenters.includes(c));
                    const parentSunGate = parentHd.personalityGates.find(g => g.planet === 'Slnko')?.gate;
                    const childSunGate = childHd.personalityGates.find(g => g.planet === 'Slnko')?.gate;
                    const parentGates = new Set([...parentHd.personalityGates.map(g => g.gate), ...parentHd.designGates.map(g => g.gate)]);
                    const childGates = new Set([...childHd.personalityGates.map(g => g.gate), ...childHd.designGates.map(g => g.gate)]);
                    const sharedGates = [...parentGates].filter(g => childGates.has(g));
                    const sharedGeneKeys = sharedGates.slice(0, 3).map(g => getGeneKeyByGate(g, language)).filter(Boolean);
                    return (
                      <>
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <p className="text-xs text-cyan-300 font-semibold uppercase mb-1">{t('rel.hdEnergyOverlap')}</p>
                        <p className="text-[11px] text-slate-300 mb-2">
                          <strong>{t('rel.parent')}:</strong> {displayName(HD_TYPE_DISPLAY, parentHd.type, language)} ({displayName(HD_AUTHORITY_DISPLAY, parentHd.authority, language)}) · <strong>{t('rel.child')}:</strong> {displayName(HD_TYPE_DISPLAY, childHd.type, language)} ({displayName(HD_AUTHORITY_DISPLAY, childHd.authority, language)})
                        </p>
                        {sharedDefined.length > 0 && (
                          <p className="text-[11px] text-slate-600">
                            <strong className="text-cyan-300">{t('rel.sharedDefined')}:</strong> {sharedDefined.map(c => displayName(HD_CENTER_DISPLAY, c, language)).join(', ')} — {language === 'sk' ? 'tu si rozumiete energeticky, obe máte stabilnú energiu.' : 'you understand each other energetically here, both have stable energy.'}
                          </p>
                        )}
                        {parentOnly.length > 0 && (
                          <p className="text-[11px] text-slate-600 mt-1">
                            <strong className="text-rose-300">{t('rel.parentConditions')}:</strong> {parentOnly.map(c => displayName(HD_CENTER_DISPLAY, c, language)).join(', ')} — {language === 'sk' ? 'dieťa absorbuje vašu energiu v týchto oblastiach.' : 'the child absorbs your energy in these areas.'}
                          </p>
                        )}
                        {childOnly.length > 0 && (
                          <p className="text-[11px] text-slate-600 mt-1">
                            <strong className="text-emerald-300">{t('rel.childTeaches')}:</strong> {childOnly.map(c => displayName(HD_CENTER_DISPLAY, c, language)).join(', ')} — {language === 'sk' ? 'tu má dieťa energiu ktorú vy nemáte.' : 'the child has energy here that you don\'t have.'}
                          </p>
                        )}
                        {parentHd.type !== childHd.type && (
                          <p className="text-[11px] text-amber-300 mt-1">
                            {language === 'sk' ? `Rôzne typy (${displayName(HD_TYPE_DISPLAY, parentHd.type, language)} vs ${displayName(HD_TYPE_DISPLAY, childHd.type, language)}) — rešpektujte odlišnú stratégiu dieťaťa: „${displayName(HD_STRATEGY_DISPLAY, childHd.strategy, language).toLowerCase()}".` : `Different types (${displayName(HD_TYPE_DISPLAY, parentHd.type, language)} vs ${displayName(HD_TYPE_DISPLAY, childHd.type, language)}) — respect the child's different strategy: "${displayName(HD_STRATEGY_DISPLAY, childHd.strategy, language).toLowerCase()}".`}
                          </p>
                        )}
                      </div>
                      {sharedGeneKeys.length > 0 && (
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-3">
                          <p className="text-xs text-purple-300 font-semibold uppercase">{t('rel.sharedGeneKeys')}</p>
                          <p className="text-[11px] text-slate-600">
                            {language === 'sk' ? 'Brány aktívne u rodiča aj dieťaťa — spoločné témy, na ktorých rastete. Tieň je to čo sa vo vzťahu spúšťa, dar je to čo z toho vytvárate.' : 'Gates active in both parent and child — shared themes you grow on. Shadow is what triggers in the relationship, gift is what you create from it.'}
                          </p>
                          {sharedGeneKeys.map(gk => (
                            <div key={gk!.gate} className="p-2.5 rounded-lg bg-white/5 border border-purple-500/10 space-y-1.5">
                              <p className="text-xs font-medium text-slate-800">
                                {language === 'sk' ? 'Brána' : 'Gate'} {gk!.gate}: <span className="text-rose-300">{gk!.shadow}</span> → <span className="text-amber-300">{gk!.gift}</span> → <span className="text-emerald-300">{gk!.siddhi}</span>
                              </p>
                              <p className="text-[11px] text-rose-300"><strong>{language === 'sk' ? 'Tieň' : 'Shadow'}:</strong> {gk!.shadowDescription}</p>
                              <p className="text-[11px] text-amber-300"><strong>{language === 'sk' ? 'Dar' : 'Gift'}:</strong> {gk!.giftDescription}</p>
                              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mt-1">
                                <p className="text-[10px] text-emerald-400 uppercase mb-0.5">{language === 'sk' ? 'Čo s tým prakticky' : 'What to do practically'}</p>
                                <p className="text-[11px] text-slate-300">
                                  {language === 'sk' ? `Keď vidíte vo vzťahu tieň (` : `When you see shadow in the relationship (`}<em>{gk!.shadow.toLowerCase()}</em>{language === 'sk' ? `) — nie je to chyba dieťaťa ani vaša. Je to signál. Vedomá voľba: prejdite spolu k daru (` : `) — it's not the child's fault or yours. It's a signal. Conscious choice: move together towards the gift (`}<em>{gk!.gift.toLowerCase()}</em>).
                                  {gk!.nlpTechnique && <> <strong>{language === 'sk' ? 'Technika:' : 'Technique:'}</strong> {gk!.nlpTechnique} — {gk!.nlpDescription}</>}
                                </p>
                              </div>
                            </div>
                          ))}
                          {parentSunGate === childSunGate && parentSunGate && (
                            <p className="text-[11px] text-amber-300">{language === 'sk' ? `Rovnaká Slnečná brána (${parentSunGate}) — hlboké zrkadlenie životnej témy. Rodič a dieťa zdieľajú rovnakú karmickú lekciu.` : `Same Sun gate (${parentSunGate}) — deep mirroring of life theme. Parent and child share the same karmic lesson.`}</p>
                          )}
                          {sharedGeneKeys.length > 1 && (
                            <p className="text-[11px] text-slate-500 italic">
                              {language === 'sk' ? 'Spoločný príbeh: Rodič prináša skúsenosť a dieťa čerstvý pohľad na rovnaké témy. Keď obaja vedome pracujete na transformácii, vzťah sa stáva priestorom rastu pre oboch.' : 'Shared story: Parent brings experience and the child a fresh perspective on the same themes. When both consciously work on transformation, the relationship becomes a space of growth for both.'}
                            </p>
                          )}
                        </div>
                      )}
                      </>
                    );
                  })()}
                </div>
              </GlassCard>
            </motion.div>
            );
          })}

          {familyResults.length > 1 && (
            <GlassCard>
              <h3 className="font-medium text-slate-900 mb-3">{t('rel.siblingInteractions')}</h3>
              {familyResults.map(({ child: c1 }, i) =>
                familyResults.slice(i + 1).map(({ child: c2 }, j) => {
                  const n1 = calculateFullNumerology(parseInt(c1.day, 10), parseInt(c1.month, 10), parseInt(c1.year, 10));
                  const n2 = calculateFullNumerology(parseInt(c2.day, 10), parseInt(c2.month, 10), parseInt(c2.year, 10));
                  const compat = calculatePartnerCompatibility(n1, n2, language);
                  const c1City = findCity(c1.birthPlace);
                  const c2City = findCity(c2.birthPlace);
                  const c1Tz = getTimezoneFromCoords(c1City?.lat ?? 48.15, c1City?.lon ?? 17.11);
                  const c2Tz = getTimezoneFromCoords(c2City?.lat ?? 48.15, c2City?.lon ?? 17.11);
                  const hd1 = calculateHumanDesign(parseInt(c1.day, 10), parseInt(c1.month, 10), parseInt(c1.year, 10), c1.hour ? parseInt(c1.hour, 10) : 12, c1.minute ? parseInt(c1.minute, 10) : 0, c1Tz);
                  const hd2 = calculateHumanDesign(parseInt(c2.day, 10), parseInt(c2.month, 10), parseInt(c2.year, 10), c2.hour ? parseInt(c2.hour, 10) : 12, c2.minute ? parseInt(c2.minute, 10) : 0, c2Tz);
                  const g1 = new Set([...hd1.personalityGates.map(g => g.gate), ...hd1.designGates.map(g => g.gate)]);
                  const g2 = new Set([...hd2.personalityGates.map(g => g.gate), ...hd2.designGates.map(g => g.gate)]);
                  const childGK = [...g1].filter(g => g2.has(g)).slice(0, 3).map(g => getGeneKeyByGate(g, language)).filter(Boolean);
                  return (
                    <div key={`${i}-${j}`} className="p-3 rounded-xl glass-light mb-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{c1.name} & {c2.name}</span>
                        <span className="text-sm font-bold text-indigo-300">{compat.overallScore}%</span>
                      </div>
                      <p className="text-xs text-slate-600">{compat.lifePathCompatibility.description}</p>
                      {compat.strengths.length > 0 && <p className="text-xs text-green-300">+ {compat.strengths[0]}</p>}
                      {compat.challenges.length > 0 && <p className="text-xs text-amber-700">! {compat.challenges[0]}</p>}
                      {childGK.length > 0 && (
                        <div className="space-y-1.5 mt-1">
                          <p className="text-[11px] text-purple-300 font-semibold">{t('rel.sharedGKLabel')}:</p>
                          {childGK.map(gk => (
                            <div key={gk!.gate} className="pl-2 border-l-2 border-purple-500/30 space-y-0.5">
                              <p className="text-[11px] text-white">{language === 'sk' ? 'Brána' : 'Gate'} {gk!.gate}: <span className="text-rose-300">{gk!.shadow}</span> → <span className="text-amber-300">{gk!.gift}</span> → <span className="text-emerald-300">{gk!.siddhi}</span></p>
                              <p className="text-[10px] text-slate-400">{gk!.shadowDescription}</p>
                              <p className="text-[10px] text-amber-300">{t('rel.gkGift')}: {gk!.giftDescription}</p>
                              {gk!.nlpTechnique && <p className="text-[10px] text-indigo-300">{language === 'sk' ? 'Prakticky' : 'Practically'}: {gk!.nlpTechnique} — {gk!.nlpDescription}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </GlassCard>
          )}

          <div className="flex justify-end">
            <button onClick={() => setEditing(true)} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1 shadow-sm">
              <span>✎</span> {t('rel.editData')}
            </button>
          </div>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">{t('common.newCalculation')}</button>
        </div>
      )}

      {/* ASTRO KOMPATIBILITA MÓD */}
      {mode === 'astro' && (!synastryResult || editing) && (
        <GlassCard>
          {!synastryResult && (
            <p className="text-sm text-slate-600 mb-4">
              <strong className="text-slate-900">{t('rel.modeAstro')}</strong> {t('rel.astroModeDesc').slice(t('rel.modeAstro').length + 1)}
            </p>
          )}
        </GlassCard>
      )}
      {mode === 'astro' && (!synastryResult || editing) && (
        <GlassCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 font-medium">{t('rel.partner1')}</p>
                <ClientPickerButton onPick={setAstroPartner1} />
              </div>
              <input
                type="text"
                placeholder={t('profile.name')}
                value={astroPartner1.name}
                onChange={e => setAstroPartner1({ ...astroPartner1, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
              />
              <div className="flex gap-2">
                <input type="number" placeholder={t('profile.day')} min={1} max={31} value={astroPartner1.day} onChange={e => setAstroPartner1({ ...astroPartner1, day: e.target.value })} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder={t('profile.month')} min={1} max={12} value={astroPartner1.month} onChange={e => setAstroPartner1({ ...astroPartner1, month: e.target.value })} className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder={t('profile.year')} min={1900} max={2100} value={astroPartner1.year} onChange={e => setAstroPartner1({ ...astroPartner1, year: e.target.value })} className="flex-1 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder={t('profile.hour')} min={0} max={23} value={astroPartner1.hour} onChange={e => setAstroPartner1({ ...astroPartner1, hour: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center text-sm focus:outline-none focus:border-indigo-500/50" />
                <span className="text-slate-400">:</span>
                <input type="number" placeholder={t('profile.minute')} min={0} max={59} value={astroPartner1.minute} onChange={e => setAstroPartner1({ ...astroPartner1, minute: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center text-sm focus:outline-none focus:border-indigo-500/50" />
                <span className="text-[10px] text-slate-500">{t('rel.time24h')}</span>
              </div>
              <input type="text" placeholder={t('profile.birthPlace')} value={astroPartner1.birthPlace} onChange={e => setAstroPartner1({ ...astroPartner1, birthPlace: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 font-medium">{t('rel.partner2')}</p>
                <ClientPickerButton onPick={setAstroPartner2} />
              </div>
              <input
                type="text"
                placeholder={t('profile.name')}
                value={astroPartner2.name}
                onChange={e => setAstroPartner2({ ...astroPartner2, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
              />
              <div className="flex gap-2">
                <input type="number" placeholder={t('profile.day')} min={1} max={31} value={astroPartner2.day} onChange={e => setAstroPartner2({ ...astroPartner2, day: e.target.value })} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder={t('profile.month')} min={1} max={12} value={astroPartner2.month} onChange={e => setAstroPartner2({ ...astroPartner2, month: e.target.value })} className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder={t('profile.year')} min={1900} max={2100} value={astroPartner2.year} onChange={e => setAstroPartner2({ ...astroPartner2, year: e.target.value })} className="flex-1 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder={t('profile.hour')} min={0} max={23} value={astroPartner2.hour} onChange={e => setAstroPartner2({ ...astroPartner2, hour: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center text-sm focus:outline-none focus:border-indigo-500/50" />
                <span className="text-slate-400">:</span>
                <input type="number" placeholder={t('profile.minute')} min={0} max={59} value={astroPartner2.minute} onChange={e => setAstroPartner2({ ...astroPartner2, minute: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center text-sm focus:outline-none focus:border-indigo-500/50" />
                <span className="text-[10px] text-slate-500">{t('rel.time24h')}</span>
              </div>
              <input type="text" placeholder={t('profile.birthPlace')} value={astroPartner2.birthPlace} onChange={e => setAstroPartner2({ ...astroPartner2, birthPlace: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { handleAstroCalc(); setEditing(false); }}
              disabled={!isAstroPersonValid(astroPartner1) || !isAstroPersonValid(astroPartner2)}
              className="flex-1 py-3.5 rounded-2xl font-semibold tracking-wide enabled:bg-gradient-to-r enabled:from-indigo-600 enabled:via-violet-600 enabled:to-purple-600 enabled:text-white enabled:shadow-lg enabled:shadow-indigo-500/30 enabled:hover:shadow-xl enabled:hover:shadow-indigo-500/40 enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 enabled:active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-800 disabled:cursor-not-allowed transition-all duration-200 ease-out"
            >
              {synastryResult ? t('rel.recalculate') : t('rel.calculateAstro')}
            </button>
            {editing && (
              <button onClick={() => setEditing(false)} className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200">{t('common.cancel')}</button>
            )}
          </div>
        </GlassCard>
      )}

      {mode === 'astro' && synastryResult && !editing && (
        <div className="space-y-6">
          {/* Tvoje čítanie */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">{t('rel.astroReadingTitle')}</h3>
            <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong className="text-slate-900">{synastryResult.person1.name} & {synastryResult.person2.name}</strong> — {language === 'sk' ? 'celková astro kompatibilita' : 'overall astro compatibility'} <strong className="text-slate-900">{synastryResult.overallScore}%</strong>.
                  {language === 'sk' ? 'Porovnávame elementy planét — nie znamenia samotné. Komplementárne elementy (Oheň+Vzduch, Zem+Voda) sa dopĺňajú.' : 'We compare planetary elements — not signs themselves. Complementary elements (Fire+Air, Earth+Water) support each other.'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <p className="text-amber-300 font-medium">{language === 'sk' ? 'Slnko' : 'Sun'} ({synastryResult.sunCompatibility.score}%)</p>
                    <p className="text-slate-400">{language === 'sk' ? 'Vedomé ja — ako si rozumiete na povrchu' : 'Conscious self — how you understand each other on the surface'}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <p className="text-purple-300 font-medium">{language === 'sk' ? 'Mesiac' : 'Moon'} ({synastryResult.moonCompatibility.score}%)</p>
                    <p className="text-slate-400">{language === 'sk' ? 'Emócie — ako sa cítite spolu v súkromí' : 'Emotions — how you feel together in private'}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <p className="text-rose-300 font-medium">{language === 'sk' ? 'Venuša' : 'Venus'} ({synastryResult.venusCompatibility.score}%)</p>
                    <p className="text-slate-400">{language === 'sk' ? 'Láska — ako dávate a prijímáte náklonnosť' : 'Love — how you give and receive affection'}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <p className="text-red-300 font-medium">Mars ({synastryResult.marsCompatibility.score}%)</p>
                    <p className="text-slate-400">{language === 'sk' ? 'Energia — ako konáte a riešite konflikty' : 'Energy — how you act and resolve conflicts'}</p>
                  </div>
                </div>
                <p>
                  {language === 'sk'
                    ? <><strong>Synastrické aspekty</strong> ukazujú presné uhly medzi planétami — harmonické (podpora) vs napäťové (rast). <strong>Davison chart</strong> je „tretia osoba" — vzťah ako bytosť. <strong>Composite</strong> je symbolická štruktúra vzťahu.</>
                    : <><strong>Synastry aspects</strong> show precise angles between planets — harmonious (support) vs tense (growth). <strong>Davison chart</strong> is the "third person" — the relationship as a being. <strong>Composite</strong> is the symbolic structure of the relationship.</>
                  }
                </p>
                <p className="italic text-slate-500">{language === 'sk' ? 'Nízke skóre neznamená „nevhodný pár" — znamená „vyžaduje vedomú prácu". Najlepšie vzťahy často nie sú najľahšie.' : 'A low score does not mean "incompatible couple" — it means "requires conscious effort". The best relationships are often not the easiest.'}</p>
            </div>
          </GlassCard>

          <GlassCard glow>
            <div className="text-center">
              <p className="text-sm text-slate-600">{synastryResult.person1.name} & {synastryResult.person2.name}</p>
              <div className="relative w-32 h-32 mx-auto my-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="45" fill="none" stroke="url(#astroGrad)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${synastryResult.overallScore * 2.83} ${283 - synastryResult.overallScore * 2.83}`}
                    initial={{ strokeDasharray: '0 283' }}
                    animate={{ strokeDasharray: `${synastryResult.overallScore * 2.83} ${283 - synastryResult.overallScore * 2.83}` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs><linearGradient id="astroGrad"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-serif font-bold text-slate-900">{synastryResult.overallScore}%</span>
                </div>
              </div>
              <p className="text-sm text-slate-600">{t('rel.overallAstroCompatibility')}</p>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-slate-400">{t('rel.sunIdentity')}</h4>
                <span className="text-lg font-bold text-amber-300">{synastryResult.sunCompatibility.score}%</span>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                {synastryResult.person1.name}: {synastryResult.person1.result.sunSign.symbol} {synastryResult.person1.result.sunSign.name} ({synastryResult.person1.result.sunSign.element})
              </p>
              <p className="text-xs text-slate-600 mb-2">
                {synastryResult.person2.name}: {synastryResult.person2.result.sunSign.symbol} {synastryResult.person2.result.sunSign.name} ({synastryResult.person2.result.sunSign.element})
              </p>
              <p className="text-sm text-slate-300">{synastryResult.sunCompatibility.description}</p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-slate-400">{t('rel.moonEmotions')}</h4>
                <span className="text-lg font-bold text-blue-300">{synastryResult.moonCompatibility.score}%</span>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                {synastryResult.person1.name}: {synastryResult.person1.result.moonSign.symbol} {synastryResult.person1.result.moonSign.name} ({synastryResult.person1.result.moonSign.element})
              </p>
              <p className="text-xs text-slate-600 mb-2">
                {synastryResult.person2.name}: {synastryResult.person2.result.moonSign.symbol} {synastryResult.person2.result.moonSign.name} ({synastryResult.person2.result.moonSign.element})
              </p>
              <p className="text-sm text-slate-300">{synastryResult.moonCompatibility.description}</p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-slate-400">{t('rel.venusLove')}</h4>
                <span className="text-lg font-bold text-pink-300">{synastryResult.venusCompatibility.score}%</span>
              </div>
              {(() => {
                const v1 = getPlanetByName(synastryResult.person1.result, 'Venuša');
                const v2 = getPlanetByName(synastryResult.person2.result, 'Venuša');
                return (
                  <>
                    {v1 && <p className="text-xs text-slate-600 mb-2">{synastryResult.person1.name}: {v1.sign.symbol} {v1.sign.name} ({v1.sign.element})</p>}
                    {v2 && <p className="text-xs text-slate-600 mb-2">{synastryResult.person2.name}: {v2.sign.symbol} {v2.sign.name} ({v2.sign.element})</p>}
                  </>
                );
              })()}
              <p className="text-sm text-slate-300">{synastryResult.venusCompatibility.description}</p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-slate-400">{t('rel.marsEnergy')}</h4>
                <span className="text-lg font-bold text-red-300">{synastryResult.marsCompatibility.score}%</span>
              </div>
              {(() => {
                const m1 = getPlanetByName(synastryResult.person1.result, 'Mars');
                const m2 = getPlanetByName(synastryResult.person2.result, 'Mars');
                return (
                  <>
                    {m1 && <p className="text-xs text-slate-600 mb-2">{synastryResult.person1.name}: {m1.sign.symbol} {m1.sign.name} ({m1.sign.element})</p>}
                    {m2 && <p className="text-xs text-slate-600 mb-2">{synastryResult.person2.name}: {m2.sign.symbol} {m2.sign.name} ({m2.sign.element})</p>}
                  </>
                );
              })()}
              <p className="text-sm text-slate-300">{synastryResult.marsCompatibility.description}</p>
            </GlassCard>
          </div>

          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">{t('rel.elementalBalance')}</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 p-3 rounded-xl bg-slate-800/50">
                <p className="text-xs text-slate-600">{synastryResult.person1.name}</p>
                <p className="text-sm font-medium text-slate-800">{t('rel.dominantElement')}: {displayName(ELEMENT_DISPLAY, synastryResult.elementBalance.person1, language)}</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-slate-800/50">
                <p className="text-xs text-slate-600">{synastryResult.person2.name}</p>
                <p className="text-sm font-medium text-slate-800">{t('rel.dominantElement')}: {displayName(ELEMENT_DISPLAY, synastryResult.elementBalance.person2, language)}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              {synastryResult.elementBalance.compatible
                ? t('rel.elementsCompatible')
                : t('rel.elementsIncompatible')}
            </p>
          </GlassCard>

          {/* Detailné aspekty medzi všetkými planétami */}
          {(() => {
            const aspects = calculateSynastryAspects(synastryResult.person1.result, synastryResult.person2.result);
            const summary = summarizeSynastry(aspects);
            if (aspects.length === 0) return null;
            const planetSymbols: Record<string, string> = {
              'Slnko': '☉', 'Mesiac': '☽', 'Merkúr': '☿', 'Venuša': '♀', 'Mars': '♂',
              'Jupiter': '♃', 'Saturn': '♄', 'Urán': '♅', 'Neptún': '♆', 'Pluto': '♇',
            };
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-2">{t('rel.synastryAspects')}</h3>
                <p className="text-xs text-slate-500 mb-3">
                  {language === 'sk'
                    ? 'Každý uhol medzi planétami partnerov tvorí aspekt – buď harmonický (trigon, sextil), napäťový (kvadratúra, opozícia) alebo neutrálny (spojenie). Orbis = odchýlka od ideálu.'
                    : 'Each angle between partners\' planets forms an aspect — either harmonic (trine, sextile), tense (square, opposition), or neutral (conjunction). Orb = deviation from the ideal angle.'}
                </p>

                {/* Súhrnný score */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-center">
                    <p className="text-[10px] uppercase text-indigo-700 font-semibold">{t('rel.score')}</p>
                    <p className="text-2xl font-bold text-indigo-700">{summary.score}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-50 border border-green-200 text-center">
                    <p className="text-[10px] uppercase text-green-700 font-semibold">{t('rel.harmonic')}</p>
                    <p className="text-2xl font-bold text-green-700">{summary.harmonic}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-center">
                    <p className="text-[10px] uppercase text-rose-700 font-semibold">{t('rel.tense')}</p>
                    <p className="text-2xl font-bold text-rose-700">{summary.tense}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[10px] uppercase text-slate-700 font-semibold">{t('rel.neutral')}</p>
                    <p className="text-2xl font-bold text-slate-700">{summary.neutral}</p>
                  </div>
                </div>

                {/* Top 12 najpresnejších */}
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2">
                    {t('rel.topAspects')} ({summary.total} celkom)
                  </p>
                  {summary.topAspects.map((a: SynastryAspect, i: number) => {
                    const bg = a.nature === 'harmonic' ? 'bg-green-50 border-green-200' :
                               a.nature === 'tense' ? 'bg-rose-50 border-rose-200' :
                               'bg-slate-50 border-slate-200';
                    const iconColor = a.nature === 'harmonic' ? 'text-green-700' :
                                      a.nature === 'tense' ? 'text-rose-700' : 'text-slate-700';
                    const meaning = getAspectMeaning(a.planet1, a.planet2, a.nature, language);
                    return (
                      <div key={i} className={`p-2 rounded-lg border ${bg}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-base">{planetSymbols[a.planet1] || ''}</span>
                            <strong className="text-slate-800">{a.planet1}</strong>
                            <span className={`text-base ${iconColor}`}>{a.symbol}</span>
                            <strong className="text-slate-800">{a.planet2}</strong>
                            <span className="text-base">{planetSymbols[a.planet2] || ''}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0">orb {a.orb.toFixed(1)}°</span>
                        </div>
                        {meaning && <p className="text-[11px] text-slate-600 mt-1">{meaning}</p>}
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-slate-500 italic mt-3">
                  {t('rel.synastryScoreNote')}
                </p>
              </GlassCard>
            );
          })()}

          {/* Davison + Composite charts (B18, B19) */}
          {(() => {
            const r1 = synastryResult.person1.result;
            const r2 = synastryResult.person2.result;
            const city1 = findCity(astroPartner1.birthPlace);
            const city2 = findCity(astroPartner2.birthPlace);
            const lat1 = city1?.lat ?? 48.15;
            const lon1 = city1?.lon ?? 17.11;
            const lat2 = city2?.lat ?? 48.15;
            const lon2 = city2?.lon ?? 17.11;
            const davison = calculateDavison(
              parseInt(astroPartner1.day, 10), parseInt(astroPartner1.month, 10), parseInt(astroPartner1.year, 10),
              astroPartner1.hour ? parseInt(astroPartner1.hour, 10) : 12,
              astroPartner1.minute ? parseInt(astroPartner1.minute, 10) : 0,
              lat1, lon1,
              parseInt(astroPartner2.day, 10), parseInt(astroPartner2.month, 10), parseInt(astroPartner2.year, 10),
              astroPartner2.hour ? parseInt(astroPartner2.hour, 10) : 12,
              astroPartner2.minute ? parseInt(astroPartner2.minute, 10) : 0,
              lat2, lon2
            );
            const composite = calculateComposite(r1, r2);
            return (
              <>
                <GlassCard>
                  <h3 className="font-medium text-slate-900 mb-1">{t('rel.davisonChart')}</h3>
                  <p className="text-xs text-slate-600 mb-3">
                    {language === 'sk'
                      ? <>Reálny astrologický graf pre <strong>stredný čas a stredné miesto</strong> oboch narodení. Symbolizuje "tretiu osobu" — samotný vzťah ako bytosť. Ascendent {davison.ascendant.symbol} {displayName(ZODIAC_DISPLAY, davison.ascendant.name, language)}.</>
                      : <>Real astrological chart for the <strong>midpoint time and place</strong> of both births. Symbolizes the "third person" — the relationship itself as an entity. Ascendant {davison.ascendant.symbol} {displayName(ZODIAC_DISPLAY, davison.ascendant.name, language)}.</>}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(() => {
                      const sun = davison.planets.find(p => p.name === 'Slnko');
                      const moon = davison.planets.find(p => p.name === 'Mesiac');
                      const venus = davison.planets.find(p => p.name === 'Venuša');
                      return (
                        <>
                          {sun && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                              <p className="text-xs text-amber-700 uppercase">{t('rel.sunOfRelationship')}</p>
                              <p className="text-sm text-white mt-1">{sun.symbol} {sun.sign.symbol} {displayName(ZODIAC_DISPLAY, sun.sign.name, language)}</p>
                              <p className="text-[10px] text-slate-400">{sun.degree.toFixed(1)}° · {davison.planetHouses[sun.name] ? `${davison.planetHouses[sun.name]}. ${language === 'sk' ? 'dom' : 'house'}` : ''}</p>
                            </div>
                          )}
                          {moon && (
                            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                              <p className="text-xs text-indigo-300 uppercase">{t('rel.moonOfRelationship')}</p>
                              <p className="text-sm text-white mt-1">{moon.symbol} {moon.sign.symbol} {displayName(ZODIAC_DISPLAY, moon.sign.name, language)}</p>
                              <p className="text-[10px] text-slate-400">{moon.degree.toFixed(1)}° · {davison.planetHouses[moon.name] ? `${davison.planetHouses[moon.name]}. ${language === 'sk' ? 'dom' : 'house'}` : ''}</p>
                            </div>
                          )}
                          {venus && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                              <p className="text-xs text-rose-300 uppercase">{t('rel.venusOfRelationship')}</p>
                              <p className="text-sm text-white mt-1">{venus.symbol} {venus.sign.symbol} {displayName(ZODIAC_DISPLAY, venus.sign.name, language)}</p>
                              <p className="text-[10px] text-slate-400">{venus.degree.toFixed(1)}° · {davison.planetHouses[venus.name] ? `${davison.planetHouses[venus.name]}. ${language === 'sk' ? 'dom' : 'house'}` : ''}</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-3">
                    {language === 'sk'
                      ? 'Davison berie do úvahy presný čas a miesto — preto je užitočný pri presných narodeninových údajoch oboch partnerov.'
                      : 'Davison takes into account exact time and place — therefore it is useful when precise birth data of both partners is available.'}
                  </p>
                </GlassCard>

                <GlassCard>
                  <h3 className="font-medium text-slate-900 mb-1">{t('rel.compositeChart')}</h3>
                  <p className="text-xs text-slate-600 mb-3">
                    {language === 'sk'
                      ? <>Pre každú planétu sa zoberie <strong>midpoint</strong> longitúd oboch partnerov (kratší oblúk). Composite NIE JE skutočný horoskop — je to symbolická štruktúra vzťahu samotného.</>
                      : <>For each planet, the <strong>midpoint</strong> of both partners' longitudes is taken (shorter arc). Composite is NOT a real horoscope — it is a symbolic structure of the relationship itself.</>}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {composite.planets.map(p => (
                      <div key={p.name} className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                        <p className="text-xs text-violet-700">{p.symbol} {p.name}</p>
                        <p className="text-sm text-white">{p.signSymbol} {p.signName}</p>
                        <p className="text-[10px] text-slate-400">{p.degree.toFixed(1)}°</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-3">
                    {language === 'sk'
                      ? 'Composite Slnko = ako vzťah žiari navonok; Composite Mesiac = vnútorný emocionálny tón vzťahu; Composite Venuša = láska ktorá medzi vami plynie.'
                      : 'Composite Sun = how the relationship shines outward; Composite Moon = internal emotional tone of the relationship; Composite Venus = the love flowing between you.'}
                  </p>
                </GlassCard>
              </>
            );
          })()}

          <div className="flex justify-end">
            <button onClick={() => setEditing(true)} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1 shadow-sm">
              <span>✎</span> {t('rel.editData')}
            </button>
          </div>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">{t('common.newCalculation')}</button>
        </div>
      )}

      {/* RODINNÁ KONŠTELÁCIA — formulár */}
      {mode === 'constellation' && (!constellationResult || editing) && (
        <div className="space-y-4">
          <GlassCard>
            <p className="text-sm text-slate-600 mb-4">
              <strong className="text-slate-900">{t('rel.modeConstellation')}</strong> — {t('rel.constellationModeDesc').split(' — ')[1]}
            </p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-700 font-medium">{t('rel.father')}</span>
              <ClientPickerButton onPick={setConstFather} />
            </div>
            <PersonForm person={constFather} onChange={setConstFather} label="" />
          </GlassCard>
          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-700 font-medium">{t('rel.mother')}</span>
              <ClientPickerButton onPick={setConstMother} />
            </div>
            <PersonForm person={constMother} onChange={setConstMother} label="" />
          </GlassCard>

          {constChildren.map((child, idx) => (
            <GlassCard key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">{t('rel.child')} {idx + 1}</span>
                <div className="flex items-center gap-2">
                  <ClientPickerButton onPick={(p) => { const next = [...constChildren]; next[idx] = p; setConstChildren(next); }} includeProfile={false} />
                  {constChildren.length > 1 && (
                    <button onClick={() => setConstChildren(constChildren.filter((_, i) => i !== idx))} className="text-xs text-red-600 hover:text-red-800 font-medium">{t('rel.removeChild')}</button>
                  )}
                </div>
              </div>
              <PersonForm person={child} onChange={(p) => { const next = [...constChildren]; next[idx] = p; setConstChildren(next); }} label="" />
            </GlassCard>
          ))}

          <button
            type="button"
            onClick={() => setConstChildren([...constChildren, emptyPerson()])}
            className="group w-full py-3.5 rounded-2xl border-2 border-dashed border-indigo-400/70 text-sm font-bold bg-gradient-to-br from-indigo-50 to-violet-50/60 text-indigo-700 hover:border-indigo-500 hover:from-indigo-100 hover:to-violet-100 hover:shadow-md hover:shadow-indigo-500/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 ease-out flex items-center justify-center gap-2"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-base font-bold leading-none transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110">+</span>
            <span className="text-indigo-800">{t('rel.addChild')}</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => { handleConstellationCalc(); setEditing(false); }}
              disabled={!isPersonValid(constFather) || !isPersonValid(constMother) || !constChildren.some(isPersonValid)}
              className="flex-1 py-3.5 rounded-2xl font-semibold tracking-wide enabled:bg-gradient-to-r enabled:from-indigo-600 enabled:via-violet-600 enabled:to-purple-600 enabled:text-white enabled:shadow-lg enabled:shadow-indigo-500/30 enabled:hover:shadow-xl enabled:hover:shadow-indigo-500/40 enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 enabled:active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-800 disabled:cursor-not-allowed transition-all duration-200 ease-out"
            >
              {constellationResult ? t('rel.recalculate') : t('rel.calculateConstellation')}
            </button>
            {editing && (
              <button onClick={() => setEditing(false)} className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200">{t('common.cancel')}</button>
            )}
          </div>
        </div>
      )}

      {/* RODINNÁ KONŠTELÁCIA — výsledky */}
      {mode === 'constellation' && constellationResult && !editing && (
        <div className="space-y-6">
          {/* Tvoje čítanie */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">{t('rel.constReadingTitle')}</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                {language === 'sk'
                  ? <>Rodina <strong className="text-slate-900">{constFather.name} & {constMother.name}</strong> + <strong className="text-slate-900">{constChildren.filter(isPersonValid).length}</strong> {constChildren.filter(isPersonValid).length === 1 ? 'dieťa' : 'deti'}. Partnerský vzťah rodičov (<strong className="text-slate-900">{constellationResult.partnerCompat.overallScore}%</strong>) je základ — jeho kvalita sa odráža na celej rodine.</>
                  : <>Family <strong className="text-slate-900">{constFather.name} & {constMother.name}</strong> + <strong className="text-slate-900">{constChildren.filter(isPersonValid).length}</strong> {constChildren.filter(isPersonValid).length === 1 ? 'child' : 'children'}. Partner relationship (<strong className="text-slate-900">{constellationResult.partnerCompat.overallScore}%</strong>) is the foundation — its quality reflects on the whole family.</>}
              </p>
              <p>
                {language === 'sk'
                  ? <><strong>Charakterová synastria</strong> porovnáva mriežky rodičov, <strong>vývojová</strong> ich K1-K4 a polaritu ega. <strong>HD bodygraph</strong> ukazuje elektromagnetické kanály (príťažlivosť), kompromisné (spoločná energia) a podmieňovanie.</>
                  : <><strong>Character synastry</strong> compares the parents&apos; grids, <strong>developmental</strong> their K1-K4 and ego polarity. <strong>HD bodygraph</strong> shows electromagnetic channels (attraction), compromise channels (shared energy) and conditioning.</>
                }
              </p>
              <p>
                {language === 'sk'
                  ? <>Pri každom dieťati: <strong>ŽČ + K3</strong> (poslanie), <strong>kozmický vek</strong> (generačné nastavenie), <strong>HD typ + centrá</strong> (kde rodič podmieňuje, kde dieťa učí), <strong>Génové kľúče</strong> (spoločné transformačné témy s praktickou technikou).</>
                  : <>For each child: <strong>Life path + K3</strong> (purpose), <strong>cosmic age</strong> (generational setting), <strong>HD type + centers</strong> (where parent conditions, where child teaches), <strong>Gene Keys</strong> (shared transformative themes with practical technique).</>
                }
              </p>
              <p>
                {language === 'sk'
                  ? <><strong>Medzi súrodencami:</strong> kompatibilita, HD centrá (kto koho podmieňuje), Gene Keys (spoločné lekcie). Rodinné číslo <strong className="text-slate-900">{reduceToSingle(constellationResult.familyNumbers.reduce((a, b) => a + b, 0))}</strong> je spoločná téma celej rodiny.</>
                  : <><strong>Between siblings:</strong> compatibility, HD centers (who conditions whom), Gene Keys (shared lessons). Family number <strong className="text-slate-900">{reduceToSingle(constellationResult.familyNumbers.reduce((a, b) => a + b, 0))}</strong> is the common theme of the whole family.</>
                }
              </p>
              <p className="text-xs text-slate-500 italic">
                {language === 'sk'
                  ? 'Nízka kompatibilita nie je problém — je to signál učenia. Najväčší rast je tam, kde je najväčšie trenie.'
                  : 'Low compatibility is not a problem — it is a signal for learning. The greatest growth happens where the greatest friction is.'}
              </p>
            </div>
          </GlassCard>

          {/* Celkový rodinný profil */}
          <GlassCard glow>
            <h3 className="font-medium text-slate-900 mb-3">{t('rel.familyEnergyProfile')}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {constellationResult.familyNumbers.map((num, i) => {
                const names = [constFather.name, constMother.name, ...constChildren.filter(isPersonValid).map(c => c.name)];
                return (
                  <div key={i} className="flex flex-col items-center p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 min-w-[60px]">
                    <span className="text-lg font-serif font-bold text-indigo-300">{num}</span>
                    <span className="text-[10px] text-slate-400">{names[i]}</span>
                  </div>
                );
              })}
            </div>
            {(() => {
              const nums = constellationResult.familyNumbers;
              const counts = new Map<number, number>();
              nums.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
              const repeated = [...counts.entries()].filter(([, c]) => c > 1);
              const allDifferent = repeated.length === 0;
              const familySum = reduceToSingle(nums.reduce((a, b) => a + b, 0));
              return (
                <div className="space-y-2 text-xs text-slate-300">
                  {repeated.length > 0 && (
                    <p>
                      <strong className="text-amber-300">{t('rel.repeatingNumbers')}:</strong>{' '}
                      {repeated.map(([n, c]) => `${n} (${c}×)`).join(', ')} — {language === 'sk' ? 'tieto energie sú v rodine zosilnené, je to spoločná téma.' : 'these energies are amplified in the family, it is a shared theme.'}
                    </p>
                  )}
                  {allDifferent && (
                    <p><strong className="text-emerald-300">{t('rel.allNumbersDifferent')}</strong></p>
                  )}
                  <p><strong>{t('rel.familyNumber')}:</strong> {familySum} — {
                    familySum === 1 ? t('rel.familyNum1') :
                    familySum === 2 ? t('rel.familyNum2') :
                    familySum === 3 ? t('rel.familyNum3') :
                    familySum === 4 ? t('rel.familyNum4') :
                    familySum === 5 ? t('rel.familyNum5') :
                    familySum === 6 ? t('rel.familyNum6') :
                    familySum === 7 ? t('rel.familyNum7') :
                    familySum === 8 ? t('rel.familyNum8') :
                    t('rel.familyNum9')
                  }</p>
                </div>
              );
            })()}
          </GlassCard>

          {/* Partnerský vzťah rodičov */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-2">{constFather.name} & {constMother.name} — {t('rel.partnerRelationship')}</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{constellationResult.partnerCompat.overallScore}%</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-300">{constellationResult.partnerCompat.lifePathCompatibility.description}</p>
                {constellationResult.partnerCompat.strengths[0] && (
                  <p className="text-xs text-emerald-300 mt-1">+ {constellationResult.partnerCompat.strengths[0]}</p>
                )}
                {constellationResult.partnerCompat.challenges[0] && (
                  <p className="text-xs text-amber-700 mt-1">! {constellationResult.partnerCompat.challenges[0]}</p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* HD rodičov */}
          {(() => {
            const fatherCityHd = findCity(constFather.birthPlace);
            const motherCityHd = findCity(constMother.birthPlace);
            const fatherTzHd = getTimezoneFromCoords(fatherCityHd?.lat ?? 48.15, fatherCityHd?.lon ?? 17.11);
            const motherTzHd = getTimezoneFromCoords(motherCityHd?.lat ?? 48.15, motherCityHd?.lon ?? 17.11);
            const hdF = calculateHumanDesign(parseInt(constFather.day, 10), parseInt(constFather.month, 10), parseInt(constFather.year, 10), constFather.hour ? parseInt(constFather.hour, 10) : 12, constFather.minute ? parseInt(constFather.minute, 10) : 0, fatherTzHd);
            const hdM = calculateHumanDesign(parseInt(constMother.day, 10), parseInt(constMother.month, 10), parseInt(constMother.year, 10), constMother.hour ? parseInt(constMother.hour, 10) : 12, constMother.minute ? parseInt(constMother.minute, 10) : 0, motherTzHd);
            return (
              <GlassCard>
                <h3 className="font-medium text-purple-300 mb-3">{t('rel.hdParentPair')}</h3>
                <PartnerBodygraph result1={hdF} result2={hdM} name1={constFather.name} name2={constMother.name} />
              </GlassCard>
            );
          })()}

          {/* Charakterová synastria rodičov */}
          {(() => {
            const numF = calculateFullNumerology(parseInt(constFather.day, 10), parseInt(constFather.month, 10), parseInt(constFather.year, 10));
            const numM = calculateFullNumerology(parseInt(constMother.day, 10), parseInt(constMother.month, 10), parseInt(constMother.year, 10));
            const sharedFull = numF.fullPlanes.filter(p => numM.fullPlanes.includes(p));
            const sharedEmpty = numF.emptyPlanes.filter(p => numM.emptyPlanes.includes(p));
            const sharedIsolated = numF.isolatedNumbers.filter(n => numM.isolatedNumbers.includes(n));
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-1">{t('rel.charSynastryParents')}</h3>
                <p className="text-xs text-slate-600 mb-3">{language === 'sk' ? 'Porovnanie numerologických mriežok — spoločné silné stránky a oblasti rastu.' : 'Comparison of numerological grids — shared strengths and areas of growth.'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-[11px] text-indigo-300 font-semibold">{constFather.name}: {language === 'sk' ? 'ŽČ' : 'LP'} {numF.lifePathNumber}</p>
                    <p className="text-[11px] text-slate-600">{language === 'sk' ? 'Plné' : 'Full'}: {numF.fullPlanes.length > 0 ? numF.fullPlanes.join(', ') : (language === 'sk' ? 'žiadne' : 'none')}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <p className="text-[11px] text-violet-300 font-semibold">{constMother.name}: {language === 'sk' ? 'ŽČ' : 'LP'} {numM.lifePathNumber}</p>
                    <p className="text-[11px] text-slate-600">{language === 'sk' ? 'Plné' : 'Full'}: {numM.fullPlanes.length > 0 ? numM.fullPlanes.join(', ') : (language === 'sk' ? 'žiadne' : 'none')}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {sharedFull.length > 0 && (
                    <p className="text-[11px] text-emerald-300">{language === 'sk' ? 'Spoločné silné roviny' : 'Shared strong planes'}: <strong>{sharedFull.join(', ')}</strong> — {language === 'sk' ? 'tu si rozumiete prirodzene.' : 'you understand each other naturally here.'}</p>
                  )}
                  {sharedEmpty.length > 0 && (
                    <p className="text-[11px] text-amber-300">{language === 'sk' ? 'Spoločné prázdne roviny' : 'Shared empty planes'}: <strong>{sharedEmpty.join(', ')}</strong> — {language === 'sk' ? 'spoločné slepé miesta, deti ich môžu dopĺňať.' : 'shared blind spots, children may complement them.'}</p>
                  )}
                  {sharedIsolated.length > 0 && (
                    <p className="text-[11px] text-rose-300">{language === 'sk' ? 'Spoločné izolované' : 'Shared isolated'}: <strong>{sharedIsolated.join(', ')}</strong> — {language === 'sk' ? 'spoločné napätie, ktoré sa prenáša na deti.' : 'shared tension that transfers to children.'}</p>
                  )}
                  {sharedFull.length === 0 && sharedEmpty.length === 0 && (
                    <p className="text-[11px] text-slate-500 italic">{language === 'sk' ? 'Rôzne mriežky — rodičia sa vzájomne dopĺňajú v rôznych oblastiach.' : 'Different grids — parents complement each other in different areas.'}</p>
                  )}
                </div>
              </GlassCard>
            );
          })()}

          {/* Vývojová synastria rodičov */}
          {(() => {
            const devF = calculateDevelopmentalNumerology(parseInt(constFather.day, 10), parseInt(constFather.month, 10), parseInt(constFather.year, 10));
            const devM = calculateDevelopmentalNumerology(parseInt(constMother.day, 10), parseInt(constMother.month, 10), parseInt(constMother.year, 10));
            const k3Match = devF.circled[2].value === devM.circled[2].value;
            const egoComplementary = (devF.egoPolarity === 'masculine' && devM.egoPolarity === 'feminine') || (devF.egoPolarity === 'feminine' && devM.egoPolarity === 'masculine');
            const egoSame = devF.egoPolarity === devM.egoPolarity && devF.egoPolarity !== 'none';
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-1">{t('rel.devSynastryParents')}</h3>
                <p className="text-xs text-slate-600 mb-3">{language === 'sk' ? 'Karmické cykly a polarita ega oboch rodičov.' : 'Karmic cycles and ego polarity of both parents.'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-700 uppercase mb-1">{constFather.name}</p>
                    <p className="text-sm text-slate-800 font-mono">K1={devF.circled[0].value} · K2={devF.circled[1].value} · K3={devF.circled[2].value} · K4={devF.circled[3].value}</p>
                    <p className="text-[11px] text-slate-600 mt-1">Ego: {devF.egoPolarity === 'masculine' ? (language === 'sk' ? 'mužské' : 'masculine') : devF.egoPolarity === 'feminine' ? (language === 'sk' ? 'ženské' : 'feminine') : (language === 'sk' ? 'žiadne' : 'none')} ({devF.oneCount}× 1)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
                    <p className="text-xs text-violet-700 uppercase mb-1">{constMother.name}</p>
                    <p className="text-sm text-slate-800 font-mono">K1={devM.circled[0].value} · K2={devM.circled[1].value} · K3={devM.circled[2].value} · K4={devM.circled[3].value}</p>
                    <p className="text-[11px] text-slate-600 mt-1">Ego: {devM.egoPolarity === 'masculine' ? (language === 'sk' ? 'mužské' : 'masculine') : devM.egoPolarity === 'feminine' ? (language === 'sk' ? 'ženské' : 'feminine') : (language === 'sk' ? 'žiadne' : 'none')} ({devM.oneCount}× 1)</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {k3Match && (
                    <p className="text-xs text-emerald-300 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      {language === 'sk' ? `★ K3 zhoda (${devF.circled[2].value}) — rovnaké životné poslanie. Silné karmické spojenie rodičov.` : `★ K3 match (${devF.circled[2].value}) — same life purpose. Strong karmic connection between parents.`}
                    </p>
                  )}
                  {egoComplementary && (
                    <p className="text-xs text-rose-300 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
                      {language === 'sk' ? '☯ Doplnková polarita ega — mužský × ženský princíp. Deti zažívajú vyváženú Yin-Yang dynamiku.' : '☯ Complementary ego polarity — masculine × feminine principle. Children experience balanced Yin-Yang dynamics.'}
                    </p>
                  )}
                  {egoSame && (
                    <p className="text-xs text-amber-700 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      {language === 'sk' ? '⚹ Rovnaká polarita ega — obaja rodičia pôsobia rovnakým energetickým štýlom na deti.' : '⚹ Same ego polarity — both parents affect children with the same energetic style.'}
                    </p>
                  )}
                </div>
              </GlassCard>
            );
          })()}

          {/* Otec ↔ deti */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">{constFather.name} ↔ {t('rel.fatherChildren')}</h3>
            <div className="space-y-3">
              {constellationResult.fatherChildren.map(({ child, result: r }, idx) => {
                const cn = calculateFullNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
                const cd = calculateDevelopmentalNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
                const fCityConst = findCity(constFather.birthPlace);
                const chCityConst = findCity(child.birthPlace);
                const fTzConst = getTimezoneFromCoords(fCityConst?.lat ?? 48.15, fCityConst?.lon ?? 17.11);
                const chTzConst = getTimezoneFromCoords(chCityConst?.lat ?? 48.15, chCityConst?.lon ?? 17.11);
                const fatherHd = calculateHumanDesign(parseInt(constFather.day, 10), parseInt(constFather.month, 10), parseInt(constFather.year, 10), constFather.hour ? parseInt(constFather.hour, 10) : 12, constFather.minute ? parseInt(constFather.minute, 10) : 0, fTzConst);
                const childHd = calculateHumanDesign(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10), child.hour ? parseInt(child.hour, 10) : 12, child.minute ? parseInt(child.minute, 10) : 0, chTzConst);
                const sharedDef = fatherHd.definedCenters.filter(c => childHd.definedCenters.includes(c));
                const fatherOnly = fatherHd.definedCenters.filter(c => !childHd.definedCenters.includes(c));
                const fGates = new Set([...fatherHd.personalityGates.map(g => g.gate), ...fatherHd.designGates.map(g => g.gate)]);
                const cGates = new Set([...childHd.personalityGates.map(g => g.gate), ...childHd.designGates.map(g => g.gate)]);
                const sharedGK = [...fGates].filter(g => cGates.has(g)).slice(0, 3).map(g => getGeneKeyByGate(g, language)).filter(Boolean);
                return (
                <div key={idx} className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">{child.name}</span>
                    <span className="text-sm font-bold text-blue-300">{r.compatibility}%</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {language === 'sk' ? 'ŽČ' : 'LP'} <strong className="text-slate-900">{cn.lifePathNumber}</strong> · K3: {cd.circled[2].value} · {cn.age === 'aquarius' ? (language === 'sk' ? 'Vodnár' : 'Aquarius') : (language === 'sk' ? 'Ryby' : 'Pisces')}
                    {cn.karmicDebts.length > 0 && <> · {language === 'sk' ? 'Karm. dlh' : 'Karmic debt'}: {cn.karmicDebts.map(d => d.number).join(', ')}</>}
                    {' '}· HD: {displayName(HD_TYPE_DISPLAY, childHd.type, language)}
                  </p>
                  <p className="text-xs text-slate-300"><strong>{t('rel.parentRole')}:</strong> {r.parentRole}</p>
                  <p className="text-xs text-slate-300"><strong>{t('rel.communication')}:</strong> {r.communicationStyle}</p>
                  {r.recommendations[0] && <p className="text-xs text-indigo-300">→ {r.recommendations[0]}</p>}
                  {(sharedDef.length > 0 || fatherOnly.length > 0) && (
                    <p className="text-[11px] text-cyan-300">
                      {sharedDef.length > 0 && <>{language === 'sk' ? 'HD spoločné' : 'HD shared'}: {sharedDef.join(', ')}. </>}
                      {fatherOnly.length > 0 && <>{language === 'sk' ? 'Podmieňuje' : 'Conditions'}: {fatherOnly.join(', ')}.</>}
                    </p>
                  )}
                  {sharedGK.length > 0 && (
                    <div className="space-y-1.5 mt-1">
                      <p className="text-[11px] text-purple-300 font-semibold">{t('rel.sharedGKLabel')}:</p>
                      {sharedGK.map(gk => (
                        <div key={gk!.gate} className="pl-2 border-l-2 border-purple-500/30 space-y-0.5">
                          <p className="text-[11px] text-white">{language === 'sk' ? 'Brána' : 'Gate'} {gk!.gate}: <span className="text-rose-300">{gk!.shadow}</span> → <span className="text-amber-300">{gk!.gift}</span> → <span className="text-emerald-300">{gk!.siddhi}</span></p>
                          <p className="text-[10px] text-slate-400">{gk!.shadowDescription}</p>
                          <p className="text-[10px] text-amber-300">{t('rel.gkGift')}: {gk!.giftDescription}</p>
                          {gk!.nlpTechnique && <p className="text-[10px] text-indigo-300">{language === 'sk' ? 'Prakticky' : 'Practically'}: {gk!.nlpTechnique} — {gk!.nlpDescription}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Matka ↔ deti */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">{constMother.name} ↔ {t('rel.motherChildren')}</h3>
            <div className="space-y-3">
              {constellationResult.motherChildren.map(({ child, result: r }, idx) => {
                const cn = calculateFullNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
                const cd = calculateDevelopmentalNumerology(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10));
                const mCityConst = findCity(constMother.birthPlace);
                const mchCityConst = findCity(child.birthPlace);
                const mTzConst = getTimezoneFromCoords(mCityConst?.lat ?? 48.15, mCityConst?.lon ?? 17.11);
                const mchTzConst = getTimezoneFromCoords(mchCityConst?.lat ?? 48.15, mchCityConst?.lon ?? 17.11);
                const motherHd = calculateHumanDesign(parseInt(constMother.day, 10), parseInt(constMother.month, 10), parseInt(constMother.year, 10), constMother.hour ? parseInt(constMother.hour, 10) : 12, constMother.minute ? parseInt(constMother.minute, 10) : 0, mTzConst);
                const childHd = calculateHumanDesign(parseInt(child.day, 10), parseInt(child.month, 10), parseInt(child.year, 10), child.hour ? parseInt(child.hour, 10) : 12, child.minute ? parseInt(child.minute, 10) : 0, mchTzConst);
                const sharedDef = motherHd.definedCenters.filter(c => childHd.definedCenters.includes(c));
                const motherOnly = motherHd.definedCenters.filter(c => !childHd.definedCenters.includes(c));
                const mGates = new Set([...motherHd.personalityGates.map(g => g.gate), ...motherHd.designGates.map(g => g.gate)]);
                const cGates = new Set([...childHd.personalityGates.map(g => g.gate), ...childHd.designGates.map(g => g.gate)]);
                const sharedGK = [...mGates].filter(g => cGates.has(g)).slice(0, 3).map(g => getGeneKeyByGate(g, language)).filter(Boolean);
                return (
                <div key={idx} className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">{child.name}</span>
                    <span className="text-sm font-bold text-purple-300">{r.compatibility}%</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {language === 'sk' ? 'ŽČ' : 'LP'} <strong className="text-slate-900">{cn.lifePathNumber}</strong> · K3: {cd.circled[2].value} · {cn.age === 'aquarius' ? (language === 'sk' ? 'Vodnár' : 'Aquarius') : (language === 'sk' ? 'Ryby' : 'Pisces')}
                    {cn.karmicDebts.length > 0 && <> · {language === 'sk' ? 'Karm. dlh' : 'Karmic debt'}: {cn.karmicDebts.map(d => d.number).join(', ')}</>}
                    {' '}· HD: {displayName(HD_TYPE_DISPLAY, childHd.type, language)}
                  </p>
                  <p className="text-xs text-slate-300"><strong>{t('rel.parentRole')}:</strong> {r.parentRole}</p>
                  <p className="text-xs text-slate-300"><strong>{t('rel.communication')}:</strong> {r.communicationStyle}</p>
                  {r.recommendations[0] && <p className="text-xs text-indigo-300">→ {r.recommendations[0]}</p>}
                  {(sharedDef.length > 0 || motherOnly.length > 0) && (
                    <p className="text-[11px] text-cyan-300">
                      {sharedDef.length > 0 && <>{language === 'sk' ? 'HD spoločné' : 'HD shared'}: {sharedDef.join(', ')}. </>}
                      {motherOnly.length > 0 && <>{language === 'sk' ? 'Podmieňuje' : 'Conditions'}: {motherOnly.join(', ')}.</>}
                    </p>
                  )}
                  {sharedGK.length > 0 && (
                    <div className="space-y-1.5 mt-1">
                      <p className="text-[11px] text-purple-300 font-semibold">{t('rel.sharedGKLabel')}:</p>
                      {sharedGK.map(gk => (
                        <div key={gk!.gate} className="pl-2 border-l-2 border-purple-500/30 space-y-0.5">
                          <p className="text-[11px] text-white">{language === 'sk' ? 'Brána' : 'Gate'} {gk!.gate}: <span className="text-rose-300">{gk!.shadow}</span> → <span className="text-amber-300">{gk!.gift}</span> → <span className="text-emerald-300">{gk!.siddhi}</span></p>
                          <p className="text-[10px] text-slate-400">{gk!.shadowDescription}</p>
                          <p className="text-[10px] text-amber-300">{t('rel.gkGift')}: {gk!.giftDescription}</p>
                          {gk!.nlpTechnique && <p className="text-[10px] text-indigo-300">{language === 'sk' ? 'Prakticky' : 'Practically'}: {gk!.nlpTechnique} — {gk!.nlpDescription}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Súrodenci */}
          {constellationResult.siblingCompats.length > 0 && (
            <GlassCard>
              <h3 className="font-medium text-slate-900 mb-3">{t('rel.siblingRelationships')}</h3>
              <p className="text-xs text-slate-500 mb-3">
                {language === 'sk' ? 'Súrodenecký vzťah je často najdlhší vzťah v živote. Dynamika medzi deťmi ovplyvňuje ich sebaobraz, sociálne zručnosti a schopnosť riešiť konflikty v dospelosti.' : 'Sibling relationship is often the longest relationship in life. Dynamics between children influence their self-image, social skills and ability to resolve conflicts in adulthood.'}
              </p>
              <div className="space-y-3">
                {constellationResult.siblingCompats.map(({ child1, child2, compat }, idx) => {
                  const n1 = calculateFullNumerology(parseInt(child1.day, 10), parseInt(child1.month, 10), parseInt(child1.year, 10));
                  const n2 = calculateFullNumerology(parseInt(child2.day, 10), parseInt(child2.month, 10), parseInt(child2.year, 10));
                  const relationshipGoal = reduceToSingle(n1.lifePathNumber + n2.lifePathNumber);
                  const s1City = findCity(child1.birthPlace);
                  const s2City = findCity(child2.birthPlace);
                  const s1Tz = getTimezoneFromCoords(s1City?.lat ?? 48.15, s1City?.lon ?? 17.11);
                  const s2Tz = getTimezoneFromCoords(s2City?.lat ?? 48.15, s2City?.lon ?? 17.11);
                  const hd1 = calculateHumanDesign(parseInt(child1.day, 10), parseInt(child1.month, 10), parseInt(child1.year, 10), child1.hour ? parseInt(child1.hour, 10) : 12, child1.minute ? parseInt(child1.minute, 10) : 0, s1Tz);
                  const hd2 = calculateHumanDesign(parseInt(child2.day, 10), parseInt(child2.month, 10), parseInt(child2.year, 10), child2.hour ? parseInt(child2.hour, 10) : 12, child2.minute ? parseInt(child2.minute, 10) : 0, s2Tz);
                  const g1 = new Set([...hd1.personalityGates.map(g => g.gate), ...hd1.designGates.map(g => g.gate)]);
                  const g2 = new Set([...hd2.personalityGates.map(g => g.gate), ...hd2.designGates.map(g => g.gate)]);
                  const siblingGK = [...g1].filter(g => g2.has(g)).slice(0, 3).map(g => getGeneKeyByGate(g, language)).filter(Boolean);
                  return (
                  <div key={idx} className="p-3 rounded-xl glass-light space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{child1.name} & {child2.name}</span>
                      <span className="text-sm font-bold text-indigo-300">{compat.overallScore}%</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {language === 'sk' ? 'ŽČ' : 'LP'} {n1.lifePathNumber} + {n2.lifePathNumber} → {language === 'sk' ? 'cieľ vzťahu' : 'relationship goal'}: <strong className="text-indigo-300">{relationshipGoal}</strong>
                      {n1.age !== n2.age && <> · <span className="text-amber-300">{language === 'sk' ? 'Rôzny kozmický vek' : 'Different cosmic age'}</span> — {language === 'sk' ? 'odlišné generačné vnímanie' : 'different generational perception'}</>}
                      {' '}· HD: {displayName(HD_TYPE_DISPLAY, hd1.type, language)} & {displayName(HD_TYPE_DISPLAY, hd2.type, language)}
                    </p>
                    <p className="text-xs text-slate-600">{compat.lifePathCompatibility.description}</p>
                    {compat.strengths[0] && <p className="text-xs text-emerald-300">+ {compat.strengths[0]}</p>}
                    {compat.strengths[1] && <p className="text-xs text-emerald-300">+ {compat.strengths[1]}</p>}
                    {compat.challenges[0] && <p className="text-xs text-amber-700">! {compat.challenges[0]}</p>}
                    {compat.challenges[1] && <p className="text-xs text-amber-700">! {compat.challenges[1]}</p>}
                    {(() => {
                      const shared = hd1.definedCenters.filter(c => hd2.definedCenters.includes(c));
                      const only1 = hd1.definedCenters.filter(c => !hd2.definedCenters.includes(c));
                      const only2 = hd2.definedCenters.filter(c => !hd1.definedCenters.includes(c));
                      return (shared.length > 0 || only1.length > 0 || only2.length > 0) ? (
                        <div className="text-[11px] text-cyan-300 space-y-0.5">
                          {shared.length > 0 && <p>{language === 'sk' ? 'HD spoločné' : 'HD shared'}: {shared.map(c => displayName(HD_CENTER_DISPLAY, c, language)).join(', ')}</p>}
                          {only1.length > 0 && <p>{child1.name} {language === 'sk' ? 'podmieňuje' : 'conditions'}: {only1.map(c => displayName(HD_CENTER_DISPLAY, c, language)).join(', ')}</p>}
                          {only2.length > 0 && <p>{child2.name} {language === 'sk' ? 'podmieňuje' : 'conditions'}: {only2.map(c => displayName(HD_CENTER_DISPLAY, c, language)).join(', ')}</p>}
                        </div>
                      ) : null;
                    })()}
                    {siblingGK.length > 0 && (
                      <div className="space-y-1.5 mt-1">
                        <p className="text-[11px] text-purple-300 font-semibold">{t('rel.sharedGKLabel')}:</p>
                        {siblingGK.map(gk => (
                          <div key={gk!.gate} className="pl-2 border-l-2 border-purple-500/30 space-y-0.5">
                            <p className="text-[11px] text-white">{language === 'sk' ? 'Brána' : 'Gate'} {gk!.gate}: <span className="text-rose-300">{gk!.shadow}</span> → <span className="text-amber-300">{gk!.gift}</span> → <span className="text-emerald-300">{gk!.siddhi}</span></p>
                            <p className="text-[10px] text-slate-400">{gk!.shadowDescription}</p>
                            <p className="text-[10px] text-amber-300">{t('rel.gkGift')}: {gk!.giftDescription}</p>
                            {gk!.nlpTechnique && <p className="text-[10px] text-indigo-300">{language === 'sk' ? 'Prakticky' : 'Practically'}: {gk!.nlpTechnique} — {gk!.nlpDescription}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </GlassCard>
          )}

          <div className="flex justify-end">
            <button onClick={() => setEditing(true)} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1 shadow-sm">
              <span>✎</span> {t('rel.editData')}
            </button>
          </div>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">{t('common.newCalculation')}</button>
        </div>
      )}
    </div>
  );
}
