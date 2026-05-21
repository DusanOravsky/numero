import { reduceToSingle } from './numerologyEngine';
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
  const r1 = lp1 > 9 ? reduceToSingle(lp1) : lp1;
  const r2 = lp2 > 9 ? reduceToSingle(lp2) : lp2;
  const key1 = `${Math.min(r1, r2)}-${Math.max(r1, r2)}`;
  return LIFE_PATH_COMPATIBILITY[key1] || 60;
}

export function calculatePartnerCompatibility(
  person1: NumerologyResult,
  person2: NumerologyResult
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

  // Porovnanie mriežok - spoločné a chýbajúce čísla
  const parentCounts = new Map<number, number>();
  const childCounts = new Map<number, number>();
  for (let i = 1; i <= 9; i++) {
    parentCounts.set(i, parent.grid[i]?.length || 0);
    childCounts.set(i, child.grid[i]?.length || 0);
  }

  // Čo rodič MÁ a dieťa NEMÁ (rodič môže pomôcť)
  const parentCanHelp: number[] = [];
  // Čo dieťa MÁ a rodič NEMÁ (dieťa učí rodiča)
  const childTeaches: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if ((parentCounts.get(i) || 0) > 0 && (childCounts.get(i) || 0) === 0) parentCanHelp.push(i);
    if ((childCounts.get(i) || 0) > 0 && (parentCounts.get(i) || 0) === 0) childTeaches.push(i);
  }

  // Spoločné roviny
  const sharedFullPlanes = parent.fullPlanes.filter(p => child.fullPlanes.includes(p));
  const sharedEmptyPlanes = parent.emptyPlanes.filter(p => child.emptyPlanes.includes(p));

  // Cieľ vzťahu
  const relationshipGoal = reduceToSingle(parent.lifePathNumber + child.lifePathNumber);

  // VDD porovnanie - kto je duchovne starší
  const parentVDD = 36 - (parent.lifePathNumber > 9 ? reduceToSingle(parent.lifePathNumber) : parent.lifePathNumber);
  const childVDD = 36 - (child.lifePathNumber > 9 ? reduceToSingle(child.lifePathNumber) : child.lifePathNumber);

  // ΣT porovnanie
  const parentAge = parent.age;
  const childAge = child.age;
  const sameAge = parentAge === childAge;

  // Výpočet kompatibility na základe viacerých faktorov
  let compatibility = lpScore;
  compatibility += sharedFullPlanes.length * 5;
  compatibility -= sharedEmptyPlanes.length * 3;
  if (parentCanHelp.length > 3) compatibility += 10; // Rodič vie hodne dať
  if (sameAge) compatibility += 5;
  compatibility = Math.max(40, Math.min(100, compatibility));

  const emotionalNeeds: string[] = [];
  const childLP = child.lifePathNumber > 9 ? reduceToSingle(child.lifePathNumber) : child.lifePathNumber;
  emotionalNeeds.push(`ŽČ dieťaťa = ${child.lifePathNumber}: ${getChildNeed(childLP)}`);
  if (child.isolatedNumbers.length > 0) {
    emotionalNeeds.push(`Izolované čísla (${child.isolatedNumbers.join(', ')}): dieťa potrebuje pomoc s integráciou týchto energií`);
  }
  if (child.emptyPlanes.length > 0) {
    emotionalNeeds.push(`Prázdne roviny dieťaťa: ${child.emptyPlanes.slice(0, 2).join(', ')} – oblasti, kde potrebuje podporu`);
  }
  if (parentCanHelp.length > 0) {
    emotionalNeeds.push(`Rodič môže pomôcť rozvíjať energie čísel: ${parentCanHelp.join(', ')}`);
  }

  let communicationStyle: string;
  if (childLP === 1 || childLP === 8) communicationStyle = 'Priama komunikácia, rešpektujte ich nezávislosť. Dajte im možnosť rozhodovať.';
  else if (childLP === 2 || childLP === 6) communicationStyle = 'Jemná, empatická komunikácia plná potvrdení a bezpečia.';
  else if (childLP === 3 || childLP === 5) communicationStyle = 'Hravá a kreatívna komunikácia. Nechajte ich objavovať a experimentovať.';
  else if (childLP === 4 || childLP === 7) communicationStyle = 'Logická, trpezlivá komunikácia. Dajte priestor na otázky a vlastné závery.';
  else communicationStyle = 'Láskavá komunikácia s rešpektom k ich hlbokej citlivosti a múdrosti.';

  const parentLP = parent.lifePathNumber > 9 ? reduceToSingle(parent.lifePathNumber) : parent.lifePathNumber;
  let parentRole: string;
  if (parentLP === 1) parentRole = 'Vodca – učíte dieťa nezávislosti a odvahe ísť vlastnou cestou';
  else if (parentLP === 2) parentRole = 'Diplomat – učíte dieťa empatii, spolupráci a jemnosti';
  else if (parentLP === 3) parentRole = 'Tvorca – učíte dieťa kreativite a radosti zo sebavyjadrenia';
  else if (parentLP === 4) parentRole = 'Staviteľ – učíte dieťa disciplíne, poriadku a spoľahlivosti';
  else if (parentLP === 5) parentRole = 'Slobodný duch – učíte dieťa adaptabilite a otvorenosti zmene';
  else if (parentLP === 6) parentRole = 'Opatrovník – učíte dieťa láske, zodpovednosti a starostlivosti';
  else if (parentLP === 7) parentRole = 'Mystik – učíte dieťa premýšľaniu, intuícii a hľadaniu pravdy';
  else if (parentLP === 8) parentRole = 'Mocnár – učíte dieťa sile, cieľavedomosti a manifestácii';
  else parentRole = 'Mudrc – učíte dieťa súcitu, múdrosti a službe';

  const boundaries: string[] = [];
  if (childLP === 5 || childLP === 3) boundaries.push('Sloboda s jasnými rámcami – nie kontrola, ale dohodnuté pravidlá');
  else if (childLP === 1 || childLP === 8) boundaries.push('Rešpektujte ich potrebu rozhodovať – nedominujte');
  else boundaries.push('Konzistentné pravidlá vytvárajú bezpečie');
  boundaries.push(`Duch. dospelosť dieťaťa: ${childVDD} r. – do tohto veku formujete základ`);
  if (sharedEmptyPlanes.length > 0) boundaries.push(`Spoločné prázdne roviny (${sharedEmptyPlanes.join(', ')}) – v týchto oblastiach sa učíte SPOLU`);
  boundaries.push('Dovoľte dieťaťu robiť vlastné chyby v bezpečnom priestore');

  const childNeeds: string[] = [
    `Hlavná potreba (ŽČ ${child.lifePathNumber}): ${getChildNeed(childLP)}`,
    `Primárny jazyk lásky: ${child.loveLanguages[0]?.language || 'Kvalitný čas'}`,
    `Cieľ vzťahu rodič-dieťa (ŽČ ${parent.lifePathNumber}+${child.lifePathNumber}=${relationshipGoal}): ${getRelationshipGoalDescription(relationshipGoal)}`,
  ];
  if (childTeaches.length > 0) {
    childNeeds.push(`Dieťa vás učí energiám čísel: ${childTeaches.join(', ')}`);
  }

  const recommendations: string[] = [
    `Podporujte ${getChildStrength(childLP)}`,
    sharedFullPlanes.length > 0 ? `Spoločné silné stránky (${sharedFullPlanes.join(', ')}) – budujte na nich aktivity` : 'Hľadajte spoločné záujmy napriek rôznostiam',
    `${parentRole.split(' – ')[0]}: vaša rola je ${parentRole.split(' – ')[1] || 'byť vzorom'}`,
    `VDD rodiča: ${parentVDD} r., VDD dieťaťa: ${childVDD} r. – ${parentVDD < childVDD ? 'vy ste duchovne skôr dozreli' : 'dieťa dozreje skôr ako vy'}`,
    !sameAge ? `Rôzne kozmické veky (${parentAge === 'aquarius' ? 'Vodnár' : 'Ryby'} vs ${childAge === 'aquarius' ? 'Vodnár' : 'Ryby'}) – rôzny prístup k životu` : 'Rovnaký kozmický vek – podobné vnímanie sveta',
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

function getRelationshipGoalDescription(goal: number): string {
  const goals: Record<number, string> = {
    1: 'Vzťah smeruje k nezávislosti a vzájomnému rešpektu individuality',
    2: 'Vzťah smeruje k hlbokej spolupráci a emocionálnemu prepojeniu',
    3: 'Vzťah smeruje k radosti, komunikácii a spoločnej tvorivosti',
    4: 'Vzťah smeruje k budovaniu stability a spoľahlivých základov',
    5: 'Vzťah smeruje k rastu cez zmeny a spoločné dobrodružstvá',
    6: 'Vzťah smeruje k harmónii, láske a vzájomnému opatrovaniu',
    7: 'Vzťah smeruje k hlbokému pochopeniu a duchovnému rastu',
    8: 'Vzťah smeruje k spoločnému dosahovaniu cieľov a hojnosti',
    9: 'Vzťah smeruje k múdrosti, odpusteniu a službe väčšiemu celku',
  };
  return goals[goal] || 'Vzťah má unikátny cieľ';
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
