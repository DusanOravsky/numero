import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
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

function PersonForm({ person, onChange, label }: { person: PersonInput; onChange: (p: PersonInput) => void; label: string }) {
  return (
    <div className="space-y-3">
      {label && <p className="text-sm text-slate-700 font-medium">{label}</p>}
      <input
        type="text"
        placeholder="Meno"
        value={person.name}
        onChange={e => onChange({ ...person, name: e.target.value })}
        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-500"
      />
      <div className="flex gap-2">
        <input type="number" placeholder="Deň" min={1} max={31} value={person.day} onChange={e => onChange({ ...person, day: e.target.value })} className="w-20 px-3 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-500" />
        <input type="number" placeholder="Mesiac" min={1} max={12} value={person.month} onChange={e => onChange({ ...person, month: e.target.value })} className="w-24 px-3 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-500" />
        <input type="number" placeholder="Rok" min={1900} max={2100} value={person.year} onChange={e => onChange({ ...person, year: e.target.value })} className="flex-1 px-3 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-center focus:outline-none focus:border-indigo-500" />
      </div>
      <div className="flex gap-2 items-center">
        <input type="number" placeholder="Hod" min={0} max={23} value={person.hour} onChange={e => onChange({ ...person, hour: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-center text-sm focus:outline-none focus:border-indigo-500" />
        <span className="text-slate-600 font-bold">:</span>
        <input type="number" placeholder="Min" min={0} max={59} value={person.minute} onChange={e => onChange({ ...person, minute: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-center text-sm focus:outline-none focus:border-indigo-500" />
        <span className="text-[10px] text-slate-600">Čas (24h)</span>
      </div>
      <input type="text" placeholder="Miesto narodenia" value={person.birthPlace} onChange={e => onChange({ ...person, birthPlace: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-indigo-500" />
    </div>
  );
}

function isPersonValid(p: PersonInput): boolean {
  const d = parseInt(p.day), m = parseInt(p.month), y = parseInt(p.year);
  return !!(p.name.trim() && d >= 1 && m >= 1 && y >= 1900 && isValidDate(d, m, y));
}

interface AstroPersonInput {
  name: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  birthPlace: string;
}

const emptyAstroPerson = (): AstroPersonInput => ({ name: '', day: '', month: '', year: '', hour: '', minute: '', birthPlace: '' });

function isAstroPersonValid(p: AstroPersonInput): boolean {
  const d = parseInt(p.day), m = parseInt(p.month), y = parseInt(p.year);
  return !!(p.name.trim() && d >= 1 && m >= 1 && y >= 1900 && isValidDate(d, m, y));
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

function getElementCompatibility(el1: string, el2: string): { score: number; description: string } {
  if (el1 === el2) return { score: 95, description: 'Rovnaký živel -- prirodzená harmónia a vzájomné pochopenie.' };
  // Komplementárne (trigón v astrológii): Oheň-Vzduch a Zem-Voda
  const compatible: Record<string, string> = { 'Oheň': 'Vzduch', 'Vzduch': 'Oheň', 'Zem': 'Voda', 'Voda': 'Zem' };
  if (compatible[el1] === el2) return { score: 80, description: 'Komplementárne živly -- vzájomne sa posilňujete a inšpirujete.' };
  // Opozičné (kvadratúra): Oheň-Voda, Zem-Vzduch
  const opposite: Record<string, string> = { 'Oheň': 'Voda', 'Voda': 'Oheň', 'Zem': 'Vzduch', 'Vzduch': 'Zem' };
  if (opposite[el1] === el2) return { score: 45, description: 'Protichodné živly -- silná príťažlivosť, ale aj napätie a výzvy.' };
  // Neutrálne (kvadratúra menej intenzívna): Oheň-Zem, Vzduch-Voda
  return { score: 55, description: 'Neutrálna kombinácia -- vyžaduje vedomú prácu na pochopení odlišností.' };
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
  name2: string, day2: number, month2: number, year2: number, hour2: number, minute2: number, lat2: number, lon2: number
): SynastryResult {
  const tz1 = getTimezoneFromCoords(lat1, lon1);
  const tz2 = getTimezoneFromCoords(lat2, lon2);
  const r1 = calculateAstrology(day1, month1, year1, hour1, minute1, lat1, lon1, tz1);
  const r2 = calculateAstrology(day2, month2, year2, hour2, minute2, lat2, lon2, tz2);

  const sunCompat = getElementCompatibility(r1.sunSign.element, r2.sunSign.element);
  const moonCompat = getElementCompatibility(r1.moonSign.element, r2.moonSign.element);

  const venus1 = getPlanetByName(r1, 'Venuša');
  const venus2 = getPlanetByName(r2, 'Venuša');
  const venusCompat = venus1 && venus2
    ? getElementCompatibility(venus1.sign.element, venus2.sign.element)
    : { score: 70, description: 'Nedá sa presne určiť.' };

  const mars1 = getPlanetByName(r1, 'Mars');
  const mars2 = getPlanetByName(r2, 'Mars');
  const marsCompat = mars1 && mars2
    ? getElementCompatibility(mars1.sign.element, mars2.sign.element)
    : { score: 70, description: 'Nedá sa presne určiť.' };

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

function getAspectMeaning(planet1: string, planet2: string, nature: string): string {
  const key = [planet1, planet2].sort().join('-');
  const meanings: Record<string, Record<string, string>> = {
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
  const pair = meanings[key];
  if (pair) return pair[nature] || pair.neutral || '';
  if (nature === 'harmonic') return 'Harmonický tok energie medzi týmito oblasťami vášho vzťahu.';
  if (nature === 'tense') return 'Napätie ktoré vyžaduje vedomú prácu, ale je motorom rastu.';
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
      const p1 = calculateFullNumerology(parseInt(saved.p1.day), parseInt(saved.p1.month), parseInt(saved.p1.year));
      const p2 = calculateFullNumerology(parseInt(saved.p2.day), parseInt(saved.p2.month), parseInt(saved.p2.year));
      return calculatePartnerCompatibility(p1, p2);
    }
    return null;
  });
  const [familyResults, setFamilyResults] = useState<{ child: PersonInput; result: ParentChildResult }[] | null>(() => {
    if (savedFamily?.parent && isPersonValid(savedFamily.parent) && savedFamily.children?.length) {
      const validChildren = savedFamily.children.filter(isPersonValid);
      if (validChildren.length === 0) return null;
      const parentNum = calculateFullNumerology(parseInt(savedFamily.parent.day), parseInt(savedFamily.parent.month), parseInt(savedFamily.parent.year));
      return validChildren.map((child: PersonInput) => {
        const childNum = calculateFullNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
        return { child, result: calculateParentChild(parentNum, childNum) };
      });
    }
    return null;
  });
  const [astroPartner1, setAstroPartner1] = useState<AstroPersonInput>(savedAstro?.p1 || emptyAstroPerson());
  const [astroPartner2, setAstroPartner2] = useState<AstroPersonInput>(savedAstro?.p2 || emptyAstroPerson());
  const [synastryResult, setSynastryResult] = useState<SynastryResult | null>(() => {
    if (savedAstro?.p1 && savedAstro?.p2 && isAstroPersonValid(savedAstro.p1) && isAstroPersonValid(savedAstro.p2)) {
      const city1 = findCity(savedAstro.p1.birthPlace);
      const city2 = findCity(savedAstro.p2.birthPlace);
      return calculateSynastry(
        savedAstro.p1.name,
        parseInt(savedAstro.p1.day), parseInt(savedAstro.p1.month), parseInt(savedAstro.p1.year),
        savedAstro.p1.hour ? parseInt(savedAstro.p1.hour) : 12,
        savedAstro.p1.minute ? parseInt(savedAstro.p1.minute) : 0,
        city1?.lat || 48.15, city1?.lon || 17.11,
        savedAstro.p2.name,
        parseInt(savedAstro.p2.day), parseInt(savedAstro.p2.month), parseInt(savedAstro.p2.year),
        savedAstro.p2.hour ? parseInt(savedAstro.p2.hour) : 12,
        savedAstro.p2.minute ? parseInt(savedAstro.p2.minute) : 0,
        city2?.lat || 48.15, city2?.lon || 17.11
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
    const fatherNum = calculateFullNumerology(parseInt(savedConst.father.day), parseInt(savedConst.father.month), parseInt(savedConst.father.year));
    const motherNum = calculateFullNumerology(parseInt(savedConst.mother.day), parseInt(savedConst.mother.month), parseInt(savedConst.mother.year));
    const partnerCompat = calculatePartnerCompatibility(fatherNum, motherNum);
    const fatherChildren = validKids.map((child: PersonInput) => {
      const childNum = calculateFullNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
      return { child, result: calculateParentChild(fatherNum, childNum) };
    });
    const motherChildren = validKids.map((child: PersonInput) => {
      const childNum = calculateFullNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
      return { child, result: calculateParentChild(motherNum, childNum) };
    });
    const siblingCompats: { child1: PersonInput; child2: PersonInput; compat: CompatibilityResult }[] = [];
    for (let i = 0; i < validKids.length; i++) {
      for (let j = i + 1; j < validKids.length; j++) {
        const n1 = calculateFullNumerology(parseInt(validKids[i].day), parseInt(validKids[i].month), parseInt(validKids[i].year));
        const n2 = calculateFullNumerology(parseInt(validKids[j].day), parseInt(validKids[j].month), parseInt(validKids[j].year));
        siblingCompats.push({ child1: validKids[i], child2: validKids[j], compat: calculatePartnerCompatibility(n1, n2) });
      }
    }
    const familyNumbers = [fatherNum.lifePathNumber, motherNum.lifePathNumber, ...validKids.map((k: PersonInput) => calculateFullNumerology(parseInt(k.day), parseInt(k.month), parseInt(k.year)).lifePathNumber)];
    return { partnerCompat, fatherChildren, motherChildren, siblingCompats, familyNumbers };
  });

  const handleConstellationCalc = () => {
    if (!isPersonValid(constFather) || !isPersonValid(constMother)) return;
    const validKids = constChildren.filter(isPersonValid);
    if (validKids.length === 0) return;

    const fatherNum = calculateFullNumerology(parseInt(constFather.day), parseInt(constFather.month), parseInt(constFather.year));
    const motherNum = calculateFullNumerology(parseInt(constMother.day), parseInt(constMother.month), parseInt(constMother.year));
    const partnerCompat = calculatePartnerCompatibility(fatherNum, motherNum);

    const fatherChildren = validKids.map(child => {
      const childNum = calculateFullNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
      return { child, result: calculateParentChild(fatherNum, childNum) };
    });

    const motherChildren = validKids.map(child => {
      const childNum = calculateFullNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
      return { child, result: calculateParentChild(motherNum, childNum) };
    });

    const siblingCompats: { child1: PersonInput; child2: PersonInput; compat: CompatibilityResult }[] = [];
    for (let i = 0; i < validKids.length; i++) {
      for (let j = i + 1; j < validKids.length; j++) {
        const n1 = calculateFullNumerology(parseInt(validKids[i].day), parseInt(validKids[i].month), parseInt(validKids[i].year));
        const n2 = calculateFullNumerology(parseInt(validKids[j].day), parseInt(validKids[j].month), parseInt(validKids[j].year));
        siblingCompats.push({ child1: validKids[i], child2: validKids[j], compat: calculatePartnerCompatibility(n1, n2) });
      }
    }

    const familyNumbers = [
      fatherNum.lifePathNumber,
      motherNum.lifePathNumber,
      ...validKids.map(k => calculateFullNumerology(parseInt(k.day), parseInt(k.month), parseInt(k.year)).lifePathNumber),
    ];

    setConstellationResult({ partnerCompat, fatherChildren, motherChildren, siblingCompats, familyNumbers });
    localStorage.setItem('relationships-constellation', JSON.stringify({ father: constFather, mother: constMother, children: validKids }));
  };

  const handlePartnerCalc = () => {
    if (!isPersonValid(partner1) || !isPersonValid(partner2)) return;
    const p1 = calculateFullNumerology(parseInt(partner1.day), parseInt(partner1.month), parseInt(partner1.year));
    const p2 = calculateFullNumerology(parseInt(partner2.day), parseInt(partner2.month), parseInt(partner2.year));
    setCompatibility(calculatePartnerCompatibility(p1, p2));
    localStorage.setItem('relationships-partners', JSON.stringify({ p1: partner1, p2: partner2 }));
  };

  const handleAstroCalc = () => {
    if (!isAstroPersonValid(astroPartner1) || !isAstroPersonValid(astroPartner2)) return;
    const city1 = findCity(astroPartner1.birthPlace);
    const city2 = findCity(astroPartner2.birthPlace);
    const result = calculateSynastry(
      astroPartner1.name,
      parseInt(astroPartner1.day), parseInt(astroPartner1.month), parseInt(astroPartner1.year),
      astroPartner1.hour ? parseInt(astroPartner1.hour) : 12,
      astroPartner1.minute ? parseInt(astroPartner1.minute) : 0,
      city1?.lat || 48.15, city1?.lon || 17.11,
      astroPartner2.name,
      parseInt(astroPartner2.day), parseInt(astroPartner2.month), parseInt(astroPartner2.year),
      astroPartner2.hour ? parseInt(astroPartner2.hour) : 12,
      astroPartner2.minute ? parseInt(astroPartner2.minute) : 0,
      city2?.lat || 48.15, city2?.lon || 17.11
    );
    setSynastryResult(result);
    localStorage.setItem('relationships-astro', JSON.stringify({ p1: astroPartner1, p2: astroPartner2 }));
  };

  const handleFamilyCalc = () => {
    if (!isPersonValid(parent)) return;
    const validChildren = children.filter(isPersonValid);
    if (validChildren.length === 0) return;

    const parentNum = calculateFullNumerology(parseInt(parent.day), parseInt(parent.month), parseInt(parent.year));
    const results = validChildren.map(child => {
      const childNum = calculateFullNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
      return { child, result: calculateParentChild(parentNum, childNum) };
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-900">Vzťahy</h1>
        <p className="text-slate-600 mt-1">Partnerská a rodinná kompatibilita</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setMode('partner')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'partner' ? 'bg-indigo-600 text-white glow' : 'border border-slate-300 bg-slate-100 text-slate-700'}`}
        >
          Partnerský výklad
        </button>
        <button
          onClick={() => setMode('family')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'family' ? 'bg-indigo-600 text-white glow' : 'border border-slate-300 bg-slate-100 text-slate-700'}`}
        >
          Rodič a deti
        </button>
        <button
          onClick={() => setMode('astro')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'astro' ? 'bg-indigo-600 text-white glow' : 'border border-slate-300 bg-slate-100 text-slate-700'}`}
        >
          Astro kompatibilita
        </button>
        <button
          onClick={() => setMode('constellation')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'constellation' ? 'bg-indigo-600 text-white glow' : 'border border-slate-300 bg-slate-100 text-slate-700'}`}
        >
          Rodinná konštelácia
        </button>
      </div>

      {/* PARTNERSKÝ MÓD */}
      {mode === 'partner' && (!compatibility || editing) && (
        <GlassCard>
          {!compatibility && (
            <p className="text-sm text-slate-600 mb-4">
              <strong className="text-slate-900">Partnerský výklad</strong> porovnáva numerologické profily dvoch osôb -- životné čísla, roviny, jazyky lásky a ročné vibrácie. Výsledkom je celková kompatibilita, silné stránky a výzvy vzťahu, plus <strong className="text-rose-300">Cieľ vzťahu</strong> (súčet životných čísel = vyšší zmysel partnerstva).
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonForm person={partner1} onChange={setPartner1} label="Partner 1" />
            <PersonForm person={partner2} onChange={setPartner2} label="Partner 2" />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { handlePartnerCalc(); setEditing(false); }}
              disabled={!isPersonValid(partner1) || !isPersonValid(partner2)}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-900 disabled:cursor-not-allowed"
            >
              {compatibility ? 'Prepočítať' : 'Vypočítať kompatibilitu'}
            </button>
            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
              >
                Zrušiť
              </button>
            )}
          </div>
        </GlassCard>
      )}

      {mode === 'partner' && compatibility && !editing && (
        <div className="space-y-6">
          {/* Tvoje čítanie */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">Tvoje čítanie — ako pracovať s partnerským výkladom</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                Kompatibilita <strong className="text-slate-900">{compatibility.overallScore}%</strong> neznamená „dobrý" alebo „zlý" vzťah — hovorí o tom, koľko vecí vám ide prirodzene a kde musíte vedome pracovať.
                <strong> Silné stránky</strong> ({compatibility.strengths.length}) sú to, čo vás drží spolu bez námahy.
                <strong> Výzvy</strong> ({compatibility.challenges.length}) sú oblasti kde rastieme spoločne.
              </p>
              <p>
                <strong>Charakterová synastria</strong> porovnáva vaše numerologické mriežky — spoločné plné roviny sú vaša zdieľaná sila, spoločné prázdne sú slepé miesta kde ani jeden nepomôže druhému.
              </p>
              <p>
                <strong>Vývojová synastria</strong> (K1-K4) ukazuje ako sa stretávajú vaše karmické úlohy. Doplnková polarita ega (mužská × ženská) je klasická Yin-Yang dynamika.
              </p>
              <p>
                <strong>Human Design</strong> bodygraph ukazuje kde sa energeticky dopĺňate (elektromagnetické kanály), kde súťažíte (kompromisné) a kde jeden podmieňuje druhého.
              </p>
              <p>
                <strong>Génové kľúče</strong> odhaľujú spoločné témy transformácie — aký tieň spolu nesete a aký dar z neho vytvárate. Technika pri každom kľúči je praktický nástroj.
              </p>
              <p className="text-xs text-slate-500 italic">
                Žiadny vzťah nie je 100% — rozdielnosti sú motor rastu. Najlepšie vzťahy nie sú najľahšie, sú najvedomejšie.
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
              <p className="text-sm text-slate-600">Celková kompatibilita</p>
            </div>
          </GlassCard>

          {/* Cieľ vzťahu */}
          {(() => {
            const p1Num = calculateFullNumerology(parseInt(partner1.day), parseInt(partner1.month), parseInt(partner1.year));
            const p2Num = calculateFullNumerology(parseInt(partner2.day), parseInt(partner2.month), parseInt(partner2.year));
            const relationshipGoal = reduceToSingle(p1Num.lifePathNumber + p2Num.lifePathNumber);
            const goalDescriptions: Record<number, string> = {
              1: 'Cieľom tohto vzťahu je vzájomná nezávislosť a podpora individuality. Spolu sa učíte byť silnými jednotlivcami, ktorí sa navzájom inšpirujú k vedeniu a odvaze.',
              2: 'Cieľom tohto vzťahu je harmonická spolupráca a vzájomná podpora. Učíte sa diplomacii, trpezlivosti a jemnému prepojeniu duší.',
              3: 'Cieľom tohto vzťahu je spoločná kreativita a radosť. Spolu tvoríte, komunikujete a zdieľate svoju radosť so svetom.',
              4: 'Cieľom tohto vzťahu je budovanie stabilných základov. Spolu vytvárate bezpečie, štruktúru a trvalé hodnoty pre seba aj okolie.',
              5: 'Cieľom tohto vzťahu je spoločný rast cez zmeny a nové skúsenosti. Učíte sa slobode v rámci vzťahu a adaptabilite.',
              6: 'Cieľom tohto vzťahu je bezpodmienečná láska a služba. Spolu vytvárate harmonický domov a staráte sa o seba aj komunitu.',
              7: 'Cieľom tohto vzťahu je duchovný rast a hlboké pochopenie. Spolu hľadáte pravdu, múdrosť a vnútorný pokoj.',
              8: 'Cieľom tohto vzťahu je spoločná manifestácia a budovanie hojnosti. Spolu dosahujete veľké veci v materiálnom aj duchovnom svete.',
              9: 'Cieľom tohto vzťahu je univerzálna láska a služba ľudstvu. Spolu sa učíte odpúšťať, púšťať a slúžiť vyššiemu dobru.',
            };
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-2">Cieľ vzťahu</h3>
                <p className="text-xs text-slate-600 mb-3">Cieľ vzťahu = súčet životných čísel oboch partnerov, redukovaný na jednociferné číslo. Ukazuje vyšší zmysel a spoločnú lekciu vášho vzťahu.</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">ŽČ({partner1.name}):</span>
                    <span className="text-lg font-bold text-indigo-300">{p1Num.lifePathNumber}</span>
                  </div>
                  <span className="text-slate-500">+</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">ŽČ({partner2.name}):</span>
                    <span className="text-lg font-bold text-indigo-300">{p2Num.lifePathNumber}</span>
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
              <h4 className="text-sm text-slate-400 mb-2">Životné čísla</h4>
              <p className="text-lg font-medium text-slate-800">{compatibility.lifePathCompatibility.score}%</p>
              <p className="text-sm text-slate-300 mt-1">{compatibility.lifePathCompatibility.description}</p>
            </GlassCard>
            <GlassCard>
              <h4 className="text-sm text-slate-400 mb-2">Jazyky lásky</h4>
              <p className="text-lg font-medium text-slate-800">{compatibility.loveLanguageMatch.score}%</p>
              {compatibility.loveLanguageMatch.matched.length > 0 && (
                <p className="text-sm text-green-300 mt-1">Zhodné: {compatibility.loveLanguageMatch.matched.join(', ')}</p>
              )}
            </GlassCard>
          </div>

          {/* Charakterová synastria — porovnanie mriežok */}
          {(() => {
            const num1 = calculateFullNumerology(parseInt(partner1.day), parseInt(partner1.month), parseInt(partner1.year));
            const num2 = calculateFullNumerology(parseInt(partner2.day), parseInt(partner2.month), parseInt(partner2.year));
            const sharedFull = num1.fullPlanes.filter(p => num2.fullPlanes.includes(p));
            const sharedEmpty = num1.emptyPlanes.filter(p => num2.emptyPlanes.includes(p));
            const sharedIsolated = num1.isolatedNumbers.filter(n => num2.isolatedNumbers.includes(n));
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-1">Charakterová synastria</h3>
                <p className="text-xs text-slate-600 mb-3">Porovnanie numerologických mriežok — spoločné silné stránky, slepé miesta a napätia.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-[11px] text-indigo-300 font-semibold">{partner1.name}: ŽČ {num1.lifePathNumber}</p>
                    <p className="text-[11px] text-slate-600">Plné: {num1.fullPlanes.length > 0 ? num1.fullPlanes.join(', ') : 'žiadne'}</p>
                    <p className="text-[11px] text-slate-600">Prázdne: {num1.emptyPlanes.length > 0 ? num1.emptyPlanes.join(', ') : 'žiadne'}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <p className="text-[11px] text-violet-300 font-semibold">{partner2.name}: ŽČ {num2.lifePathNumber}</p>
                    <p className="text-[11px] text-slate-600">Plné: {num2.fullPlanes.length > 0 ? num2.fullPlanes.join(', ') : 'žiadne'}</p>
                    <p className="text-[11px] text-slate-600">Prázdne: {num2.emptyPlanes.length > 0 ? num2.emptyPlanes.join(', ') : 'žiadne'}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {sharedFull.length > 0 && (
                    <p className="text-[11px] text-emerald-300">Spoločné silné roviny: <strong>{sharedFull.join(', ')}</strong> — tu si rozumiete bez slov, spoločná energia.</p>
                  )}
                  {sharedEmpty.length > 0 && (
                    <p className="text-[11px] text-amber-300">Spoločné prázdne roviny: <strong>{sharedEmpty.join(', ')}</strong> — spoločné slepé miesta, nikto z vás tu nepomôže druhému.</p>
                  )}
                  {sharedIsolated.length > 0 && (
                    <p className="text-[11px] text-rose-300">Spoločné izolované: <strong>{sharedIsolated.join(', ')}</strong> — spoločné napätie, môže zosilnieť vo vzťahu.</p>
                  )}
                  {sharedFull.length === 0 && sharedEmpty.length === 0 && sharedIsolated.length === 0 && (
                    <p className="text-[11px] text-slate-500 italic">Veľmi odlišné mriežky — dopĺňate sa tam, kde druhý nemá energiu.</p>
                  )}
                </div>
              </GlassCard>
            );
          })()}

          {/* Vývojová synastria (B20) — porovnanie K1-K4 a egoPolarity */}
          {(() => {
            const dev1 = calculateDevelopmentalNumerology(parseInt(partner1.day), parseInt(partner1.month), parseInt(partner1.year));
            const dev2 = calculateDevelopmentalNumerology(parseInt(partner2.day), parseInt(partner2.month), parseInt(partner2.year));

            // K3 (životné poslanie) zhoda
            const k3Match = dev1.circled[2].value === dev2.circled[2].value;
            // K1 (psychická stabilita) zhoda
            const k1Match = dev1.circled[0].value === dev2.circled[0].value;
            // Polarita ega: opačné polarity = klasická "doplnková" páril, rovnaké = súznejúce ale aj možné napätie
            const egoComplementary = (dev1.egoPolarity === 'masculine' && dev2.egoPolarity === 'feminine') ||
                                      (dev1.egoPolarity === 'feminine' && dev2.egoPolarity === 'masculine');
            const egoSame = dev1.egoPolarity === dev2.egoPolarity && dev1.egoPolarity !== 'none';

            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-1">Vývojová synastria (Lívia Mičková)</h3>
                <p className="text-xs text-slate-600 mb-3">
                  Porovnanie 4 zakrúžkovaných karmických čísel oboch partnerov a polarity ega — ukazuje, ako sa stretávajú vaše karmické úlohy.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-700 uppercase mb-1">{partner1.name}</p>
                    <p className="text-sm text-slate-800 font-mono">
                      K1={dev1.circled[0].value} · K2={dev1.circled[1].value} · K3={dev1.circled[2].value} · K4={dev1.circled[3].value}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Ego: {dev1.egoPolarity === 'masculine' ? 'mužské' : dev1.egoPolarity === 'feminine' ? 'ženské' : 'žiadne'} ({dev1.oneCount}× 1)
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
                    <p className="text-xs text-violet-700 uppercase mb-1">{partner2.name}</p>
                    <p className="text-sm text-slate-800 font-mono">
                      K1={dev2.circled[0].value} · K2={dev2.circled[1].value} · K3={dev2.circled[2].value} · K4={dev2.circled[3].value}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Ego: {dev2.egoPolarity === 'masculine' ? 'mužské' : dev2.egoPolarity === 'feminine' ? 'ženské' : 'žiadne'} ({dev2.oneCount}× 1)
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {k3Match && (
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-xs text-emerald-300">
                        ★ <strong>K3 zhoda ({dev1.circled[2].value})</strong> — máte rovnaké životné poslanie. Vaše duše sa stretli pre tú istú misiu — buď vás to spája hlboko, alebo súťažíte o tú istú lekciu.
                      </p>
                    </div>
                  )}
                  {k1Match && (
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <p className="text-xs text-blue-300">
                        K1 zhoda ({dev1.circled[0].value}) — máte rovnakú psychickú konštrukciu, takže si rozumiete „bez slov", ale zdieľate aj rovnaké slabé miesta.
                      </p>
                    </div>
                  )}
                  {egoComplementary && (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
                      <p className="text-xs text-rose-300">
                        ☯ Doplnková polarita ega — mužský × ženský princíp. Klasická vzťahová dynamika; aktivuje sa archetyp „Yin-Yang".
                      </p>
                    </div>
                  )}
                  {egoSame && (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <p className="text-xs text-amber-700">
                        ⚹ Rovnaká polarita ega — silne si rozumiete v tempe a štýle, ale možný súboj o ten istý priestor.
                      </p>
                    </div>
                  )}
                  {!k3Match && !k1Match && !egoComplementary && !egoSame && (
                    <p className="text-xs text-slate-500 italic">
                      Vaše vývojové čísla sú odlišné — vzťah je o vzájomnom učení a doplňovaní.
                    </p>
                  )}
                </div>
              </GlassCard>
            );
          })()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compatibility.strengths.length > 0 && (
              <GlassCard>
                <h3 className="font-medium text-green-300 mb-3">Silné stránky</h3>
                {compatibility.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1"><span className="text-green-400">+</span><span className="text-xs text-slate-300">{s}</span></div>
                ))}
              </GlassCard>
            )}

            {compatibility.challenges.length > 0 && (
              <GlassCard>
                <h3 className="font-medium text-amber-300 mb-3">Výzvy</h3>
                {compatibility.challenges.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1"><span className="text-amber-400">!</span><span className="text-xs text-slate-300">{c}</span></div>
                ))}
              </GlassCard>
            )}

            <GlassCard>
              <h3 className="font-medium text-indigo-300 mb-3">Odporúčania</h3>
              {compatibility.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 mb-1"><span className="text-indigo-400">→</span><span className="text-xs text-slate-300">{r}</span></div>
              ))}
            </GlassCard>

            <GlassCard>
              <h3 className="font-medium text-rose-300 mb-3">Rituály pre pár</h3>
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
            const hd1 = calculateHumanDesign(parseInt(partner1.day), parseInt(partner1.month), parseInt(partner1.year), partner1.hour !== '' ? parseInt(partner1.hour) : 12, partner1.minute !== '' ? parseInt(partner1.minute) : 0, pTz1);
            const hd2 = calculateHumanDesign(parseInt(partner2.day), parseInt(partner2.month), parseInt(partner2.year), partner2.hour !== '' ? parseInt(partner2.hour) : 12, partner2.minute !== '' ? parseInt(partner2.minute) : 0, pTz2);
            const gates1 = new Set([...hd1.personalityGates.map(g => g.gate), ...hd1.designGates.map(g => g.gate)]);
            const gates2 = new Set([...hd2.personalityGates.map(g => g.gate), ...hd2.designGates.map(g => g.gate)]);
            const partnerGK = [...gates1].filter(g => gates2.has(g)).slice(0, 4).map(g => getGeneKeyByGate(g)).filter(Boolean);
            return (
              <>
              <GlassCard>
                <h3 className="font-medium text-purple-300 mb-3">Human Design kompatibilita</h3>
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
              <span>✎</span> Upraviť údaje
            </button>
          </div>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">Nový výpočet</button>
        </div>
      )}

      {/* RODINNÝ MÓD */}
      {mode === 'family' && (!familyResults || editing) && (
        <div className="space-y-4">
          <GlassCard>
            <PersonForm person={parent} onChange={setParent} label="Rodič" />
          </GlassCard>

          {children.map((child, idx) => (
            <GlassCard key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Dieťa {idx + 1}</span>
                {children.length > 1 && (
                  <button onClick={() => removeChild(idx)} className="text-xs text-red-600 hover:text-red-800 font-medium">Odstrániť</button>
                )}
              </div>
              <PersonForm person={child} onChange={(p) => { const next = [...children]; next[idx] = p; setChildren(next); }} label="" />
            </GlassCard>
          ))}

          <button
            type="button"
            onClick={addChild}
            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-400 text-slate-900 text-sm font-bold bg-white hover:bg-slate-100 active:bg-slate-200"
          >
            + Pridať ďalšie dieťa
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => { handleFamilyCalc(); setEditing(false); }}
              disabled={!isPersonValid(parent) || !children.some(isPersonValid)}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-900 disabled:cursor-not-allowed"
            >
              {familyResults ? 'Prepočítať' : 'Vypočítať kompatibilitu'}
            </button>
            {editing && (
              <button onClick={() => setEditing(false)} className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200">Zrušiť</button>
            )}
          </div>
        </div>
      )}

      {mode === 'family' && familyResults && !editing && (
        <div className="space-y-6">
          {/* Tvoje čítanie */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">Tvoje čítanie — ako pracovať s rodič-dieťa výkladom</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                Rodič <strong className="text-slate-900">{parent.name}</strong> a <strong className="text-slate-900">{familyResults.length}</strong> {familyResults.length === 1 ? 'dieťa' : 'deti'}.
                Každé dieťa prichádza s vlastnou energiou — nie je kópia rodiča. <strong>Profil dieťaťa</strong> ukazuje jeho ŽČ, K3 poslanie, kozmický vek a karmické lekcie.
              </p>
              <p>
                <strong>Rola rodiča</strong> hovorí, čím ste pre toto konkrétne dieťa. <strong>Komunikácia</strong> ukazuje, ako s ním najlepšie hovoriť. <strong>Potreby dieťaťa</strong> sú to, čo od vás naozaj potrebuje.
              </p>
              <p>
                <strong>Human Design</strong> prekrývanie ukazuje kde máte rovnakú energiu (rozumiete si), kde vy podmieňujete dieťa (absorbuje vašu energiu) a kde vás dieťa učí (má energiu ktorú vy nemáte).
              </p>
              <p>
                <strong>Génové kľúče</strong> sú spoločné brány — témy, na ktorých obaja pracujete. Tieň je to čo sa vo vzťahu spúšťa, dar je to čo z toho spoločne vytvárate. Technika je praktický nástroj.
              </p>
              <p className="text-xs text-slate-500 italic">
                Nízke % nie je zlyhanie — je to signál, že toto dieťa vás učí niečo nové. Práve tam je najväčší rast pre oboch.
              </p>
            </div>
          </GlassCard>

          <p className="text-sm text-slate-600">Rodič: <span className="text-white font-medium">{parent.name}</span></p>

          {familyResults.map(({ child, result }, idx) => {
            const childNum = calculateFullNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
            const childDev = calculateDevelopmentalNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
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
                    <p className="text-xs text-violet-700 font-semibold uppercase mb-1">Profil dieťaťa</p>
                    <p className="text-xs text-slate-300">
                      <strong>ŽČ {childNum.lifePathNumber}</strong> z {childNum.lifePathFrom}.{' '}
                      <strong>K3 (životné poslanie):</strong> {childDev.circled[2].value}.{' '}
                      <strong>Kozmický vek:</strong> {childNum.age === 'aquarius' ? 'Vodnár — nové paradigmy, technológie, kolektívne vedomie' : 'Ryby — duchovnosť, introspekcia, tradičná múdrosť'}.{' '}
                      <strong>Polarita ega:</strong> {childDev.egoPolarity === 'masculine' ? 'mužská (akcia, vymedovanie)' : childDev.egoPolarity === 'feminine' ? 'ženská (prijímanie, otvorenosť)' : 'neutrálna'}.
                    </p>
                    {childNum.karmicTriangles.length > 0 && (
                      <p className="text-xs text-indigo-300 mt-1">
                        <strong>Karmické cykly:</strong> {childNum.karmicTriangles.map(t => `${t.label} (${t.fromAge}–${t.toAge ?? '∞'} r., vibrácia ${t.vibration})`).join(' → ')}
                      </p>
                    )}
                    {childNum.karmicDebts.length > 0 && (
                      <p className="text-xs text-rose-300 mt-1">
                        <strong>Karmické dlhy:</strong> {childNum.karmicDebts.map(d => `${d.number} (${d.theme})`).join(', ')} — oblasti kde dieťa nesie hlbšiu lekciu z minulosti.
                      </p>
                    )}
                    {childNum.isolatedNumbers.length > 0 && (
                      <p className="text-xs text-amber-700 mt-1">
                        <strong>Izolované čísla:</strong> {childNum.isolatedNumbers.join(', ')} — energie kde potrebuje vašu pozornosť a podporu.
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-slate-600 mb-1">Rola rodiča</p>
                    <p className="text-sm text-slate-300">{result.parentRole}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Komunikácia</p>
                    <p className="text-sm text-slate-300">{result.communicationStyle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Emocionálne potreby</p>
                    {result.emotionalNeeds.map((n, i) => (
                      <p key={i} className="text-xs text-cyan-300">• {n}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Potreby dieťaťa</p>
                    {result.childNeeds.map((n, i) => (
                      <p key={i} className="text-xs text-purple-300">• {n}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Odporúčania</p>
                    {result.recommendations.map((r, i) => (
                      <p key={i} className="text-xs text-indigo-300">→ {r}</p>
                    ))}
                  </div>

                  {/* HD porovnanie rodič↔dieťa */}
                  {(() => {
                    const parentCityHd = findCity(parent.birthPlace);
                    const childCityHd = findCity(child.birthPlace);
                    const parentTzHd = getTimezoneFromCoords(parentCityHd?.lat ?? 48.15, parentCityHd?.lon ?? 17.11);
                    const childTzHd = getTimezoneFromCoords(childCityHd?.lat ?? 48.15, childCityHd?.lon ?? 17.11);
                    const parentHd = calculateHumanDesign(parseInt(parent.day), parseInt(parent.month), parseInt(parent.year), parent.hour ? parseInt(parent.hour) : 12, parent.minute ? parseInt(parent.minute) : 0, parentTzHd);
                    const childHd = calculateHumanDesign(parseInt(child.day), parseInt(child.month), parseInt(child.year), child.hour ? parseInt(child.hour) : 12, child.minute ? parseInt(child.minute) : 0, childTzHd);
                    const sharedDefined = parentHd.definedCenters.filter(c => childHd.definedCenters.includes(c));
                    const parentOnly = parentHd.definedCenters.filter(c => !childHd.definedCenters.includes(c));
                    const childOnly = childHd.definedCenters.filter(c => !parentHd.definedCenters.includes(c));
                    const parentSunGate = parentHd.personalityGates.find(g => g.planet === 'Slnko')?.gate;
                    const childSunGate = childHd.personalityGates.find(g => g.planet === 'Slnko')?.gate;
                    const parentGates = new Set([...parentHd.personalityGates.map(g => g.gate), ...parentHd.designGates.map(g => g.gate)]);
                    const childGates = new Set([...childHd.personalityGates.map(g => g.gate), ...childHd.designGates.map(g => g.gate)]);
                    const sharedGates = [...parentGates].filter(g => childGates.has(g));
                    const sharedGeneKeys = sharedGates.slice(0, 3).map(g => getGeneKeyByGate(g)).filter(Boolean);
                    return (
                      <>
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <p className="text-xs text-cyan-300 font-semibold uppercase mb-1">Human Design — energetické prekrývanie</p>
                        <p className="text-[11px] text-slate-300 mb-2">
                          <strong>Rodič:</strong> {parentHd.type} ({parentHd.authority}) · <strong>Dieťa:</strong> {childHd.type} ({childHd.authority})
                        </p>
                        {sharedDefined.length > 0 && (
                          <p className="text-[11px] text-slate-600">
                            <strong className="text-cyan-300">Spoločne definované:</strong> {sharedDefined.join(', ')} — tu si rozumiete energeticky, obe máte stabilnú energiu.
                          </p>
                        )}
                        {parentOnly.length > 0 && (
                          <p className="text-[11px] text-slate-600 mt-1">
                            <strong className="text-rose-300">Rodič podmieňuje dieťa:</strong> {parentOnly.join(', ')} — dieťa absorbuje vašu energiu v týchto oblastiach.
                          </p>
                        )}
                        {childOnly.length > 0 && (
                          <p className="text-[11px] text-slate-600 mt-1">
                            <strong className="text-emerald-300">Dieťa učí rodiča:</strong> {childOnly.join(', ')} — tu má dieťa energiu ktorú vy nemáte.
                          </p>
                        )}
                        {parentHd.type !== childHd.type && (
                          <p className="text-[11px] text-amber-300 mt-1">
                            Rôzne typy ({parentHd.type} vs {childHd.type}) — rešpektujte odlišnú stratégiu dieťaťa: „{childHd.strategy.toLowerCase()}".
                          </p>
                        )}
                      </div>
                      {sharedGeneKeys.length > 0 && (
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-3">
                          <p className="text-xs text-purple-300 font-semibold uppercase">Spoločné Génové kľúče — transformačná cesta rodič ↔ dieťa</p>
                          <p className="text-[11px] text-slate-600">
                            Brány aktívne u rodiča aj dieťaťa — spoločné témy, na ktorých rastete. Tieň je to čo sa vo vzťahu spúšťa, dar je to čo z toho vytvárate.
                          </p>
                          {sharedGeneKeys.map(gk => (
                            <div key={gk!.gate} className="p-2.5 rounded-lg bg-white/5 border border-purple-500/10 space-y-1.5">
                              <p className="text-xs font-medium text-slate-800">
                                Brána {gk!.gate}: <span className="text-rose-300">{gk!.shadow}</span> → <span className="text-amber-300">{gk!.gift}</span> → <span className="text-emerald-300">{gk!.siddhi}</span>
                              </p>
                              <p className="text-[11px] text-rose-300"><strong>Tieň:</strong> {gk!.shadowDescription}</p>
                              <p className="text-[11px] text-amber-300"><strong>Dar:</strong> {gk!.giftDescription}</p>
                              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mt-1">
                                <p className="text-[10px] text-emerald-400 uppercase mb-0.5">Čo s tým prakticky</p>
                                <p className="text-[11px] text-slate-300">
                                  Keď vidíte vo vzťahu tieň (<em>{gk!.shadow.toLowerCase()}</em>) — nie je to chyba dieťaťa ani vaša. Je to signál.
                                  Vedomá voľba: prejdite spolu k daru (<em>{gk!.gift.toLowerCase()}</em>).
                                  {gk!.nlpTechnique && <> <strong>Technika:</strong> {gk!.nlpTechnique} — {gk!.nlpDescription}</>}
                                </p>
                              </div>
                            </div>
                          ))}
                          {parentSunGate === childSunGate && parentSunGate && (
                            <p className="text-[11px] text-amber-300">Rovnaká Slnečná brána ({parentSunGate}) — hlboké zrkadlenie životnej témy. Rodič a dieťa zdieľajú rovnakú karmickú lekciu.</p>
                          )}
                          {sharedGeneKeys.length > 1 && (
                            <p className="text-[11px] text-slate-500 italic">
                              Spoločný príbeh: Rodič prináša skúsenosť a dieťa čerstvý pohľad na rovnaké témy. Keď obaja vedome pracujete na transformácii, vzťah sa stáva priestorom rastu pre oboch.
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
              <h3 className="font-medium text-slate-900 mb-3">Interakcie medzi deťmi</h3>
              {familyResults.map(({ child: c1 }, i) =>
                familyResults.slice(i + 1).map(({ child: c2 }, j) => {
                  const n1 = calculateFullNumerology(parseInt(c1.day), parseInt(c1.month), parseInt(c1.year));
                  const n2 = calculateFullNumerology(parseInt(c2.day), parseInt(c2.month), parseInt(c2.year));
                  const compat = calculatePartnerCompatibility(n1, n2);
                  const c1City = findCity(c1.birthPlace);
                  const c2City = findCity(c2.birthPlace);
                  const c1Tz = getTimezoneFromCoords(c1City?.lat ?? 48.15, c1City?.lon ?? 17.11);
                  const c2Tz = getTimezoneFromCoords(c2City?.lat ?? 48.15, c2City?.lon ?? 17.11);
                  const hd1 = calculateHumanDesign(parseInt(c1.day), parseInt(c1.month), parseInt(c1.year), c1.hour ? parseInt(c1.hour) : 12, c1.minute ? parseInt(c1.minute) : 0, c1Tz);
                  const hd2 = calculateHumanDesign(parseInt(c2.day), parseInt(c2.month), parseInt(c2.year), c2.hour ? parseInt(c2.hour) : 12, c2.minute ? parseInt(c2.minute) : 0, c2Tz);
                  const g1 = new Set([...hd1.personalityGates.map(g => g.gate), ...hd1.designGates.map(g => g.gate)]);
                  const g2 = new Set([...hd2.personalityGates.map(g => g.gate), ...hd2.designGates.map(g => g.gate)]);
                  const childGK = [...g1].filter(g => g2.has(g)).slice(0, 3).map(g => getGeneKeyByGate(g)).filter(Boolean);
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
                          <p className="text-[11px] text-purple-300 font-semibold">Spoločné Génové kľúče:</p>
                          {childGK.map(gk => (
                            <div key={gk!.gate} className="pl-2 border-l-2 border-purple-500/30 space-y-0.5">
                              <p className="text-[11px] text-white">Brána {gk!.gate}: <span className="text-rose-300">{gk!.shadow}</span> → <span className="text-amber-300">{gk!.gift}</span> → <span className="text-emerald-300">{gk!.siddhi}</span></p>
                              <p className="text-[10px] text-slate-400">{gk!.shadowDescription}</p>
                              <p className="text-[10px] text-amber-300">Dar: {gk!.giftDescription}</p>
                              {gk!.nlpTechnique && <p className="text-[10px] text-indigo-300">Prakticky: {gk!.nlpTechnique} — {gk!.nlpDescription}</p>}
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
              <span>✎</span> Upraviť údaje
            </button>
          </div>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">Nový výpočet</button>
        </div>
      )}

      {/* ASTRO KOMPATIBILITA MÓD */}
      {mode === 'astro' && (!synastryResult || editing) && (
        <GlassCard>
          {!synastryResult && (
            <p className="text-sm text-slate-600 mb-4">
              <strong className="text-slate-900">Astro kompatibilita</strong> porovnáva astrologické pozície oboch partnerov -- Slnko, Mesiac, Venušu a Mars. Výsledkom je synastria založená na elementálnej harmónii a planetárnej kompatibilite.
            </p>
          )}
        </GlassCard>
      )}
      {mode === 'astro' && (!synastryResult || editing) && (
        <GlassCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-sm text-slate-600 font-medium">Partner 1</p>
              <input
                type="text"
                placeholder="Meno"
                value={astroPartner1.name}
                onChange={e => setAstroPartner1({ ...astroPartner1, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
              />
              <div className="flex gap-2">
                <input type="number" placeholder="Deň" min={1} max={31} value={astroPartner1.day} onChange={e => setAstroPartner1({ ...astroPartner1, day: e.target.value })} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder="Mesiac" min={1} max={12} value={astroPartner1.month} onChange={e => setAstroPartner1({ ...astroPartner1, month: e.target.value })} className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder="Rok" min={1900} max={2100} value={astroPartner1.year} onChange={e => setAstroPartner1({ ...astroPartner1, year: e.target.value })} className="flex-1 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Hod" min={0} max={23} value={astroPartner1.hour} onChange={e => setAstroPartner1({ ...astroPartner1, hour: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center text-sm focus:outline-none focus:border-indigo-500/50" />
                <span className="text-slate-400">:</span>
                <input type="number" placeholder="Min" min={0} max={59} value={astroPartner1.minute} onChange={e => setAstroPartner1({ ...astroPartner1, minute: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center text-sm focus:outline-none focus:border-indigo-500/50" />
                <span className="text-[10px] text-slate-500">Čas (24h)</span>
              </div>
              <input type="text" placeholder="Miesto narodenia" value={astroPartner1.birthPlace} onChange={e => setAstroPartner1({ ...astroPartner1, birthPlace: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-600 font-medium">Partner 2</p>
              <input
                type="text"
                placeholder="Meno"
                value={astroPartner2.name}
                onChange={e => setAstroPartner2({ ...astroPartner2, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
              />
              <div className="flex gap-2">
                <input type="number" placeholder="Deň" min={1} max={31} value={astroPartner2.day} onChange={e => setAstroPartner2({ ...astroPartner2, day: e.target.value })} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder="Mesiac" min={1} max={12} value={astroPartner2.month} onChange={e => setAstroPartner2({ ...astroPartner2, month: e.target.value })} className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder="Rok" min={1900} max={2100} value={astroPartner2.year} onChange={e => setAstroPartner2({ ...astroPartner2, year: e.target.value })} className="flex-1 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Hod" min={0} max={23} value={astroPartner2.hour} onChange={e => setAstroPartner2({ ...astroPartner2, hour: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center text-sm focus:outline-none focus:border-indigo-500/50" />
                <span className="text-slate-400">:</span>
                <input type="number" placeholder="Min" min={0} max={59} value={astroPartner2.minute} onChange={e => setAstroPartner2({ ...astroPartner2, minute: e.target.value })} className="w-16 px-2 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center text-sm focus:outline-none focus:border-indigo-500/50" />
                <span className="text-[10px] text-slate-500">Čas (24h)</span>
              </div>
              <input type="text" placeholder="Miesto narodenia" value={astroPartner2.birthPlace} onChange={e => setAstroPartner2({ ...astroPartner2, birthPlace: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { handleAstroCalc(); setEditing(false); }}
              disabled={!isAstroPersonValid(astroPartner1) || !isAstroPersonValid(astroPartner2)}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-900 disabled:cursor-not-allowed"
            >
              {synastryResult ? 'Prepočítať' : 'Vypočítať astro kompatibilitu'}
            </button>
            {editing && (
              <button onClick={() => setEditing(false)} className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200">Zrušiť</button>
            )}
          </div>
        </GlassCard>
      )}

      {mode === 'astro' && synastryResult && !editing && (
        <div className="space-y-6">
          {/* Tvoje čítanie */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">Tvoje čítanie — ako pracovať s astro kompatibilitou</h3>
            <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong className="text-slate-900">{synastryResult.person1.name} & {synastryResult.person2.name}</strong> — celková astro kompatibilita <strong className="text-slate-900">{synastryResult.overallScore}%</strong>.
                  Porovnávame elementy planét — nie znamenia samotné. Komplementárne elementy (Oheň+Vzduch, Zem+Voda) sa dopĺňajú.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <p className="text-amber-300 font-medium">Slnko ({synastryResult.sunCompatibility.score}%)</p>
                    <p className="text-slate-400">Vedomé ja — ako si rozumiete na povrchu</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <p className="text-purple-300 font-medium">Mesiac ({synastryResult.moonCompatibility.score}%)</p>
                    <p className="text-slate-400">Emócie — ako sa cítite spolu v súkromí</p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <p className="text-rose-300 font-medium">Venuša ({synastryResult.venusCompatibility.score}%)</p>
                    <p className="text-slate-400">Láska — ako dávate a prijímáte náklonnosť</p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <p className="text-red-300 font-medium">Mars ({synastryResult.marsCompatibility.score}%)</p>
                    <p className="text-slate-400">Energia — ako konáte a riešite konflikty</p>
                  </div>
                </div>
                <p>
                  <strong>Synastrické aspekty</strong> ukazujú presné uhly medzi planétami — harmonické (podpora) vs napäťové (rast). <strong>Davison chart</strong> je „tretia osoba" — vzťah ako bytosť. <strong>Composite</strong> je symbolická štruktúra vzťahu.
                </p>
                <p className="italic text-slate-500">Nízke skóre neznamená „nevhodný pár" — znamená „vyžaduje vedomú prácu". Najlepšie vzťahy často nie sú najľahšie.</p>
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
              <p className="text-sm text-slate-600">Celková astro kompatibilita</p>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-slate-400">Slnko (identita)</h4>
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
                <h4 className="text-sm text-slate-400">Mesiac (emócie)</h4>
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
                <h4 className="text-sm text-slate-400">Venuša (láska)</h4>
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
                <h4 className="text-sm text-slate-400">Mars (energia)</h4>
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
            <h3 className="font-medium text-slate-900 mb-3">Elementálna rovnováha</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 p-3 rounded-xl bg-slate-800/50">
                <p className="text-xs text-slate-600">{synastryResult.person1.name}</p>
                <p className="text-sm font-medium text-slate-800">Dominantný živel: {synastryResult.elementBalance.person1}</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-slate-800/50">
                <p className="text-xs text-slate-600">{synastryResult.person2.name}</p>
                <p className="text-sm font-medium text-slate-800">Dominantný živel: {synastryResult.elementBalance.person2}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              {synastryResult.elementBalance.compatible
                ? 'Vaše dominantné živly sú kompatibilné -- prirodzene sa dopĺňate a vaša energia ladí.'
                : 'Vaše dominantné živly sú odlišné -- to prináša rôznorodosť, ale vyžaduje viac pochopenia a prispôsobenia.'}
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
                <h3 className="font-medium text-slate-900 mb-2">Synastrické aspekty (všetky planéty)</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Každý uhol medzi planétami partnerov tvorí aspekt – buď harmonický (trigon, sextil), napäťový (kvadratúra, opozícia) alebo neutrálny (spojenie). Orbis = odchýlka od ideálu.
                </p>

                {/* Súhrnný score */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-center">
                    <p className="text-[10px] uppercase text-indigo-700 font-semibold">Skóre</p>
                    <p className="text-2xl font-bold text-indigo-700">{summary.score}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-50 border border-green-200 text-center">
                    <p className="text-[10px] uppercase text-green-700 font-semibold">Harmonické</p>
                    <p className="text-2xl font-bold text-green-700">{summary.harmonic}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-center">
                    <p className="text-[10px] uppercase text-rose-700 font-semibold">Napäťové</p>
                    <p className="text-2xl font-bold text-rose-700">{summary.tense}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[10px] uppercase text-slate-700 font-semibold">Neutrálne</p>
                    <p className="text-2xl font-bold text-slate-700">{summary.neutral}</p>
                  </div>
                </div>

                {/* Top 12 najpresnejších */}
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2">
                    Top 12 najpresnejších ({summary.total} celkom)
                  </p>
                  {summary.topAspects.map((a: SynastryAspect, i: number) => {
                    const bg = a.nature === 'harmonic' ? 'bg-green-50 border-green-200' :
                               a.nature === 'tense' ? 'bg-rose-50 border-rose-200' :
                               'bg-slate-50 border-slate-200';
                    const iconColor = a.nature === 'harmonic' ? 'text-green-700' :
                                      a.nature === 'tense' ? 'text-rose-700' : 'text-slate-700';
                    const meaning = getAspectMeaning(a.planet1, a.planet2, a.nature);
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
                  Skóre vychádza z prevahy harmonických aspektov nad napäťovými. Napäťové nie sú "zlé" — sú motorom rastu vzťahu, ak sa s nimi vedome pracuje.
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
              parseInt(astroPartner1.day), parseInt(astroPartner1.month), parseInt(astroPartner1.year),
              astroPartner1.hour ? parseInt(astroPartner1.hour) : 12,
              astroPartner1.minute ? parseInt(astroPartner1.minute) : 0,
              lat1, lon1,
              parseInt(astroPartner2.day), parseInt(astroPartner2.month), parseInt(astroPartner2.year),
              astroPartner2.hour ? parseInt(astroPartner2.hour) : 12,
              astroPartner2.minute ? parseInt(astroPartner2.minute) : 0,
              lat2, lon2
            );
            const composite = calculateComposite(r1, r2);
            return (
              <>
                <GlassCard>
                  <h3 className="font-medium text-slate-900 mb-1">Davison chart — vzťahový horoskop</h3>
                  <p className="text-xs text-slate-600 mb-3">
                    Reálny astrologický graf pre <strong>stredný čas a stredné miesto</strong> oboch narodení.
                    Symbolizuje "tretiu osobu" — samotný vzťah ako bytosť. Ascendent {davison.ascendant.symbol} {davison.ascendant.name}.
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
                              <p className="text-xs text-amber-700 uppercase">Slnko vzťahu</p>
                              <p className="text-sm text-white mt-1">{sun.symbol} {sun.sign.symbol} {sun.sign.name}</p>
                              <p className="text-[10px] text-slate-400">{sun.degree.toFixed(1)}° · {davison.planetHouses[sun.name] ? `${davison.planetHouses[sun.name]}. dom` : ''}</p>
                            </div>
                          )}
                          {moon && (
                            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                              <p className="text-xs text-indigo-300 uppercase">Mesiac vzťahu</p>
                              <p className="text-sm text-white mt-1">{moon.symbol} {moon.sign.symbol} {moon.sign.name}</p>
                              <p className="text-[10px] text-slate-400">{moon.degree.toFixed(1)}° · {davison.planetHouses[moon.name] ? `${davison.planetHouses[moon.name]}. dom` : ''}</p>
                            </div>
                          )}
                          {venus && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                              <p className="text-xs text-rose-300 uppercase">Venuša vzťahu</p>
                              <p className="text-sm text-white mt-1">{venus.symbol} {venus.sign.symbol} {venus.sign.name}</p>
                              <p className="text-[10px] text-slate-400">{venus.degree.toFixed(1)}° · {davison.planetHouses[venus.name] ? `${davison.planetHouses[venus.name]}. dom` : ''}</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-3">
                    Davison berie do úvahy presný čas a miesto — preto je užitočný pri presných narodeninových údajoch oboch partnerov.
                  </p>
                </GlassCard>

                <GlassCard>
                  <h3 className="font-medium text-slate-900 mb-1">Composite chart — symbolický graf vzťahu</h3>
                  <p className="text-xs text-slate-600 mb-3">
                    Pre každú planétu sa zoberie <strong>midpoint</strong> longitúd oboch partnerov (kratší oblúk).
                    Composite NIE JE skutočný horoskop — je to symbolická štruktúra vzťahu samotného.
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
                    Composite Slnko = ako vzťah žiari navonok; Composite Mesiac = vnútorný emocionálny tón vzťahu;
                    Composite Venuša = láska ktorá medzi vami plynie.
                  </p>
                </GlassCard>
              </>
            );
          })()}

          <div className="flex justify-end">
            <button onClick={() => setEditing(true)} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1 shadow-sm">
              <span>✎</span> Upraviť údaje
            </button>
          </div>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">Nový výpočet</button>
        </div>
      )}

      {/* RODINNÁ KONŠTELÁCIA — formulár */}
      {mode === 'constellation' && (!constellationResult || editing) && (
        <div className="space-y-4">
          <GlassCard>
            <p className="text-sm text-slate-600 mb-4">
              <strong className="text-slate-900">Rodinná konštelácia</strong> — zadaj oboch rodičov a deti. Výsledok ukáže partnerský vzťah rodičov, vzťah každého rodiča ku každému dieťaťu, vzťahy medzi súrodencami a celkový rodinný energetický profil.
            </p>
          </GlassCard>

          <GlassCard>
            <PersonForm person={constFather} onChange={setConstFather} label="Otec" />
          </GlassCard>
          <GlassCard>
            <PersonForm person={constMother} onChange={setConstMother} label="Matka" />
          </GlassCard>

          {constChildren.map((child, idx) => (
            <GlassCard key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Dieťa {idx + 1}</span>
                {constChildren.length > 1 && (
                  <button onClick={() => setConstChildren(constChildren.filter((_, i) => i !== idx))} className="text-xs text-red-600 hover:text-red-800 font-medium">Odstrániť</button>
                )}
              </div>
              <PersonForm person={child} onChange={(p) => { const next = [...constChildren]; next[idx] = p; setConstChildren(next); }} label="" />
            </GlassCard>
          ))}

          <button
            type="button"
            onClick={() => setConstChildren([...constChildren, emptyPerson()])}
            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-400 text-slate-900 text-sm font-bold bg-white hover:bg-slate-100 active:bg-slate-200"
          >
            + Pridať ďalšie dieťa
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => { handleConstellationCalc(); setEditing(false); }}
              disabled={!isPersonValid(constFather) || !isPersonValid(constMother) || !constChildren.some(isPersonValid)}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-900 disabled:cursor-not-allowed"
            >
              {constellationResult ? 'Prepočítať' : 'Vypočítať rodinnú konšteláciu'}
            </button>
            {editing && (
              <button onClick={() => setEditing(false)} className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200">Zrušiť</button>
            )}
          </div>
        </div>
      )}

      {/* RODINNÁ KONŠTELÁCIA — výsledky */}
      {mode === 'constellation' && constellationResult && !editing && (
        <div className="space-y-6">
          {/* Tvoje čítanie */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">Tvoje čítanie — ako pracovať s rodinnou konšteláciou</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                Rodina <strong className="text-slate-900">{constFather.name} & {constMother.name}</strong> + <strong className="text-slate-900">{constChildren.filter(isPersonValid).length}</strong> {constChildren.filter(isPersonValid).length === 1 ? 'dieťa' : 'deti'}.
                Partnerský vzťah rodičov (<strong className="text-slate-900">{constellationResult.partnerCompat.overallScore}%</strong>) je základ — jeho kvalita sa odráža na celej rodine.
              </p>
              <p>
                <strong>Charakterová synastria</strong> porovnáva mriežky rodičov, <strong>vývojová</strong> ich K1-K4 a polaritu ega. <strong>HD bodygraph</strong> ukazuje elektromagnetické kanály (príťažlivosť), kompromisné (spoločná energia) a podmieňovanie.
              </p>
              <p>
                Pri každom dieťati: <strong>ŽČ + K3</strong> (poslanie), <strong>kozmický vek</strong> (generačné nastavenie), <strong>HD typ + centrá</strong> (kde rodič podmieňuje, kde dieťa učí), <strong>Génové kľúče</strong> (spoločné transformačné témy s praktickou technikou).
              </p>
              <p>
                <strong>Medzi súrodencami:</strong> kompatibilita, HD centrá (kto koho podmieňuje), Gene Keys (spoločné lekcie). Rodinné číslo <strong className="text-slate-900">{reduceToSingle(constellationResult.familyNumbers.reduce((a, b) => a + b, 0))}</strong> je spoločná téma celej rodiny.
              </p>
              <p className="text-xs text-slate-500 italic">
                Nízka kompatibilita nie je problém — je to signál učenia. Najväčší rast je tam, kde je najväčšie trenie.
              </p>
            </div>
          </GlassCard>

          {/* Celkový rodinný profil */}
          <GlassCard glow>
            <h3 className="font-medium text-slate-900 mb-3">Rodinný energetický profil</h3>
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
                      <strong className="text-amber-300">Opakujúce sa čísla:</strong>{' '}
                      {repeated.map(([n, c]) => `${n} (${c}×)`).join(', ')} — tieto energie sú v rodine zosilnené, je to spoločná téma.
                    </p>
                  )}
                  {allDifferent && (
                    <p><strong className="text-emerald-300">Všetky čísla sú rôzne</strong> — rodina pokrýva široké spektrum energií, každý prináša niečo unikátne.</p>
                  )}
                  <p><strong>Rodinné číslo:</strong> {familySum} — {
                    familySum === 1 ? 'Rodina lídrov. Spoločná lekcia: nezávislosť, iniciatíva a odvaha ísť vlastnou cestou. Každý člen sa učí stáť na vlastných nohách.' :
                    familySum === 2 ? 'Rodina harmónie. Spoločná lekcia: spolupráca, diplomacia a vzájomná podpora. Učíte sa počúvať a vyvažovať.' :
                    familySum === 3 ? 'Rodina tvorivosti. Spoločná lekcia: sebavyjadrenie, radosť a komunikácia. Vaším poslaním je tvoriť a zdieľať.' :
                    familySum === 4 ? 'Rodina staviteľov. Spoločná lekcia: stabilita, zodpovednosť a budovanie trvalých hodnôt. Základ je bezpečie.' :
                    familySum === 5 ? 'Rodina dobrodružstva. Spoločná lekcia: sloboda, zmena a rast cez nové skúsenosti. Učíte sa adaptabilite.' :
                    familySum === 6 ? 'Rodina lásky. Spoločná lekcia: zodpovednosť, starostlivosť a bezpodmienečná láska. Domov je vaše poslanie.' :
                    familySum === 7 ? 'Rodina hľadačov. Spoločná lekcia: duchovno, introspekcia a hľadanie pravdy. Učíte sa dôverovať vnútornej múdrosti.' :
                    familySum === 8 ? 'Rodina hojnosti. Spoločná lekcia: manifestácia, sila a spoločné dosahovanie cieľov. Učíte sa moci a zodpovednosti.' :
                    'Rodina služby. Spoločná lekcia: odpustenie, univerzálna láska a služba vyššiemu dobru. Učíte sa púšťať a slúžiť.'
                  }</p>
                </div>
              );
            })()}
          </GlassCard>

          {/* Partnerský vzťah rodičov */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-2">{constFather.name} & {constMother.name} — partnerský vzťah</h3>
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
            const hdF = calculateHumanDesign(parseInt(constFather.day), parseInt(constFather.month), parseInt(constFather.year), constFather.hour ? parseInt(constFather.hour) : 12, constFather.minute ? parseInt(constFather.minute) : 0, fatherTzHd);
            const hdM = calculateHumanDesign(parseInt(constMother.day), parseInt(constMother.month), parseInt(constMother.year), constMother.hour ? parseInt(constMother.hour) : 12, constMother.minute ? parseInt(constMother.minute) : 0, motherTzHd);
            return (
              <GlassCard>
                <h3 className="font-medium text-purple-300 mb-3">Human Design — rodičovský pár</h3>
                <PartnerBodygraph result1={hdF} result2={hdM} name1={constFather.name} name2={constMother.name} />
              </GlassCard>
            );
          })()}

          {/* Charakterová synastria rodičov */}
          {(() => {
            const numF = calculateFullNumerology(parseInt(constFather.day), parseInt(constFather.month), parseInt(constFather.year));
            const numM = calculateFullNumerology(parseInt(constMother.day), parseInt(constMother.month), parseInt(constMother.year));
            const sharedFull = numF.fullPlanes.filter(p => numM.fullPlanes.includes(p));
            const sharedEmpty = numF.emptyPlanes.filter(p => numM.emptyPlanes.includes(p));
            const sharedIsolated = numF.isolatedNumbers.filter(n => numM.isolatedNumbers.includes(n));
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-1">Charakterová synastria rodičov</h3>
                <p className="text-xs text-slate-600 mb-3">Porovnanie numerologických mriežok — spoločné silné stránky a oblasti rastu.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-[11px] text-indigo-300 font-semibold">{constFather.name}: ŽČ {numF.lifePathNumber}</p>
                    <p className="text-[11px] text-slate-600">Plné: {numF.fullPlanes.length > 0 ? numF.fullPlanes.join(', ') : 'žiadne'}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <p className="text-[11px] text-violet-300 font-semibold">{constMother.name}: ŽČ {numM.lifePathNumber}</p>
                    <p className="text-[11px] text-slate-600">Plné: {numM.fullPlanes.length > 0 ? numM.fullPlanes.join(', ') : 'žiadne'}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {sharedFull.length > 0 && (
                    <p className="text-[11px] text-emerald-300">Spoločné silné roviny: <strong>{sharedFull.join(', ')}</strong> — tu si rozumiete prirodzene.</p>
                  )}
                  {sharedEmpty.length > 0 && (
                    <p className="text-[11px] text-amber-300">Spoločné prázdne roviny: <strong>{sharedEmpty.join(', ')}</strong> — spoločné slepé miesta, deti ich môžu dopĺňať.</p>
                  )}
                  {sharedIsolated.length > 0 && (
                    <p className="text-[11px] text-rose-300">Spoločné izolované: <strong>{sharedIsolated.join(', ')}</strong> — spoločné napätie, ktoré sa prenáša na deti.</p>
                  )}
                  {sharedFull.length === 0 && sharedEmpty.length === 0 && (
                    <p className="text-[11px] text-slate-500 italic">Rôzne mriežky — rodičia sa vzájomne dopĺňajú v rôznych oblastiach.</p>
                  )}
                </div>
              </GlassCard>
            );
          })()}

          {/* Vývojová synastria rodičov */}
          {(() => {
            const devF = calculateDevelopmentalNumerology(parseInt(constFather.day), parseInt(constFather.month), parseInt(constFather.year));
            const devM = calculateDevelopmentalNumerology(parseInt(constMother.day), parseInt(constMother.month), parseInt(constMother.year));
            const k3Match = devF.circled[2].value === devM.circled[2].value;
            const egoComplementary = (devF.egoPolarity === 'masculine' && devM.egoPolarity === 'feminine') || (devF.egoPolarity === 'feminine' && devM.egoPolarity === 'masculine');
            const egoSame = devF.egoPolarity === devM.egoPolarity && devF.egoPolarity !== 'none';
            return (
              <GlassCard>
                <h3 className="font-medium text-slate-900 mb-1">Vývojová synastria rodičov</h3>
                <p className="text-xs text-slate-600 mb-3">Karmické cykly a polarita ega oboch rodičov.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-700 uppercase mb-1">{constFather.name}</p>
                    <p className="text-sm text-slate-800 font-mono">K1={devF.circled[0].value} · K2={devF.circled[1].value} · K3={devF.circled[2].value} · K4={devF.circled[3].value}</p>
                    <p className="text-[11px] text-slate-600 mt-1">Ego: {devF.egoPolarity === 'masculine' ? 'mužské' : devF.egoPolarity === 'feminine' ? 'ženské' : 'žiadne'} ({devF.oneCount}× 1)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
                    <p className="text-xs text-violet-700 uppercase mb-1">{constMother.name}</p>
                    <p className="text-sm text-slate-800 font-mono">K1={devM.circled[0].value} · K2={devM.circled[1].value} · K3={devM.circled[2].value} · K4={devM.circled[3].value}</p>
                    <p className="text-[11px] text-slate-600 mt-1">Ego: {devM.egoPolarity === 'masculine' ? 'mužské' : devM.egoPolarity === 'feminine' ? 'ženské' : 'žiadne'} ({devM.oneCount}× 1)</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {k3Match && (
                    <p className="text-xs text-emerald-300 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      ★ K3 zhoda ({devF.circled[2].value}) — rovnaké životné poslanie. Silné karmické spojenie rodičov.
                    </p>
                  )}
                  {egoComplementary && (
                    <p className="text-xs text-rose-300 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
                      ☯ Doplnková polarita ega — mužský × ženský princíp. Deti zažívajú vyváženú Yin-Yang dynamiku.
                    </p>
                  )}
                  {egoSame && (
                    <p className="text-xs text-amber-700 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      ⚹ Rovnaká polarita ega — obaja rodičia pôsobia rovnakým energetickým štýlom na deti.
                    </p>
                  )}
                </div>
              </GlassCard>
            );
          })()}

          {/* Otec ↔ deti */}
          <GlassCard>
            <h3 className="font-medium text-slate-900 mb-3">{constFather.name} ↔ deti</h3>
            <div className="space-y-3">
              {constellationResult.fatherChildren.map(({ child, result: r }, idx) => {
                const cn = calculateFullNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
                const cd = calculateDevelopmentalNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
                const fCityConst = findCity(constFather.birthPlace);
                const chCityConst = findCity(child.birthPlace);
                const fTzConst = getTimezoneFromCoords(fCityConst?.lat ?? 48.15, fCityConst?.lon ?? 17.11);
                const chTzConst = getTimezoneFromCoords(chCityConst?.lat ?? 48.15, chCityConst?.lon ?? 17.11);
                const fatherHd = calculateHumanDesign(parseInt(constFather.day), parseInt(constFather.month), parseInt(constFather.year), constFather.hour ? parseInt(constFather.hour) : 12, constFather.minute ? parseInt(constFather.minute) : 0, fTzConst);
                const childHd = calculateHumanDesign(parseInt(child.day), parseInt(child.month), parseInt(child.year), child.hour ? parseInt(child.hour) : 12, child.minute ? parseInt(child.minute) : 0, chTzConst);
                const sharedDef = fatherHd.definedCenters.filter(c => childHd.definedCenters.includes(c));
                const fatherOnly = fatherHd.definedCenters.filter(c => !childHd.definedCenters.includes(c));
                const fGates = new Set([...fatherHd.personalityGates.map(g => g.gate), ...fatherHd.designGates.map(g => g.gate)]);
                const cGates = new Set([...childHd.personalityGates.map(g => g.gate), ...childHd.designGates.map(g => g.gate)]);
                const sharedGK = [...fGates].filter(g => cGates.has(g)).slice(0, 3).map(g => getGeneKeyByGate(g)).filter(Boolean);
                return (
                <div key={idx} className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">{child.name}</span>
                    <span className="text-sm font-bold text-blue-300">{r.compatibility}%</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    ŽČ <strong className="text-slate-900">{cn.lifePathNumber}</strong> · K3: {cd.circled[2].value} · {cn.age === 'aquarius' ? 'Vodnár' : 'Ryby'}
                    {cn.karmicDebts.length > 0 && <> · Karm. dlh: {cn.karmicDebts.map(d => d.number).join(', ')}</>}
                    {' '}· HD: {childHd.type}
                  </p>
                  <p className="text-xs text-slate-300"><strong>Rola:</strong> {r.parentRole}</p>
                  <p className="text-xs text-slate-300"><strong>Komunikácia:</strong> {r.communicationStyle}</p>
                  {r.recommendations[0] && <p className="text-xs text-indigo-300">→ {r.recommendations[0]}</p>}
                  {(sharedDef.length > 0 || fatherOnly.length > 0) && (
                    <p className="text-[11px] text-cyan-300">
                      {sharedDef.length > 0 && <>HD spoločné: {sharedDef.join(', ')}. </>}
                      {fatherOnly.length > 0 && <>Podmieňuje: {fatherOnly.join(', ')}.</>}
                    </p>
                  )}
                  {sharedGK.length > 0 && (
                    <div className="space-y-1.5 mt-1">
                      <p className="text-[11px] text-purple-300 font-semibold">Spoločné Génové kľúče:</p>
                      {sharedGK.map(gk => (
                        <div key={gk!.gate} className="pl-2 border-l-2 border-purple-500/30 space-y-0.5">
                          <p className="text-[11px] text-white">Brána {gk!.gate}: <span className="text-rose-300">{gk!.shadow}</span> → <span className="text-amber-300">{gk!.gift}</span> → <span className="text-emerald-300">{gk!.siddhi}</span></p>
                          <p className="text-[10px] text-slate-400">{gk!.shadowDescription}</p>
                          <p className="text-[10px] text-amber-300">Dar: {gk!.giftDescription}</p>
                          {gk!.nlpTechnique && <p className="text-[10px] text-indigo-300">Prakticky: {gk!.nlpTechnique} — {gk!.nlpDescription}</p>}
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
            <h3 className="font-medium text-slate-900 mb-3">{constMother.name} ↔ deti</h3>
            <div className="space-y-3">
              {constellationResult.motherChildren.map(({ child, result: r }, idx) => {
                const cn = calculateFullNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
                const cd = calculateDevelopmentalNumerology(parseInt(child.day), parseInt(child.month), parseInt(child.year));
                const mCityConst = findCity(constMother.birthPlace);
                const mchCityConst = findCity(child.birthPlace);
                const mTzConst = getTimezoneFromCoords(mCityConst?.lat ?? 48.15, mCityConst?.lon ?? 17.11);
                const mchTzConst = getTimezoneFromCoords(mchCityConst?.lat ?? 48.15, mchCityConst?.lon ?? 17.11);
                const motherHd = calculateHumanDesign(parseInt(constMother.day), parseInt(constMother.month), parseInt(constMother.year), constMother.hour ? parseInt(constMother.hour) : 12, constMother.minute ? parseInt(constMother.minute) : 0, mTzConst);
                const childHd = calculateHumanDesign(parseInt(child.day), parseInt(child.month), parseInt(child.year), child.hour ? parseInt(child.hour) : 12, child.minute ? parseInt(child.minute) : 0, mchTzConst);
                const sharedDef = motherHd.definedCenters.filter(c => childHd.definedCenters.includes(c));
                const motherOnly = motherHd.definedCenters.filter(c => !childHd.definedCenters.includes(c));
                const mGates = new Set([...motherHd.personalityGates.map(g => g.gate), ...motherHd.designGates.map(g => g.gate)]);
                const cGates = new Set([...childHd.personalityGates.map(g => g.gate), ...childHd.designGates.map(g => g.gate)]);
                const sharedGK = [...mGates].filter(g => cGates.has(g)).slice(0, 3).map(g => getGeneKeyByGate(g)).filter(Boolean);
                return (
                <div key={idx} className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">{child.name}</span>
                    <span className="text-sm font-bold text-purple-300">{r.compatibility}%</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    ŽČ <strong className="text-slate-900">{cn.lifePathNumber}</strong> · K3: {cd.circled[2].value} · {cn.age === 'aquarius' ? 'Vodnár' : 'Ryby'}
                    {cn.karmicDebts.length > 0 && <> · Karm. dlh: {cn.karmicDebts.map(d => d.number).join(', ')}</>}
                    {' '}· HD: {childHd.type}
                  </p>
                  <p className="text-xs text-slate-300"><strong>Rola:</strong> {r.parentRole}</p>
                  <p className="text-xs text-slate-300"><strong>Komunikácia:</strong> {r.communicationStyle}</p>
                  {r.recommendations[0] && <p className="text-xs text-indigo-300">→ {r.recommendations[0]}</p>}
                  {(sharedDef.length > 0 || motherOnly.length > 0) && (
                    <p className="text-[11px] text-cyan-300">
                      {sharedDef.length > 0 && <>HD spoločné: {sharedDef.join(', ')}. </>}
                      {motherOnly.length > 0 && <>Podmieňuje: {motherOnly.join(', ')}.</>}
                    </p>
                  )}
                  {sharedGK.length > 0 && (
                    <div className="space-y-1.5 mt-1">
                      <p className="text-[11px] text-purple-300 font-semibold">Spoločné Génové kľúče:</p>
                      {sharedGK.map(gk => (
                        <div key={gk!.gate} className="pl-2 border-l-2 border-purple-500/30 space-y-0.5">
                          <p className="text-[11px] text-white">Brána {gk!.gate}: <span className="text-rose-300">{gk!.shadow}</span> → <span className="text-amber-300">{gk!.gift}</span> → <span className="text-emerald-300">{gk!.siddhi}</span></p>
                          <p className="text-[10px] text-slate-400">{gk!.shadowDescription}</p>
                          <p className="text-[10px] text-amber-300">Dar: {gk!.giftDescription}</p>
                          {gk!.nlpTechnique && <p className="text-[10px] text-indigo-300">Prakticky: {gk!.nlpTechnique} — {gk!.nlpDescription}</p>}
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
              <h3 className="font-medium text-slate-900 mb-3">Vzťahy medzi súrodencami</h3>
              <p className="text-xs text-slate-500 mb-3">
                Súrodenecký vzťah je často najdlhší vzťah v živote. Dynamika medzi deťmi ovplyvňuje ich sebaobraz, sociálne zručnosti a schopnosť riešiť konflikty v dospelosti.
              </p>
              <div className="space-y-3">
                {constellationResult.siblingCompats.map(({ child1, child2, compat }, idx) => {
                  const n1 = calculateFullNumerology(parseInt(child1.day), parseInt(child1.month), parseInt(child1.year));
                  const n2 = calculateFullNumerology(parseInt(child2.day), parseInt(child2.month), parseInt(child2.year));
                  const relationshipGoal = reduceToSingle(n1.lifePathNumber + n2.lifePathNumber);
                  const s1City = findCity(child1.birthPlace);
                  const s2City = findCity(child2.birthPlace);
                  const s1Tz = getTimezoneFromCoords(s1City?.lat ?? 48.15, s1City?.lon ?? 17.11);
                  const s2Tz = getTimezoneFromCoords(s2City?.lat ?? 48.15, s2City?.lon ?? 17.11);
                  const hd1 = calculateHumanDesign(parseInt(child1.day), parseInt(child1.month), parseInt(child1.year), child1.hour ? parseInt(child1.hour) : 12, child1.minute ? parseInt(child1.minute) : 0, s1Tz);
                  const hd2 = calculateHumanDesign(parseInt(child2.day), parseInt(child2.month), parseInt(child2.year), child2.hour ? parseInt(child2.hour) : 12, child2.minute ? parseInt(child2.minute) : 0, s2Tz);
                  const g1 = new Set([...hd1.personalityGates.map(g => g.gate), ...hd1.designGates.map(g => g.gate)]);
                  const g2 = new Set([...hd2.personalityGates.map(g => g.gate), ...hd2.designGates.map(g => g.gate)]);
                  const siblingGK = [...g1].filter(g => g2.has(g)).slice(0, 3).map(g => getGeneKeyByGate(g)).filter(Boolean);
                  return (
                  <div key={idx} className="p-3 rounded-xl glass-light space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{child1.name} & {child2.name}</span>
                      <span className="text-sm font-bold text-indigo-300">{compat.overallScore}%</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      ŽČ {n1.lifePathNumber} + {n2.lifePathNumber} → cieľ vzťahu: <strong className="text-indigo-300">{relationshipGoal}</strong>
                      {n1.age !== n2.age && <> · <span className="text-amber-300">Rôzny kozmický vek</span> — odlišné generačné vnímanie</>}
                      {' '}· HD: {hd1.type} & {hd2.type}
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
                          {shared.length > 0 && <p>HD spoločné: {shared.join(', ')}</p>}
                          {only1.length > 0 && <p>{child1.name} podmieňuje: {only1.join(', ')}</p>}
                          {only2.length > 0 && <p>{child2.name} podmieňuje: {only2.join(', ')}</p>}
                        </div>
                      ) : null;
                    })()}
                    {siblingGK.length > 0 && (
                      <div className="space-y-1.5 mt-1">
                        <p className="text-[11px] text-purple-300 font-semibold">Spoločné Génové kľúče:</p>
                        {siblingGK.map(gk => (
                          <div key={gk!.gate} className="pl-2 border-l-2 border-purple-500/30 space-y-0.5">
                            <p className="text-[11px] text-white">Brána {gk!.gate}: <span className="text-rose-300">{gk!.shadow}</span> → <span className="text-amber-300">{gk!.gift}</span> → <span className="text-emerald-300">{gk!.siddhi}</span></p>
                            <p className="text-[10px] text-slate-400">{gk!.shadowDescription}</p>
                            <p className="text-[10px] text-amber-300">Dar: {gk!.giftDescription}</p>
                            {gk!.nlpTechnique && <p className="text-[10px] text-indigo-300">Prakticky: {gk!.nlpTechnique} — {gk!.nlpDescription}</p>}
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
              <span>✎</span> Upraviť údaje
            </button>
          </div>

          <button onClick={reset} className="px-4 py-2 rounded-xl text-sm border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">Nový výpočet</button>
        </div>
      )}
    </div>
  );
}
