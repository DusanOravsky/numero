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
import { planetInSignDescriptions, cycleVibrationDescriptions } from '../data/planetSignDescriptions';
import { orvDescriptions } from '../data/orvDescriptions';
import { getGeneKeyByGate } from '../data/geneKeys';
import lifePathsData from '../data/lifePaths.json';
import { useStore } from '../store/useStore';

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string }>;

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
  const [shareMsg, setShareMsg] = useState('');
  const { clients } = useStore();

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
      <h2 className="font-serif text-xl font-bold text-slate-300 mb-3">Kompletný profil</h2>
      <GlassCard>
        <p className="text-sm text-slate-400 mb-4">Exportujte kompletný profil klienta so všetkými výsledkami.</p>
        <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => {
            import('jspdf').then(({ jsPDF }) => {
              const doc = new jsPDF();
              const lpKey = String(numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber);
              const lpTitle = lifePaths[lpKey]?.title || '';
              const lpDesc = lifePaths[lpKey]?.description || '';
              let y = 20;
              let pageNum = 1;

              const addPageNumber = () => {
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
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

              // Farebné palety sekcií (RGB)
              const sectionColors: Record<string, [number, number, number]> = {
                indigo: [79, 70, 229],
                cyan: [8, 145, 178],
                purple: [124, 58, 237],
                green: [22, 163, 74],
                amber: [180, 83, 9],
                rose: [225, 29, 72],
                slate: [100, 116, 139],
                teal: [13, 148, 136],
              };

              const addSection = (text: string, color: keyof typeof sectionColors = 'indigo', icon?: string) => {
                checkPage(18);
                y += 4;
                const [r, g, b] = sectionColors[color];
                // Farebný pruh vľavo namiesto čiary cez celú šírku
                doc.setFillColor(r, g, b);
                doc.rect(14, y - 1, 3, 10, 'F');
                doc.setFontSize(13);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(r, g, b);
                doc.text(`${icon ? icon + '  ' : ''}${text}`, 21, y + 6);
                doc.setTextColor(0, 0, 0);
                y += 12;
              };

              const addLine = (text: string) => {
                checkPage();
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                const lines = doc.splitTextToSize(text, 180);
                doc.text(lines, 14, y);
                y += lines.length * 5 + 2;
              };

              const addBoldLine = (text: string) => {
                checkPage();
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                const lines = doc.splitTextToSize(text, 180);
                doc.text(lines, 14, y);
                doc.setFont('helvetica', 'normal');
                y += lines.length * 5 + 2;
              };

              const addSpace = () => { y += 4; };

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
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(120, 120, 130);
              doc.text('Integralna mapa bytia', 105, 50, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              // Hlavny nadpis s shadow efektom
              doc.setFontSize(28);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(79, 70, 229);
              doc.text('INTEGRALNY PROFIL', 105, 80, { align: 'center' });
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
              doc.setFont('helvetica', 'normal');
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
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(255, 255, 255);
              doc.text(String(lpNumber), 105, 173, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              doc.setFontSize(11);
              doc.setFont('helvetica', 'italic');
              doc.setTextColor(79, 70, 229);
              doc.text(`Zivotne cislo - ${lpTitle}`, 105, 188, { align: 'center' });
              doc.setTextColor(0, 0, 0);
              doc.setFont('helvetica', 'normal');

              // Spodok titulnej strany
              doc.setFontSize(9);
              doc.setTextColor(150, 150, 150);
              doc.text(new Date().toLocaleDateString('sk-SK'), 105, 270, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              addPageNumber();
              doc.addPage();
              pageNum++;
              y = 20;

              // === NUMEROLOGIA ===
              addSection('NUMEROLOGIA', 'indigo');
              addBoldLine(`Zivotne cislo: ${numerology.lifePathNumber} z ${numerology.lifePathFrom} - ${lpTitle}`);
              addLine(lpDesc);
              addSpace();
              addLine(`ORV: ${numerology.orv} | OMV: ${numerology.omv} | ODV: ${numerology.odv}`);
              addLine(`VDD: ${numerology.vdd} rokov`);
              addLine(`Plne roviny: ${numerology.fullPlanes.join(', ') || 'ziadne'}`);
              addLine(`Prazdne roviny: ${numerology.emptyPlanes.join(', ') || 'ziadne'}`);
              if (numerology.isolatedNumbers.length > 0) addLine(`Izolovane cisla: ${numerology.isolatedNumbers.join(', ')}`);
              addSpace();

              // Vizuálna mriežka 3×3 (Charakterová)
              checkPage(50);
              addBoldLine('Mriezka 3x3 (Charakterova):');
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
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(79, 70, 229);
                    doc.text(items.map(it => it.value).join(' '), cx + gridSize / 2 - 0.5, cy + gridSize / 2 + 2, { align: 'center' });
                    doc.setFont('helvetica', 'normal');
                  }
                });
              });
              doc.setTextColor(0, 0, 0);
              y += gridSize * 3 + 6;
              addSpace();

              addBoldLine('Karmicke cykly:');
              numerology.karmicTriangles.forEach(t => {
                addLine(`  ${t.label}: ${t.fromAge}-${t.toAge || '...'} r. | Vibracia ${t.vibration} - ${cycleVibrationDescriptions[t.vibration] || ''}`);
              });
              addSpace();

              // === VYVOJOVA NUMEROLOGIA (Livia / Cervenak) ===
              const devNum = calculateDevelopmentalNumerology(client.birthDay, client.birthMonth, client.birthYear);
              addSection('VYVOJOVA NUMEROLOGIA', 'amber');
              addLine(`D+M = ${devNum.dayMonthSum} | R = ${devNum.yearSum}${devNum.isPost2000 ? ' (rok >= 2000: 20 + zvysok)' : ''}`);
              addBoldLine('Karmicke cykly (zakruzkovane cisla):');
              const cycleNames = [
                'K1 - Psychicka stabilita',
                'K2 - Materialna stabilita',
                'K3 - Zivotne poslanie',
                'K4 - Detske sny',
              ];
              devNum.circled.forEach((c, idx) => {
                addLine(`  ${cycleNames[idx]}: ${c.value}  (${c.formula})`);
              });
              addSpace();
              if (devNum.oneCount > 0) {
                addBoldLine(`Polarita ega: ${devNum.egoPolarity === 'masculine' ? 'Muzske ego' : 'Zenske ego'} (${devNum.oneCount}x cislo 1)`);
                addLine(devNum.egoPolarity === 'masculine'
                  ? 'Neparny pocet jednotiek - energia davania, vymedzovania, akcie.'
                  : 'Parny pocet jednotiek - energia prijimania, otvorenia, trpezlivosti.');
              }
              addSpace();

              // === GENE KEYS ===
              const sunGate = humanDesign.personalityGates.find(g => g.planet === 'Slnko')?.gate;
              const earthGate = humanDesign.personalityGates.find(g => g.planet === 'Zem')?.gate;
              const topGeneKeys = [sunGate, earthGate].filter((g): g is number => g !== undefined).map(g => getGeneKeyByGate(g)).filter(Boolean);
              if (topGeneKeys.length > 0) {
                addSection('GENOVE KLUCE', 'purple');
                topGeneKeys.forEach(gk => {
                  if (!gk) return;
                  addBoldLine(`Brana ${gk.gate}:`);
                  addLine(`  Tien: ${gk.shadow} - ${gk.shadowDescription}`);
                  addLine(`  Dar: ${gk.gift} - ${gk.giftDescription}`);
                  addLine(`  Siddhi: ${gk.siddhi}`);
                  addLine(`  NLP technika: ${gk.nlpTechnique} - ${gk.nlpDescription}`);
                  addSpace();
                });
              }

              // === ASTROLOGIA ===
              addSection('ASTROLOGIA', 'cyan');
              addLine(`Slnko: ${astrology.sunSign.name} (${astrology.sunSign.element}) - ${planetInSignDescriptions['Slnko']?.[astrology.sunSign.name] || ''}`);
              addLine(`Mesiac: ${astrology.moonSign.name} (${astrology.moonSign.element}) - ${planetInSignDescriptions['Mesiac']?.[astrology.moonSign.name] || ''}`);
              addLine(`Ascendent: ${astrology.ascendant.name} (${astrology.ascendant.element})`);
              addLine(`Dominantny zivel: ${astrology.dominantElement} | Kvalita: ${astrology.dominantQuality}`);
              addSpace();

              // Vizuálne natálne koliesko (zjednodušené)
              checkPage(70);
              addBoldLine('Natalne koliesko:');
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
                doc.text(`${p.symbol} ${p.sign.name} ${Math.floor(p.degree)}°`, legendX, wheelCy - 18 + i * 5);
              });
              y = wheelCy + wheelR + 8;
              addSpace();

              // === HUMAN DESIGN ===
              addSection('HUMAN DESIGN', 'purple');
              addBoldLine(`Typ: ${humanDesign.type} | Autorita: ${humanDesign.authority}`);
              addLine(`Strategia: ${humanDesign.strategy}`);
              addLine(`Profil: ${humanDesign.profile.line1}/${humanDesign.profile.line2} - ${humanDesign.profile.name}: ${humanDesign.profile.description}`);
              addLine(`Inkarnacny kriz: ${humanDesign.incarnationCross}`);
              addLine(`Definovane centra: ${humanDesign.definedCenters.join(', ')}`);
              addLine(`Otvorene centra: ${humanDesign.openCenters.join(', ')}`);
              addSpace();

              // Vizuálny bodygraph — 9 centier
              checkPage(45);
              addBoldLine('Bodygraph (centra):');
              const centersLayout: Array<{ name: string; x: number; y: number }> = [
                { name: 'Hlava', x: 50, y: 0 },
                { name: 'Ajna', x: 50, y: 10 },
                { name: 'Hrdlo', x: 50, y: 20 },
                { name: 'G', x: 50, y: 30 },
                { name: 'Ego', x: 72, y: 26 },
                { name: 'Sakrál', x: 50, y: 40 },
                { name: 'SP', x: 72, y: 36 },
                { name: 'Slezina', x: 28, y: 36 },
                { name: 'Koreň', x: 50, y: 50 },
              ];
              const definedSet = new Set(humanDesign.definedCenters);
              const nameMap: Record<string, string> = { 'Srdce/Ego': 'Ego', 'Solárny plexus': 'SP', 'Sakrálne': 'Sakrál' };
              const bgStartY = y + 2;
              centersLayout.forEach(c => {
                const cx = 14 + c.x * 0.8;
                const cy = bgStartY + c.y * 0.7;
                const isDef = definedSet.has(c.name) || Object.entries(nameMap).some(([full, short]) => short === c.name && definedSet.has(full));
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

              // === JAZYKY LASKY ===
              addSection('JAZYKY LASKY', 'rose');
              numerology.loveLanguages.forEach((l, i) => addLine(`${i + 1}. ${l.language}: ${l.score} bodov`));
              addSpace();

              // === THETA HEALING ===
              addSection('THETA HEALING', 'teal');
              addBoldLine('Limitujuce presvedcenia:');
              theta.primaryBeliefs.forEach(b => addLine(`  "${b.belief}" (${b.level}, ${b.emotion})`));
              addSpace();

              // === KABALA ===
              addSection('KABALA', 'amber');
              addLine(`Primarna sefira: ${kabalah.primarySefira.name} (${kabalah.primarySefira.meaning})`);
              addLine(`Dar: ${kabalah.primarySefira.gift}`);
              addLine(`Tien: ${kabalah.primarySefira.shadow}`);
              addLine(`Cin v Malchut: ${kabalah.malchutAction}`);
              addSpace();

              // === PARTNER COMPATIBILITY ===
              if (client.partnerId) {
                const partner = clients.find(c => c.id === client.partnerId);
                if (partner) {
                  const partnerNum = calculateFullNumerology(partner.birthDay, partner.birthMonth, partner.birthYear);
                  const compat = calculatePartnerCompatibility(numerology, partnerNum);
                  addSection('PARTNERSKA KOMPATIBILITA', 'rose');
                  addBoldLine(`${client.name} & ${partner.name} - Celkove skore: ${compat.overallScore}%`);
                  addLine(`Zivotne cisla: ${numerology.lifePathNumber} + ${partnerNum.lifePathNumber} | Zhoda: ${compat.lifePathCompatibility.score}%`);
                  addLine(`Jazyky lasky: ${compat.loveLanguageMatch.score}%`);
                  if (compat.strengths.length > 0) {
                    addSpace();
                    addBoldLine('Silne stranky:');
                    compat.strengths.forEach(s => addLine(`  + ${s}`));
                  }
                  if (compat.challenges.length > 0) {
                    addSpace();
                    addBoldLine('Vyzvy:');
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
              doc.setFont('helvetica', 'italic');
              doc.setTextColor(120, 120, 120);
              doc.text(`Vygenerovane: ${new Date().toLocaleDateString('sk-SK')} ${new Date().toLocaleTimeString('sk-SK')}`, 14, y);
              doc.text(`Integralna mapa bytia v${APP_VERSION}`, 196, y, { align: 'right' });
              doc.setTextColor(0, 0, 0);

              addPageNumber();

              doc.save(`profil-${client.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
            });
          }}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
        >
          Exportovať PDF
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
                setShareMsg('Skopírované!');
                setTimeout(() => setShareMsg(''), 3000);
              }).catch(() => {
                prompt('Skopírujte tento link:', shareUrl);
              });
            } else {
              prompt('Skopírujte tento link:', shareUrl);
            }
          }}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
        >
          {shareMsg || 'Zdieľať výklad'}
        </button>
        <button
          onClick={() => {
            const gridNumbers: string[] = [];
            for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                const cell = numerology.grid[row][col];
                if (cell.value > 0) {
                  const count = numerology.gridNumbers.filter(g => g.value === cell.value).length;
                  gridNumbers.push(`${cell.value} (${count}x)`);
                }
              }
            }

            const lpKey = String(numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber);
            const lpDescription = lifePaths[lpKey]?.description || '';
            const lpTitle2 = lifePaths[lpKey]?.title || '';

            const orvInfo = orvDescriptions[numerology.orv];

            const sunDesc = planetInSignDescriptions['Slnko']?.[astrology.sunSign.name] || '';
            const moonDesc = planetInSignDescriptions['Mesiac']?.[astrology.moonSign.name] || '';
            const ascDesc = `Vystupujuci znak na horizonte pri narodeni - urcuje vonkajsi prejav a prvy dojem`;

            const primaryLoveLang = numerology.loveLanguages[0];

            const primaryBelief = theta.primaryBeliefs[0];

            const text = [
              '═══════════════════════════════════════════',
              '         KOMPLETNY PROFIL',
              '═══════════════════════════════════════════',
              '',
              `Meno: ${client.name}`,
              `Datum narodenia: ${client.birthDay}.${client.birthMonth}.${client.birthYear}${client.birthHour !== undefined ? ` ${client.birthHour}:${String(client.birthMinute || 0).padStart(2, '0')}` : ''}`,
              '',
              '───────────────────────────────────────────',
              '  NUMEROLOGIA',
              '───────────────────────────────────────────',
              '',
              `Zivotne cislo: ${numerology.lifePathNumber} (z ${numerology.lifePathFrom})`,
              `Nazov: ${lpTitle2}`,
              `Popis: ${lpDescription}`,
              '',
              `Mriezka 3x3 - pritomne cisla: ${gridNumbers.join(', ')}`,
              '',
              `Plne roviny: ${numerology.fullPlanes.length > 0 ? numerology.fullPlanes.join(', ') : 'ziadne'}`,
              `Prazdne roviny: ${numerology.emptyPlanes.length > 0 ? numerology.emptyPlanes.join(', ') : 'ziadne'}`,
              `Izolovane cisla: ${numerology.isolatedNumbers.length > 0 ? numerology.isolatedNumbers.join(', ') : 'ziadne'}`,
              '',
              `ORV (Osobna rocna vibracia): ${numerology.orv}${orvInfo ? ` - ${orvInfo.title}: ${orvInfo.theme}` : ''}`,
              `OMV (Osobna mesacna vibracia): ${numerology.omv}`,
              `ODV (Osobna denna vibracia): ${numerology.odv}`,
              '',
              `VDD (Vek duchovnej dospelosti): ${numerology.vdd} rokov`,
              '',
              'Karmicke cykly:',
              ...numerology.karmicTriangles.map(t =>
                `  ${t.label}: ${t.fromAge}-${t.toAge || '∞'} r. | Vibracia ${t.vibration} | ${t.description}${cycleVibrationDescriptions[t.vibration] ? ' | ' + cycleVibrationDescriptions[t.vibration] : ''}`
              ),
              '',
              '───────────────────────────────────────────',
              '  ASTROLOGIA',
              '───────────────────────────────────────────',
              '',
              `Slnko: ${astrology.sunSign.name} (${astrology.sunSign.element})`,
              `  ${sunDesc}`,
              '',
              `Mesiac: ${astrology.moonSign.name} (${astrology.moonSign.element})`,
              `  ${moonDesc}`,
              '',
              `Ascendent: ${astrology.ascendant.name} (${astrology.ascendant.element})`,
              `  ${ascDesc}`,
              '',
              `Dominantny zivel: ${astrology.dominantElement}`,
              `Dominantna kvalita: ${astrology.dominantQuality}`,
              `Dominantna planeta: ${astrology.dominantPlanet}`,
              `Mesacna faza: ${astrology.moonPhase}`,
              '',
              '───────────────────────────────────────────',
              '  HUMAN DESIGN',
              '───────────────────────────────────────────',
              '',
              `Typ: ${humanDesign.type}`,
              `Autorita: ${humanDesign.authority}`,
              `Strategia: ${humanDesign.strategy}`,
              `Profil: ${humanDesign.profile.line1}/${humanDesign.profile.line2} - ${humanDesign.profile.name}`,
              `Inkarnacny kriz: ${humanDesign.incarnationCross}`,
              `Definovane centra: ${humanDesign.definedCenters.join(', ')}`,
              `Otvorene centra: ${humanDesign.openCenters.join(', ')}`,
              '',
              '───────────────────────────────────────────',
              '  JAZYKY LASKY',
              '───────────────────────────────────────────',
              '',
              `Primarny jazyk lasky: ${primaryLoveLang?.language || '-'} (skore: ${primaryLoveLang?.score || 0})`,
              ...numerology.loveLanguages.map((l, i) => `  ${i + 1}. ${l.language}: ${l.score} bodov`),
              '',
              '───────────────────────────────────────────',
              '  THETA HEALING',
              '───────────────────────────────────────────',
              '',
              `Primarne limitujuce presvedcenie: "${primaryBelief?.belief || '-'}"`,
              `  Uroven: ${primaryBelief?.level || '-'}`,
              `  Emocionalny naboj: ${primaryBelief?.emotion || '-'}`,
              '',
              'Dalsie presvedcenia:',
              ...theta.primaryBeliefs.slice(1).map(b => `  - "${b.belief}" (${b.level}, ${b.emotion})`),
              '',
              '═══════════════════════════════════════════',
              `Vygenerovane: ${new Date().toLocaleDateString('sk-SK')} ${new Date().toLocaleTimeString('sk-SK')}`,
              '═══════════════════════════════════════════',
            ].join('\n');

            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `profil-${client.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
        >
          Exportovať TXT
        </button>
        </div>
      </GlassCard>
    </motion.section>
  );
}
