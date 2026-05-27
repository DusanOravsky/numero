import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubject } from '../hooks/useSubject';
import { GlassCard } from '../components/GlassCard';
import { EnergyCard } from '../components/EnergyCard';
import { DateInput } from '../components/DateInput';
import { calculateAstrology, calculateNatalAspects, calculateTransitAspects } from '../engine/astrologyEngine';
import type { AstrologyResult, SynastryAspect, TransitAspect } from '../engine/astrologyEngine';
import { motion } from 'framer-motion';
import { getPlanetSignDescription } from '../data/planetSignDescriptions';
import { LunarTimeline } from '../components/LunarTimeline';
import { NatalWheel } from '../components/NatalWheel';
import { UpcomingEclipses } from '../components/UpcomingEclipses';
import { ProgressionsView } from '../components/ProgressionsView';
import { SolarReturnView } from '../components/SolarReturnView';
import { calculateChineseZodiac } from '../engine/chineseZodiacEngine';
import { getChineseAnimalInfo, getChineseElementInfo } from '../data/chineseZodiac';
import { useTranslation } from '../i18n/useTranslation';
import type { Language } from '../store/useStore';
import { displayName, ZODIAC_DISPLAY, PLANET_DISPLAY, ELEMENT_DISPLAY, QUALITY_DISPLAY, MOON_PHASE_DISPLAY, CHINESE_ANIMAL_DISPLAY, CHINESE_ELEMENT_DISPLAY, HOUSE_THEME_DISPLAY, CHINESE_ANIMAL_GENITIVE } from '../i18n/entityNames';

function getSunSignDescription(sign: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Baran': 'Vaše vedomé ja je odvážne, priame a iniciatívne. Ste prirodzený líder, ktorý rád začína nové veci a ide vlastnou cestou.',
    'Býk': 'Vaše vedomé ja je stabilné, zmyslové a trpezlivé. Ceníte si krásu, pohodlie a bezpečie. Ste spoľahliví a vytrvalí.',
    'Blíženci': 'Vaše vedomé ja je zvedavé, komunikatívne a adaptabilné. Potrebujete intelektuálnu stimuláciu a rozmanitosť.',
    'Rak': 'Vaše vedomé ja je citlivé, starostlivé a ochranárske. Domov a rodina sú pre vás kľúčové. Máte silnú intuíciu.',
    'Lev': 'Vaše vedomé ja je kreatívne, veľkorysé a dramatické. Potrebujete uznanie a sebavyjadrenie. Ste prirodzene charizmatickí.',
    'Panna': 'Vaše vedomé ja je analytické, praktické a orientované na detaily. Služba iným a zdokonaľovanie sú vaše silné stránky.',
    'Váhy': 'Vaše vedomé ja je harmonické, diplomatické a estetické. Hľadáte rovnováhu a partnerstvo. Máte zmysel pre spravodlivosť.',
    'Škorpión': 'Vaše vedomé ja je intenzívne, hlboké a transformačné. Vidíte pod povrch vecí a nebojíte sa tieňov.',
    'Strelec': 'Vaše vedomé ja je optimistické, filozofické a dobrodružné. Hľadáte zmysel, pravdu a nové horizonty.',
    'Kozorožec': 'Vaše vedomé ja je ambiciózne, disciplinované a zodpovedné. Budujete trvalé štruktúry a máte dlhodobú víziu.',
    'Vodnár': 'Vaše vedomé ja je inovatívne, nezávislé a humanitárne. Myslíte na budúcnosť a kolektív. Ste originálni.',
    'Ryby': 'Vaše vedomé ja je intuitívne, empatické a duchovné. Máte hlboké spojenie s neviditeľným svetom a silnú imagináciu.',
  };
  const en: Record<string, string> = {
    'Baran': 'Your conscious self is bold, direct, and initiative-driven. You are a natural leader who loves starting new things and forging your own path.',
    'Býk': 'Your conscious self is stable, sensual, and patient. You value beauty, comfort, and security. You are reliable and persistent.',
    'Blíženci': 'Your conscious self is curious, communicative, and adaptable. You need intellectual stimulation and variety.',
    'Rak': 'Your conscious self is sensitive, nurturing, and protective. Home and family are central to your identity. You have strong intuition.',
    'Lev': 'Your conscious self is creative, generous, and dramatic. You need recognition and self-expression. You are naturally charismatic.',
    'Panna': 'Your conscious self is analytical, practical, and detail-oriented. Service to others and refinement are your strengths.',
    'Váhy': 'Your conscious self is harmonious, diplomatic, and aesthetic. You seek balance and partnership. You have a strong sense of justice.',
    'Škorpión': 'Your conscious self is intense, deep, and transformative. You see beneath the surface and are unafraid of shadows.',
    'Strelec': 'Your conscious self is optimistic, philosophical, and adventurous. You seek meaning, truth, and new horizons.',
    'Kozorožec': 'Your conscious self is ambitious, disciplined, and responsible. You build lasting structures and hold a long-term vision.',
    'Vodnár': 'Your conscious self is innovative, independent, and humanitarian. You think about the future and the collective. You are original.',
    'Ryby': 'Your conscious self is intuitive, empathic, and spiritual. You have a deep connection to the unseen world and a vivid imagination.',
  };
  const fallback = lang === 'en' ? 'A unique solar energy shapes your conscious identity.' : 'Jedinečná slnečná energia formuje vaše vedomé ja.';
  return (lang === 'en' ? en : sk)[sign] ?? fallback;
}

function getMoonSignDescription(sign: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Baran': 'Emocionálne reagujete rýchlo a impulzívne. Potrebujete akciu a vzrušenie na emocionálnej úrovni.',
    'Býk': 'Emocionálne potrebujete stabilitu a zmyslové potešenie. Vaše pocity sú hlboké a vytrvalé.',
    'Blíženci': 'Emocionálne potrebujete komunikáciu a intelektuálnu výmenu. Spracúvate pocity cez rozhovor.',
    'Rak': 'Emocionálne ste veľmi citliví a starostliví. Potrebujete bezpečie domova a blízkych vzťahov.',
    'Lev': 'Emocionálne potrebujete uznanie a teplé vyjadrenia lásky. Vaše pocity sú veľkolepé a dramatické.',
    'Panna': 'Emocionálne spracúvate pocity cez analýzu a praktické riešenia. Potrebujete poriadok pre vnútorný pokoj.',
    'Váhy': 'Emocionálne potrebujete harmóniu a partnerstvo. Konflikty vás hlboko rozrušujú.',
    'Škorpión': 'Emocionálne prežívate intenzívne a hlboko. Potrebujete dôveru a intimitu. Ťažko odpúšťate.',
    'Strelec': 'Emocionálne potrebujete slobodu a optimizmus. Vieru v lepší zajtrajšok a zmysel.',
    'Kozorožec': 'Emocionálne ste zdržanliví, ale loajálni. Potrebujete pocit kontroly a úspechu.',
    'Vodnár': 'Emocionálne si držíte odstup a potrebujete slobodu. Pocity spracúvate intelektuálne.',
    'Ryby': 'Emocionálne ste veľmi vnímaví a absorbujete emócie okolia. Potrebujete duchovné zakotvenie.',
  };
  const en: Record<string, string> = {
    'Baran': 'You react emotionally with speed and impulse. You need action and excitement on an emotional level.',
    'Býk': 'You need emotional stability and sensory pleasure. Your feelings run deep and steady.',
    'Blíženci': 'You need communication and intellectual exchange to process emotions. You work through feelings by talking.',
    'Rak': 'You are emotionally very sensitive and caring. You need the safety of home and close relationships.',
    'Lev': 'You need recognition and warm expressions of love. Your feelings are grand and dramatic.',
    'Panna': 'You process emotions through analysis and practical solutions. You need order for inner peace.',
    'Váhy': 'You need emotional harmony and partnership. Conflict disturbs you deeply.',
    'Škorpión': 'You experience emotions intensely and deeply. You need trust and intimacy. Forgiveness comes hard.',
    'Strelec': 'You need emotional freedom and optimism. Faith in a better tomorrow and sense of meaning.',
    'Kozorožec': 'You are emotionally reserved but loyal. You need a sense of control and achievement.',
    'Vodnár': 'You keep emotional distance and need freedom. You process feelings intellectually.',
    'Ryby': 'You are highly receptive and absorb the emotions around you. You need spiritual grounding.',
  };
  const fallback = lang === 'en' ? 'Your lunar energy shapes your inner emotional world.' : 'Vaša mesačná energia formuje vnútorný emocionálny svet.';
  return (lang === 'en' ? en : sk)[sign] ?? fallback;
}

