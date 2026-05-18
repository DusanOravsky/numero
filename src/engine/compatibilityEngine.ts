import type { NumerologyResult } from './numerologyEngine';

export interface CompatibilityResult {
  overallScore: number;
  lifePathCompatibility: { score: number; description: string };
  planeCompatibility: { score: number; sharedPlanes: string[]; conflictPlanes: string[] };
  loveLanguageMatch: { score: number; matched: string[]; mismatched: string[] };
  energeticConnection: { score: number; description: string };
  challenges: string[];
  strengths: string[];
  recommendations: string[];
  rituals: string[];
}

export interface ParentChildResult {
  compatibility: number;
  emotionalNeeds: string[];
  communicationStyle: string;
  boundaries: string[];
  recommendations: string[];
  parentRole: string;
  childNeeds: string[];
}

const LIFE_PATH_COMPATIBILITY: Record<string, number> = {
  '1-1': 60, '1-2': 70, '1-3': 80, '1-4': 50, '1-5': 85, '1-6': 65, '1-7': 70, '1-8': 75, '1-9': 80,
  '2-2': 65, '2-3': 75, '2-4': 80, '2-5': 55, '2-6': 90, '2-7': 60, '2-8': 75, '2-9': 70,
  '3-3': 70, '3-4': 45, '3-5': 90, '3-6': 85, '3-7': 65, '3-8': 60, '3-9': 85,
  '4-4': 70, '4-5': 40, '4-6': 80, '4-7': 75, '4-8': 85, '4-9': 50,
  '5-5': 65, '5-6': 55, '5-7': 80, '5-8': 70, '5-9': 75,
  '6-6': 75, '6-7': 55, '6-8': 70, '6-9': 85,
  '7-7': 70, '7-8': 50, '7-9': 75,
  '8-8': 65, '8-9': 60,
  '9-9': 70,
};

function getLifePathScore(lp1: number, lp2: number): number {
  const key1 = `${Math.min(lp1, lp2)}-${Math.max(lp1, lp2)}`;
  return LIFE_PATH_COMPATIBILITY[key1] || 60;
}

export function calculatePartnerCompatibility(
  person1: NumerologyResult,
  person2: NumerologyResult,
  name1: string,
  name2: string
): CompatibilityResult {
  const lpScore = getLifePathScore(person1.lifePathNumber, person2.lifePathNumber);

  const sharedPlanes = person1.fullPlanes.filter(p => person2.fullPlanes.includes(p));
  const conflictPlanes: string[] = [];
  person1.emptyPlanes.forEach(p => {
    if (person2.emptyPlanes.includes(p)) conflictPlanes.push(p);
  });
  const planeScore = Math.min(100, 50 + sharedPlanes.length * 15 - conflictPlanes.length * 10);

  const p1Top = person1.loveLanguages.slice(0, 2).map(l => l.language);
  const p2Top = person2.loveLanguages.slice(0, 2).map(l => l.language);
  const matchedLangs = p1Top.filter(l => p2Top.includes(l));
  const mismatchedLangs = p1Top.filter(l => !p2Top.includes(l));
  const llScore = matchedLangs.length === 2 ? 95 : matchedLangs.length === 1 ? 70 : 40;

  const orvDiff = Math.abs(person1.orv - person2.orv);
  const energeticScore = Math.max(40, 100 - orvDiff * 10);
  void name1;
  void name2;

  const overallScore = Math.round((lpScore * 0.3 + planeScore * 0.25 + llScore * 0.25 + energeticScore * 0.2));

  const challenges: string[] = [];
  const strengths: string[] = [];

  if (lpScore >= 75) strengths.push(`Silná kompatibilita životných čísel (${person1.lifePathNumber} a ${person2.lifePathNumber})`);
  else if (lpScore < 55) challenges.push(`Výzva v životných číslach – rôzne životné lekcie`);

  if (sharedPlanes.length > 0) strengths.push(`Zdieľané roviny: ${sharedPlanes.join(', ')}`);
  if (conflictPlanes.length > 0) challenges.push(`Spoločné prázdne roviny: ${conflictPlanes.join(', ')}`);

  if (matchedLangs.length > 0) strengths.push(`Rovnaký jazyk lásky: ${matchedLangs.join(', ')}`);
  if (mismatchedLangs.length > 0) challenges.push(`Rôzne jazyky lásky – treba komunikovať potreby`);

  const recommendations: string[] = [
    `Učte sa jazyk lásky partnera: ${p2Top[0]}`,
    `Spoločná aktivita pre zdieľanú energiu`,
    overallScore > 70 ? 'Vaša kompatibilita je silná – budujte na spoločných silách' : 'Rôznosť je dar – učte sa od seba navzájom',
    'Pravidelne zdieľajte svoje potreby',
  ];

  const rituals: string[] = [
    'Ranná spoločná afirmácia',
    'Týždenný check-in: "Čo potrebujem? Čo ti môžem dať?"',
    'Mesačný rituál vďačnosti za partnera',
    'Denný moment prítomnosti – 5 minút bez telefónov',
  ];

  return {
    overallScore,
    lifePathCompatibility: { score: lpScore, description: getLifePathDescription(person1.lifePathNumber, person2.lifePathNumber) },
    planeCompatibility: { score: planeScore, sharedPlanes, conflictPlanes },
    loveLanguageMatch: { score: llScore, matched: matchedLangs, mismatched: mismatchedLangs },
    energeticConnection: { score: energeticScore, description: `Energetické prepojenie: ORV ${person1.orv} a ${person2.orv}` },
    challenges,
    strengths,
    recommendations,
    rituals,
  };
}

