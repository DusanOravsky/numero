import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { calculateFullNumerology, reduceToSingle } from '../engine/numerologyEngine';
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

              const addSection = (text: string) => {
                checkPage(15);
                y += 4;
                doc.setDrawColor(79, 70, 229);
                doc.setLineWidth(0.5);
                doc.line(14, y, 196, y);
                y += 7;
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(79, 70, 229);
                doc.text(text, 14, y);
                doc.setTextColor(0, 0, 0);
                y += 8;
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
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(150, 150, 150);
              doc.text('Integralna mapa bytia', 105, 60, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              doc.setFontSize(26);
              doc.setFont('helvetica', 'bold');
              doc.text('INTEGRALNY PROFIL', 105, 85, { align: 'center' });

              doc.setDrawColor(79, 70, 229);
              doc.setLineWidth(1);
              doc.line(60, 92, 150, 92);

              doc.setFontSize(18);
              doc.setFont('helvetica', 'normal');
              doc.text(client.name, 105, 110, { align: 'center' });

              doc.setFontSize(12);
              doc.setTextColor(100, 100, 100);
              doc.text(`${client.birthDay}.${client.birthMonth}.${client.birthYear}${client.birthHour !== undefined ? ` ${client.birthHour}:${String(client.birthMinute || 0).padStart(2, '0')}` : ''}`, 105, 122, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              doc.setFontSize(10);
              doc.setTextColor(150, 150, 150);
              doc.text(new Date().toLocaleDateString('sk-SK'), 105, 140, { align: 'center' });
              doc.setTextColor(0, 0, 0);

              addPageNumber();
              doc.addPage();
              pageNum++;
              y = 20;

              // === NUMEROLOGIA ===
              addSection('NUMEROLOGIA');
              addBoldLine(`Zivotne cislo: ${numerology.lifePathNumber} z ${numerology.lifePathFrom} - ${lpTitle}`);
              addLine(lpDesc);
              addSpace();
              addLine(`ORV: ${numerology.orv} | OMV: ${numerology.omv} | ODV: ${numerology.odv}`);
              addLine(`VDD: ${numerology.vdd} rokov`);
              addLine(`Plne roviny: ${numerology.fullPlanes.join(', ') || 'ziadne'}`);
              addLine(`Prazdne roviny: ${numerology.emptyPlanes.join(', ') || 'ziadne'}`);
              if (numerology.isolatedNumbers.length > 0) addLine(`Izolovane cisla: ${numerology.isolatedNumbers.join(', ')}`);
              addSpace();

              addBoldLine('Karmicke cykly:');
              numerology.karmicTriangles.forEach(t => {
                addLine(`  ${t.label}: ${t.fromAge}-${t.toAge || '...'} r. | Vibracia ${t.vibration} - ${cycleVibrationDescriptions[t.vibration] || ''}`);
              });
              addSpace();

              // === GENE KEYS ===
              const sunGate = humanDesign.personalityGates.find(g => g.planet === 'Slnko')?.gate;
              const earthGate = humanDesign.personalityGates.find(g => g.planet === 'Zem')?.gate;
              const topGeneKeys = [sunGate, earthGate].filter((g): g is number => g !== undefined).map(g => getGeneKeyByGate(g)).filter(Boolean);
              if (topGeneKeys.length > 0) {
                addSection('GENOVE KLUCE');
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
              addSection('ASTROLOGIA');
              addLine(`Slnko: ${astrology.sunSign.name} (${astrology.sunSign.element}) - ${planetInSignDescriptions['Slnko']?.[astrology.sunSign.name] || ''}`);
              addLine(`Mesiac: ${astrology.moonSign.name} (${astrology.moonSign.element}) - ${planetInSignDescriptions['Mesiac']?.[astrology.moonSign.name] || ''}`);
              addLine(`Ascendent: ${astrology.ascendant.name} (${astrology.ascendant.element})`);
              addLine(`Dominantny zivel: ${astrology.dominantElement} | Kvalita: ${astrology.dominantQuality}`);
              addSpace();

              // === HUMAN DESIGN ===
              addSection('HUMAN DESIGN');
              addBoldLine(`Typ: ${humanDesign.type} | Autorita: ${humanDesign.authority}`);
              addLine(`Strategia: ${humanDesign.strategy}`);
              addLine(`Profil: ${humanDesign.profile.line1}/${humanDesign.profile.line2} - ${humanDesign.profile.name}: ${humanDesign.profile.description}`);
              addLine(`Inkarnacny kriz: ${humanDesign.incarnationCross}`);
              addLine(`Definovane centra: ${humanDesign.definedCenters.join(', ')}`);
              addLine(`Otvorene centra: ${humanDesign.openCenters.join(', ')}`);
              addSpace();

              // === JAZYKY LASKY ===
              addSection('JAZYKY LASKY');
              numerology.loveLanguages.forEach((l, i) => addLine(`${i + 1}. ${l.language}: ${l.score} bodov`));
              addSpace();

              // === THETA HEALING ===
              addSection('THETA HEALING');
              addBoldLine('Limitujuce presvedcenia:');
              theta.primaryBeliefs.forEach(b => addLine(`  "${b.belief}" (${b.level}, ${b.emotion})`));
              addSpace();

              // === KABALA ===
              addSection('KABALA');
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
                  addSection('PARTNERSKA KOMPATIBILITA');
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
              doc.text('Integralna mapa bytia v1.5.0', 196, y, { align: 'right' });
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
            const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
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