function getAscendantDescription(sign: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Baran': 'Pôsobíte energicky, priamo a odvážne. Prvý dojem, ktorý robíte, je dynamický a sebavedomý.',
    'Býk': 'Pôsobíte pokojne, spoľahlivo a príjemne. Vyžarujete stabilitu a zmysel pre krásu.',
    'Blíženci': 'Pôsobíte živý, zvedavo a komunikatívne. Ľudia vás vnímajú ako spoločenského a vtipného.',
    'Rak': 'Pôsobíte mäkko, starostlivo a prístupne. Ľudia sa pri vás cítia v bezpečí.',
    'Lev': 'Pôsobíte charizmaticky, hrdro a kreatívne. Priťahujete pozornosť prirodzene.',
    'Panna': 'Pôsobíte upraveně, skromne a inteligentne. Ľudia vás vnímajú ako spoľahlivého a detailného.',
    'Váhy': 'Pôsobíte elegantne, prívetivo a harmonicky. Máte prirodzený šarm a diplomatické vystupovanie.',
    'Škorpión': 'Pôsobíte magneticky, intenzívne a tajomne. Váš pohľad je prenikavý a charizmatický.',
    'Strelec': 'Pôsobíte optimisticky, otvorene a dobrodružne. Ste spoločenskí a inšpirujúci.',
    'Kozorožec': 'Pôsobíte seriózne, zodpovedne a profesionálne. Vyžarujete autoritu a kompetenciu.',
    'Vodnár': 'Pôsobíte originálne, nezávisle a progresívne. Ste vnímaní ako unikátni a niekedy excentrickí.',
    'Ryby': 'Pôsobíte snovito, jemne a mysticky. Máte éterickú kvalitu a ľudia vás vnímajú ako duchovného.',
  };
  const en: Record<string, string> = {
    'Baran': 'You come across as energetic, direct, and bold. Your first impression is dynamic and confident.',
    'Býk': 'You come across as calm, reliable, and pleasant. You radiate stability and an eye for beauty.',
    'Blíženci': 'You come across as lively, curious, and communicative. People see you as sociable and witty.',
    'Rak': 'You come across as soft, caring, and approachable. People feel safe around you.',
    'Lev': 'You come across as charismatic, proud, and creative. You attract attention naturally.',
    'Panna': 'You come across as neat, modest, and intelligent. People perceive you as reliable and detail-oriented.',
    'Váhy': 'You come across as elegant, friendly, and harmonious. You have natural charm and diplomatic bearing.',
    'Škorpión': 'You come across as magnetic, intense, and mysterious. Your gaze is penetrating and charismatic.',
    'Strelec': 'You come across as optimistic, open, and adventurous. You are sociable and inspiring.',
    'Kozorožec': 'You come across as serious, responsible, and professional. You radiate authority and competence.',
    'Vodnár': 'You come across as original, independent, and progressive. You are seen as unique, sometimes eccentric.',
    'Ryby': 'You come across as dreamy, gentle, and mystical. You have an ethereal quality and are perceived as spiritual.',
  };
  const fallback = lang === 'en' ? 'Your ascendant shapes the first impression and outward presentation.' : 'Váš ascendent formuje prvý dojem a vonkajšiu prezentáciu.';
  return (lang === 'en' ? en : sk)[sign] ?? fallback;
}

function getPlanetMeaning(planet: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Slnko': 'Vedomé ja, identita',
    'Mesiac': 'Emócie, podvedomie',
    'Merkúr': 'Myslenie, komunikácia',
    'Venuša': 'Láska, krása, hodnoty',
    'Mars': 'Energia, vôľa, akcia',
    'Jupiter': 'Expanzia, šťastie',
    'Saturn': 'Disciplína, lekcie',
    'Urán': 'Zmena, originalita',
    'Neptún': 'Intuícia, duchovnosť',
    'Pluto': 'Transformácia, moc',
    'Lilith': 'Tieň, divoká ženskosť, tabu (Mean Black Moon)',
    'Chiron': 'Zranený liečiteľ, najhlbšia rana → najväčší dar',
  };
  const en: Record<string, string> = {
    'Slnko': 'Identity, conscious self',
    'Mesiac': 'Emotions, subconscious',
    'Merkúr': 'Thinking, communication',
    'Venuša': 'Love, beauty, values',
    'Mars': 'Energy, drive, action',
    'Jupiter': 'Expansion, luck',
    'Saturn': 'Discipline, life lessons',
    'Urán': 'Change, originality',
    'Neptún': 'Intuition, spirituality',
    'Pluto': 'Transformation, power',
    'Lilith': 'Shadow, wild feminine, taboo (Mean Black Moon)',
    'Chiron': 'Wounded healer, deepest wound → greatest gift',
  };
  return (lang === 'en' ? en : sk)[planet] ?? '';
}

function getElementDescription(element: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Oheň': 'Dominancia ohňa prináša vášeň, energiu, iniciatívu a optimizmus. Ste dynamickí a akčne orientovaní.',
    'Zem': 'Dominancia zeme prináša praktickosť, stabilitu, zmysel pre realitu a spoľahlivosť.',
    'Vzduch': 'Dominancia vzduchu prináša intelekt, komunikáciu, spoločenskosť a racionálne myslenie.',
    'Voda': 'Dominancia vody prináša emocionalitu, intuíciu, empatiu a hlboké vnímanie.',
  };
  const en: Record<string, string> = {
    'Oheň': 'Fire dominance brings passion, energy, initiative, and optimism. You are dynamic and action-oriented.',
    'Zem': 'Earth dominance brings practicality, stability, a sense of reality, and reliability.',
    'Vzduch': 'Air dominance brings intellect, communication, sociability, and rational thinking.',
    'Voda': 'Water dominance brings emotionality, intuition, empathy, and deep perception.',
  };
  return (lang === 'en' ? en : sk)[element] ?? '';
}

