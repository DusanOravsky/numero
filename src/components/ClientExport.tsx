import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { APP_VERSION } from './PWAPrompts';
import { calculateFullNumerology, reduceToSingle } from '../engine/numerologyEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import type { NumerologyResult } from '../engine/numerologyEngine';
import type { AstrologyResult } from '../engine/astrologyEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { calculatePartnerCompatibility } from '../engine/compatibilityEngine';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import { getEnneagramType } from '../data/enneagram';
import { evaluateChakras } from '../engine/chakraEngine';
import { deriveDosha } from '../engine/ayurvedaEngine';
import { deriveTCMElement } from '../engine/tcmEngine';
import { calculateChineseZodiac } from '../engine/chineseZodiacEngine';
import { calculateBiorhythm } from '../engine/biorhythmEngine';
import { deriveArchetype } from '../engine/archetypeEngine';
import { calculateKua } from '../engine/kuaEngine';
import { getDailyCrystal, getZodiacCrystals, getBlockedChakraCrystals } from '../data/crystals';
import { getPlanetSignDescription, getCycleVibrationDescription } from '../data/planetSignDescriptions';
import { getGeneKeyByGate } from '../data/geneKeys';
import { getOrvDescription } from '../data/orvDescriptions';
import { getOmvDescription } from '../data/omvDescriptions';
import { getOdvDescription } from '../data/odvDescriptions';
import { useTranslation } from '../i18n/useTranslation';
import { getGridCount } from '../engine/numerologyEngine';
import lifePathsData from '../data/lifePaths';
import { getLifePath } from '../data/lifePaths';
import { getLoveLanguageName } from '../data/orvDescriptions';
import { displayName, ZODIAC_DISPLAY, PLANET_DISPLAY, ELEMENT_DISPLAY, QUALITY_DISPLAY, HD_TYPE_DISPLAY, HD_AUTHORITY_DISPLAY, HD_CENTER_DISPLAY, CHINESE_ANIMAL_DISPLAY, CHINESE_ELEMENT_DISPLAY, CHAKRA_NAME_DISPLAY } from '../i18n/entityNames';
import { useStore } from '../store/useStore';
import { loadPdf, PDF_SECTION_COLORS } from '../utils/pdfExport';

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string; recommendation?: string }>;

interface Client {
  id: string;
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour?: number;
  birthMinute?: number;
  birthPlace?: string;
  partnerId?: string;
  childrenIds?: string[];
}

interface ClientExportProps {
  client: Client;
  numerology: NumerologyResult;
  astrology: AstrologyResult;
  humanDesign: HumanDesignResult;
  kabalah: KabalahResult;
  theta: ThetaHealingResult;
}

