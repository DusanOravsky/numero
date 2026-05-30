import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import type { NumerologyResult } from '../engine/numerologyEngine';
import type { AstrologyResult } from '../engine/astrologyEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import { getEnneagramType } from '../data/enneagram';
import { deriveDosha } from '../engine/ayurvedaEngine';
import { deriveTCMElement } from '../engine/tcmEngine';
import { getDoshaInfo } from '../data/ayurveda';
import { getTCMElement } from '../data/tcm';
import { useStore } from '../store/useStore';
import { calculateChineseZodiac } from '../engine/chineseZodiacEngine';
import { getChineseAnimalInfo } from '../data/chineseZodiac';
import { evaluateChakras } from '../engine/chakraEngine';
import { getGridCount } from '../engine/numerologyEngine';
import { getPlanetSignDescription } from '../data/planetSignDescriptions';
import { getOrvDescription } from '../data/orvDescriptions';
import { getGeneKeyByGate } from '../data/geneKeys';
import { useTranslation } from '../i18n/useTranslation';
import { displayName, ZODIAC_DISPLAY, ELEMENT_DISPLAY, HD_TYPE_DISPLAY, HD_AUTHORITY_DISPLAY, HD_CENTER_DISPLAY, HD_STRATEGY_DISPLAY, HD_NOT_SELF_THEME_DISPLAY, LOVE_LANGUAGE_DISPLAY, CHINESE_ANIMAL_DISPLAY, CHINESE_ELEMENT_DISPLAY, CHAKRA_NAME_DISPLAY } from '../i18n/entityNames';
import { getCellMeaning } from '../data/developmentalMeanings';
import { getLoveLanguageDescription } from '../data/orvDescriptions';
import { deriveArchetype } from '../engine/archetypeEngine';
import { calculateBiorhythm } from '../engine/biorhythmEngine';
import { calculateKua } from '../engine/kuaEngine';
import { getDailyCrystal, getZodiacCrystals } from '../data/crystals';
import { getOmvDescription } from '../data/omvDescriptions';
import { getOdvDescription } from '../data/odvDescriptions';
import { getLifePath } from '../data/lifePaths';

interface ClientSummaryProps {
  clientName: string;
  /** Deň narodenia — pre výpočet Vývojovej mriežky. Ak chýba, fallback na regex z formuly. */
  birthDay?: number;
  birthMonth?: number;
  birthYear?: number;
  /** Pohlavie — Kua číslo (Feng Shui) sa líši pre mužov a ženy. Default 'male'. */
  gender?: 'male' | 'female';
  numerology: NumerologyResult;
  astrology: AstrologyResult;
  humanDesign: HumanDesignResult;
  kabalah: KabalahResult;
  theta: ThetaHealingResult;
  /** Ak true (default), zobrazí len pohľad pre aktuálnu zvolenú metódu.
   *  Ak false, zobrazí oba pohľady bez ohľadu na nastavenie (Dashboard). */
  respectMethodPreference?: boolean;
}