function getQualityDescription(quality: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Kardinálny': 'Kardinálna kvalita znamená iniciatívu – radi začínate nové veci a vediete ostatných.',
    'Fixný': 'Fixná kvalita znamená vytrvalosť – ste stabilní, spoľahliví a dokážete dotiahnuť veci do konca.',
    'Mutabilný': 'Mutabilná kvalita znamená adaptabilitu – ste flexibilní, prispôsobiví a otvorení zmenám.',
  };
  const en: Record<string, string> = {
    'Kardinálny': 'Cardinal quality means initiative — you love starting new things and leading others.',
    'Fixný': 'Fixed quality means persistence — you are stable, reliable, and able to see things through.',
    'Mutabilný': 'Mutable quality means adaptability — you are flexible, adjustable, and open to change.',
  };
  return (lang === 'en' ? en : sk)[quality] ?? '';
}

function getDominantPlanetDescription(planet: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Mars': 'Mars ako dominantná planéta prináša odhodlanie, akčnosť a bojovného ducha.',
    'Venuša': 'Venuša ako dominantná planéta prináša zmysel pre krásu, harmóniu a vzťahy.',
    'Merkúr': 'Merkúr ako dominantná planéta prináša bystrú myseľ, komunikačné schopnosti a analytiku.',
    'Mesiac': 'Mesiac ako dominantná planéta prináša emocionalitu, intuíciu a starostlivosť.',
    'Slnko': 'Slnko ako dominantná planéta prináša charizmu, sebavedomie a kreatívne vyjadrenie.',
    'Jupiter': 'Jupiter ako dominantná planéta prináša optimizmus, múdrosť a expanzívnu energiu.',
    'Saturn': 'Saturn ako dominantná planéta prináša disciplínu, zodpovednosť a životné lekcie.',
    'Urán': 'Urán ako dominantná planéta prináša originalitu, inovácie a túžbu po slobode.',
    'Neptún': 'Neptún ako dominantná planéta prináša duchovnosť, kreativitu a silnú intuíciu.',
    'Pluto': 'Pluto ako dominantná planéta prináša transformačnú silu, intenzitu a schopnosť regenerácie.',
  };
  const en: Record<string, string> = {
    'Mars': 'Mars as your dominant planet brings determination, drive, and a warrior spirit.',
    'Venuša': 'Venus as your dominant planet brings a sense of beauty, harmony, and relationships.',
    'Merkúr': 'Mercury as your dominant planet brings a sharp mind, communication skills, and analytical ability.',
    'Mesiac': 'The Moon as your dominant planet brings emotionality, intuition, and nurturing energy.',
    'Slnko': 'The Sun as your dominant planet brings charisma, confidence, and creative expression.',
    'Jupiter': 'Jupiter as your dominant planet brings optimism, wisdom, and expansive energy.',
    'Saturn': 'Saturn as your dominant planet brings discipline, responsibility, and life lessons.',
    'Urán': 'Uranus as your dominant planet brings originality, innovation, and a desire for freedom.',
    'Neptún': 'Neptune as your dominant planet brings spirituality, creativity, and strong intuition.',
    'Pluto': 'Pluto as your dominant planet brings transformative power, intensity, and the capacity for regeneration.',
  };
  const fallback = lang === 'en' ? 'This planet shapes your overall energetic expression.' : 'Táto planéta formuje váš celkový energetický výraz.';
  return (lang === 'en' ? en : sk)[planet] ?? fallback;
}

function getMoonPhaseDescription(phase: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Nov': 'Narodení počas novu sú priekopníci – začínajú nové cykly, sú introspektívni a majú silný vnútorný impulz k obnove.',
    'Dorastajúci kosáčik': 'Narodení v tejto fáze sú bojovníci proti starým vzorcom. Majú silu presadiť sa napriek odporu.',
    'Prvá štvrť': 'Narodení v prvej štvrti sú akčne orientovaní, rozhodní a schopní prekonávať krízy.',
    'Dorastajúci mesiac': 'Narodení v tejto fáze sú budovatelia a rozvíjači. Zdokonaľujú to, čo bolo začaté.',
    'Spln': 'Narodení počas splnu sú orientovaní na vzťahy, majú silné vedomie a schopnosť objektivne vidieť situácie.',
    'Ubúdajúci mesiac': 'Narodení v tejto fáze sú učitelia a zdieľači múdrosti. Predávajú svoje skúsenosti ďalej.',
    'Posledná štvrť': 'Narodení v poslednej štvrti sú ideovými vodcami, ktorí búrajú staré systémy pre nové.',
    'Ubúdajúci kosáčik': 'Narodení v tejto fáze sú vizionári a proroci – dokončujú karmické cykly a pripravujú budúcnosť.',
  };
  const en: Record<string, string> = {
    'Nov': 'Those born during the New Moon are pioneers — they start new cycles, are introspective, and have a strong inner impulse for renewal.',
    'Dorastajúci kosáčik': 'Those born in this phase are fighters against old patterns. They have the strength to push through despite resistance.',
    'Prvá štvrť': 'Those born in the First Quarter are action-oriented, decisive, and capable of overcoming crises.',
    'Dorastajúci mesiac': 'Those born in this phase are builders and developers. They refine what has been started.',
    'Spln': 'Those born during the Full Moon are relationship-oriented, highly aware, and able to see situations objectively.',
    'Ubúdajúci mesiac': 'Those born in this phase are teachers and wisdom-sharers. They pass their experience on to others.',
    'Posledná štvrť': 'Those born in the Last Quarter are ideological leaders who tear down old systems to make way for the new.',
    'Ubúdajúci kosáčik': 'Those born in this phase are visionaries and prophets — they complete karmic cycles and prepare the future.',
  };
  const fallback = lang === 'en' ? 'The Moon phase at birth influences your life rhythm and approach to cycles of change.' : 'Mesačná fáza pri narodení ovplyvňuje váš životný štýl a prístup k cyklom zmien.';
  return (lang === 'en' ? en : sk)[phase] ?? fallback;
}