export function calculateParentChild(
  parent: NumerologyResult,
  child: NumerologyResult
): ParentChildResult {
  const lpScore = getLifePathScore(parent.lifePathNumber, child.lifePathNumber);
  const compatibility = Math.min(100, lpScore + 10);

  const emotionalNeeds: string[] = [];
  if (child.lifePathNumber <= 3) emotionalNeeds.push('Potrebuje slobodu vyjadrenia a kreativitu');
  if (child.lifePathNumber >= 4 && child.lifePathNumber <= 6) emotionalNeeds.push('Potrebuje štruktúru a bezpečie');
  if (child.lifePathNumber >= 7) emotionalNeeds.push('Potrebuje priestor na premýšľanie a pochopenie');

  if (child.isolatedNumbers.length > 0) emotionalNeeds.push('Potrebuje pomoc s prepojením energií');
  if (child.emptyPlanes.length > 2) emotionalNeeds.push('Potrebuje podporu v oblastiach prázdnych rovín');

  let communicationStyle = '';
  if (child.lifePathNumber === 1 || child.lifePathNumber === 8) {
    communicationStyle = 'Priama komunikácia, rešpektujte ich nezávislosť';
  } else if (child.lifePathNumber === 2 || child.lifePathNumber === 6) {
    communicationStyle = 'Jemná, empatická komunikácia plná potvrdení';
  } else if (child.lifePathNumber === 3 || child.lifePathNumber === 5) {
    communicationStyle = 'Hravá a kreatívna komunikácia, nechajte ich objavovať';
  } else if (child.lifePathNumber === 4 || child.lifePathNumber === 7) {
    communicationStyle = 'Logická, trpezlivá komunikácia s priestorom na otázky';
  } else {
    communicationStyle = 'Láskavá komunikácia s rešpektom k ich citlivosti';
  }

  const boundaries: string[] = [
    'Nastavte jasné ale láskavé hranice',
    child.lifePathNumber === 5 ? 'Dajte slobodu s jasnými rámcami' : 'Konzistentné pravidlá vytvárajú bezpečie',
    'Rešpektujte ich tempo a rytmus',
    'Dovoľte im robiť vlastné chyby (v bezpečnom priestore)',
  ];

  let parentRole = '';
  if (parent.lifePathNumber <= 3) parentRole = 'Inšpirujúci rodič – učíte kreativitou';
  else if (parent.lifePathNumber <= 6) parentRole = 'Stabilný rodič – učíte príkladom';
  else parentRole = 'Múdry rodič – učíte hlbokým pochopením';

  const childNeeds: string[] = [
    `Hlavná potreba: ${getChildNeed(child.lifePathNumber)}`,
    `Jazyk lásky dieťaťa: ${child.loveLanguages[0]?.language || 'Kvalitný čas'}`,
    child.isolatedNumbers.length > 0 ? `Pozor na izolované energie: ${child.isolatedNumbers.join(', ')}` : 'Harmonická energetická distribúcia',
  ];

  const recommendations: string[] = [
    `Podporujte ${getChildStrength(child.lifePathNumber)}`,
    'Vytvorte rituály pre spojenie (pred spaním, ráno)',
    `Komunikujte štýlom: ${communicationStyle}`,
    'Sledujte, kedy dieťa potrebuje priestor a kedy blízkosť',
    'Budujte ich sebadôveru cez konkrétne ocenenia',
  ];

  return {
    compatibility,
    emotionalNeeds,
    communicationStyle,
    boundaries,
    recommendations,
    parentRole,
    childNeeds,
  };
}

function getLifePathDescription(lp1: number, lp2: number): string {
  const descriptions: Record<string, string> = {
    '1-5': 'Dynamický pár plný dobrodružstva a vzájomného rešpektu nezávislosti',
    '2-6': 'Hlboké emocionálne prepojenie, vzájomná starostlivosť a harmónia',
    '3-5': 'Kreatívny a slobodný vzťah plný radosti a inšpirácie',
    '4-8': 'Silný partnerský tím pre budovanie a dosahovanie cieľov',
    '6-9': 'Vzťah založený na službe, láske k ľuďom a hlbokom pochopení',
  };
  const key = `${Math.min(lp1, lp2)}-${Math.max(lp1, lp2)}`;
  return descriptions[key] || `Životné čísla ${lp1} a ${lp2} prinášajú unikátnu dynamiku vzťahu`;
}

function getChildNeed(lp: number): string {
  const needs: Record<number, string> = {
    1: 'Nezávislosť a priestor na vedenie',
    2: 'Bezpečie a emocionálna blízkosť',
    3: 'Kreativita a sebavyjadrenie',
    4: 'Stabilita a jasné pravidlá',
    5: 'Sloboda a nové skúsenosti',
    6: 'Harmónia a rodinné prepojenie',
    7: 'Ticho a priestor na premýšľanie',
    8: 'Uznanie a možnosť dosahovať',
    9: 'Zmysluplnosť a pomoc iným',
  };
  return needs[lp] || 'Láska a prijatie';
}

function getChildStrength(lp: number): string {
  const strengths: Record<number, string> = {
    1: 'vodcovské schopnosti a nezávislosť',
    2: 'citlivosť a schopnosť spolupracovať',
    3: 'kreativitu a radosť z vyjadrenia',
    4: 'systematickosť a spoľahlivosť',
    5: 'adaptabilitu a zvedavosť',
    6: 'starostlivosť a zmysel pre krásu',
    7: 'analytické myslenie a intuíciu',
    8: 'ambície a schopnosť organizovať',
    9: 'empatiu a múdrosť',
  };
  return strengths[lp] || 'unikátne dary';
}
