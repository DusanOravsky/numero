import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import type { NumerologyResult } from '../engine/numerologyEngine';
import type { AstrologyResult } from '../engine/astrologyEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import { planetInSignDescriptions } from '../data/planetSignDescriptions';
import { orvDescriptions } from '../data/orvDescriptions';
import { getGeneKeyByGate } from '../data/geneKeys';
import lifePathsData from '../data/lifePaths.json';

const lifePaths = lifePathsData as Record<string, { title: string; keywords: string[]; description: string; gift: string; shadow: string }>;

interface ClientSummaryProps {
  clientName: string;
  numerology: NumerologyResult;
  astrology: AstrologyResult;
  humanDesign: HumanDesignResult;
  kabalah: KabalahResult;
  theta: ThetaHealingResult;
}

export function ClientSummary({ clientName, numerology, astrology, humanDesign, kabalah, theta }: ClientSummaryProps) {
  const lpInfo = lifePaths[String(numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber)];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
      <GlassCard glow>
        <h2 className="font-serif text-xl font-bold text-indigo-600 mb-4">Integrálny súhrn osobnosti</h2>
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            <strong>{clientName}</strong> nesie životné číslo <strong>{numerology.lifePathNumber}</strong> z {numerology.lifePathFrom} ({lpInfo?.title || ''}).
            {lpInfo?.description || ''} Toto číslo definuje jadro osobnosti, hlavnú životnú lekciu a smer rastu.
          </p>

          <p className="border-l-2 border-indigo-200 pl-3">
            <strong>Dar:</strong> {lpInfo?.gift || '-'}.<br/>
            <strong>Tieň:</strong> {lpInfo?.shadow || '-'}.
          </p>

          <p>
            <strong>Astrológia</strong> dopĺňa tento obraz: Slnko v <strong>{astrology.sunSign.name}</strong> ({astrology.sunSign.element}) –
            {planetInSignDescriptions['Slnko']?.[astrology.sunSign.name] || ''}{' '}
            Mesiac v <strong>{astrology.moonSign.name}</strong> ({astrology.moonSign.element}) odhaľuje emočný svet –
            {planetInSignDescriptions['Mesiac']?.[astrology.moonSign.name] || ''}{' '}
            Ascendent v <strong>{astrology.ascendant.name}</strong> určuje, ako ho vnímajú ostatní pri prvom kontakte.
            Dominantný živel je <strong>{astrology.dominantElement}</strong>, čo {
              astrology.dominantElement === 'Oheň' ? 'prináša dynamiku, vášeň a akčnosť' :
              astrology.dominantElement === 'Zem' ? 'prináša praktickosť, spoľahlivosť a zmysel pre realitu' :
              astrology.dominantElement === 'Vzduch' ? 'prináša intelekt, komunikačný talent a slobodomyseľnosť' :
              'prináša emočnú hĺbku, intuíciu a empatiu'
            }.
          </p>

          <p>
            V <strong>Human Design</strong> je typ <strong>{humanDesign.type}</strong> s <strong>{humanDesign.authority}</strong> autoritou.
            {humanDesign.type === 'Generátor' ? ' Ako Generátor má obrovskú životnú energiu, ale musí čakať na správne podnety – nie iniciovať z hlavy. Keď reaguje na to, čo ho naozaj "zapne", je neúnavný.' :
             humanDesign.type === 'Manifestujúci Generátor' ? ' Kombinuje energiu Generátora s iniciatívou Manifestora – je rýchly, multi-talentovaný, ale musí reagovať AJ informovať okolie.' :
             humanDesign.type === 'Manifestor' ? ' Ako Manifestor je tu aby začínal a inicioval. Musí informovať ostatných pred konaním, čím redukuje odpor okolia.' :
             humanDesign.type === 'Projektor' ? ' Ako Projektor nemá konzistentnú vlastnú energiu, ale vidí systémy a ľudí hlboko. Musí čakať na pozvanie do veľkých životných rozhodnutí.' :
             ' Ako Reflektor odráža prostredie okolo seba a musí čakať 28 dní pred veľkými rozhodnutiami.'}
            {' '}Stratégia: <strong>{humanDesign.strategy}</strong>.
            Profil <strong>{humanDesign.profile.line1}/{humanDesign.profile.line2}</strong> ({humanDesign.profile.name}) – {humanDesign.profile.description}
          </p>

          <p>
            <strong>Energetická mapa:</strong>{' '}
            {humanDesign.definedCenters.length >= 6 ? 'Väčšina centier je definovaná – má konzistentnú a spoľahlivú energiu vo väčšine oblastí života.' :
             humanDesign.definedCenters.length >= 4 ? 'Vyvážený počet definovaných a otvorených centier – kombinácia stability a flexibility.' :
             'Väčšina centier je otvorená – je vysoko adaptabilný a citlivý na prostredie, ale musí rozlišovať čo je jeho a čo absorbuje od iných.'}
            {' '}Definované: {humanDesign.definedCenters.join(', ')}.
            Otvorené (oblasti múdrosti): {humanDesign.openCenters.join(', ')}.
          </p>

          {(() => {
            const sunGate = humanDesign.personalityGates.find(g => g.planet === 'Slnko')?.gate;
            const earthGate = humanDesign.personalityGates.find(g => g.planet === 'Zem')?.gate;
            const topGeneKeys = [sunGate, earthGate].filter((g): g is number => g !== undefined).map(g => getGeneKeyByGate(g)).filter(Boolean);
            if (topGeneKeys.length === 0) return null;
            return (
              <div className="border-l-2 border-purple-200 pl-3 space-y-3">
                <p><strong>Génové kľúče – cesta transformácie:</strong></p>
                {topGeneKeys.map((gk) => (
                  <div key={gk!.gate} className="space-y-1">
                    <p className="text-sm">
                      <strong>Brána {gk!.gate}</strong>: <span className="text-red-600">{gk!.shadow}</span> (tieň) →
                      <span className="text-amber-600"> {gk!.gift}</span> (dar) →
                      <span className="text-green-600"> {gk!.siddhi}</span> (siddhi)
                    </p>
                    <p className="text-xs text-slate-500">{gk!.shadowDescription}</p>
                    <p className="text-xs text-slate-500">Dar: {gk!.giftDescription}</p>
                    <p className="text-xs text-slate-600">
                      <strong>NLP: {gk!.nlpTechnique}</strong> – {gk!.nlpDescription}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}

          <p>
            {numerology.fullPlanes.length > 0 && <><strong>Silné stránky</strong> (plné roviny): {numerology.fullPlanes.join(', ')}. Tieto schopnosti dostal do vienka a môže sa na ne spoliehať. </>}
            {numerology.emptyPlanes.length > 0 && <><strong>Oblasti rastu</strong> (prázdne roviny): {numerology.emptyPlanes.join(', ')}. Tu sa učí a rastie – nie je to slabosť, ale smer rozvoja. </>}
            {numerology.isolatedNumbers.length > 0 && <>Izolované čísla ({numerology.isolatedNumbers.join(', ')}) naznačujú energie, ktoré sú odrezané od zvyšku – vyžadujú vedomú pozornosť a integráciu.</>}
          </p>

          <p>
            <strong>Vo vzťahoch</strong> je primárny jazyk lásky <strong>{numerology.loveLanguages[0]?.language || '-'}</strong> –
            {numerology.loveLanguages[0]?.language === 'Fyzický dotyk' ? ' najhlbšie prijíma a vyjadruje lásku cez fyzickú blízkosť, objatie, dotyk. Bez fyzického kontaktu sa cíti odpojený.' :
             numerology.loveLanguages[0]?.language === 'Slová uistenia' ? ' potrebuje počuť slová uznania, ocenenia a potvrdenia. Kritika ho hlboko zraňuje.' :
             numerology.loveLanguages[0]?.language === 'Kvalitný čas' ? ' najdôležitejšia je plná pozornosť a spoločne strávený čas. Rozptýlenie partnera vníma ako nezáujem.' :
             numerology.loveLanguages[0]?.language === 'Obdarovávanie' ? ' oceňuje premyslené dary a zdieľanie. Nie je to materializmus – ide o symbol: "myslel som na teba."' :
             ' najhlbšie vníma lásku cez praktickú pomoc a službu. Keď mu niekto uľahčí život, cíti sa milovaný.'}
          </p>

          <p>
            <strong>Aktuálne obdobie:</strong> Nachádza sa v osobnom roku <strong>{numerology.orv}</strong> ({orvDescriptions[numerology.orv]?.title || ''}).
            {orvDescriptions[numerology.orv]?.description || ''}{' '}
            Vek duchovnej dospelosti (VDD) nastáva v <strong>{numerology.vdd}</strong> rokoch – zlomové obdobie, kedy sa menia priority a životné hodnoty.
          </p>

          <p>
            <strong>Duchovná rovina</strong> (Kabala): Primárna sefira <strong>{kabalah.primarySefira.name}</strong> ({kabalah.primarySefira.meaning}).
            {' '}{kabalah.primarySefira.gift}. Tieňová stránka: {kabalah.primarySefira.shadow}.
            Denný čin: {kabalah.malchutAction}
          </p>

          <p>
            <strong>Podvedomé vzorce</strong> (Theta Healing): Na najhlbšej úrovni môže niesť presvedčenie
            <em> "{theta.primaryBeliefs[0]?.belief}"</em> (pôvod: {theta.primaryBeliefs[0]?.origin}).
            Toto presvedčenie sa drží v oblasti: {theta.primaryBeliefs[0]?.bodyArea}. Emócia: {theta.primaryBeliefs[0]?.emotion}.
            Cesta k transformácii vedie cez uvedomenie a nahradenie novým presvedčením.
          </p>

          <div className="border-t border-slate-200 pt-3 mt-3">
            <p className="text-xs text-slate-500">
              <strong>Prepojenia naprieč systémami:</strong>{' '}
              {numerology.lifePathNumber === 1 && humanDesign.type === 'Projektor' ? 'ŽČ 1 (vodcovstvo) + HD Projektor (čakať na pozvanie) = kľúčová lekcia je viesť cez múdrosť, nie silu. ' : ''}
              {numerology.lifePathNumber === 7 && astrology.dominantElement === 'Voda' ? 'ŽČ 7 (mystik) + vodný živel = silná intuícia a potreba hĺbky vo všetkom. ' : ''}
              {numerology.isolatedNumbers.includes(1) && humanDesign.openCenters.includes('G') ? 'Izolovaná 1 + otvorené G centrum = hľadanie identity je celoživotná téma. ' : ''}
              {astrology.dominantElement === 'Oheň' && numerology.fullPlanes.some(p => p.includes('Energia')) ? 'Ohnivý živel + plná Rovina energie = obrovská životná sila a akčnosť. ' : ''}
              {astrology.dominantElement === 'Zem' && numerology.fullPlanes.some(p => p.includes('Vytrvalosť')) ? 'Zemský živel + Rovina vytrvalosti = vynikajúca schopnosť dotiahnuť veci do konca. ' : ''}
              ŽČ {numerology.lifePathNumber} + {astrology.sunSign.name} + HD {humanDesign.type} tvoria unikátnu kombináciu, ktorá definuje cestu tejto osobnosti.
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