function getNodeDescription(sign: string, type: 'north' | 'south', lang: Language): string {
  const northSk: Record<string, string> = {
    'Baran': 'Učíte sa nezávislosti, odvaze a presadzovaniu sa.',
    'Býk': 'Učíte sa stability, trpezlivosti a budovaniu hodnôt.',
    'Blíženci': 'Učíte sa komunikácii, flexibilite a zvedavosti.',
    'Rak': 'Učíte sa zraniteľnosti, domovu a emocionálnej inteligencii.',
    'Lev': 'Učíte sa sebavyjadreniu, kreativite a osobnej radosti.',
    'Panna': 'Učíte sa službe, detailom a praktickému zdokonaľovaniu.',
    'Váhy': 'Učíte sa partnerstvu, diplomacii a spolupráci.',
    'Škorpión': 'Učíte sa transformácii, intímnosti a odvaze ísť do hĺbky.',
    'Strelec': 'Učíte sa rozširovaniu obzorov, viery a hľadaniu zmyslu.',
    'Kozorožec': 'Učíte sa disciplíne, zodpovednosti a budovaniu trvalých štruktúr.',
    'Vodnár': 'Učíte sa originalite, kolektívnemu mysleniu a slobode.',
    'Ryby': 'Učíte sa odovzdanosti, intuícii a bezpodmienečnému súcitu.',
  };
  const northEn: Record<string, string> = {
    'Baran': 'You are learning independence, courage, and self-assertion.',
    'Býk': 'You are learning stability, patience, and building lasting values.',
    'Blíženci': 'You are learning communication, flexibility, and curiosity.',
    'Rak': 'You are learning vulnerability, home, and emotional intelligence.',
    'Lev': 'You are learning self-expression, creativity, and personal joy.',
    'Panna': 'You are learning service, attention to detail, and practical refinement.',
    'Váhy': 'You are learning partnership, diplomacy, and cooperation.',
    'Škorpión': 'You are learning transformation, intimacy, and the courage to go deep.',
    'Strelec': 'You are learning to broaden horizons, cultivate faith, and seek meaning.',
    'Kozorožec': 'You are learning discipline, responsibility, and building lasting structures.',
    'Vodnár': 'You are learning originality, collective thinking, and freedom.',
    'Ryby': 'You are learning surrender, intuition, and unconditional compassion.',
  };
  const southSk: Record<string, string> = {
    'Baran': 'Vrodená nezávislosť a impulzivita z minulých životov.',
    'Býk': 'Vrodená stabilita a priľnutie k materiálnemu z minulých životov.',
    'Blíženci': 'Vrodené komunikačné schopnosti a povrchnosť z minulých životov.',
    'Rak': 'Vrodená starostlivosť a emocionálna závislosť z minulých životov.',
    'Lev': 'Vrodená kreativita a egocentrizmus z minulých životov.',
    'Panna': 'Vrodená analytičnosť a perfekcionizmus z minulých životov.',
    'Váhy': 'Vrodená diplomacia a závislosť na partneroch z minulých životov.',
    'Škorpión': 'Vrodená intenzita a kontrola z minulých životov.',
    'Strelec': 'Vrodený optimizmus a neukotvenosť z minulých životov.',
    'Kozorožec': 'Vrodená disciplína a rigidita z minulých životov.',
    'Vodnár': 'Vrodená originalita a odtrhnutie od emócií z minulých životov.',
    'Ryby': 'Vrodená intuícia a tendencia k úniku z minulých životov.',
  };
  const southEn: Record<string, string> = {
    'Baran': 'Innate independence and impulsiveness from past lives.',
    'Býk': 'Innate stability and attachment to the material from past lives.',
    'Blíženci': 'Innate communication skills and superficiality from past lives.',
    'Rak': 'Innate nurturing and emotional dependency from past lives.',
    'Lev': 'Innate creativity and egocentrism from past lives.',
    'Panna': 'Innate analytical ability and perfectionism from past lives.',
    'Váhy': 'Innate diplomacy and dependence on partners from past lives.',
    'Škorpión': 'Innate intensity and need for control from past lives.',
    'Strelec': 'Innate optimism and lack of grounding from past lives.',
    'Kozorožec': 'Innate discipline and rigidity from past lives.',
    'Vodnár': 'Innate originality and emotional detachment from past lives.',
    'Ryby': 'Innate intuition and tendency toward escapism from past lives.',
  };
  if (type === 'north') {
    const fallback = lang === 'en' ? 'The direction of your life evolution.' : 'Smer vašej životnej evolúcie.';
    return (lang === 'en' ? northEn : northSk)[sign] ?? fallback;
  }
  const fallback = lang === 'en' ? 'Your comfort zone from past lives.' : 'Vaša komfortná zóna z minulých životov.';
  return (lang === 'en' ? southEn : southSk)[sign] ?? fallback;
}