export function ClientSummary({ clientName, birthDay, birthMonth, birthYear, gender = 'male', numerology, astrology, humanDesign, kabalah, theta, respectMethodPreference = true }: ClientSummaryProps) {
  const { t, language } = useTranslation();
  const storedMethod = useStore(s => s.numerologyMethod);
  const showBoth = !respectMethodPreference;
  const showCharacter = showBoth || storedMethod === 'characterological';
  const showDevelopmental = showBoth || storedMethod === 'developmental';
  const lpInfo = getLifePath(String(numerology.lifePathNumber), language) || getLifePath(String(reduceToSingle(numerology.lifePathNumber)), language);

  // Vývojová mriežka — používame explicit props ak sú dostupné,
  // inak (legacy callers) sfallback-ujeme cez regex z formuly.
  const m = numerology.formula.match(/\((\d+)→\d+\)\s*\+\s*\((\d+)→\d+\)\s*\+\s*\((\d+)→\d+\)/);
  const day = birthDay ?? (m ? parseInt(m[1], 10) : 1);
  const month = birthMonth ?? (m ? parseInt(m[2], 10) : 1);
  const year = birthYear ?? (m ? parseInt(m[3], 10) : 1900);
  const devNumerology = calculateDevelopmentalNumerology(day, month, year);

  // Z Vývojovej mriežky vyberieme top 3 najsilnejšie (najviac výskytov) a top 3 chýbajúce
  const devSorted = Object.entries(devNumerology.counts)
    .map(([k, v]) => ({ num: parseInt(k, 10), count: v }))
    .sort((a, b) => b.count - a.count);
  const devStrong = devSorted.filter(x => x.count >= 2).slice(0, 3);
  const devMissing = devSorted.filter(x => x.count === 0).slice(0, 3);

  const enneagram = deriveEnneagramType(numerology, devNumerology, storedMethod);
  const enneagramType = getEnneagramType(enneagram.coreType, language);
  const enneagramIntegration = getEnneagramType(enneagram.integrationDirection, language);
  const enneagramDisintegration = getEnneagramType(enneagram.disintegrationDirection, language);

  const doshaProfile = deriveDosha(numerology, astrology, humanDesign);
  const primaryDosha = getDoshaInfo(doshaProfile.primary, language);
  const tcmResult = deriveTCMElement(numerology, astrology);
  const primaryTCM = getTCMElement(tcmResult.primary, language);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
      <GlassCard glow>
        <h2 className="font-serif text-xl font-bold text-indigo-600 mb-4">{t('summary.title')}</h2>

        {/* Tvoje čítanie — ako pracovať s integrálnym súhrnom */}
        <details className="mb-5 rounded-xl border border-indigo-200 bg-white overflow-hidden">
          <summary className="p-4 cursor-pointer hover:bg-indigo-50/50 transition-colors">
            <span className="font-medium text-indigo-800">{t('summary.howToRead')}</span>
            <span className="text-xs text-indigo-500 ml-2">— {t('summary.guide')}</span>
          </summary>
          <div className="px-4 pb-4 space-y-3">
            <p className="text-xs text-slate-600">
              {language === 'sk'
                ? 'Integrálny súhrn kombinuje 11 systémov — ale nepotrebuješ zvládnuť všetky naraz. Každý hovorí o tom istom človeku, len iným jazykom. Tu je tvoj „čítací kľúč":'
                : 'The integral summary combines 11 systems — but you don\'t need to master them all at once. Each speaks about the same person, just in a different language. Here is your "reading key":'}
            </p>

            <div className="p-3 rounded-lg bg-violet-50 border border-violet-200">
              <p className="text-xs font-semibold text-violet-800 mb-1">1. {t('summary.whoYouAre')}</p>
              <p className="text-xs text-slate-700">
                {language === 'sk'
                  ? <>Životné číslo <strong>{numerology.lifePathNumber}</strong> ({lpInfo?.title || ''}) + Enneagram typ <strong>{enneagram.coreType}</strong> ({enneagramType?.name || ''}) — to je tvoja hlavná téma z dvoch uhlov. Začni tu.</>
                  : <>Life path number <strong>{numerology.lifePathNumber}</strong> ({lpInfo?.title || ''}) + Enneagram type <strong>{enneagram.coreType}</strong> ({enneagramType?.name || ''}) — this is your main theme from two angles. Start here.</>}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
              <p className="text-xs font-semibold text-indigo-800 mb-1">2. {t('summary.howToFunction')}</p>
              <p className="text-xs text-slate-700">
                {language === 'sk'
                  ? <>HD typ <strong>{displayName(HD_TYPE_DISPLAY, humanDesign.type, language)}</strong> + stratégia „{displayName(HD_STRATEGY_DISPLAY, humanDesign.strategy, language).toLowerCase()}" + autorita <strong>{displayName(HD_AUTHORITY_DISPLAY, humanDesign.authority, language)}</strong> — toto je tvoj denný „operačný systém". Keď cítiš {displayName(HD_NOT_SELF_THEME_DISPLAY, humanDesign.notSelfTheme, language).toLowerCase()}, niečo nie je pre teba.</>
                  : <>HD type <strong>{displayName(HD_TYPE_DISPLAY, humanDesign.type, language)}</strong> + strategy "{displayName(HD_STRATEGY_DISPLAY, humanDesign.strategy, language).toLowerCase()}" + authority <strong>{displayName(HD_AUTHORITY_DISPLAY, humanDesign.authority, language)}</strong> — this is your daily "operating system". When you feel {displayName(HD_NOT_SELF_THEME_DISPLAY, humanDesign.notSelfTheme, language).toLowerCase()}, something is not for you.</>}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs font-semibold text-amber-800 mb-1">3. {t('summary.whereGoing')}</p>
              <p className="text-xs text-slate-700">
                {language === 'sk'
                  ? <>Severný uzol v <strong>{displayName(ZODIAC_DISPLAY, astrology.northNode.name, language)}</strong> (životná evolúcia) + Enneagram integrácia smerom k typu <strong>{enneagram.integrationDirection}</strong> ({enneagramIntegration?.name || ''}) — to je tvoj smer rastu.</>
                  : <>North Node in <strong>{displayName(ZODIAC_DISPLAY, astrology.northNode.name, language)}</strong> (life evolution) + Enneagram integration towards type <strong>{enneagram.integrationDirection}</strong> ({enneagramIntegration?.name || ''}) — this is your direction of growth.</>}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[10px] text-slate-500 uppercase mb-1">{language === 'sk' ? 'Praktický tip' : 'Practical tip'}</p>
              <p className="text-xs text-slate-700">
                {language === 'sk'
                  ? 'Ostatné systémy (Ayurvéda, TCM, Kabala, Theta, Astrológia detaily) sú kontext a hĺbka — vráť sa k nim, keď budeš chcieť rozšíriť obraz. Najprv zvládni tieto tri body — tie ti dajú 80% praktického úžitku.'
                  : 'The other systems (Ayurveda, TCM, Kabbalah, Theta, Astrology details) provide context and depth — return to them when you want to expand the picture. First master these three points — they give you 80% of practical value.'}
              </p>
            </div>
          </div>
        </details>

        {/* Quick takeaway — 3 najdôležitejšie veci */}
        <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200">
          <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wide mb-3">{language === 'sk' ? 'Najdôležitejšie na prvý pohľad' : 'Most important at a glance'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-indigo-700">{numerology.lifePathNumber}</p>
              <p className="text-xs text-slate-700 font-medium">{lpInfo?.title || t('numerology.lifePath')}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t('summary.whoYouAre')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-indigo-700">{displayName(HD_TYPE_DISPLAY, humanDesign.type, language)}</p>
              <p className="text-xs text-slate-700 font-medium">{displayName(HD_STRATEGY_DISPLAY, humanDesign.strategy, language)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t('summary.howToFunction')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-indigo-700">{astrology.sunSign.symbol}</p>
              <p className="text-xs text-slate-700 font-medium">{displayName(ZODIAC_DISPLAY, astrology.sunSign.name, language)} / {displayName(ZODIAC_DISPLAY, astrology.moonSign.name, language)} / {displayName(ZODIAC_DISPLAY, astrology.ascendant.name, language)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t('astrology.sun')} / {t('astrology.moon')} / Asc</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            {language === 'sk'
              ? <><strong>{clientName}</strong> nesie životné číslo <strong>{numerology.lifePathNumber}</strong> z {numerology.lifePathFrom} ({lpInfo?.title || ''}). {lpInfo?.description || ''} Toto číslo definuje jadro osobnosti, hlavnú životnú lekciu a smer rastu.</>
              : <><strong>{clientName}</strong> carries life path number <strong>{numerology.lifePathNumber}</strong> from {numerology.lifePathFrom} ({lpInfo?.title || ''}). {lpInfo?.description || ''} This number defines the core of the personality, main life lesson and direction of growth.</>}
          </p>

          <p className="border-l-2 border-indigo-200 pl-3">
            <strong>{t('summary.gift')}:</strong> {lpInfo?.gift || '-'}.<br/>
            <strong>{t('summary.shadowLabel')}:</strong> {lpInfo?.shadow || '-'}.
          </p>

          {/* Enneagram archetyp */}
          {enneagramType && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">
                Enneagram — {language === 'sk' ? 'Typ' : 'Type'} {enneagram.coreType}: {enneagramType.name}
              </p>
              <p className="text-xs text-slate-700">
                {enneagramType.subtitle}.{' '}
                <strong>{language === 'sk' ? 'Motivácia' : 'Motivation'}:</strong> {enneagramType.motivation.toLowerCase()}.{' '}
                <strong>{language === 'sk' ? 'Strach' : 'Fear'}:</strong> {enneagramType.fear.toLowerCase()}.
                {enneagram.dominantWing && (
                  <> {language === 'sk' ? 'Dominantné krídlo' : 'Dominant wing'}: <strong>{enneagram.dominantWing}w</strong> ({getEnneagramType(enneagram.dominantWing, language)?.name}).</>
                )}
              </p>
              <p className="text-xs text-slate-700">
                <strong>{language === 'sk' ? 'Rast' : 'Growth'} (→{enneagram.integrationDirection}):</strong> {enneagramIntegration?.name} — {enneagramType.growthPath.split('.')[0]}.{' '}
                <strong>{language === 'sk' ? 'Stres' : 'Stress'} (→{enneagram.disintegrationDirection}):</strong> {enneagramDisintegration?.name}.
              </p>
            </div>
          )}

          {/* Ayurvéda + TCM */}
          {primaryDosha && primaryTCM && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-2">
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">
                {language === 'sk' ? 'Ayurvéda & TCM' : 'Ayurveda & TCM'}
              </p>
              <p className="text-xs text-slate-700">
                <strong>{language === 'sk' ? 'Dóša' : 'Dosha'}:</strong> {primaryDosha.name} ({primaryDosha.element}) — {primaryDosha.mind.toLowerCase()}.
                {doshaProfile.secondary && <> {language === 'sk' ? 'Sekundárna' : 'Secondary'}: {getDoshaInfo(doshaProfile.secondary, language)?.name}.</>}
                {' '}<strong>{language === 'sk' ? 'TCM element' : 'TCM element'}:</strong> {primaryTCM.name} ({language === 'sk' ? 'orgán' : 'organ'}: {primaryTCM.organ}, {language === 'sk' ? 'emócia' : 'emotion'}: {primaryTCM.emotion}, {language === 'sk' ? 'cnosť' : 'virtue'}: {primaryTCM.virtue}).
              </p>
            </div>
          )}

          {/* Pohľad na mriežku — len pre aktívnu metódu */}
          {showCharacter && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-2">
              <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">
                {language === 'sk' ? 'Charakterová mriežka (vrodené kvality)' : 'Characterological grid (innate qualities)'}
              </p>
              <p className="text-xs text-slate-700">
                {numerology.fullPlanes.length > 0 && (
                  <><strong>{language === 'sk' ? 'Plné roviny' : 'Full planes'}:</strong> {numerology.fullPlanes.join(', ')}. {language === 'sk' ? 'Tieto kvality má od narodenia.' : 'These qualities are innate.'} </>
                )}
                {numerology.emptyPlanes.length > 0 && (
                  <><strong>{language === 'sk' ? 'Prázdne roviny' : 'Empty planes'}:</strong> {numerology.emptyPlanes.join(', ')}. {language === 'sk' ? 'Tu sa učí.' : 'Learning areas.'} </>
                )}
                {numerology.isolatedNumbers.length > 0 && (
                  <><strong>{language === 'sk' ? 'Izolované' : 'Isolated'}:</strong> {numerology.isolatedNumbers.join(', ')} – {language === 'sk' ? 'energie odrezané od zvyšku, vyžadujú vedomú integráciu.' : 'energies cut off from the rest, requiring conscious integration.'} </>
                )}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                {language === 'sk' ? 'Zdroj: Robin Steinová – Numerológia: Čísla Lásky' : 'Source: Robin Steinová – Numerology: Numbers of Love'}
              </p>
            </div>
          )}

          {showDevelopmental && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-2">
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">
                {language === 'sk' ? 'Vývojová mriežka (životné úlohy)' : 'Developmental grid (life tasks)'}
              </p>
              <p className="text-xs text-slate-700">
                {devStrong.length > 0 && (
                  <>
                    <strong>{language === 'sk' ? 'Silné oblasti:' : 'Strong areas:'}</strong>{' '}
                    {devStrong.map(s => `${s.num} (${getCellMeaning(s.num, language)?.theme.split(' – ')[0]}, ${s.count}×)`).join('; ')}.{' '}
                  </>
                )}
                {devMissing.length > 0 && (
                  <>
                    <strong>{language === 'sk' ? 'Životné úlohy (chýbajúce):' : 'Life tasks (missing):'}</strong>{' '}
                    {devMissing.map(s => getCellMeaning(s.num, language)?.theme.split(' – ')[0]).filter(Boolean).join(', ')}.{' '}
                  </>
                )}
                {devNumerology.circled.length > 0 && (
                  <>
                    <strong>{language === 'sk' ? 'Karmické cykly:' : 'Karmic cycles:'}</strong> 1.={devNumerology.circled[0].value},{' '}
                    2.={devNumerology.circled[1].value},{' '}
                    3.={devNumerology.circled[2].value},{' '}
                    4.={devNumerology.circled[3].value}.{' '}
                  </>
                )}
                {devNumerology.oneCount > 0 && (
                  <>
                    <strong>{language === 'sk' ? 'Polarita ega:' : 'Ego polarity:'}</strong>{' '}
                    {devNumerology.egoPolarity === 'masculine'
                      ? (language === 'sk' ? '♂ mužské' : '♂ masculine')
                      : (language === 'sk' ? '♀ ženské' : '♀ feminine')}
                    {' '}({devNumerology.oneCount}× {language === 'sk' ? 'číslo' : 'number'} 1, {devNumerology.egoPolarity === 'masculine'
                      ? (language === 'sk' ? 'nepárny' : 'odd')
                      : (language === 'sk' ? 'párny' : 'even')} {language === 'sk' ? 'počet' : 'count'}){' '}
                    – {devNumerology.egoPolarity === 'masculine'
                        ? (language === 'sk' ? 'energia dávania, vymedzovania, akcie.' : 'energy of giving, setting boundaries, action.')
                        : (language === 'sk' ? 'energia prijímania, otvorenia, trpezlivosti.' : 'energy of receiving, openness, patience.')}{' '}
                  </>
                )}
                {devNumerology.isPost2000 && (
                  <em>{language === 'sk' ? 'Rok ≥ 2000 sa počíta špeciálne (20 + zvyšok).' : 'Year ≥ 2000 is calculated specially (20 + remainder).'}</em>
                )}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                {language === 'sk' ? 'Zdroj: kniha Lívia Mičková – Duchovná numerológia' : 'Source: book Lívia Mičková – Spiritual Numerology'}
              </p>
            </div>
          )}

          <p>
            {language === 'sk'
              ? <><strong>Astrológia</strong> dopĺňa tento obraz: Slnko v <strong>{displayName(ZODIAC_DISPLAY, astrology.sunSign.name, language)}</strong> ({displayName(ELEMENT_DISPLAY, astrology.sunSign.element, language)}) – {getPlanetSignDescription('Slnko', astrology.sunSign.name, language) || ''}{' '}Mesiac v <strong>{displayName(ZODIAC_DISPLAY, astrology.moonSign.name, language)}</strong> ({displayName(ELEMENT_DISPLAY, astrology.moonSign.element, language)}) odhaľuje emočný svet – {getPlanetSignDescription('Mesiac', astrology.moonSign.name, language) || ''}{' '}Ascendent v <strong>{displayName(ZODIAC_DISPLAY, astrology.ascendant.name, language)}</strong> určuje, ako ho vnímajú ostatní pri prvom kontakte. Dominantný živel je <strong>{displayName(ELEMENT_DISPLAY, astrology.dominantElement, language)}</strong>, čo {
                astrology.dominantElement === 'Oheň' ? 'prináša dynamiku, vášeň a akčnosť' :
                astrology.dominantElement === 'Zem' ? 'prináša praktickosť, spoľahlivosť a zmysel pre realitu' :
                astrology.dominantElement === 'Vzduch' ? 'prináša intelekt, komunikačný talent a slobodomyseľnosť' :
                'prináša emočnú hĺbku, intuíciu a empatiu'
              }.</>
              : <><strong>Astrology</strong> complements this picture: Sun in <strong>{displayName(ZODIAC_DISPLAY, astrology.sunSign.name, language)}</strong> ({displayName(ELEMENT_DISPLAY, astrology.sunSign.element, language)}) – {getPlanetSignDescription('Slnko', astrology.sunSign.name, language) || ''}{' '}Moon in <strong>{displayName(ZODIAC_DISPLAY, astrology.moonSign.name, language)}</strong> ({displayName(ELEMENT_DISPLAY, astrology.moonSign.element, language)}) reveals the emotional world – {getPlanetSignDescription('Mesiac', astrology.moonSign.name, language) || ''}{' '}Ascendant in <strong>{displayName(ZODIAC_DISPLAY, astrology.ascendant.name, language)}</strong> determines how others perceive them at first contact. The dominant element is <strong>{displayName(ELEMENT_DISPLAY, astrology.dominantElement, language)}</strong>, which {
                astrology.dominantElement === 'Oheň' ? 'brings dynamism, passion and drive' :
                astrology.dominantElement === 'Zem' ? 'brings practicality, reliability and sense of reality' :
                astrology.dominantElement === 'Vzduch' ? 'brings intellect, communication talent and free-thinking' :
                'brings emotional depth, intuition and empathy'
              }.</>}
          </p>

          <p>
            {language === 'sk'
              ? <>V <strong>Human Design</strong> je typ <strong>{displayName(HD_TYPE_DISPLAY, humanDesign.type, language)}</strong> s <strong>{displayName(HD_AUTHORITY_DISPLAY, humanDesign.authority, language)}</strong> autoritou.
                {humanDesign.type === 'Generátor' ? ' Ako Generátor má obrovskú životnú energiu, ale musí čakať na správne podnety – nie iniciovať z hlavy. Keď reaguje na to, čo ho naozaj "zapne", je neúnavný.' :
                 humanDesign.type === 'Manifestujúci Generátor' ? ' Kombinuje energiu Generátora s iniciatívou Manifestora – je rýchly, multi-talentovaný, ale musí reagovať AJ informovať okolie.' :
                 humanDesign.type === 'Manifestor' ? ' Ako Manifestor je tu aby začínal a inicioval. Musí informovať ostatných pred konaním, čím redukuje odpor okolia.' :
                 humanDesign.type === 'Projektor' ? ' Ako Projektor nemá konzistentnú vlastnú energiu, ale vidí systémy a ľudí hlboko. Musí čakať na pozvanie do veľkých životných rozhodnutí.' :
                 ' Ako Reflektor odráža prostredie okolo seba a musí čakať 28 dní pred veľkými rozhodnutiami.'}
                {' '}Stratégia: <strong>{displayName(HD_STRATEGY_DISPLAY, humanDesign.strategy, language)}</strong>. Profil <strong>{humanDesign.profile.line1}/{humanDesign.profile.line2}</strong> ({humanDesign.profile.name}) – {humanDesign.profile.description}</>
              : <>In <strong>Human Design</strong>, the type is <strong>{displayName(HD_TYPE_DISPLAY, humanDesign.type, language)}</strong> with <strong>{displayName(HD_AUTHORITY_DISPLAY, humanDesign.authority, language)}</strong> authority.
                {humanDesign.type === 'Generátor' ? ' As a Generator, they have enormous life energy, but must wait for the right stimuli – not initiate from the mind. When responding to what truly "lights them up", they are tireless.' :
                 humanDesign.type === 'Manifestujúci Generátor' ? ' Combines Generator energy with Manifestor initiative – fast, multi-talented, but must respond AND inform others.' :
                 humanDesign.type === 'Manifestor' ? ' As a Manifestor, they are here to start and initiate. They must inform others before acting, which reduces resistance.' :
                 humanDesign.type === 'Projektor' ? ' As a Projector, they lack consistent own energy, but see systems and people deeply. They must wait for invitation into major life decisions.' :
                 ' As a Reflector, they mirror their environment and must wait 28 days before major decisions.'}
                {' '}Strategy: <strong>{displayName(HD_STRATEGY_DISPLAY, humanDesign.strategy, language)}</strong>. Profile <strong>{humanDesign.profile.line1}/{humanDesign.profile.line2}</strong> ({humanDesign.profile.name}) – {humanDesign.profile.description}</>}
          </p>

          <p>
            <strong>{language === 'sk' ? 'Energetická mapa:' : 'Energy map:'}</strong>{' '}
            {language === 'sk'
              ? (humanDesign.definedCenters.length >= 6 ? 'Väčšina centier je definovaná – má konzistentnú a spoľahlivú energiu vo väčšine oblastí života.' :
                 humanDesign.definedCenters.length >= 4 ? 'Vyvážený počet definovaných a otvorených centier – kombinácia stability a flexibility.' :
                 'Väčšina centier je otvorená – je vysoko adaptabilný a citlivý na prostredie, ale musí rozlišovať čo je jeho a čo absorbuje od iných.')
              : (humanDesign.definedCenters.length >= 6 ? 'Most centers are defined – consistent and reliable energy in most areas of life.' :
                 humanDesign.definedCenters.length >= 4 ? 'Balanced number of defined and open centers – a combination of stability and flexibility.' :
                 'Most centers are open – highly adaptable and sensitive to the environment, but must discern what is theirs and what they absorb from others.')}
            {' '}{language === 'sk' ? 'Definované' : 'Defined'}: {humanDesign.definedCenters.map(c => displayName(HD_CENTER_DISPLAY, c, language)).join(', ')}.
            {language === 'sk' ? 'Otvorené (oblasti múdrosti)' : 'Open (areas of wisdom)'}: {humanDesign.openCenters.map(c => displayName(HD_CENTER_DISPLAY, c, language)).join(', ')}.
          </p>

          {(() => {
            const sunGate = humanDesign.personalityGates.find(g => g.planet === 'Slnko')?.gate;
            const earthGate = humanDesign.personalityGates.find(g => g.planet === 'Zem')?.gate;
            const topGeneKeys = [sunGate, earthGate].filter((g): g is number => g !== undefined).map(g => getGeneKeyByGate(g, language)).filter(Boolean);
            if (topGeneKeys.length === 0) return null;
            return (
              <div className="border-l-2 border-purple-200 pl-3 space-y-3">
                <p><strong>{language === 'sk' ? 'Génové kľúče – cesta transformácie:' : 'Gene Keys – path of transformation:'}</strong></p>
                {topGeneKeys.map((gk) => (
                  <div key={gk!.gate} className="space-y-1">
                    <p className="text-sm">
                      <strong>{language === 'sk' ? 'Brána' : 'Gate'} {gk!.gate}</strong>: <span className="text-red-600">{gk!.shadow}</span> ({language === 'sk' ? 'tieň' : 'shadow'}) →
                      <span className="text-amber-600"> {gk!.gift}</span> ({language === 'sk' ? 'dar' : 'gift'}) →
                      <span className="text-green-600"> {gk!.siddhi}</span> (siddhi)
                    </p>
                    <p className="text-xs text-slate-500">{gk!.shadowDescription}</p>
                    <p className="text-xs text-slate-500">{language === 'sk' ? 'Dar' : 'Gift'}: {gk!.giftDescription}</p>
                    <p className="text-xs text-slate-600">
                      <strong>NLP: {gk!.nlpTechnique}</strong> – {gk!.nlpDescription}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}

          <p>
            {numerology.fullPlanes.length > 0 && (language === 'sk'
              ? <><strong>Silné stránky</strong> (plné roviny): {numerology.fullPlanes.join(', ')}. Tieto schopnosti dostal do vienka a môže sa na ne spoliehať. </>
              : <><strong>Strengths</strong> (full planes): {numerology.fullPlanes.join(', ')}. These abilities are innate and can be relied upon. </>)}
            {numerology.emptyPlanes.length > 0 && (language === 'sk'
              ? <><strong>Oblasti rastu</strong> (prázdne roviny): {numerology.emptyPlanes.join(', ')}. Tu sa učí a rastie – nie je to slabosť, ale smer rozvoja. </>
              : <><strong>Growth areas</strong> (empty planes): {numerology.emptyPlanes.join(', ')}. This is where learning and growth happens – not a weakness, but a direction of development. </>)}
            {numerology.isolatedNumbers.length > 0 && (language === 'sk'
              ? <>Izolované čísla ({numerology.isolatedNumbers.join(', ')}) naznačujú energie, ktoré sú odrezané od zvyšku – vyžadujú vedomú pozornosť a integráciu.</>
              : <>Isolated numbers ({numerology.isolatedNumbers.join(', ')}) indicate energies that are cut off from the rest – they require conscious attention and integration.</>)}
          </p>

          {/* Jazyky lásky – bohatý blok */}
          {numerology.loveLanguages && numerology.loveLanguages.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 space-y-3">
              <p className="font-medium text-slate-800 flex items-center gap-2">
                <span className="text-rose-500">♡</span> {t('summary.loveLanguages')}
              </p>
              <p className="text-xs text-slate-600">
                {language === 'sk'
                  ? <>Numerologický rebríček toho, ako <strong>{clientName}</strong> najhlbšie prijíma a prejavuje lásku. Skóre vyplýva z numerologickej mriežky (napr. čím viac čísel z roviny 3-6-9 Empatia, tým silnejšie „Slová uistenia"; rovina 7-8-9 Energia podporuje „Fyzický dotyk").</>
                  : <>Numerological ranking of how <strong>{clientName}</strong> most deeply receives and expresses love. The score derives from the numerological grid (e.g. the more numbers from plane 3-6-9 Empathy, the stronger "Words of affirmation"; plane 7-8-9 Energy supports "Physical touch").</>}
              </p>

              {/* Primárny jazyk – detailne */}
              {numerology.loveLanguages[0] && (() => {
                const top = numerology.loveLanguages[0];
                const info = getLoveLanguageDescription(top.language, language);
                return (
                  <div className="p-3 rounded-lg bg-white border border-rose-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wide text-rose-700 font-semibold">
                        {language === 'sk' ? `Primárny jazyk – ${top.score} bodov` : `Primary language – ${top.score} points`}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 text-base">{displayName(LOVE_LANGUAGE_DISPLAY, top.language, language)}</p>
                    {info && (
                      <>
                        <p className="text-xs text-slate-700 mt-1.5">{info.description}</p>
                        <p className="text-xs text-slate-600 mt-1.5">
                          <strong className="text-slate-800">{language === 'sk' ? 'Príklady prejavu:' : 'Examples of expression:'}</strong> {info.examples}
                        </p>
                        <p className="text-xs text-rose-700 mt-1">
                          <strong>{language === 'sk' ? 'Ako lásku prejaviť tomuto človeku:' : 'How to show love to this person:'}</strong> {info.howToShow}
                        </p>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Sekundárny jazyk – stručne */}
              {numerology.loveLanguages[1] && (() => {
                const second = numerology.loveLanguages[1];
                const info = getLoveLanguageDescription(second.language, language);
                return (
                  <div className="p-3 rounded-lg bg-white border border-indigo-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wide text-indigo-700 font-semibold">
                        {language === 'sk' ? `Sekundárny jazyk – ${second.score} bodov` : `Secondary language – ${second.score} points`}
                      </span>
                    </div>
                    <p className="font-medium text-slate-800">{displayName(LOVE_LANGUAGE_DISPLAY, second.language, language)}</p>
                    {info && <p className="text-xs text-slate-600 mt-1">{info.description}</p>}
                  </div>
                );
              })()}

              {/* Rebríček ostatných */}
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                  {language === 'sk' ? 'Celý rebríček' : 'Full ranking'}
                </p>
                {numerology.loveLanguages.map((lang, idx) => {
                  const widthPct = Math.max(0, Math.min(100, (lang.score + 5) * 8));
                  return (
                    <div key={lang.language}>
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className={idx === 0 ? 'text-slate-800 font-medium' : 'text-slate-600'}>
                          {idx + 1}. {displayName(LOVE_LANGUAGE_DISPLAY, lang.language, language)}
                        </span>
                        <span className="text-slate-500">{lang.score}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            idx === 0
                              ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                              : 'bg-gradient-to-r from-indigo-400 to-violet-400'
                          }`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 italic">
                {language === 'sk'
                  ? 'Pozn.: Záporné skóre neznamená neschopnosť — len to, že tento jazyk vyžaduje vedomé úsilie. Vo vzťahu je dôležité poznať jazyk lásky partnera a vedome ho používať.'
                  : 'Note: A negative score does not mean inability — only that this language requires conscious effort. In a relationship, it is important to know your partner\'s love language and use it consciously.'}
              </p>
            </div>
          )}

          {/* Čínsky horoskop */}
          {(() => {
            const cz = calculateChineseZodiac(year, birthMonth, birthDay);
            const animalInfo = getChineseAnimalInfo(cz.animal, language);
            return (
              <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 space-y-2">
                <p className="text-xs text-red-700 font-semibold uppercase tracking-wide">
                  {language === 'sk' ? 'Čínsky horoskop' : 'Chinese horoscope'}
                </p>
                <p className="text-xs text-slate-700">
                  <strong>{displayName(CHINESE_ANIMAL_DISPLAY, cz.animal, language)}</strong> ({displayName(CHINESE_ELEMENT_DISPLAY, cz.element, language)}, {cz.polarity}).{' '}
                  {animalInfo?.traits}{' '}
                  {animalInfo && <><strong>{language === 'sk' ? 'Silné stránky:' : 'Strengths:'}</strong> {animalInfo.strengths}. <strong>{language === 'sk' ? 'Výzvy:' : 'Challenges:'}</strong> {animalInfo.challenges}.</>}
                </p>
              </div>
            );
          })()}

          {/* Čakry */}
          {(() => {
            const gridCounts = getGridCount(numerology.grid);
            const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement, language);
            if (!chakras) return null;
            const blocked = chakras.filter(c => c.status === 'blocked');
            const hyperactive = chakras.filter(c => c.status === 'hyperactive');
            if (blocked.length === 0 && hyperactive.length === 0) return null;
            return (
              <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4 space-y-2">
                <p className="text-xs text-purple-700 font-semibold uppercase tracking-wide">
                  {language === 'sk' ? 'Čakry — energetický stav' : 'Chakras — energy state'}
                </p>
                <p className="text-xs text-slate-700">
                  {blocked.length > 0 && (
                    <><strong>{language === 'sk' ? 'Blokované:' : 'Blocked:'}</strong> {blocked.map(c => `${displayName(CHAKRA_NAME_DISPLAY, c.chakra.name, language)} (${c.score})`).join(', ')} — {language === 'sk' ? 'oblasti kde energia neprúdi voľne, vyžadujú vedomú pozornosť.' : 'areas where energy does not flow freely, requiring conscious attention.'} </>
                  )}
                  {hyperactive.length > 0 && (
                    <><strong>{language === 'sk' ? 'Hyperaktívne:' : 'Hyperactive:'}</strong> {hyperactive.map(c => `${displayName(CHAKRA_NAME_DISPLAY, c.chakra.name, language)} (${c.score})`).join(', ')} — {language === 'sk' ? 'nadbytok energie, potrebné vyváženie.' : 'excess energy, balancing needed.'} </>
                  )}
                </p>
              </div>
            );
          })()}

          <p>
            {language === 'sk'
              ? <><strong>Aktuálne obdobie:</strong> Nachádza sa v osobnom roku <strong>{numerology.orv}</strong> ({getOrvDescription(numerology.orv, language)?.title || ''}). {getOrvDescription(numerology.orv, language)?.description || ''}{' '}Vek duchovnej dospelosti (VDD) nastáva v <strong>{numerology.vdd}</strong> rokoch – zlomové obdobie, kedy sa menia priority a životné hodnoty.</>
              : <><strong>Current period:</strong> Currently in personal year <strong>{numerology.orv}</strong> ({getOrvDescription(numerology.orv, language)?.title || ''}). {getOrvDescription(numerology.orv, language)?.description || ''}{' '}Age of spiritual maturity (VDD) occurs at <strong>{numerology.vdd}</strong> years – a turning point when priorities and life values change.</>}
          </p>

          <p>
            {language === 'sk'
              ? <><strong>Duchovná rovina</strong> (Kabala): Primárna sefira <strong>{kabalah.primarySefira.name}</strong> ({kabalah.primarySefira.meaning}). {kabalah.primarySefira.gift}. Tieňová stránka: {kabalah.primarySefira.shadow}. Denný čin: {kabalah.malchutAction}</>
              : <><strong>Spiritual plane</strong> (Kabbalah): Primary sephira <strong>{kabalah.primarySefira.name}</strong> ({kabalah.primarySefira.meaning}). {kabalah.primarySefira.gift}. Shadow side: {kabalah.primarySefira.shadow}. Daily action: {kabalah.malchutAction}</>}
          </p>

          <p>
            {language === 'sk'
              ? <><strong>Podvedomé vzorce</strong> (Theta Healing): Na najhlbšej úrovni môže niesť presvedčenie <em>"{theta.primaryBeliefs[0]?.belief}"</em> (pôvod: {theta.primaryBeliefs[0]?.origin}). Toto presvedčenie sa drží v oblasti: {theta.primaryBeliefs[0]?.bodyArea}. Emócia: {theta.primaryBeliefs[0]?.emotion}. Cesta k transformácii vedie cez uvedomenie a nahradenie novým presvedčením.</>
              : <><strong>Subconscious patterns</strong> (Theta Healing): At the deepest level, they may carry the belief <em>"{theta.primaryBeliefs[0]?.belief}"</em> (origin: {theta.primaryBeliefs[0]?.origin}). This belief is held in the area: {theta.primaryBeliefs[0]?.bodyArea}. Emotion: {theta.primaryBeliefs[0]?.emotion}. The path to transformation leads through awareness and replacement with a new belief.</>}
          </p>

          {/* Ako to všetko súvisí — koherentný cross-system príbeh */}
          <div className="border-t border-violet-200 pt-4 mt-4">
            <p className="text-xs text-violet-700 font-semibold uppercase tracking-wide mb-3">{language === 'sk' ? 'Ako to všetko súvisí — jeden príbeh z rôznych uhlov' : 'How it all connects — one story from different angles'}</p>
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>
                {language === 'sk'
                  ? 'Všetky systémy hovoria o tom istom človeku — len každý iným jazykom. Tu je to prepojené:'
                  : 'All systems speak about the same person — each in a different language. Here is how they connect:'}
              </p>

              <p>
                {language === 'sk'
                  ? <><strong>Tvoja hlavná téma</strong> je {enneagramType ? enneagramType.motivation.toLowerCase() : lpInfo?.title?.toLowerCase() || 'rast'}. Numerológia to vyjadruje cez životné číslo <strong>{numerology.lifePathNumber}</strong> ({lpInfo?.title || ''}). Enneagram to vidí ako typ <strong>{enneagram.coreType}</strong> ({enneagramType?.name}) — rovnaká energia, len pomenovaná cez motiváciu a strach. Kabala na to poukazuje cez sefiru <strong>{kabalah.primarySefira.name}</strong> ({kabalah.primarySefira.meaning}) — tá istá téma, ale v duchovnom jazyku.</>
                  : <><strong>Your main theme</strong> is {enneagramType ? enneagramType.motivation.toLowerCase() : lpInfo?.title?.toLowerCase() || 'growth'}. Numerology expresses this through life path number <strong>{numerology.lifePathNumber}</strong> ({lpInfo?.title || ''}). Enneagram sees it as type <strong>{enneagram.coreType}</strong> ({enneagramType?.name}) — the same energy, just named through motivation and fear. Kabbalah points to it through sephira <strong>{kabalah.primarySefira.name}</strong> ({kabalah.primarySefira.meaning}) — the same theme, but in spiritual language.</>}
              </p>

              <p>
                {language === 'sk'
                  ? <><strong>Ako to prejavuješ vo svete:</strong>{' '}Astrológia ukazuje, že tvoje vedomé ja ({displayName(ZODIAC_DISPLAY, astrology.sunSign.name, language)}, element {displayName(ELEMENT_DISPLAY, astrology.sunSign.element, language).toLowerCase()})
                    {astrology.sunSign.element === 'Oheň' ? ' ti dáva akčnosť a vášeň' :
                     astrology.sunSign.element === 'Zem' ? ' ti dáva praktickosť a vytrvalosť' :
                     astrology.sunSign.element === 'Vzduch' ? ' ti dáva komunikačný talent a analytické myslenie' :
                     ' ti dáva emočnú hĺbku a intuíciu'} — a Human Design dopĺňa <em>ako</em> túto energiu správne používať: si <strong>{displayName(HD_TYPE_DISPLAY, humanDesign.type, language)}</strong>, čiže tvoja stratégia je „{displayName(HD_STRATEGY_DISPLAY, humanDesign.strategy, language).toLowerCase()}".
                    {humanDesign.type === 'Generátor' || humanDesign.type === 'Manifestujúci Generátor'
                      ? ' Máš obrovskú energiu, ale musíš čakať na správny podnet — nie iniciovať z hlavy.'
                      : humanDesign.type === 'Projektor'
                      ? ' Nemáš nekonečnú energiu, ale máš dar vidieť do hĺbky — tvoja sila je múdrosť, nie výkon.'
                      : humanDesign.type === 'Manifestor'
                      ? ' Si tu aby si inicioval — ale vždy informuj okolie, inak narazíš na odpor.'
                      : ' Odrážaš prostredie okolo seba — tvoja sila je v trpezlivosti a rozlišovaní.'}</>
                  : <><strong>How you express this in the world:</strong>{' '}Astrology shows that your conscious self ({displayName(ZODIAC_DISPLAY, astrology.sunSign.name, language)}, element {displayName(ELEMENT_DISPLAY, astrology.sunSign.element, language).toLowerCase()})
                    {astrology.sunSign.element === 'Oheň' ? ' gives you drive and passion' :
                     astrology.sunSign.element === 'Zem' ? ' gives you practicality and persistence' :
                     astrology.sunSign.element === 'Vzduch' ? ' gives you communication talent and analytical thinking' :
                     ' gives you emotional depth and intuition'} — and Human Design adds <em>how</em> to use this energy correctly: you are a <strong>{displayName(HD_TYPE_DISPLAY, humanDesign.type, language)}</strong>, so your strategy is "{displayName(HD_STRATEGY_DISPLAY, humanDesign.strategy, language).toLowerCase()}".
                    {humanDesign.type === 'Generátor' || humanDesign.type === 'Manifestujúci Generátor'
                      ? ' You have enormous energy, but must wait for the right stimulus — not initiate from the mind.'
                      : humanDesign.type === 'Projektor'
                      ? ' You don\'t have unlimited energy, but you have the gift of seeing deeply — your strength is wisdom, not output.'
                      : humanDesign.type === 'Manifestor'
                      ? ' You are here to initiate — but always inform others, otherwise you\'ll meet resistance.'
                      : ' You mirror your environment — your strength is patience and discernment.'}</>}
              </p>

              <p>
                {language === 'sk'
                  ? <><strong>Kde rastieš a kde sa bráníš:</strong>{' '}Enneagram ukazuje, že keď si v pohode, preberáš vlastnosti typu {enneagram.integrationDirection} ({enneagramIntegration?.name}) — to je tvoj smer zdravia. Pod stresom skĺzneš k typu {enneagram.disintegrationDirection} ({enneagramDisintegration?.name}).
                    {theta.primaryBeliefs[0] && (
                      <> Theta Healing dopĺňa, že na podvedomej úrovni ti môže brániť presvedčenie <em>„{theta.primaryBeliefs[0].belief}"</em> — to je koreň, nie symptóm.</>
                    )}</>
                  : <><strong>Where you grow and where you resist:</strong>{' '}Enneagram shows that when you are at ease, you take on qualities of type {enneagram.integrationDirection} ({enneagramIntegration?.name}) — this is your direction of health. Under stress you slide towards type {enneagram.disintegrationDirection} ({enneagramDisintegration?.name}).
                    {theta.primaryBeliefs[0] && (
                      <> Theta Healing adds that at a subconscious level, the belief <em>"{theta.primaryBeliefs[0].belief}"</em> may be blocking you — this is the root, not the symptom.</>
                    )}</>}
              </p>

              <p>
                <strong>{language === 'sk' ? 'Červená niť:' : 'Red thread:'}</strong>{' '}
                {language === 'sk'
                  ? (astrology.dominantElement === 'Oheň' && enneagram.coreType <= 3
                    ? 'Ohnivý element + nízky enneagram typ = silná akčná energia s túžbou po výsledkoch. Lekcia: spomaľ a počúvaj (HD autorita).'
                    : astrology.dominantElement === 'Voda' && (enneagram.coreType === 4 || enneagram.coreType === 2)
                    ? 'Vodný element + citovo orientovaný enneagram = hlboká empatia, ale riziko strácanin sa v emóciách iných. Lekcia: hranice.'
                    : astrology.dominantElement === 'Vzduch' && (enneagram.coreType === 5 || enneagram.coreType === 7)
                    ? 'Vzdušný element + mentálny enneagram = brilantný intelekt, ale riziko odpojenia od tela. Lekcia: grounding.'
                    : astrology.dominantElement === 'Zem' && (enneagram.coreType === 6 || enneagram.coreType === 9)
                    ? 'Zemský element + stabilizujúci enneagram = spoľahlivosť, ale riziko stagnácie. Lekcia: odvaha riskovať.'
                    : `Element ${displayName(ELEMENT_DISPLAY, astrology.dominantElement, language).toLowerCase()} + enneagram ${enneagram.coreType} + HD ${displayName(HD_TYPE_DISPLAY, humanDesign.type, language)} = unikátna kombinácia. Tvoja lekcia je nájsť rovnováhu medzi tým, čo ťa poháňa (motivácia) a tým, čo ťa brzdí (strach).`)
                  : (astrology.dominantElement === 'Oheň' && enneagram.coreType <= 3
                    ? 'Fire element + low enneagram type = strong action energy with desire for results. Lesson: slow down and listen (HD authority).'
                    : astrology.dominantElement === 'Voda' && (enneagram.coreType === 4 || enneagram.coreType === 2)
                    ? 'Water element + emotionally oriented enneagram = deep empathy, but risk of losing yourself in others\' emotions. Lesson: boundaries.'
                    : astrology.dominantElement === 'Vzduch' && (enneagram.coreType === 5 || enneagram.coreType === 7)
                    ? 'Air element + mental enneagram = brilliant intellect, but risk of disconnecting from the body. Lesson: grounding.'
                    : astrology.dominantElement === 'Zem' && (enneagram.coreType === 6 || enneagram.coreType === 9)
                    ? 'Earth element + stabilizing enneagram = reliability, but risk of stagnation. Lesson: courage to take risks.'
                    : `Element ${displayName(ELEMENT_DISPLAY, astrology.dominantElement, language).toLowerCase()} + enneagram ${enneagram.coreType} + HD ${displayName(HD_TYPE_DISPLAY, humanDesign.type, language)} = unique combination. Your lesson is to find balance between what drives you (motivation) and what holds you back (fear).`)}
                {' '}{language === 'sk' ? 'Všetky systémy ukazujú tú istú cestu — len rôznymi slovami.' : 'All systems point to the same path — just in different words.'}
              </p>
            </div>
          </div>

          {/* Praktický záver — čo s tým */}
          <div className="border-t border-indigo-200 pt-4 mt-4">
            <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wide mb-3">{language === 'sk' ? 'Prakticky — čo s tým robiť' : 'Practically — what to do with this'}</p>
            <div className="space-y-2 text-xs text-slate-700">
              <p>
                {language === 'sk'
                  ? <><strong>1. Rozhodovanie:</strong> Používaj svoju HD autoritu (<strong>{displayName(HD_AUTHORITY_DISPLAY, humanDesign.authority, language)}</strong>) —
                    {humanDesign.authority === 'Emocionálna' ? ' nikdy sa nerozhoduj v emočnom výkyve, čakaj na jasnosť.' :
                     humanDesign.authority === 'Sakrálna' ? ' počúvaj reakciu z brucha (uh-huh / unh-unh).' :
                     humanDesign.authority === 'Slezinová' ? ' dôveruj prvému impulzu, ak ho ignoruješ, stratíš ho.' :
                     ' dôveruj svojmu vnútornému kompasu.'}</>
                  : <><strong>1. Decision-making:</strong> Use your HD authority (<strong>{displayName(HD_AUTHORITY_DISPLAY, humanDesign.authority, language)}</strong>) —
                    {humanDesign.authority === 'Emocionálna' ? ' never decide during an emotional wave, wait for clarity.' :
                     humanDesign.authority === 'Sakrálna' ? ' listen to the gut response (uh-huh / unh-unh).' :
                     humanDesign.authority === 'Slezinová' ? ' trust the first impulse, if you ignore it, you lose it.' :
                     ' trust your inner compass.'}</>}
              </p>
              <p>
                {language === 'sk'
                  ? <><strong>2. Energia:</strong> Ako {displayName(HD_TYPE_DISPLAY, humanDesign.type, language)} je tvoja stratégia „{displayName(HD_STRATEGY_DISPLAY, humanDesign.strategy, language).toLowerCase()}". Keď cítiš {displayName(HD_NOT_SELF_THEME_DISPLAY, humanDesign.notSelfTheme, language).toLowerCase()} — je to signál, že niečo nie je pre teba.</>
                  : <><strong>2. Energy:</strong> As a {displayName(HD_TYPE_DISPLAY, humanDesign.type, language)} your strategy is "{displayName(HD_STRATEGY_DISPLAY, humanDesign.strategy, language).toLowerCase()}". When you feel {displayName(HD_NOT_SELF_THEME_DISPLAY, humanDesign.notSelfTheme, language).toLowerCase()} — it is a signal that something is not for you.</>}
              </p>
              <p>
                {language === 'sk'
                  ? <><strong>3. Rast:</strong> Tvoj dar je {lpInfo?.gift?.toLowerCase() || 'v tvojom životnom čísle'}. Tvoja výzva je {lpInfo?.shadow?.toLowerCase() || 'v tieni tvojho čísla'}. Vedomá práca s tieňom je cesta k daru.</>
                  : <><strong>3. Growth:</strong> Your gift is {lpInfo?.gift?.toLowerCase() || 'in your life path number'}. Your challenge is {lpInfo?.shadow?.toLowerCase() || 'in the shadow of your number'}. Conscious work with the shadow is the path to the gift.</>}
              </p>
              <p>
                <strong>{language === 'sk' ? '4. Dnes:' : '4. Today:'}</strong> {kabalah.malchutAction}
              </p>
            </div>
          </div>

          {/* Tvoja cesta transformácie — arc */}
          <div className="border-t border-violet-200 pt-4 mt-4">
            <p className="text-xs text-violet-700 font-semibold uppercase tracking-wide mb-3">{language === 'sk' ? 'Tvoja cesta transformácie' : 'Your path of transformation'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <p className="text-rose-700 font-semibold mb-1">{language === 'sk' ? 'Odkiaľ ideš' : 'Where you come from'}</p>
                <p>{language === 'sk' ? 'Enneagram stres' : 'Enneagram stress'} → {language === 'sk' ? 'typ' : 'type'} {enneagram.disintegrationDirection} ({enneagramDisintegration?.name})</p>
                {theta.primaryBeliefs[0] && <p className="mt-1 italic">"{theta.primaryBeliefs[0].belief}"</p>}
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <p className="text-indigo-700 font-semibold mb-1">{language === 'sk' ? 'Kde si teraz' : 'Where you are now'}</p>
                <p>{language === 'sk' ? 'ŽČ' : 'LP'} {numerology.lifePathNumber} ({lpInfo?.title}), ORV {numerology.orv}</p>
                <p className="mt-1">HD: {displayName(HD_TYPE_DISPLAY, humanDesign.type, language)}, {language === 'sk' ? 'stratégia' : 'strategy'} "{displayName(HD_STRATEGY_DISPLAY, humanDesign.strategy, language).toLowerCase()}"</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-emerald-700 font-semibold mb-1">{language === 'sk' ? 'Kam smeruješ' : 'Where you are heading'}</p>
                <p>{language === 'sk' ? 'Enneagram rast' : 'Enneagram growth'} → {language === 'sk' ? 'typ' : 'type'} {enneagram.integrationDirection} ({enneagramIntegration?.name})</p>
                <p className="mt-1">{language === 'sk' ? 'Sev. uzol' : 'N. Node'}: {displayName(ZODIAC_DISPLAY, astrology.northNode.name, language)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vibrácie + Karmické dlhy + Kua */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {getOmvDescription(numerology.omv, language) && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-[10px] text-purple-400 uppercase mb-1">☽ OMV {numerology.omv}</p>
              <p className="text-xs font-medium text-purple-300">{getOmvDescription(numerology.omv, language).title}</p>
              <p className="text-[10px] text-slate-500 mt-1">{getOmvDescription(numerology.omv, language).theme}</p>
            </div>
          )}
          {getOdvDescription(numerology.odv, language) && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] text-amber-400 uppercase mb-1">☀ ODV {numerology.odv}</p>
              <p className="text-xs font-medium text-amber-300">{getOdvDescription(numerology.odv, language).title}</p>
              <p className="text-[10px] text-slate-500 mt-1">{getOdvDescription(numerology.odv, language).theme}</p>
            </div>
          )}
          {(() => {
            const kua = calculateKua(year, gender, language);
            return (
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-[10px] text-orange-400 uppercase mb-1">🧭 Kua {kua.kuaNumber}</p>
                <p className="text-xs font-medium text-orange-300">{kua.group === 'east' ? (language === 'sk' ? 'Východná' : 'Eastern') : (language === 'sk' ? 'Západná' : 'Western')} {language === 'sk' ? 'skupina' : 'group'}</p>
                <p className="text-[10px] text-slate-500 mt-1">{language === 'sk' ? 'Spálňa' : 'Bedroom'}: {kua.bestForSleep} | {language === 'sk' ? 'Práca' : 'Work'}: {kua.bestForWork}</p>
              </div>
            );
          })()}
        </div>

        {numerology.karmicDebts.length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-[10px] text-red-400 uppercase mb-1">{language === 'sk' ? 'Karmické dlhy' : 'Karmic debts'}</p>
            <p className="text-xs font-medium text-red-600">
              {numerology.karmicDebts.map(d => `${d.number} — ${d.theme}`).join(' | ')}
            </p>
          </div>
        )}

        {/* Archetyp + Biorytmus + Kryštál */}
        {(() => {
          const archetype = deriveArchetype(numerology.lifePathNumber, enneagram.coreType, humanDesign.type, language);
          const biorhythm = calculateBiorhythm(day, month, year);
          const dailyCrystal = getDailyCrystal(numerology.odv, language);
          const zodiacCrystals = getZodiacCrystals(astrology.sunSign.name, language);
          return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-[10px] text-indigo-400 uppercase mb-1">🎭 {language === 'sk' ? 'Archetyp' : 'Archetype'}</p>
                <p className="text-sm font-medium text-indigo-300">{archetype.primary.name}</p>
                <p className="text-[10px] text-slate-400 italic">„{archetype.primary.motto}"</p>
                <p className="text-[10px] text-slate-500 mt-1">{language === 'sk' ? 'Tieň' : 'Shadow'}: {archetype.shadow.name}</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-[10px] text-cyan-400 uppercase mb-1">〰️ {language === 'sk' ? 'Biorytmus dnes' : 'Biorhythm today'}</p>
                <p className="text-[10px] text-slate-400">{language === 'sk' ? 'Fyzický' : 'Physical'}: <strong className={biorhythm.physical > 0 ? 'text-emerald-400' : 'text-rose-400'}>{biorhythm.physical > 0 ? '+' : ''}{biorhythm.physical}%</strong></p>
                <p className="text-[10px] text-slate-400">{language === 'sk' ? 'Emocionálny' : 'Emotional'}: <strong className={biorhythm.emotional > 0 ? 'text-emerald-400' : 'text-rose-400'}>{biorhythm.emotional > 0 ? '+' : ''}{biorhythm.emotional}%</strong></p>
                <p className="text-[10px] text-slate-400">{language === 'sk' ? 'Intelektuálny' : 'Intellectual'}: <strong className={biorhythm.intellectual > 0 ? 'text-emerald-400' : 'text-rose-400'}>{biorhythm.intellectual > 0 ? '+' : ''}{biorhythm.intellectual}%</strong></p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-[10px] text-purple-400 uppercase mb-1">💎 {language === 'sk' ? 'Kryštál dňa' : 'Crystal of the day'}</p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: dailyCrystal.color }} />
                  <p className="text-sm font-medium text-purple-300">{dailyCrystal.name}</p>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{dailyCrystal.properties}</p>
                {zodiacCrystals.length > 0 && (
                  <p className="text-[10px] text-slate-500 mt-1">{language === 'sk' ? 'Znamenie' : 'Zodiac'}: {zodiacCrystals.map(c => c.name).join(', ')}</p>
                )}
              </div>
            </div>
          );
        })()}
      </GlassCard>
    </motion.section>
  );
}