export function ClientExport({ client, numerology, astrology, humanDesign, kabalah, theta }: ClientExportProps) {
  const { language } = useTranslation();
  const [shareMsg, setShareMsg] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const clients = useStore(s => s.clients);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
      <h2 className="font-serif text-xl font-bold text-slate-300 mb-3">{language === 'sk' ? 'Kompletný profil' : 'Complete Profile'}</h2>
      <GlassCard>
        <p className="text-sm text-slate-400 mb-4">{language === 'sk' ? 'Exportujte kompletný profil klienta so všetkými výsledkami.' : 'Export the complete client profile with all results.'}</p>
        <div className="flex gap-3 flex-wrap">
        <button
          disabled={isExporting}
          onClick={async () => {
            if (isExporting) return;
            setIsExporting(true);
            try {
              const doc = await loadPdf();
              const lpKey = lifePaths[String(numerology.lifePathNumber)] ? String(numerology.lifePathNumber) : String(reduceToSingle(numerology.lifePathNumber));
              const lpData = getLifePath(lpKey, language);
              const lpTitle = lpData?.title || '';
              const lpDesc = lpData?.description || '';
              let y = 20;
              let pageNum = 1;

              const addPageNumber = () => {
                doc.setFontSize(8);
                doc.setFont('Roboto', 'normal');
                doc.setTextColor(150, 150, 150);
                doc.text(`${pageNum}`, 105, 290, { align: 'center' });
                doc.setTextColor(0, 0, 0);
              };

              const checkPage = (needed: number = 20) => {
                if (y > 270 - needed) {
                  addPageNumber();
                  doc.addPage();
                  pageNum++;
                  y = 20;
                }
              };

              const sectionColors = PDF_SECTION_COLORS;

              const addSection = (text: string, color: keyof typeof sectionColors = 'indigo', icon?: string) => {
                checkPage(18);
                y += 4;
                const [r, g, b] = sectionColors[color];
                // Farebný pruh vľavo namiesto čiary cez celú šírku
                doc.setFillColor(r, g, b);
                doc.rect(14, y - 1, 3, 10, 'F');
                doc.setFontSize(13);
                doc.setFont('Roboto', 'bold');
                doc.setTextColor(r, g, b);
                doc.text(`${icon ? icon + '  ' : ''}${text}`, 21, y + 6);
                doc.setTextColor(0, 0, 0);
                y += 12;
              };

              const addLine = (text: string) => {
                checkPage();
                doc.setFontSize(10);
                doc.setFont('Roboto', 'normal');
                const lines = doc.splitTextToSize(text, 180);
                doc.text(lines, 14, y);
                y += lines.length * 5 + 2;
              };

              const addBoldLine = (text: string) => {
                checkPage();
                doc.setFontSize(10);
                doc.setFont('Roboto', 'bold');
                const lines = doc.splitTextToSize(text, 180);
                doc.text(lines, 14, y);
                doc.setFont('Roboto', 'normal');
                y += lines.length * 5 + 2;
              };

              const addSpace = () => { y += 4; };

              const addInterpretation = (text: string) => {
                checkPage();
                doc.setFontSize(9);
                doc.setFont('Roboto', 'normal');
                doc.setTextColor(79, 70, 140);
                const lines = doc.splitTextToSize(text, 176);
                doc.setFillColor(245, 243, 255);
                doc.roundedRect(14, y - 2, 182, lines.length * 4.5 + 4, 2, 2, 'F');
                doc.text(lines, 16, y + 2);
                doc.setTextColor(0, 0, 0);
                y += lines.length * 4.5 + 6;
              };

              // === TITLE PAGE ===
              // Čakrový gradient pruh navrchu strany (7 farieb, každá ~28mm široká)
              const chakraColors: Array<[number, number, number]> = [
                [239, 68, 68],   // Korenova - cervena
                [249, 115, 22], // Sakralna - oranzova
                [234, 179, 8],  // Solarny plexus - zlta
                [34, 197, 94],  // Srdcova - zelena
                [59, 130, 246], // Krcna - modra
                [99, 102, 241], // Tretie oko - indigo
                [168, 85, 247], // Korunna - fialova
              ];
              const stripeWidth = 196 / chakraColors.length;
              chakraColors.forEach((c, i) => {
                doc.setFillColor(c[0], c[1], c[2]);
                doc.rect(7 + i * stripeWidth, 0, stripeWidth, 6, 'F');
              });

              // Lemovky stránky
              doc.setDrawColor(220, 220, 220);
              doc.setLineWidth(0.3);
              doc.line(14, 280, 196, 280);

              doc.setFontSize(10);
              doc.setFont('Roboto', 'normal');
              doc.setTextColor(120, 120, 130);
              doc.text(language === 'sk' ? 'Integrálna mapa bytia' : 'Integral Map of Being', 105, 50, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              // Hlavny nadpis s shadow efektom
              doc.setFontSize(28);
              doc.setFont('Roboto', 'bold');
              doc.setTextColor(79, 70, 229);
              doc.text(language === 'sk' ? 'INTEGRÁLNY PROFIL' : 'INTEGRAL PROFILE', 105, 80, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              // Dvojitá čiara pod nadpisom
              doc.setDrawColor(79, 70, 229);
              doc.setLineWidth(0.8);
              doc.line(50, 86, 160, 86);
              doc.setLineWidth(0.3);
              doc.line(50, 88, 160, 88);

              // Box s menom
              doc.setDrawColor(220, 220, 220);
              doc.setFillColor(248, 250, 252);
              doc.roundedRect(45, 100, 120, 36, 3, 3, 'FD');

              doc.setFontSize(20);
              doc.setFont('Roboto', 'normal');
              doc.setTextColor(30, 27, 75);
              doc.text(client.name, 105, 116, { align: 'center' });

              doc.setFontSize(11);
              doc.setTextColor(100, 100, 110);
              doc.text(
                `${client.birthDay}.${client.birthMonth}.${client.birthYear}${client.birthHour !== undefined ? ` ${client.birthHour}:${String(client.birthMinute || 0).padStart(2, '0')}` : ''}`,
                105, 126, { align: 'center' }
              );
              if (client.birthPlace) {
                doc.text(client.birthPlace, 105, 132, { align: 'center' });
              }
              doc.setTextColor(0, 0, 0);

              // Životné číslo ako veľký akcent
              const lpNumber = numerology.lifePathNumber;
              doc.setFillColor(79, 70, 229);
              doc.circle(105, 165, 15, 'F');
              doc.setFontSize(28);
              doc.setFont('Roboto', 'bold');
              doc.setTextColor(255, 255, 255);
              doc.text(String(lpNumber), 105, 173, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              doc.setFontSize(11);
              doc.setFont('Roboto', 'normal');
              doc.setTextColor(79, 70, 229);
              doc.text(language === 'sk' ? `Životné číslo — ${lpTitle}` : `Life Path Number — ${lpTitle}`, 105, 188, { align: 'center' });
              doc.setTextColor(0, 0, 0);
              doc.setFont('Roboto', 'normal');

              // Spodok titulnej strany
              doc.setFontSize(9);
              doc.setTextColor(150, 150, 150);
              doc.text(new Date().toLocaleDateString(language === 'sk' ? 'sk-SK' : 'en-GB'), 105, 270, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              addPageNumber();
              doc.addPage();
              pageNum++;
              y = 20;

              // === NUMEROLOGIA ===
              addSection(language === 'sk' ? 'NUMEROLÓGIA' : 'NUMEROLOGY', 'indigo');
              addBoldLine(language === 'sk'
                ? `Životné číslo: ${numerology.lifePathNumber} z ${numerology.lifePathFrom} — ${lpTitle}`
                : `Life Path Number: ${numerology.lifePathNumber} from ${numerology.lifePathFrom} — ${lpTitle}`);
              addLine(lpDesc);
              addSpace();

              // Personalizovaný výklad
              const charCounts: Record<number, number> = {};
              for (let i = 1; i <= 9; i++) charCounts[i] = numerology.grid[i]?.length || 0;
              const charZeros = Object.entries(charCounts).filter(([, c]) => c === 0).map(([n]) => Number(n));
              const charHigh = Object.entries(charCounts).filter(([, c]) => c >= 3).map(([n, c]) => `${n} (${c}×)`);
              addInterpretation(
                language === 'sk'
                ? `Ako čítať: Tvoje životné číslo ${numerology.lifePathNumber} (${lpTitle}) je tvoja „červená niť". ` +
                  (charZeros.length > 0 ? `Chýbajúce čísla (${charZeros.join(', ')}) sú smery rastu — oblasti na vedomé rozvíjanie. ` : '') +
                  (charHigh.length > 0 ? `Silné energie (${charHigh.join(', ')}) sú tvoje dary, ale v nadbytku aj výzvy. ` : '') +
                  (numerology.isolatedNumbers.length > 0 ? `Izolované čísla (${numerology.isolatedNumbers.join(', ')}) majú blokovanú energiu — vyžadujú integráciu.` : '')
                : `How to read: Your life path number ${numerology.lifePathNumber} (${lpTitle}) is your "red thread". ` +
                  (charZeros.length > 0 ? `Missing numbers (${charZeros.join(', ')}) are growth directions — areas for conscious development. ` : '') +
                  (charHigh.length > 0 ? `Strong energies (${charHigh.join(', ')}) are your gifts, but in excess also challenges. ` : '') +
                  (numerology.isolatedNumbers.length > 0 ? `Isolated numbers (${numerology.isolatedNumbers.join(', ')}) have blocked energy — they require integration.` : '')
              );
              addSpace();
              addLine(`ORV: ${numerology.orv} | OMV: ${numerology.omv} | ODV: ${numerology.odv}`);
              addLine(language === 'sk' ? `VDD: ${numerology.vdd} rokov` : `VDD: ${numerology.vdd} years`);
              addLine(language === 'sk'
                ? `Plné roviny: ${numerology.fullPlanes.join(', ') || 'žiadne'}`
                : `Full planes: ${numerology.fullPlanes.join(', ') || 'none'}`);
              addLine(language === 'sk'
                ? `Prázdne roviny: ${numerology.emptyPlanes.join(', ') || 'žiadne'}`
                : `Empty planes: ${numerology.emptyPlanes.join(', ') || 'none'}`);
              if (numerology.isolatedNumbers.length > 0) addLine(language === 'sk' ? `Izolované čísla: ${numerology.isolatedNumbers.join(', ')}` : `Isolated numbers: ${numerology.isolatedNumbers.join(', ')}`);
              addSpace();

              // Vizuálna mriežka 3×3 (Charakterová)
              checkPage(50);
              addBoldLine(language === 'sk' ? 'Mriežka 3×3 (Charakterová):' : '3×3 Grid (Character):');
              const gridSize = 14;
              const gridStartX = 14;
              const gridStartY = y + 2;
              const gridLayout = [[3, 6, 9], [2, 5, 8], [1, 4, 7]];
              gridLayout.forEach((row, rIdx) => {
                row.forEach((num, cIdx) => {
                  const cx = gridStartX + cIdx * gridSize;
                  const cy = gridStartY + rIdx * gridSize;
                  const items = numerology.grid[num] || [];
                  if (items.length > 0) {
                    doc.setFillColor(238, 242, 255);
                    doc.setDrawColor(99, 102, 241);
                  } else {
                    doc.setFillColor(248, 250, 252);
                    doc.setDrawColor(220, 220, 220);
                  }
                  doc.setLineWidth(0.3);
                  doc.roundedRect(cx, cy, gridSize - 1, gridSize - 1, 1, 1, 'FD');
                  // Číslo políčka v rohu
                  doc.setFontSize(6);
                  doc.setTextColor(160, 160, 160);
                  doc.text(String(num), cx + 1, cy + 3);
                  // Obsah – počet výskytov
                  if (items.length > 0) {
                    doc.setFontSize(10);
                    doc.setFont('Roboto', 'bold');
                    doc.setTextColor(79, 70, 229);
                    doc.text(items.map(it => it.value).join(' '), cx + gridSize / 2 - 0.5, cy + gridSize / 2 + 2, { align: 'center' });
                    doc.setFont('Roboto', 'normal');
                  }
                });
              });
              doc.setTextColor(0, 0, 0);
              y += gridSize * 3 + 6;
              addSpace();

              addBoldLine(language === 'sk' ? 'Karmické cykly:' : 'Karmic Cycles:');
              numerology.karmicTriangles.forEach(t => {
                addLine(language === 'sk'
                  ? `  ${t.label}: ${t.fromAge}–${t.toAge || '...'} r. | Vibrácia ${t.vibration} — ${getCycleVibrationDescription(t.vibration, language) || ''}`
                  : `  ${t.label}: ${t.fromAge}–${t.toAge || '...'} yrs | Vibration ${t.vibration} — ${getCycleVibrationDescription(t.vibration, language) || ''}`);
              });
              addSpace();

              // === VÝVOJOVÁ NUMEROLÓGIA (Lívia / Červenák) ===
              const devNum = calculateDevelopmentalNumerology(client.birthDay, client.birthMonth, client.birthYear);
              addSection(language === 'sk' ? 'VÝVOJOVÁ NUMEROLÓGIA' : 'DEVELOPMENTAL NUMEROLOGY', 'amber');
              addLine(language === 'sk'
                ? `D+M = ${devNum.dayMonthSum} | R = ${devNum.yearSum}${devNum.isPost2000 ? ' (rok ≥ 2000: 20 + zvyšok)' : ''}`
                : `D+M = ${devNum.dayMonthSum} | Y = ${devNum.yearSum}${devNum.isPost2000 ? ' (year ≥ 2000: 20 + remainder)' : ''}`);
              addBoldLine(language === 'sk' ? 'Karmické cykly (zakrúžkované čísla):' : 'Karmic Cycles (circled numbers):');
              const cycleNames = language === 'sk' ? [
                'K1 — Psychická stabilita (0–30 r.)',
                'K2 — Materiálna stabilita (30–50 r.)',
                'K3 — Životné poslanie ★ (50+ r., ale rezonuje celý život)',
                'K4 — Detské sny (neskorší vek)',
              ] : [
                'K1 — Psychological stability (0–30 yrs)',
                'K2 — Material stability (30–50 yrs)',
                'K3 — Life mission ★ (50+ yrs, but resonates whole life)',
                'K4 — Childhood dreams (later age)',
              ];
              devNum.circled.forEach((c, idx) => {
                addLine(`  ${cycleNames[idx]}: ${c.value}  (${c.formula})`);
              });
              addSpace();
              if (devNum.oneCount > 0) {
                addBoldLine(language === 'sk'
                  ? `Polarita ega: ${devNum.egoPolarity === 'masculine' ? 'Mužské ego' : 'Ženské ego'} (${devNum.oneCount}× číslo 1)`
                  : `Ego polarity: ${devNum.egoPolarity === 'masculine' ? 'Masculine ego' : 'Feminine ego'} (${devNum.oneCount}× number 1)`);
                addLine(language === 'sk'
                  ? (devNum.egoPolarity === 'masculine'
                    ? 'Nepárny počet jednotiek — energia dávania, vymedzovania, akcie.'
                    : 'Párny počet jednotiek — energia prijímania, otvorenia, trpezlivosti.')
                  : (devNum.egoPolarity === 'masculine'
                    ? 'Odd count of ones — energy of giving, setting boundaries, action.'
                    : 'Even count of ones — energy of receiving, openness, patience.'));
              }
              addSpace();

              // Personalizovaný výklad vývojovej
              const devZeros = Object.entries(devNum.counts).filter(([, c]) => c === 0).map(([n]) => Number(n));
              const devHigh = Object.entries(devNum.counts).filter(([, c]) => c >= 3).map(([n, c]) => `${n} (${c}×)`);
              const k3Val = devNum.circled[2]?.value;
              addInterpretation(
                language === 'sk'
                ? `Ako čítať: K3 = ${k3Val} je tvoje životné poslanie — hlavná téma, pre ktorú si tu. ` +
                  (devZeros.length > 0 ? `Nuly (${devZeros.join(', ')}) sú životné úlohy — nie deficity, ale lekcie. ` : '') +
                  (devHigh.length > 0 ? `Silné energie (${devHigh.join(', ')}) — ak ich vieš nasmerovať, sú dary. ` : '') +
                  `Cykly sa aktivujú postupne: K1 do 30 r., K2 do 50 r., K3 celý život (naplno po 50-ke), K4 neskorší vek.`
                : `How to read: K3 = ${k3Val} is your life mission — the main theme you are here for. ` +
                  (devZeros.length > 0 ? `Zeros (${devZeros.join(', ')}) are life tasks — not deficits, but lessons. ` : '') +
                  (devHigh.length > 0 ? `Strong energies (${devHigh.join(', ')}) — if you can channel them, they are gifts. ` : '') +
                  `Cycles activate progressively: K1 until 30 yrs, K2 until 50 yrs, K3 whole life (fully after 50), K4 later age.`
              );
              addSpace();

              // === GENE KEYS ===
              const sunGate = humanDesign.personalityGates.find(g => g.planet === 'Slnko')?.gate;
              const earthGate = humanDesign.personalityGates.find(g => g.planet === 'Zem')?.gate;
              const topGeneKeys = [sunGate, earthGate].filter((g): g is number => g !== undefined).map(g => getGeneKeyByGate(g, language)).filter(Boolean);
              if (topGeneKeys.length > 0) {
                addSection(language === 'sk' ? 'GÉNOVÉ KĽÚČE' : 'GENE KEYS', 'purple');
                addInterpretation(
                  language === 'sk'
                  ? 'Ako čítať: Každá brána má 3 frekvencie — Tieň (pod tlakom), Dar (vedomá voľba), Siddhi (najvyššia forma). ' +
                    'Rozpoznaj tieň bez súdenia → vedome prejdi k daru. Siddhi príde samo.'
                  : 'How to read: Each gate has 3 frequencies — Shadow (under pressure), Gift (conscious choice), Siddhi (highest form). ' +
                    'Recognize the shadow without judgment → consciously move to the gift. Siddhi comes on its own.'
                );
                addSpace();
                topGeneKeys.forEach(gk => {
                  if (!gk) return;
                  addBoldLine(language === 'sk' ? `Brána ${gk.gate}:` : `Gate ${gk.gate}:`);
                  addLine(language === 'sk' ? `  Tieň: ${gk.shadow} — ${gk.shadowDescription}` : `  Shadow: ${gk.shadow} — ${gk.shadowDescription}`);
                  addLine(language === 'sk' ? `  Dar: ${gk.gift} — ${gk.giftDescription}` : `  Gift: ${gk.gift} — ${gk.giftDescription}`);
                  addLine(`  Siddhi: ${gk.siddhi}`);
                  if (gk.nlpTechnique) addLine(language === 'sk' ? `  NLP technika: ${gk.nlpTechnique} — ${gk.nlpDescription}` : `  NLP technique: ${gk.nlpTechnique} — ${gk.nlpDescription}`);
                  addSpace();
                });
              }

              // === ASTROLÓGIA ===
              addSection(language === 'sk' ? 'ASTROLÓGIA' : 'ASTROLOGY', 'cyan');
              const sunSignName = displayName(ZODIAC_DISPLAY, astrology.sunSign.name, language);
              const moonSignName = displayName(ZODIAC_DISPLAY, astrology.moonSign.name, language);
              const ascSignName = displayName(ZODIAC_DISPLAY, astrology.ascendant.name, language);
              const northNodeName = displayName(ZODIAC_DISPLAY, astrology.northNode.name, language);
              const domElement = displayName(ELEMENT_DISPLAY, astrology.dominantElement, language);
              const domQuality = displayName(QUALITY_DISPLAY, astrology.dominantQuality, language);
              addLine(`${displayName(PLANET_DISPLAY, 'Slnko', language)}: ${sunSignName} (${displayName(ELEMENT_DISPLAY, astrology.sunSign.element, language)}) — ${getPlanetSignDescription('Slnko', astrology.sunSign.name, language) || ''}`);
              addLine(`${displayName(PLANET_DISPLAY, 'Mesiac', language)}: ${moonSignName} (${displayName(ELEMENT_DISPLAY, astrology.moonSign.element, language)}) — ${getPlanetSignDescription('Mesiac', astrology.moonSign.name, language) || ''}`);
              addLine(`${language === 'sk' ? 'Ascendent' : 'Ascendant'}: ${ascSignName} (${displayName(ELEMENT_DISPLAY, astrology.ascendant.element, language)})`);
              addLine(language === 'sk'
                ? `Dominantný živel: ${domElement} | Kvalita: ${domQuality}`
                : `Dominant element: ${domElement} | Quality: ${domQuality}`);
              addSpace();

              addInterpretation(
                language === 'sk'
                ? `Ako čítať: Slnko v ${sunSignName} = tvoja podstata (kto si). ` +
                  `Mesiac v ${moonSignName} = tvoje emócie (čo cítiš). ` +
                  `Ascendent v ${ascSignName} = ako ťa vidia iní. ` +
                  `Sev. uzol v ${northNodeName} = kam smeruješ (životná evolúcia). ` +
                  `Začni od týchto 4 bodov — to je 80% toho, čo potrebuješ vedieť.`
                : `How to read: Sun in ${sunSignName} = your essence (who you are). ` +
                  `Moon in ${moonSignName} = your emotions (what you feel). ` +
                  `Ascendant in ${ascSignName} = how others see you. ` +
                  `North Node in ${northNodeName} = where you're heading (life evolution). ` +
                  `Start with these 4 points — that's 80% of what you need to know.`
              );
              addSpace();

              // Vizuálne natálne koliesko (zjednodušené)
              checkPage(70);
              addBoldLine(language === 'sk' ? 'Natálne koliesko:' : 'Natal Chart:');
              const wheelCx = 65;
              const wheelCy = y + 32;
              const wheelR = 28;
              const SIGN_SYMBOLS = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
              const ascIdx = ['Baran', 'Býk', 'Blíženci', 'Rak', 'Lev', 'Panna', 'Váhy', 'Škorpión', 'Strelec', 'Kozorožec', 'Vodnár', 'Ryby'].indexOf(astrology.ascendant.name);
              doc.setDrawColor(99, 102, 241);
              doc.setLineWidth(0.5);
              doc.circle(wheelCx, wheelCy, wheelR);
              doc.circle(wheelCx, wheelCy, wheelR - 8);
              for (let i = 0; i < 12; i++) {
                const ang = ((i * 30 - (ascIdx * 30)) * Math.PI) / 180;
                const x1 = wheelCx + (wheelR - 8) * Math.cos(ang);
                const y1w = wheelCy - (wheelR - 8) * Math.sin(ang);
                const x2 = wheelCx + wheelR * Math.cos(ang);
                const y2w = wheelCy - wheelR * Math.sin(ang);
                doc.line(x1, y1w, x2, y2w);
                const midAng = ((i * 30 + 15 - (ascIdx * 30)) * Math.PI) / 180;
                const lx = wheelCx + (wheelR - 4) * Math.cos(midAng);
                const ly = wheelCy - (wheelR - 4) * Math.sin(midAng);
                doc.setFontSize(5);
                doc.setTextColor(99, 102, 241);
                doc.text(SIGN_SYMBOLS[i], lx, ly, { align: 'center' });
              }
              // Planéty
              doc.setFontSize(6);
              doc.setTextColor(0, 0, 0);
              astrology.planets.slice(0, 10).forEach((p, i) => {
                const pAng = (((ascIdx * 30 + astrology.ascendantDegree) - p.longitude + 540) % 360) * Math.PI / 180;
                const pr = wheelR - 16 - (i % 2) * 5;
                const px = wheelCx + pr * Math.cos(pAng);
                const py = wheelCy - pr * Math.sin(pAng);
                doc.text(p.symbol, px, py, { align: 'center' });
              });
              // ASC label
              doc.setFontSize(6);
              doc.setTextColor(220, 50, 50);
              doc.text('ASC', wheelCx - wheelR - 5, wheelCy + 1);
              doc.setTextColor(0, 0, 0);
              // Legenda vedľa kolieska
              doc.setFontSize(7);
              const legendX = wheelCx + wheelR + 10;
              astrology.planets.slice(0, 7).forEach((p, i) => {
                doc.text(`${p.symbol} ${displayName(ZODIAC_DISPLAY, p.sign.name, language)} ${Math.floor(p.degree)}°`, legendX, wheelCy - 18 + i * 5);
              });
              y = wheelCy + wheelR + 8;
              addSpace();

              // === HUMAN DESIGN ===
              addSection('HUMAN DESIGN', 'purple');
              const hdType = displayName(HD_TYPE_DISPLAY, humanDesign.type, language);
              const hdAuth = displayName(HD_AUTHORITY_DISPLAY, humanDesign.authority, language);
              const hdDefinedCenters = humanDesign.definedCenters.map(c => displayName(HD_CENTER_DISPLAY, c, language));
              const hdOpenCenters = humanDesign.openCenters.map(c => displayName(HD_CENTER_DISPLAY, c, language));
              addBoldLine(language === 'sk'
                ? `Typ: ${hdType} | Autorita: ${hdAuth}`
                : `Type: ${hdType} | Authority: ${hdAuth}`);
              addLine(language === 'sk' ? `Stratégia: ${humanDesign.strategy}` : `Strategy: ${humanDesign.strategy}`);
              addLine(language === 'sk'
                ? `Profil: ${humanDesign.profile.line1}/${humanDesign.profile.line2} — ${humanDesign.profile.name}: ${humanDesign.profile.description}`
                : `Profile: ${humanDesign.profile.line1}/${humanDesign.profile.line2} — ${humanDesign.profile.name}: ${humanDesign.profile.description}`);
              addLine(language === 'sk' ? `Inkarnačný kríž: ${humanDesign.incarnationCross}` : `Incarnation Cross: ${humanDesign.incarnationCross}`);
              addLine(language === 'sk'
                ? `Definované centrá: ${hdDefinedCenters.join(', ')}`
                : `Defined Centers: ${hdDefinedCenters.join(', ')}`);
              addLine(language === 'sk'
                ? `Otvorené centrá: ${hdOpenCenters.join(', ')}`
                : `Open Centers: ${hdOpenCenters.join(', ')}`);
              addSpace();

              addInterpretation(
                language === 'sk'
                ? `Ako čítať: Si ${hdType} — tvoja stratégia je „${humanDesign.strategy.toLowerCase()}". ` +
                  `Autorita (${hdAuth}) ti hovorí ako správne rozhodovať. ` +
                  `Keď cítiš „${humanDesign.notSelfTheme.toLowerCase()}" — niečo nie je pre teba. ` +
                  `Otvorené centrá (${hdOpenCenters.join(', ')}) = kde absorbujuješ cudziu energiu. ` +
                  `Začni od stratégie a autority — to sú dva najdôležitejšie nástroje na každý deň.`
                : `How to read: You are a ${hdType} — your strategy is "${humanDesign.strategy.toLowerCase()}". ` +
                  `Authority (${hdAuth}) tells you how to make correct decisions. ` +
                  `When you feel "${humanDesign.notSelfTheme.toLowerCase()}" — something is not for you. ` +
                  `Open Centers (${hdOpenCenters.join(', ')}) = where you absorb others' energy. ` +
                  `Start with strategy and authority — these are the two most important tools for every day.`
              );
              addSpace();

              // Vizuálny bodygraph — 9 centier
              checkPage(45);
              addBoldLine(language === 'sk' ? 'Bodygraph (centrá):' : 'Bodygraph (Centers):');
              const centersLayout: Array<{ name: string; x: number; y: number }> = language === 'sk' ? [
                { name: 'Hlava', x: 50, y: 0 },
                { name: 'Ajna', x: 50, y: 10 },
                { name: 'Hrdlo', x: 50, y: 20 },
                { name: 'G', x: 50, y: 30 },
                { name: 'Ego', x: 72, y: 26 },
                { name: 'Sakrál', x: 50, y: 40 },
                { name: 'SP', x: 72, y: 36 },
                { name: 'Slezina', x: 28, y: 36 },
                { name: 'Koreň', x: 50, y: 50 },
              ] : [
                { name: 'Head', x: 50, y: 0 },
                { name: 'Ajna', x: 50, y: 10 },
                { name: 'Throat', x: 50, y: 20 },
                { name: 'G', x: 50, y: 30 },
                { name: 'Ego', x: 72, y: 26 },
                { name: 'Sacral', x: 50, y: 40 },
                { name: 'SP', x: 72, y: 36 },
                { name: 'Spleen', x: 28, y: 36 },
                { name: 'Root', x: 50, y: 50 },
              ];
              const definedSet = new Set(humanDesign.definedCenters);
              // Maps SK engine center names → short labels used in centersLayout
              const centerLabelMap: Record<string, string> = language === 'sk'
                ? { 'Hlava': 'Hlava', 'Ajna': 'Ajna', 'Hrdlo': 'Hrdlo', 'G': 'G', 'Srdce/Ego': 'Ego', 'Solárny plexus': 'SP', 'Sakrálne': 'Sakrál', 'Slezina': 'Slezina', 'Koreň': 'Koreň' }
                : { 'Hlava': 'Head', 'Ajna': 'Ajna', 'Hrdlo': 'Throat', 'G': 'G', 'Srdce/Ego': 'Ego', 'Solárny plexus': 'SP', 'Sakrálne': 'Sacral', 'Slezina': 'Spleen', 'Koreň': 'Root' };
              const bgStartY = y + 2;
              centersLayout.forEach(c => {
                const cx = 14 + c.x * 0.8;
                const cy = bgStartY + c.y * 0.7;
                const isDef = Object.entries(centerLabelMap).some(([skName, label]) => label === c.name && definedSet.has(skName));
                if (isDef) {
                  doc.setFillColor(99, 102, 241);
                  doc.setTextColor(255, 255, 255);
                } else {
                  doc.setFillColor(248, 250, 252);
                  doc.setTextColor(100, 100, 100);
                }
                doc.setDrawColor(180, 180, 180);
                doc.roundedRect(cx - 5, cy - 3, 10, 6, 1, 1, 'FD');
                doc.setFontSize(5);
                doc.text(c.name, cx, cy + 1, { align: 'center' });
              });
              doc.setTextColor(0, 0, 0);
              y = bgStartY + 40;
              addSpace();

              // === JAZYKY LÁSKY ===
              addSection(language === 'sk' ? 'JAZYKY LÁSKY' : 'LOVE LANGUAGES', 'rose');
              numerology.loveLanguages.forEach((l, i) => addLine(`${i + 1}. ${getLoveLanguageName(l.language, language)}: ${l.score} ${language === 'sk' ? 'bodov' : 'points'}`));
              addSpace();

              // === THETA HEALING ===
              addSection('THETA HEALING', 'teal');
              addBoldLine(language === 'sk' ? 'Limitujúce presvedčenia:' : 'Limiting Beliefs:');
              theta.primaryBeliefs.forEach(b => addLine(`  "${b.belief}" (${b.level}, ${b.emotion})`));
              addSpace();

              // === KABALA ===
              addSection(language === 'sk' ? 'KABALA' : 'KABBALAH', 'amber');
              addLine(language === 'sk'
                ? `Primárna sefira: ${kabalah.primarySefira.name} (${kabalah.primarySefira.meaning})`
                : `Primary Sephira: ${kabalah.primarySefira.name} (${kabalah.primarySefira.meaning})`);
              addLine(language === 'sk' ? `Dar: ${kabalah.primarySefira.gift}` : `Gift: ${kabalah.primarySefira.gift}`);
              addLine(language === 'sk' ? `Tieň: ${kabalah.primarySefira.shadow}` : `Shadow: ${kabalah.primarySefira.shadow}`);
              addLine(language === 'sk' ? `Čin v Malchut: ${kabalah.malchutAction}` : `Action in Malchut: ${kabalah.malchutAction}`);
              addSpace();

              // === ENNEAGRAM ===
              const devNumForEnneagram = calculateDevelopmentalNumerology(client.birthDay, client.birthMonth, client.birthYear);
              const enneagram = deriveEnneagramType(numerology, devNumForEnneagram, 'developmental');
              if (enneagram) {
                addSection('ENNEAGRAM', 'emerald');
                const coreType = getEnneagramType(enneagram.coreType, language);
                addBoldLine(language === 'sk'
                  ? `Typ ${enneagram.coreType} — ${coreType?.name || ''}`
                  : `Type ${enneagram.coreType} — ${coreType?.name || ''}`);
                if (coreType?.motivation) addLine(coreType.motivation.slice(0, 200));
                addLine(language === 'sk'
                  ? `Krídlo: ${enneagram.dominantWing || enneagram.wing1} | Integrácia → ${enneagram.integrationDirection} | Stres → ${enneagram.disintegrationDirection}`
                  : `Wing: ${enneagram.dominantWing || enneagram.wing1} | Integration → ${enneagram.integrationDirection} | Stress → ${enneagram.disintegrationDirection}`);
                if (coreType?.growthPath) {
                  addSpace();
                  addBoldLine(language === 'sk' ? 'Cesta rastu:' : 'Growth Path:');
                  addLine(coreType.growthPath.slice(0, 250));
                }
                addSpace();
              }

              // === ČAKRY ===
              const gridCounts = getGridCount(numerology.grid);
              const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement);
              addSection(language === 'sk' ? 'ČAKRY' : 'CHAKRAS', 'rose');
              const blocked = chakras.filter(ch => ch.status === 'blocked');
              const balanced = chakras.filter(ch => ch.status === 'balanced');
              if (blocked.length > 0) {
                addBoldLine(language === 'sk' ? 'Blokované:' : 'Blocked:');
                blocked.forEach(ch => addLine(`  ${displayName(CHAKRA_NAME_DISPLAY, ch.chakra.name, language)} (${ch.score}/100)`));
                addSpace();
              }
              if (balanced.length > 0) {
                addBoldLine(language === 'sk' ? 'Vyvážené:' : 'Balanced:');
                balanced.forEach(ch => addLine(`  ${displayName(CHAKRA_NAME_DISPLAY, ch.chakra.name, language)} (${ch.score}/100)`));
                addSpace();
              }
              addInterpretation(
                language === 'sk'
                ? 'Ako čítať: Blokované čakry = oblasti na vedomé rozvíjanie (meditácia, afirmácie, pohyb). ' +
                  'Vyvážené = vaše silné stránky a zdroje energie.'
                : 'How to read: Blocked chakras = areas for conscious development (meditation, affirmations, movement). ' +
                  'Balanced = your strengths and energy sources.'
              );
              addSpace();

              // === AYURVÉDA ===
              const dosha = deriveDosha(numerology, astrology, humanDesign);
              addSection(language === 'sk' ? 'AYURVÉDA' : 'AYURVEDA', 'amber');
              addBoldLine(language === 'sk' ? `Dominantná dóša: ${dosha.primary}` : `Dominant Dosha: ${dosha.primary}`);
              addLine(language === 'sk' ? `Sekundárna: ${dosha.secondary || 'žiadna'}` : `Secondary: ${dosha.secondary || 'none'}`);
              addLine(language === 'sk' ? `Dominancia: ${dosha.balance}%` : `Dominance: ${dosha.balance}%`);
              addSpace();

              // === TCM ===
              const tcm = deriveTCMElement(numerology, astrology);
              addSection(language === 'sk' ? 'TCM — 5 ELEMENTOV' : 'TCM — 5 ELEMENTS', 'emerald');
              addBoldLine(language === 'sk' ? `Dominantný element: ${tcm.primary}` : `Dominant Element: ${tcm.primary}`);
              addLine(language === 'sk' ? `Sekundárny element: ${tcm.secondary}` : `Secondary Element: ${tcm.secondary}`);
              addSpace();

              // === ČÍNSKY HOROSKOP ===
              const chineseZodiac = calculateChineseZodiac(client.birthYear);
              addSection(language === 'sk' ? 'ČÍNSKY HOROSKOP' : 'CHINESE HOROSCOPE', 'red');
              addBoldLine(`${displayName(CHINESE_ANIMAL_DISPLAY, chineseZodiac.animal, language)} — ${displayName(CHINESE_ELEMENT_DISPLAY, chineseZodiac.element, language)} (${chineseZodiac.polarity})`);
              addSpace();

              // === ORV / OMV / ODV S POPISMI ===
              addSection(language === 'sk' ? 'OSOBNÉ VIBRÁCIE' : 'PERSONAL VIBRATIONS', 'indigo');
              addBoldLine(`ORV ${numerology.orv} — ${getOrvDescription(numerology.orv, language)?.title || ''}`);
              addLine(getOrvDescription(numerology.orv, language)?.advice || '');
              addSpace();
              addBoldLine(`OMV ${numerology.omv} — ${getOmvDescription(numerology.omv, language)?.title || ''}`);
              addLine(getOmvDescription(numerology.omv, language)?.advice || '');
              addSpace();
              addBoldLine(`ODV ${numerology.odv} — ${getOdvDescription(numerology.odv, language)?.title || ''}`);
              addLine(getOdvDescription(numerology.odv, language)?.advice || '');
              addSpace();

              // === BIORYTMUS ===
              const biorhythm = calculateBiorhythm(client.birthDay, client.birthMonth, client.birthYear);
              addSection(language === 'sk' ? 'BIORYTMUS' : 'BIORHYTHM', 'cyan');
              const phaseLabel = (phase: string) => language === 'sk'
                ? (phase === 'high' ? 'vysoký' : phase === 'low' ? 'nízky' : 'kritický')
                : (phase === 'high' ? 'high' : phase === 'low' ? 'low' : 'critical');
              addLine(`${language === 'sk' ? 'Fyzický' : 'Physical'}: ${biorhythm.physical > 0 ? '+' : ''}${biorhythm.physical}% (${phaseLabel(biorhythm.physicalPhase)})`);
              addLine(`${language === 'sk' ? 'Emocionálny' : 'Emotional'}: ${biorhythm.emotional > 0 ? '+' : ''}${biorhythm.emotional}% (${phaseLabel(biorhythm.emotionalPhase)})`);
              addLine(`${language === 'sk' ? 'Intelektuálny' : 'Intellectual'}: ${biorhythm.intellectual > 0 ? '+' : ''}${biorhythm.intellectual}% (${phaseLabel(biorhythm.intellectualPhase)})`);
              addSpace();

              // === JUNGOV ARCHETYP ===
              const archetype = deriveArchetype(
                numerology.lifePathNumber,
                enneagram?.coreType || 9,
                humanDesign.type,
                language
              );
              addSection(language === 'sk' ? 'JUNGOV ARCHETYP' : 'JUNGIAN ARCHETYPE', 'purple');
              addBoldLine(language === 'sk'
                ? `Primárny: ${archetype.primary.name} — „${archetype.primary.motto}"`
                : `Primary: ${archetype.primary.name} — "${archetype.primary.motto}"`);
              addLine(language === 'sk' ? `Dar: ${archetype.primary.gift}` : `Gift: ${archetype.primary.gift}`);
              addLine(language === 'sk' ? `Stratégia: ${archetype.primary.strategy}` : `Strategy: ${archetype.primary.strategy}`);
              addLine(language === 'sk'
                ? `Sekundárny: ${archetype.secondary.name} | Tieňový: ${archetype.shadow.name}`
                : `Secondary: ${archetype.secondary.name} | Shadow: ${archetype.shadow.name}`);
              addSpace();

              // === KRISTALOTERAPIA ===
              addSection(language === 'sk' ? 'KRISTALOTERAPIA' : 'CRYSTAL THERAPY', 'violet');
              const zodiacCrystals = getZodiacCrystals(astrology.sunSign.name, language);
              if (zodiacCrystals.length > 0) {
                addBoldLine(language === 'sk' ? `Kryštály pre ${sunSignName}:` : `Crystals for ${sunSignName}:`);
                zodiacCrystals.forEach(c => addLine(`  ${c.name} — ${c.properties}`));
                addSpace();
              }
              const blockedChakraNums = chakras.filter(c => c.status === 'blocked').map(c => c.chakra?.number).filter((n): n is number => n !== undefined);
              const healingCrystals = getBlockedChakraCrystals(blockedChakraNums, language);
              if (healingCrystals.length > 0) {
                addBoldLine(language === 'sk' ? 'Pre blokované čakry:' : 'For blocked chakras:');
                healingCrystals.forEach(c => addLine(language === 'sk' ? `  ${c.name} (čakra ${c.chakra}) — ${c.usage}` : `  ${c.name} (chakra ${c.chakra}) — ${c.usage}`));
                addSpace();
              }
              const dailyCrystal = getDailyCrystal(numerology.odv, language);
              addLine(language === 'sk'
                ? `Kryštál dňa (ODV ${numerology.odv}): ${dailyCrystal.name} — ${dailyCrystal.properties}`
                : `Crystal of the day (ODV ${numerology.odv}): ${dailyCrystal.name} — ${dailyCrystal.properties}`);
              addSpace();

              // === KUA ČÍSLO ===
              const gender = (client as { gender?: string }).gender === 'female' ? 'female' : 'male';
              const kua = calculateKua(client.birthYear, gender as 'male' | 'female', language);
              addSection(language === 'sk' ? 'KUA ČÍSLO (FENG SHUI)' : 'KUA NUMBER (FENG SHUI)', 'amber');
              addBoldLine(`Kua: ${kua.kuaNumber} | ${language === 'sk' ? 'Skupina' : 'Group'}: ${kua.group === 'east' ? (language === 'sk' ? 'Východná' : 'Eastern') : (language === 'sk' ? 'Západná' : 'Western')} | Element: ${kua.element}`);
              addLine(language === 'sk'
                ? `Spálňa: ${kua.bestForSleep} | Pracovný stôl: ${kua.bestForWork} | Vstup: ${kua.bestForEntrance}`
                : `Bedroom: ${kua.bestForSleep} | Desk: ${kua.bestForWork} | Entrance: ${kua.bestForEntrance}`);
              addLine(language === 'sk'
                ? `Priaznivé smery: ${kua.favorable.map(d => d.direction).join(', ')}`
                : `Favorable directions: ${kua.favorable.map(d => d.direction).join(', ')}`);
              addSpace();

              // === PARTNERSKÁ KOMPATIBILITA ===
              if (client.partnerId) {
                const partner = clients.find(c => c.id === client.partnerId);
                if (partner) {
                  const partnerNum = calculateFullNumerology(partner.birthDay, partner.birthMonth, partner.birthYear);
                  const compat = calculatePartnerCompatibility(numerology, partnerNum, language);
                  addSection(language === 'sk' ? 'PARTNERSKÁ KOMPATIBILITA' : 'PARTNER COMPATIBILITY', 'rose');
                  addBoldLine(language === 'sk'
                    ? `${client.name} & ${partner.name} — Celkové skóre: ${compat.overallScore}%`
                    : `${client.name} & ${partner.name} — Overall Score: ${compat.overallScore}%`);
                  addLine(language === 'sk'
                    ? `Životné čísla: ${numerology.lifePathNumber} + ${partnerNum.lifePathNumber} | Zhoda: ${compat.lifePathCompatibility.score}%`
                    : `Life Path Numbers: ${numerology.lifePathNumber} + ${partnerNum.lifePathNumber} | Match: ${compat.lifePathCompatibility.score}%`);
                  addLine(language === 'sk' ? `Jazyky lásky: ${compat.loveLanguageMatch.score}%` : `Love Languages: ${compat.loveLanguageMatch.score}%`);
                  if (compat.strengths.length > 0) {
                    addSpace();
                    addBoldLine(language === 'sk' ? 'Silné stránky:' : 'Strengths:');
                    compat.strengths.forEach(s => addLine(`  + ${s}`));
                  }
                  if (compat.challenges.length > 0) {
                    addSpace();
                    addBoldLine(language === 'sk' ? 'Výzvy:' : 'Challenges:');
                    compat.challenges.forEach(c => addLine(`  ! ${c}`));
                  }
                  addSpace();
                }
              }

              // === FOOTER ===
              checkPage(20);
              y += 10;
              doc.setDrawColor(79, 70, 229);
              doc.setLineWidth(0.3);
              doc.line(14, y, 196, y);
              y += 8;
              doc.setFontSize(8);
              doc.setFont('Roboto', 'normal');
              doc.setTextColor(120, 120, 120);
              const footerLocale = language === 'sk' ? 'sk-SK' : 'en-GB';
              doc.text(language === 'sk'
                ? `Vygenerovane: ${new Date().toLocaleDateString(footerLocale)} ${new Date().toLocaleTimeString(footerLocale)}`
                : `Generated: ${new Date().toLocaleDateString(footerLocale)} ${new Date().toLocaleTimeString(footerLocale)}`, 14, y);
              doc.text(language === 'sk' ? `Integrálna mapa bytia v${APP_VERSION}` : `Integral Map of Being v${APP_VERSION}`, 196, y, { align: 'right' });
              doc.setTextColor(0, 0, 0);

              addPageNumber();

              doc.save(`${language === 'sk' ? 'profil' : 'profile'}-${client.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
            } finally {
              setIsExporting(false);
            }
          }}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (language === 'sk' ? 'Generujem…' : 'Generating…') : (language === 'sk' ? 'Exportovať PDF (plný)' : 'Export PDF (full)')}
        </button>
        <button
          disabled={isExporting}
          onClick={async () => {
            if (isExporting) return;
            setIsExporting(true);
            try {
              const doc = await loadPdf();
              let y = 20;
              const addLine = (text: string) => {
                if (y > 270) { doc.addPage(); y = 20; }
                doc.setFontSize(10);
                doc.setFont('Roboto', 'normal');
                const lines = doc.splitTextToSize(text, 180);
                doc.text(lines, 14, y);
                y += lines.length * 5 + 2;
              };
              const addBold = (text: string) => {
                if (y > 270) { doc.addPage(); y = 20; }
                doc.setFontSize(11);
                doc.setFont('Roboto', 'bold');
                doc.text(text, 14, y);
                doc.setFont('Roboto', 'normal');
                y += 7;
              };
              const addSpace = () => { y += 5; };

              // Header
              doc.setFontSize(18);
              doc.setFont('Roboto', 'bold');
              doc.setTextColor(79, 70, 229);
              doc.text(language === 'sk' ? 'Osobný výklad' : 'Personal Reading', 105, 30, { align: 'center' });
              doc.setFontSize(14);
              doc.setTextColor(0, 0, 0);
              doc.text(client.name, 105, 40, { align: 'center' });
              doc.setFontSize(10);
              doc.setFont('Roboto', 'normal');
              doc.setTextColor(120, 120, 120);
              doc.text(`${client.birthDay}.${client.birthMonth}.${client.birthYear}`, 105, 48, { align: 'center' });
              doc.setTextColor(0, 0, 0);
              y = 60;

              // Životné číslo
              const lpKey = lifePaths[String(numerology.lifePathNumber)] ? String(numerology.lifePathNumber) : String(reduceToSingle(numerology.lifePathNumber));
              const lpInfo = getLifePath(lpKey, language);
              addBold(language === 'sk'
                ? `Životné číslo ${numerology.lifePathNumber} — ${lpInfo?.title || ''}`
                : `Life Path Number ${numerology.lifePathNumber} — ${lpInfo?.title || ''}`);
              if (lpInfo) {
                addLine(lpInfo.description);
                addSpace();
                addLine(language === 'sk' ? `Dar: ${lpInfo.gift}` : `Gift: ${lpInfo.gift}`);
                addLine(language === 'sk' ? `Tieň: ${lpInfo.shadow}` : `Shadow: ${lpInfo.shadow}`);
                addLine(language === 'sk' ? `Odporúčanie: ${lpInfo.recommendation}` : `Recommendation: ${lpInfo.recommendation}`);
              }
              addSpace();

              // HD
              const simpleHdType = displayName(HD_TYPE_DISPLAY, humanDesign.type, language);
              const simpleHdAuth = displayName(HD_AUTHORITY_DISPLAY, humanDesign.authority, language);
              addBold(`Human Design: ${simpleHdType}`);
              addLine(language === 'sk'
                ? `Stratégia: „${humanDesign.strategy}" — keď cítiš „${humanDesign.notSelfTheme.toLowerCase()}", niečo nie je pre teba.`
                : `Strategy: "${humanDesign.strategy}" — when you feel "${humanDesign.notSelfTheme.toLowerCase()}", something is not for you.`);
              addLine(language === 'sk'
                ? `Autorita: ${simpleHdAuth} — takto správne rozhoduješ.`
                : `Authority: ${simpleHdAuth} — this is how you make correct decisions.`);
              addSpace();

              // Astrológia
              const simpleSun = displayName(ZODIAC_DISPLAY, astrology.sunSign.name, language);
              const simpleMoon = displayName(ZODIAC_DISPLAY, astrology.moonSign.name, language);
              const simpleAsc = displayName(ZODIAC_DISPLAY, astrology.ascendant.name, language);
              const simpleDomEl = displayName(ELEMENT_DISPLAY, astrology.dominantElement, language);
              addBold(language === 'sk' ? 'Astrológia' : 'Astrology');
              addLine(language === 'sk'
                ? `Slnko v ${simpleSun} — tvoja podstata.`
                : `Sun in ${simpleSun} — your essence.`);
              addLine(language === 'sk'
                ? `Mesiac v ${simpleMoon} — tvoje emócie.`
                : `Moon in ${simpleMoon} — your emotions.`);
              addLine(language === 'sk'
                ? `Ascendent v ${simpleAsc} — ako ťa vidia iní.`
                : `Ascendant in ${simpleAsc} — how others see you.`);
              addLine(language === 'sk'
                ? `Dominantný element: ${simpleDomEl}.`
                : `Dominant element: ${simpleDomEl}.`);
              addSpace();

              // Vývojová
              const devNum = calculateDevelopmentalNumerology(client.birthDay, client.birthMonth, client.birthYear);
              addBold(language === 'sk' ? 'Vývojová numerológia' : 'Developmental Numerology');
              addLine(language === 'sk'
                ? `K3 (životné poslanie): ${devNum.circled[2].value} — hlavná téma, pre ktorú si tu.`
                : `K3 (life mission): ${devNum.circled[2].value} — the main theme you are here for.`);
              addLine(language === 'sk'
                ? `Polarita ega: ${devNum.egoPolarity === 'masculine' ? 'mužské' : devNum.egoPolarity === 'feminine' ? 'ženské' : 'bez ega'}.`
                : `Ego polarity: ${devNum.egoPolarity === 'masculine' ? 'masculine' : devNum.egoPolarity === 'feminine' ? 'feminine' : 'no ego'}.`);
              addSpace();

              // Praktické tipy
              addBold(language === 'sk' ? 'Prakticky — čo s tým' : 'Practical — what to do');
              addLine(language === 'sk'
                ? `1. Rozhodovanie: používaj svoju autoritu (${simpleHdAuth}).`
                : `1. Decision-making: use your authority (${simpleHdAuth}).`);
              addLine(language === 'sk'
                ? `2. Energia: stratégia „${humanDesign.strategy.toLowerCase()}" — keď to funguje, cítiš spokojnosť.`
                : `2. Energy: strategy "${humanDesign.strategy.toLowerCase()}" — when it works, you feel satisfaction.`);
              addLine(language === 'sk'
                ? `3. Rast: dar = ${lpInfo?.gift?.toLowerCase() || '?'}. Výzva = ${lpInfo?.shadow?.toLowerCase() || '?'}.`
                : `3. Growth: gift = ${lpInfo?.gift?.toLowerCase() || '?'}. Challenge = ${lpInfo?.shadow?.toLowerCase() || '?'}.`);
              addSpace();

              // Footer
              doc.setFontSize(8);
              doc.setTextColor(150, 150, 150);
              doc.text(language === 'sk'
                ? `Vygenerované: ${new Date().toLocaleDateString('sk-SK')} | Integrálna mapa bytia`
                : `Generated: ${new Date().toLocaleDateString('en-GB')} | Integral Map of Being`, 105, 285, { align: 'center' });

              doc.save(`${language === 'sk' ? 'vyklad' : 'reading'}-${client.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
            } finally {
              setIsExporting(false);
            }
          }}
          className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (language === 'sk' ? 'Generujem…' : 'Generating…') : (language === 'sk' ? 'PDF pre klienta (zjednodušený)' : 'PDF for client (simplified)')}
        </button>
        <button
          onClick={() => {
            const shareData = {
              name: client.name,
              birthDay: client.birthDay,
              birthMonth: client.birthMonth,
              birthYear: client.birthYear,
              birthHour: client.birthHour,
              birthMinute: client.birthMinute,
            };
            // Modern UTF-8 → base64 (escape() je deprecated)
            const json = JSON.stringify(shareData);
            const bytes = new TextEncoder().encode(json);
            const binary = String.fromCharCode(...bytes);
            const encoded = btoa(binary);
            const baseUrl = window.location.origin + window.location.pathname;
            const shareUrl = `${baseUrl}#/shared?data=${encoded}`;

            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(shareUrl).then(() => {
                setShareMsg(language === 'sk' ? 'Skopírované!' : 'Copied!');
                setTimeout(() => setShareMsg(''), 3000);
              }).catch(() => {
                prompt(language === 'sk' ? 'Skopírujte tento link:' : 'Copy this link:', shareUrl);
              });
            } else {
              prompt(language === 'sk' ? 'Skopírujte tento link:' : 'Copy this link:', shareUrl);
            }
          }}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
        >
          {shareMsg || (language === 'sk' ? 'Zdieľať výklad' : 'Share reading')}
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className="px-6 py-3 rounded-xl bg-slate-600 text-white font-medium hover:bg-slate-500 transition-colors"
        >
          {language === 'sk' ? 'QR kód' : 'QR Code'}
        </button>
        </div>
        {showQR && (() => {
          const qrData = {
            name: client.name,
            birthDay: client.birthDay,
            birthMonth: client.birthMonth,
            birthYear: client.birthYear,
            birthHour: client.birthHour,
            birthMinute: client.birthMinute,
          };
          const json = JSON.stringify(qrData);
          const bytes = new TextEncoder().encode(json);
          const binary = String.fromCharCode(...bytes);
          const encoded = btoa(binary);
          const baseUrl = window.location.origin + window.location.pathname;
          const qrUrl = `${baseUrl}#/shared?data=${encoded}`;
          return (
            <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 text-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
                alt={language === 'sk' ? 'QR kód pre zdieľanie profilu' : 'QR code for sharing profile'}
                className="mx-auto w-48 h-48"
              />
              <p className="text-xs text-slate-500 mt-2">{language === 'sk' ? `Naskenuj pre zobrazenie profilu ${client.name}` : `Scan to view ${client.name}'s profile`}</p>
              <p className="text-[10px] text-slate-400 mt-1 break-all max-w-xs mx-auto">{qrUrl.slice(0, 80)}...</p>
            </div>
          );
        })()}
      </GlassCard>
    </motion.section>
  );
}