export function AstrologyPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const profile = useSubject();
  const [manualResult, setManualResult] = useState<AstrologyResult | null>(null);

  const profileResult = useMemo<AstrologyResult | null>(() => {
    if (!profile) return null;
    return calculateAstrology(
      profile.birthDay,
      profile.birthMonth,
      profile.birthYear,
      profile.birthHour ?? 12,
      profile.birthMinute ?? 0,
      profile.birthLatitude ?? 48.15,
      profile.birthLongitude ?? 17.11,
      profile.timezoneOffset
    );
  }, [profile]);

  const result = manualResult ?? profileResult;

  const handleCalculate = (day: number, month: number, year: number, hour?: number, minute?: number, lat?: number, lon?: number) => {
    setManualResult(calculateAstrology(day, month, year, hour ?? 12, minute ?? 0, lat ?? 48.15, lon ?? 17.11));
  };

  return (
    <div className="space-y-6">
      <div>
        {profile?.isClient && (
          <button
            onClick={() => navigate(`/clients/${profile.id}`)}
            className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-flex items-center gap-1"
          >
            ← {t('clients.backToClient')} {profile.name}
          </button>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl font-bold text-white">{t('astrology.title')}</h1>
          {profile?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              {language === 'sk' ? 'Klient' : 'Client'}: <strong>{profile.name}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          {profile?.isClient
            ? (language === 'sk' ? `Astrologický profil klienta ${profile.name}` : `Astrological profile of ${profile.name}`)
            : (language === 'sk' ? 'Astrologický profil a analýza' : 'Astrological profile and analysis')}
        </p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} showTime showPlace label={language === 'sk' ? 'Dátum a čas narodenia' : 'Date and time of birth'} />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          {/* Warning ak chýba miesto narodenia — Asc sa ráta z default Bratislavy */}
          {profile && profile.birthLatitude === undefined && (
            <GlassCard>
              <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/40">
                <p className="text-sm text-amber-700">
                  <strong>⚠ {language === 'sk' ? 'Pozor' : 'Warning'}:</strong> {language === 'sk'
                    ? <>Pre {profile.name} chýba miesto narodenia. Ascendent a domy sú vypočítané z default súradníc Bratislavy (48.15°N, 17.11°E) a môžu byť nepresné. Doplň miesto v {profile.isClient ? 'detail klienta' : 'Settings → Profil'} pre presný horoskop.</>
                    : <>Birth place is missing for {profile.name}. Ascendant and houses are calculated from default Bratislava coordinates (48.15°N, 17.11°E) and may be inaccurate. Add the birth place in {profile.isClient ? 'client detail' : 'Settings → Profile'} for a precise chart.</>}
                </p>
              </div>
            </GlassCard>
          )}
          <GlassCard>
            <p className="text-sm text-slate-400">
              {language === 'sk'
                ? <><strong className="text-white">Astrologický profil</strong> ukazuje rozloženie planét v okamihu vášho narodenia. Tri kľúčové body -- Slnko, Mesiac a Ascendent -- tvoria základ vašej osobnosti. Slnko je vaše vedomé ja, Mesiac vnútorný emocionálny svet a Ascendent maska, ktorú ukazujete svetu.</>
                : <><strong className="text-white">Astrological profile</strong> shows the planetary positions at the moment of your birth. Three key points — Sun, Moon, and Ascendant — form the foundation of your personality. The Sun is your conscious self, the Moon your inner emotional world, and the Ascendant the mask you show the world.</>}
            </p>
          </GlassCard>

          {/* Jednoducho povedané — praktické takeaway */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{t('astrology.whatToTakeAway')}</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                {language === 'sk'
                  ? <>Astrológia ti nehovorí, čo sa ti stane — hovorí ti, <strong className="text-white">akú energiu máš k dispozícii</strong>. Tu sú tri veci, ktoré ti pomôžu hneď:</>
                  : <>Astrology doesn't tell you what will happen — it tells you <strong className="text-white">what energy you have available</strong>. Here are three things that will help you right away:</>}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-700 font-semibold mb-1">{result.sunSign.symbol} {language === 'sk' ? 'Kto si (Slnko)' : 'Who you are (Sun)'}</p>
                  <p className="text-xs text-slate-700">
                    {language === 'sk'
                      ? <>Si <strong>{displayName(ZODIAC_DISPLAY, result.sunSign.name, language)}</strong> — tvoje vedomé ja, to čo ťa baví a kde sa cítiš „doma". Element {displayName(ELEMENT_DISPLAY, result.sunSign.element, language).toLowerCase()} = {result.sunSign.element === 'Oheň' ? 'akcia a vášeň' : result.sunSign.element === 'Zem' ? 'stabilita a prax' : result.sunSign.element === 'Vzduch' ? 'myslenie a komunikácia' : 'emócie a intuícia'}.</>
                      : <>You are <strong>{displayName(ZODIAC_DISPLAY, result.sunSign.name, language)}</strong> — your conscious self, what excites you and where you feel "at home". Element {displayName(ELEMENT_DISPLAY, result.sunSign.element, language).toLowerCase()} = {result.sunSign.element === 'Oheň' ? 'action and passion' : result.sunSign.element === 'Zem' ? 'stability and practice' : result.sunSign.element === 'Vzduch' ? 'thinking and communication' : 'emotions and intuition'}.</>}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <p className="text-xs text-purple-700 font-semibold mb-1">{result.moonSign.symbol} {language === 'sk' ? 'Čo cítiš (Mesiac)' : 'What you feel (Moon)'}</p>
                  <p className="text-xs text-slate-700">
                    {language === 'sk'
                      ? <>Mesiac v <strong>{displayName(ZODIAC_DISPLAY, result.moonSign.name, language)}</strong> — tvoje emócie a podvedomie. Takto spracúvaš stres, lásku a strach. Nemusíš sa podľa toho „správať" — ale pomáha to pochopiť.</>
                      : <>Moon in <strong>{displayName(ZODIAC_DISPLAY, result.moonSign.name, language)}</strong> — your emotions and subconscious. This is how you process stress, love, and fear. You don't have to "act" accordingly — but it helps to understand.</>}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200">
                  <p className="text-xs text-cyan-700 font-semibold mb-1">{result.ascendant.symbol} {language === 'sk' ? 'Ako ťa vidia (Asc)' : 'How others see you (Asc)'}</p>
                  <p className="text-xs text-slate-700">
                    {language === 'sk'
                      ? <>Ascendent v <strong>{displayName(ZODIAC_DISPLAY, result.ascendant.name, language)}</strong> — prvý dojem, tvoje „obaly". Nie je to kto si, je to ako ťa svet vníma a akú energiu vyžaruješ.</>
                      : <>Ascendant in <strong>{displayName(ZODIAC_DISPLAY, result.ascendant.name, language)}</strong> — first impression, your "wrapping". It's not who you are, it's how the world perceives you and what energy you radiate.</>}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                {language === 'sk'
                  ? 'Nižšie nájdeš koliesko s presnými pozíciami, planéty v znameniach, domy a aspekty — ale tieto tri body sú 80% toho, čo potrebuješ vedieť.'
                  : 'Below you\'ll find the wheel with exact positions, planets in signs, houses, and aspects — but these three points are 80% of what you need to know.'}
              </p>
            </div>
          </GlassCard>

          {/* Tvoje čítanie — personalizovaný sprievodca astrológiou */}
          <GlassCard>
            <details open>
              <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
                <span className="font-medium text-white">{t('astrology.yourReading')}</span>
              </summary>
              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-400">
                  {language === 'sk'
                    ? 'Horoskop nie je osud — je to mapa energií, s ktorými si sa narodil. Ukazuje tvoje silné stránky, výzvy a životné témy. Nie hovorí čo „musíš" — hovorí čo máš k dispozícii.'
                    : 'A horoscope is not fate — it\'s a map of the energies you were born with. It shows your strengths, challenges, and life themes. It doesn\'t say what you "must" do — it shows what\'s available to you.'}
                </p>

                {/* Slnko — podstata */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs font-semibold text-amber-300 mb-1">
                    {result.sunSign.symbol} {language === 'sk' ? 'Tvoja podstata: Slnko v' : 'Your essence: Sun in'} {displayName(ZODIAC_DISPLAY, result.sunSign.name, language)}
                  </p>
                  <p className="text-xs text-slate-300">{getSunSignDescription(result.sunSign.name, language)}</p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    {language === 'sk'
                      ? <>Element {displayName(ELEMENT_DISPLAY, result.sunSign.element, language)} + kvalita {displayName(QUALITY_DISPLAY, result.sunSign.quality, language).toLowerCase()} = {result.sunSign.quality === 'Kardinálny' ? 'iniciatíva a začínanie' : result.sunSign.quality === 'Fixný' ? 'vytrvalosť a stabilita' : 'adaptabilita a flexibilita'}.</>
                      : <>Element {displayName(ELEMENT_DISPLAY, result.sunSign.element, language)} + quality {displayName(QUALITY_DISPLAY, result.sunSign.quality, language).toLowerCase()} = {result.sunSign.quality === 'Kardinálny' ? 'initiative and starting' : result.sunSign.quality === 'Fixný' ? 'persistence and stability' : 'adaptability and flexibility'}.</>}
                  </p>
                </div>

                {/* Mesiac — emócie */}
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs font-semibold text-purple-300 mb-1">
                    {result.moonSign.symbol} {language === 'sk' ? 'Tvoje emócie: Mesiac v' : 'Your emotions: Moon in'} {displayName(ZODIAC_DISPLAY, result.moonSign.name, language)}
                  </p>
                  <p className="text-xs text-slate-300">{getMoonSignDescription(result.moonSign.name, language)}</p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    {language === 'sk' ? 'Fáza Mesiaca pri narodení:' : 'Moon phase at birth:'} {displayName(MOON_PHASE_DISPLAY, result.moonPhase, language)} — {getMoonPhaseDescription(result.moonPhase, language)}
                  </p>
                </div>

                {/* Ascendent — maska */}
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-xs font-semibold text-cyan-300 mb-1">
                    {result.ascendant.symbol} {language === 'sk' ? 'Ako ťa vidia: Ascendent v' : 'How others see you: Ascendant in'} {displayName(ZODIAC_DISPLAY, result.ascendant.name, language)}
                  </p>
                  <p className="text-xs text-slate-300">{getAscendantDescription(result.ascendant.name, language)}</p>
                </div>

                {/* Lunárne uzly — životná cesta */}
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-xs font-semibold text-indigo-300 mb-1">
                    {language === 'sk' ? 'Tvoja životná cesta: severný uzol v' : 'Your life path: North Node in'} {displayName(ZODIAC_DISPLAY, result.northNode.name, language)}
                  </p>
                  <p className="text-xs text-slate-300">
                    <strong className="text-emerald-300">{language === 'sk' ? 'Kam smeruješ:' : 'Where you\'re heading:'}</strong> {getNodeDescription(result.northNode.name, 'north', language)}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    <strong className="text-rose-300">{language === 'sk' ? 'Odkiaľ ideš:' : 'Where you come from:'}</strong> {getNodeDescription(result.southNode.name, 'south', language)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    {language === 'sk'
                      ? 'Severný uzol = tvoja evolučná úloha. Južný uzol = tvoja komfortná zóna z minulosti.'
                      : 'North Node = your evolutionary task. South Node = your comfort zone from the past.'}
                  </p>
                </div>

                {/* Dominantný element + planéta */}
                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                  <p className="text-xs font-semibold text-slate-300 mb-1">
                    {language === 'sk' ? 'Tvoja dominantná energia:' : 'Your dominant energy:'} {displayName(ELEMENT_DISPLAY, result.dominantElement, language)} + {displayName(PLANET_DISPLAY, result.dominantPlanet, language)}
                  </p>
                  <p className="text-xs text-slate-400">{getElementDescription(result.dominantElement, language)}</p>
                  <p className="text-xs text-slate-400 mt-1">{getDominantPlanetDescription(result.dominantPlanet, language)}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">{language === 'sk' ? 'Praktický tip' : 'Practical tip'}</p>
                  <p className="text-xs text-slate-300">
                    {language === 'sk'
                      ? 'Začni od Slnka (kto si), Mesiaca (čo cítiš) a severného uzla (kam smeruješ). To sú tri najdôležitejšie body. Planéty v znameniach a aspekty sú podrobnejší kontext — vráť sa k nim neskôr.'
                      : 'Start with the Sun (who you are), Moon (what you feel), and North Node (where you\'re heading). These are the three most important points. Planets in signs and aspects are deeper context — come back to them later.'}
                  </p>
                </div>
              </div>
            </details>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EnergyCard
              title={t('astrology.sunSign')}
              value={`${result.sunSign.symbol} ${displayName(ZODIAC_DISPLAY, result.sunSign.name, language)}`}
              subtitle={`${displayName(ELEMENT_DISPLAY, result.sunSign.element, language)} | ${displayName(QUALITY_DISPLAY, result.sunSign.quality, language)}`}
              color="gold"
              delay={0.1}
            />
            <EnergyCard
              title={t('astrology.moonSign')}
              value={`${result.moonSign.symbol} ${displayName(ZODIAC_DISPLAY, result.moonSign.name, language)}`}
              subtitle={`${displayName(ELEMENT_DISPLAY, result.moonSign.element, language)} | ${displayName(QUALITY_DISPLAY, result.moonSign.quality, language)}`}
              color="purple"
              delay={0.2}
            />
            <EnergyCard
              title={t('astrology.ascSign')}
              value={`${result.ascendant.symbol} ${displayName(ZODIAC_DISPLAY, result.ascendant.name, language)}`}
              subtitle={`${displayName(ELEMENT_DISPLAY, result.ascendant.element, language)} | ${displayName(QUALITY_DISPLAY, result.ascendant.quality, language)}`}
              color="cyan"
              delay={0.3}
            />
          </div>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Čo znamenajú vaše tri hlavné body' : 'What your three main points mean'}</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-400 uppercase mb-1">{displayName(PLANET_DISPLAY, 'Slnko', language)} {language === 'sk' ? 'v' : 'in'} {displayName(ZODIAC_DISPLAY, result.sunSign.name, language)} ({displayName(ELEMENT_DISPLAY, result.sunSign.element, language)})</p>
                <p className="text-sm text-slate-300">{getSunSignDescription(result.sunSign.name, language)}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-400 uppercase mb-1">{displayName(PLANET_DISPLAY, 'Mesiac', language)} {language === 'sk' ? 'v' : 'in'} {displayName(ZODIAC_DISPLAY, result.moonSign.name, language)} ({displayName(ELEMENT_DISPLAY, result.moonSign.element, language)})</p>
                <p className="text-sm text-slate-300">{getMoonSignDescription(result.moonSign.name, language)}</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-xs text-cyan-400 uppercase mb-1">{t('astrology.ascendant')} {language === 'sk' ? 'v' : 'in'} {displayName(ZODIAC_DISPLAY, result.ascendant.name, language)} ({displayName(ELEMENT_DISPLAY, result.ascendant.element, language)})</p>
                <p className="text-sm text-slate-300">{getAscendantDescription(result.ascendant.name, language)}</p>
              </div>
            </div>
          </GlassCard>

          {/* Natálne koliesko (B29) */}
          <NatalWheel result={result} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
            <GlassCard>
              <h3 className="font-medium text-white mb-2">{t('astrology.planetsInSigns')}</h3>
              <p className="text-xs text-slate-400 mb-4">{language === 'sk' ? 'Každá planéta ovplyvňuje inú oblasť vášho života. Znamenie, v ktorom sa nachádza, určuje spôsob, akým sa táto energia prejavuje.' : 'Each planet influences a different area of your life. The sign it occupies determines how that energy expresses itself.'}</p>
              <div className="space-y-3">
                {result.planets.map((planet, idx) => (
                  <motion.div
                    key={planet.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded-xl glass-light"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{planet.symbol}</span>
                        <div>
                          <span className="text-sm font-medium text-white">{displayName(PLANET_DISPLAY, planet.name, language)}</span>
                          <p className="text-[10px] text-slate-500">{getPlanetMeaning(planet.name, language)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-indigo-300">{planet.sign.symbol} {displayName(ZODIAC_DISPLAY, planet.sign.name, language)}</span>
                        <span className="text-xs text-slate-500 ml-2">{planet.degree.toFixed(1)}°</span>
                        {result.planetHouses[planet.name] && (
                          <span className="block text-[10px] text-amber-700 mt-0.5">
                            {result.planetHouses[planet.name]}. {language === 'sk' ? 'dom' : 'house'}
                          </span>
                        )}
                      </div>
                    </div>
                    {getPlanetSignDescription(planet.name, planet.sign.name, language) && (
                      <p className="text-xs text-slate-400 mt-2">{getPlanetSignDescription(planet.name, planet.sign.name, language)}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Čínsky horoskop — ľavý stĺpec pod planétami */}
            {(() => {
              const birthYear = profile?.birthYear ?? (manualResult ? new Date().getFullYear() - 30 : null);
              if (!birthYear) return null;
              const chinese = calculateChineseZodiac(birthYear, profile?.birthMonth, profile?.birthDay);
              const animalInfo = getChineseAnimalInfo(chinese.animal, language);
              const elementInfo = getChineseElementInfo(chinese.element, language);
              if (!animalInfo) return null;
              return (
                <GlassCard>
                  <h3 className="font-medium text-white mb-3">{t('astrology.chineseZodiac')}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">{chinese.animalEmoji}</div>
                    <div>
                      <p className="text-lg font-serif font-bold text-white">{displayName(CHINESE_ANIMAL_DISPLAY, chinese.animal, language)}</p>
                      <p className="text-sm text-slate-400">
                        {displayName(CHINESE_ELEMENT_DISPLAY, chinese.element, language)} {chinese.elementEmoji} · {chinese.polarity} · {language === 'sk' ? 'rok' : 'year'} {birthYear}
                      </p>
                    </div>
                  </div>

                  {profile?.birthMonth && profile.birthMonth <= 2 && (
                    <p className="text-[11px] text-amber-400 italic mb-3">
                      {language === 'sk'
                        ? `Pozor: Čínsky nový rok začína medzi 21. januárom a 20. februárom. Ak si narodený v januári/februári, tvoje zviera môže byť z predošlého roku. Overiť presný dátum nového roka pre rok ${birthYear}.`
                        : `Note: Chinese New Year falls between January 21 and February 20. If born in January/February, your animal may be from the previous year. Verify the exact New Year date for year ${birthYear}.`}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-xs text-red-400 uppercase mb-1">{t('astrology.chineseAnimal')}: {displayName(CHINESE_ANIMAL_DISPLAY, chinese.animal, language)}</p>
                      <p className="text-xs text-slate-300">{animalInfo.traits}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs text-emerald-400 uppercase mb-1">{language === 'sk' ? 'Silné stránky' : 'Strengths'}</p>
                        <p className="text-xs text-slate-300">{animalInfo.strengths}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs text-amber-400 uppercase mb-1">{language === 'sk' ? 'Výzvy' : 'Challenges'}</p>
                        <p className="text-xs text-slate-300">{animalInfo.challenges}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <p className="text-xs text-indigo-400 uppercase mb-1">{t('astrology.chineseElement')}: {displayName(CHINESE_ELEMENT_DISPLAY, chinese.element, language)} {chinese.elementEmoji}</p>
                      <p className="text-xs text-slate-300">{elementInfo?.personality}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <p className="text-xs text-purple-400 uppercase mb-1">{t('astrology.chineseCompat')}</p>
                      <p className="text-xs text-slate-300">{animalInfo.compatibility}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <p className="text-xs text-cyan-400 uppercase mb-1">{t('astrology.chineseAdvice')}</p>
                      <p className="text-xs text-slate-300 italic">{animalInfo.advice}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                      <p className="text-xs text-slate-400">
                        {t('astrology.chineseNextYear')} {CHINESE_ANIMAL_GENITIVE[chinese.animal]?.[language] ?? chinese.animalGenitive} {chinese.animalEmoji}: <strong className="text-white">{chinese.nextYear}</strong>
                        <span className="text-slate-500"> ({language === 'sk' ? 'za' : 'in'} {chinese.nextYear - new Date().getFullYear()} {language === 'sk' ? (chinese.nextYear - new Date().getFullYear() === 1 ? 'rok' : chinese.nextYear - new Date().getFullYear() < 5 ? 'roky' : 'rokov') : (chinese.nextYear - new Date().getFullYear() === 1 ? 'year' : 'years')})</span>
                      </p>
                    </div>
                  </div>
                </GlassCard>
              );
            })()}
            </div>

            <div className="space-y-4">
              <GlassCard>
                <h3 className="font-medium text-white mb-2">{t('astrology.dominantEnergies')}</h3>
                <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Dominanty ukazujú, aké energie vo vašom horoskope prevládajú a formujú váš celkový prístup k životu.' : 'Dominants show which energies prevail in your chart and shape your overall approach to life.'}</p>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{t('astrology.dominantElement')}</span>
                      <span className="font-medium text-white">{displayName(ELEMENT_DISPLAY, result.dominantElement, language)}</span>
                    </div>
                    <p className="text-xs text-slate-400">{getElementDescription(result.dominantElement, language)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{t('astrology.dominantQuality')}</span>
                      <span className="font-medium text-white">{displayName(QUALITY_DISPLAY, result.dominantQuality, language)}</span>
                    </div>
                    <p className="text-xs text-slate-400">{getQualityDescription(result.dominantQuality, language)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{t('astrology.dominantPlanet')}</span>
                      <span className="font-medium text-white">{displayName(PLANET_DISPLAY, result.dominantPlanet, language)}</span>
                    </div>
                    <p className="text-xs text-slate-400">{getDominantPlanetDescription(result.dominantPlanet, language)}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-medium text-white mb-2">{t('astrology.moonPhase')}</h3>
                <p className="text-lg text-indigo-300 font-serif">{displayName(MOON_PHASE_DISPLAY, result.moonPhase, language)}</p>
                <p className="text-xs text-slate-400 mt-2">{getMoonPhaseDescription(result.moonPhase, language)}</p>
              </GlassCard>

              {/* Tranzity — čo sa deje TERAZ */}
              {(() => {
                const transits: TransitAspect[] = calculateTransitAspects(result);
                if (transits.length === 0) return null;
                const important = transits.filter(t => ['Jupiter', 'Saturn', 'Urán', 'Neptún', 'Pluto'].includes(t.transitPlanet));
                const personal = transits.filter(t => !['Jupiter', 'Saturn', 'Urán', 'Neptún', 'Pluto'].includes(t.transitPlanet));
                return (
                  <GlassCard>
                    <h3 className="font-medium text-white mb-2">{t('astrology.currentTransits')}</h3>
                    <p className="text-xs text-slate-500 mb-4">
                      {language === 'sk'
                        ? 'Planéty na oblohe práve teraz tvoria aspekty k tvojim natálnym pozíciám. Vonkajšie planéty (Jupiter–Pluto) sú dlhodobejšie a dôležitejšie.'
                        : 'Planets in the sky right now form aspects to your natal positions. Outer planets (Jupiter–Pluto) are longer-lasting and more significant.'}
                    </p>

                    {important.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-amber-400 uppercase font-semibold mb-2">{t('astrology.longTermTransits')}</p>
                        <div className="space-y-2">
                          {important.slice(0, 6).map((tr, i) => (
                            <div key={i} className={`p-3 rounded-xl border ${tr.nature === 'harmonic' ? 'bg-emerald-500/10 border-emerald-500/20' : tr.nature === 'tense' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-white">{displayName(PLANET_DISPLAY, tr.transitPlanet, language)} {tr.symbol} {displayName(PLANET_DISPLAY, tr.natalPlanet, language)}</span>
                                <span className="text-xs text-slate-400 ml-auto">orb {tr.orb.toFixed(1)}°</span>
                              </div>
                              <p className="text-xs text-slate-300">{tr.meaning}</p>
                              <p className="text-[10px] text-slate-500 mt-1">{language === 'sk' ? 'Tranzit' : 'Transit'} {displayName(PLANET_DISPLAY, tr.transitPlanet, language)} {language === 'sk' ? 'v' : 'in'} {displayName(ZODIAC_DISPLAY, tr.transitSign, language)} → {language === 'sk' ? 'natálny' : 'natal'} {displayName(PLANET_DISPLAY, tr.natalPlanet, language)} {language === 'sk' ? 'v' : 'in'} {displayName(ZODIAC_DISPLAY, tr.natalSign, language)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {personal.length > 0 && (
                      <details>
                        <summary className="text-xs text-indigo-700 font-medium cursor-pointer hover:text-indigo-800 select-none">
                          {t('astrology.shortTermTransits')} ({personal.length})
                        </summary>
                        <div className="space-y-2 mt-3">
                          {personal.slice(0, 8).map((tr, i) => (
                            <div key={i} className={`p-2 rounded-lg border ${tr.nature === 'harmonic' ? 'bg-emerald-500/5 border-emerald-500/15' : tr.nature === 'tense' ? 'bg-rose-500/5 border-rose-500/15' : 'bg-slate-500/5 border-slate-500/15'}`}>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-white">{displayName(PLANET_DISPLAY, tr.transitPlanet, language)} {tr.symbol} {displayName(PLANET_DISPLAY, tr.natalPlanet, language)}</span>
                                <span className="text-[10px] text-slate-400 ml-auto">{tr.orb.toFixed(1)}°</span>
                              </div>
                              <p className="text-[10px] text-slate-400">{tr.meaning}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </GlassCard>
                );
              })()}

              <LunarTimeline />

              <UpcomingEclipses />

              {profile && (
                <ProgressionsView
                  birthDay={profile.birthDay}
                  birthMonth={profile.birthMonth}
                  birthYear={profile.birthYear}
                  birthHour={profile.birthHour ?? 12}
                  birthMinute={profile.birthMinute ?? 0}
                />
              )}

              {profile && (
                <SolarReturnView
                  birthDay={profile.birthDay}
                  birthMonth={profile.birthMonth}
                  birthYear={profile.birthYear}
                  birthHour={profile.birthHour ?? 12}
                  birthMinute={profile.birthMinute ?? 0}
                  latitude={profile.birthLatitude}
                  longitude={profile.birthLongitude}
                />
              )}

              <GlassCard>
                <h3 className="font-medium text-white mb-2">{t('astrology.houses')}</h3>
                <p className="text-xs text-slate-500 mb-3">
                  {language === 'sk'
                    ? '12 domov začína znamením ascendentu. Každý dom predstavuje oblasť života. Planéty v dome ukazujú, aká energia v tej oblasti pôsobí.'
                    : '12 houses begin with the ascendant sign. Each house represents an area of life. Planets in a house show what energy is at work in that area.'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {result.houses.map(h => {
                    const planetsInHouse = result.planets.filter(p => result.planetHouses[p.name] === h.number);
                    return (
                      <div key={h.number} className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-700">{h.number}. {h.sign.symbol}</span>
                          <span className="text-[10px] text-slate-500">{displayName(ZODIAC_DISPLAY, h.sign.name, language)}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">{HOUSE_THEME_DISPLAY[h.number]?.[language] ?? h.theme}</p>
                        {planetsInHouse.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {planetsInHouse.map(p => (
                              <span key={p.name} title={displayName(PLANET_DISPLAY, p.name, language)} className="text-sm">{p.symbol}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-medium text-white mb-2">{t('astrology.karmicNodes')}</h3>
                <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Severný uzol ukazuje smer vašej evolúcie – kam sa máte posúvať. Južný uzol je vaša komfortná zóna z minulých životov.' : 'The North Node shows the direction of your evolution — where you need to grow. The South Node is your comfort zone from past lives.'}</p>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{language === 'sk' ? 'Severný uzol (budúcnosť)' : 'North Node (future)'}</span>
                      <span className="text-sm text-indigo-300">{result.northNode.symbol} {displayName(ZODIAC_DISPLAY, result.northNode.name, language)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{t('astrology.growthDirection')} {getNodeDescription(result.northNode.name, 'north', language)}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{language === 'sk' ? 'Južný uzol (minulosť)' : 'South Node (past)'}</span>
                      <span className="text-sm text-purple-300">{result.southNode.symbol} {displayName(ZODIAC_DISPLAY, result.southNode.name, language)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{t('astrology.innateTalent')} {getNodeDescription(result.southNode.name, 'south', language)}</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Natálne aspekty */}
          {(() => {
            const natalAspects = calculateNatalAspects(result);
            if (natalAspects.length === 0) return null;
            const planetSymbols: Record<string, string> = {
              'Slnko': '☉', 'Mesiac': '☽', 'Merkúr': '☿', 'Venuša': '♀', 'Mars': '♂',
              'Jupiter': '♃', 'Saturn': '♄', 'Urán': '♅', 'Neptún': '♆', 'Pluto': '♇',
            };
            const harmonic = natalAspects.filter(a => a.nature === 'harmonic').length;
            const tense = natalAspects.filter(a => a.nature === 'tense').length;
            const neutral = natalAspects.filter(a => a.nature === 'neutral').length;
            const top = natalAspects.slice(0, 12);
            return (
              <GlassCard>
                <h3 className="font-medium text-white mb-2">{t('astrology.natalAspects')}</h3>
                <p className="text-xs text-slate-500 mb-3">
                  {language === 'sk'
                    ? 'Uhly medzi planétami v rámci vášho vlastného horoskopu. Každý aspekt je dialóg dvoch planét — buď harmonický (trigon, sextil), napäťový (kvadratúra, opozícia) alebo neutrálny (spojenie, ktoré planétne energie zlučuje).'
                    : 'Angles between planets in your natal chart. Each aspect is a dialogue between two planets — either harmonic (trine, sextile), tense (square, opposition), or neutral (conjunction, which merges planetary energies).'}
                </p>

                {/* Súhrn počtu */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-green-50 border border-green-200 text-center">
                    <p className="text-[10px] uppercase text-green-700 font-semibold">{t('astrology.harmonicAspects')}</p>
                    <p className="text-2xl font-bold text-green-700">{harmonic}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-center">
                    <p className="text-[10px] uppercase text-rose-700 font-semibold">{t('astrology.tenseAspects')}</p>
                    <p className="text-2xl font-bold text-rose-700">{tense}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[10px] uppercase text-slate-700 font-semibold">{t('astrology.neutralAspects')}</p>
                    <p className="text-2xl font-bold text-slate-700">{neutral}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2">
                    {language === 'sk' ? `Top 12 najpresnejších (${natalAspects.length} celkom)` : `Top 12 most exact (${natalAspects.length} total)`}
                  </p>
                  {top.map((a: SynastryAspect, i: number) => {
                    const bg = a.nature === 'harmonic' ? 'bg-green-50 border-green-200' :
                               a.nature === 'tense' ? 'bg-rose-50 border-rose-200' :
                               'bg-slate-50 border-slate-200';
                    const iconColor = a.nature === 'harmonic' ? 'text-green-700' :
                                      a.nature === 'tense' ? 'text-rose-700' : 'text-slate-700';
                    return (
                      <div key={i} className={`p-2 rounded-lg border ${bg}`}>
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{planetSymbols[a.planet1] || ''}</span>
                            <strong className="text-slate-800">{displayName(PLANET_DISPLAY, a.planet1, language)}</strong>
                            <span className={`text-base ${iconColor}`}>{a.symbol}</span>
                            <strong className="text-slate-800">{displayName(PLANET_DISPLAY, a.planet2, language)}</strong>
                            <span className="text-base">{planetSymbols[a.planet2] || ''}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0">orb {a.orb.toFixed(1)}°</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{a.description}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 italic mt-3">
                  {language === 'sk'
                    ? 'Napäťové aspekty nie sú zlé — sú motorom vývoja. Harmonické sú ľahké, ale často nevedome (môžete ich brať ako samozrejmé).'
                    : 'Tense aspects aren\'t bad — they are the engine of growth. Harmonic ones are easy but often unconscious (you may take them for granted).'}
                </p>
              </GlassCard>
            );
          })()}


          {manualResult && (
            <button
              onClick={() => setManualResult(null)}
              className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white"
            >
              {t('common.newCalculation')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
