import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubject } from '../hooks/useSubject';
import { GlassCard } from '../components/GlassCard';
import { EnergyCard } from '../components/EnergyCard';
import { DateInput } from '../components/DateInput';
import { calculateAstrology, calculateNatalAspects, calculateTransitAspects } from '../engine/astrologyEngine';
import type { AstrologyResult, SynastryAspect, TransitAspect } from '../engine/astrologyEngine';
import { motion } from 'framer-motion';
import { planetInSignDescriptions } from '../data/planetSignDescriptions';
import { LunarTimeline } from '../components/LunarTimeline';
import { NatalWheel } from '../components/NatalWheel';
import { UpcomingEclipses } from '../components/UpcomingEclipses';
import { ProgressionsView } from '../components/ProgressionsView';
import { SolarReturnView } from '../components/SolarReturnView';
import { calculateChineseZodiac } from '../engine/chineseZodiacEngine';
import { CHINESE_ANIMALS, CHINESE_ELEMENTS } from '../data/chineseZodiac';
import { AIChat } from '../components/AIChat';

function getSunSignDescription(sign: string): string {
  const descriptions: Record<string, string> = {
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
  return descriptions[sign] || 'Jedinečná slnečná energia formuje vaše vedomé ja.';
}

function getMoonSignDescription(sign: string): string {
  const descriptions: Record<string, string> = {
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
  return descriptions[sign] || 'Vaša mesačná energia formuje vnútorný emocionálny svet.';
}

function getAscendantDescription(sign: string): string {
  const descriptions: Record<string, string> = {
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
  return descriptions[sign] || 'Váš ascendent formuje prvý dojem a vonkajšiu prezentáciu.';
}

function getPlanetMeaning(planet: string): string {
  const meanings: Record<string, string> = {
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
    'Chiron': 'Zranený liečiteľ, najhlbšia rana → najväčší dar (~aproximovaná pozícia)',
  };
  return meanings[planet] || '';
}

function getElementDescription(element: string): string {
  const descriptions: Record<string, string> = {
    'Oheň': 'Dominancia ohňa prináša vášeň, energiu, iniciatívu a optimizmus. Ste dynamickí a akčne orientovaní.',
    'Zem': 'Dominancia zeme prináša praktickosť, stabilitu, zmysel pre realitu a spoľahlivosť.',
    'Vzduch': 'Dominancia vzduchu prináša intelekt, komunikáciu, spoločenskosť a racionálne myslenie.',
    'Voda': 'Dominancia vody prináša emocionalitu, intuíciu, empatiu a hlboké vnímanie.',
  };
  return descriptions[element] || '';
}

function getQualityDescription(quality: string): string {
  const descriptions: Record<string, string> = {
    'Kardinálny': 'Kardinálna kvalita znamená iniciatívu – radi začínate nové veci a vediete ostatných.',
    'Fixný': 'Fixná kvalita znamená vytrvalosť – ste stabilní, spoľahliví a dokážete dotiahnuť veci do konca.',
    'Mutabilný': 'Mutabilná kvalita znamená adaptabilitu – ste flexibilní, prispôsobiví a otvorení zmenám.',
  };
  return descriptions[quality] || '';
}

function getDominantPlanetDescription(planet: string): string {
  const descriptions: Record<string, string> = {
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
  return descriptions[planet] || 'Táto planéta formuje váš celkový energetický výraz.';
}

function getMoonPhaseDescription(phase: string): string {
  const descriptions: Record<string, string> = {
    'Nov': 'Narodení počas novu sú priekopníci – začínajú nové cykly, sú introspektívni a majú silný vnútorný impulz k obnove.',
    'Dorastajúci kosáčik': 'Narodení v tejto fáze sú bojovníci proti starým vzorcom. Majú silu presadiť sa napriek odporu.',
    'Prvá štvrť': 'Narodení v prvej štvrti sú akčne orientovaní, rozhodní a schopní prekonávať krízy.',
    'Dorastajúci mesiac': 'Narodení v tejto fáze sú budovatelia a rozvíjači. Zdokonaľujú to, čo bolo začaté.',
    'Spln': 'Narodení počas splnu sú orientovaní na vzťahy, majú silné vedomie a schopnosť objektivne vidieť situácie.',
    'Ubúdajúci mesiac': 'Narodení v tejto fáze sú učitelia a zdieľači múdrosti. Predávajú svoje skúsenosti ďalej.',
    'Posledná štvrť': 'Narodení v poslednej štvrti sú ideovými vodcami, ktorí búrajú staré systémy pre nové.',
    'Ubúdajúci kosáčik': 'Narodení v tejto fáze sú vizionári a proroci – dokončujú karmické cykly a pripravujú budúcnosť.',
  };
  return descriptions[phase] || 'Mesačná fáza pri narodení ovplyvňuje váš životný štýl a prístup k cyklom zmien.';
}

function getNodeDescription(sign: string, type: 'north' | 'south'): string {
  const northDescriptions: Record<string, string> = {
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
  const southDescriptions: Record<string, string> = {
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
  if (type === 'north') return northDescriptions[sign] || 'Smer vašej životnej evolúcie.';
  return southDescriptions[sign] || 'Vaša komfortná zóna z minulých životov.';
}

export function AstrologyPage() {
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
            ← Späť na klienta {profile.name}
          </button>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl font-bold text-white">Astrológia</h1>
          {profile?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              Klient: <strong>{profile.name}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          {profile?.isClient ? `Astrologický profil klienta ${profile.name}` : 'Astrologický profil a analýza'}
        </p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} showTime showPlace label="Dátum a čas narodenia" />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          {/* Warning ak chýba miesto narodenia — Asc sa ráta z default Bratislavy */}
          {profile && profile.birthLatitude === undefined && (
            <GlassCard>
              <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/40">
                <p className="text-sm text-amber-700">
                  <strong>⚠ Pozor:</strong> Pre {profile.name} chýba miesto narodenia. Ascendent a domy sú vypočítané z default súradníc Bratislavy (48.15°N, 17.11°E) a môžu byť nepresné. Doplň miesto v {profile.isClient ? 'detail klienta' : 'Settings → Profil'} pre presný horoskop.
                </p>
              </div>
            </GlassCard>
          )}
          <GlassCard>
            <p className="text-sm text-slate-400">
              <strong className="text-white">Astrologický profil</strong> ukazuje rozloženie planét v okamihu vášho narodenia. Tri kľúčové body -- Slnko, Mesiac a Ascendent -- tvoria základ vašej osobnosti. Slnko je vaše vedomé ja, Mesiac vnútorný emocionálny svet a Ascendent maska, ktorú ukazujete svetu.
            </p>
          </GlassCard>

          {/* Jednoducho povedané — praktické takeaway */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">Čo si z toho vziať</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                Astrológia ti nehovorí, čo sa ti stane — hovorí ti, <strong className="text-white">akú energiu máš k dispozícii</strong>. Tu sú tri veci, ktoré ti pomôžu hneď:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-700 font-semibold mb-1">{result.sunSign.symbol} Kto si (Slnko)</p>
                  <p className="text-xs text-slate-700">
                    Si <strong>{result.sunSign.name}</strong> — tvoje vedomé ja, to čo ťa baví a kde sa cítiš „doma". Element {result.sunSign.element.toLowerCase()} = {result.sunSign.element === 'Oheň' ? 'akcia a vášeň' : result.sunSign.element === 'Zem' ? 'stabilita a prax' : result.sunSign.element === 'Vzduch' ? 'myslenie a komunikácia' : 'emócie a intuícia'}.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <p className="text-xs text-purple-700 font-semibold mb-1">{result.moonSign.symbol} Čo cítiš (Mesiac)</p>
                  <p className="text-xs text-slate-700">
                    Mesiac v <strong>{result.moonSign.name}</strong> — tvoje emócie a podvedomie. Takto spracúvaš stres, lásku a strach. Nemusíš sa podľa toho „správať" — ale pomáha to pochopiť.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200">
                  <p className="text-xs text-cyan-700 font-semibold mb-1">{result.ascendant.symbol} Ako ťa vidia (Asc)</p>
                  <p className="text-xs text-slate-700">
                    Ascendent v <strong>{result.ascendant.name}</strong> — prvý dojem, tvoje „obaly". Nie je to kto si, je to ako ťa svet vníma a akú energiu vyžaruješ.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                Nižšie nájdeš koliesko s presnými pozíciami, planéty v znameniach, domy a aspekty — ale tieto tri body sú 80% toho, čo potrebuješ vedieť.
              </p>
            </div>
          </GlassCard>

          {/* Tvoje čítanie — personalizovaný sprievodca astrológiou */}
          <GlassCard>
            <details open>
              <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
                <span className="font-medium text-white">Tvoje čítanie — ako pracovať s horoskopom</span>
              </summary>
              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-400">
                  Horoskop nie je osud — je to mapa energií, s ktorými si sa narodil. Ukazuje tvoje silné stránky, výzvy a životné témy.
                  Nie hovorí čo „musíš" — hovorí čo máš k dispozícii.
                </p>

                {/* Slnko — podstata */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs font-semibold text-amber-300 mb-1">
                    {result.sunSign.symbol} Tvoja podstata: Slnko v {result.sunSign.name}
                  </p>
                  <p className="text-xs text-slate-300">{getSunSignDescription(result.sunSign.name)}</p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    Element {result.sunSign.element} + kvalita {result.sunSign.quality.toLowerCase()} = {result.sunSign.quality === 'Kardinálny' ? 'iniciatíva a začínanie' : result.sunSign.quality === 'Fixný' ? 'vytrvalosť a stabilita' : 'adaptabilita a flexibilita'}.
                  </p>
                </div>

                {/* Mesiac — emócie */}
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs font-semibold text-purple-300 mb-1">
                    {result.moonSign.symbol} Tvoje emócie: Mesiac v {result.moonSign.name}
                  </p>
                  <p className="text-xs text-slate-300">{getMoonSignDescription(result.moonSign.name)}</p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    Fáza Mesiaca pri narodení: {result.moonPhase} — {getMoonPhaseDescription(result.moonPhase)}
                  </p>
                </div>

                {/* Ascendent — maska */}
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-xs font-semibold text-cyan-300 mb-1">
                    {result.ascendant.symbol} Ako ťa vidia: Ascendent v {result.ascendant.name}
                  </p>
                  <p className="text-xs text-slate-300">{getAscendantDescription(result.ascendant.name)}</p>
                </div>

                {/* Lunárne uzly — životná cesta */}
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-xs font-semibold text-indigo-300 mb-1">
                    Tvoja životná cesta: severný uzol v {result.northNode.name}
                  </p>
                  <p className="text-xs text-slate-300">
                    <strong className="text-emerald-300">Kam smeruješ:</strong> {getNodeDescription(result.northNode.name, 'north')}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    <strong className="text-rose-300">Odkiaľ ideš:</strong> {getNodeDescription(result.southNode.name, 'south')}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    Severný uzol = tvoja evolučná úloha. Južný uzol = tvoja komfortná zóna z minulosti.
                  </p>
                </div>

                {/* Dominantný element + planéta */}
                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                  <p className="text-xs font-semibold text-slate-300 mb-1">
                    Tvoja dominantná energia: {result.dominantElement} + {result.dominantPlanet}
                  </p>
                  <p className="text-xs text-slate-400">{getElementDescription(result.dominantElement)}</p>
                  <p className="text-xs text-slate-400 mt-1">{getDominantPlanetDescription(result.dominantPlanet)}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">Praktický tip</p>
                  <p className="text-xs text-slate-300">
                    Začni od Slnka (kto si), Mesiaca (čo cítiš) a severného uzla (kam smeruješ). To sú tri najdôležitejšie body.
                    Planéty v znameniach a aspekty sú podrobnejší kontext — vráť sa k nim neskôr.
                  </p>
                </div>
              </div>
            </details>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EnergyCard
              title="Slnečné znamenie"
              value={`${result.sunSign.symbol} ${result.sunSign.name}`}
              subtitle={`${result.sunSign.element} | ${result.sunSign.quality}`}
              color="gold"
              delay={0.1}
            />
            <EnergyCard
              title="Mesačné znamenie"
              value={`${result.moonSign.symbol} ${result.moonSign.name}`}
              subtitle={`${result.moonSign.element} | ${result.moonSign.quality}`}
              color="purple"
              delay={0.2}
            />
            <EnergyCard
              title="Ascendent"
              value={`${result.ascendant.symbol} ${result.ascendant.name}`}
              subtitle={`${result.ascendant.element} | ${result.ascendant.quality}`}
              color="cyan"
              delay={0.3}
            />
          </div>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Čo znamenajú vaše tri hlavné body</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-400 uppercase mb-1">Slnko v {result.sunSign.name} ({result.sunSign.element})</p>
                <p className="text-sm text-slate-300">{getSunSignDescription(result.sunSign.name)}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-400 uppercase mb-1">Mesiac v {result.moonSign.name} ({result.moonSign.element})</p>
                <p className="text-sm text-slate-300">{getMoonSignDescription(result.moonSign.name)}</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-xs text-cyan-400 uppercase mb-1">Ascendent v {result.ascendant.name} ({result.ascendant.element})</p>
                <p className="text-sm text-slate-300">{getAscendantDescription(result.ascendant.name)}</p>
              </div>
            </div>
          </GlassCard>

          {/* Natálne koliesko (B29) */}
          <NatalWheel result={result} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
            <GlassCard>
              <h3 className="font-medium text-white mb-2">Planéty v znameniach</h3>
              <p className="text-xs text-slate-400 mb-4">Každá planéta ovplyvňuje inú oblasť vášho života. Znamenie, v ktorom sa nachádza, určuje spôsob, akým sa táto energia prejavuje.</p>
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
                          <span className="text-sm font-medium text-white">{planet.name}</span>
                          <p className="text-[10px] text-slate-500">{getPlanetMeaning(planet.name)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-indigo-300">{planet.sign.symbol} {planet.sign.name}</span>
                        <span className="text-xs text-slate-500 ml-2">{planet.degree.toFixed(1)}°</span>
                        {result.planetHouses[planet.name] && (
                          <span className="block text-[10px] text-amber-700 mt-0.5">
                            {result.planetHouses[planet.name]}. dom
                          </span>
                        )}
                      </div>
                    </div>
                    {planetInSignDescriptions[planet.name]?.[planet.sign.name] && (
                      <p className="text-xs text-slate-400 mt-2">{planetInSignDescriptions[planet.name][planet.sign.name]}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Čínsky horoskop — ľavý stĺpec pod planétami */}
            {(() => {
              const birthYear = profile?.birthYear ?? (manualResult ? new Date().getFullYear() - 30 : null);
              if (!birthYear) return null;
              const chinese = calculateChineseZodiac(birthYear);
              const animalInfo = CHINESE_ANIMALS[chinese.animal];
              const elementInfo = CHINESE_ELEMENTS[chinese.element];
              if (!animalInfo) return null;
              return (
                <GlassCard>
                  <h3 className="font-medium text-white mb-3">Čínsky horoskop</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">{chinese.animalEmoji}</div>
                    <div>
                      <p className="text-lg font-serif font-bold text-white">{chinese.animal}</p>
                      <p className="text-sm text-slate-400">
                        {chinese.element} {chinese.elementEmoji} · {chinese.polarity} · rok {birthYear}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-xs text-red-400 uppercase mb-1">Povaha {chinese.animal}</p>
                      <p className="text-xs text-slate-300">{animalInfo.traits}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs text-emerald-400 uppercase mb-1">Silné stránky</p>
                        <p className="text-xs text-slate-300">{animalInfo.strengths}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs text-amber-400 uppercase mb-1">Výzvy</p>
                        <p className="text-xs text-slate-300">{animalInfo.challenges}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <p className="text-xs text-indigo-400 uppercase mb-1">Element: {chinese.element} {chinese.elementEmoji}</p>
                      <p className="text-xs text-slate-300">{elementInfo?.personality}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <p className="text-xs text-purple-400 uppercase mb-1">Kompatibilita</p>
                      <p className="text-xs text-slate-300">{animalInfo.compatibility}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <p className="text-xs text-cyan-400 uppercase mb-1">Odporúčanie</p>
                      <p className="text-xs text-slate-300 italic">{animalInfo.advice}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                      <p className="text-xs text-slate-400">
                        Najbližší rok {chinese.animalGenitive} {chinese.animalEmoji}: <strong className="text-white">{chinese.nextYear}</strong>
                        <span className="text-slate-500"> (za {chinese.nextYear - new Date().getFullYear()} {chinese.nextYear - new Date().getFullYear() === 1 ? 'rok' : chinese.nextYear - new Date().getFullYear() < 5 ? 'roky' : 'rokov'})</span>
                      </p>
                    </div>
                  </div>
                </GlassCard>
              );
            })()}
            </div>

            <div className="space-y-4">
              <GlassCard>
                <h3 className="font-medium text-white mb-2">Dominantné energie</h3>
                <p className="text-xs text-slate-400 mb-3">Dominanty ukazujú, aké energie vo vašom horoskope prevládajú a formujú váš celkový prístup k životu.</p>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">Dominantný živel</span>
                      <span className="font-medium text-white">{result.dominantElement}</span>
                    </div>
                    <p className="text-xs text-slate-400">{getElementDescription(result.dominantElement)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">Dominantná kvalita</span>
                      <span className="font-medium text-white">{result.dominantQuality}</span>
                    </div>
                    <p className="text-xs text-slate-400">{getQualityDescription(result.dominantQuality)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">Dominantná planéta</span>
                      <span className="font-medium text-white">{result.dominantPlanet}</span>
                    </div>
                    <p className="text-xs text-slate-400">{getDominantPlanetDescription(result.dominantPlanet)}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-medium text-white mb-2">Mesačná fáza pri narodení</h3>
                <p className="text-lg text-indigo-300 font-serif">{result.moonPhase}</p>
                <p className="text-xs text-slate-400 mt-2">{getMoonPhaseDescription(result.moonPhase)}</p>
              </GlassCard>

              {/* Tranzity — čo sa deje TERAZ */}
              {(() => {
                const transits: TransitAspect[] = calculateTransitAspects(result);
                if (transits.length === 0) return null;
                const important = transits.filter(t => ['Jupiter', 'Saturn', 'Urán', 'Neptún', 'Pluto'].includes(t.transitPlanet));
                const personal = transits.filter(t => !['Jupiter', 'Saturn', 'Urán', 'Neptún', 'Pluto'].includes(t.transitPlanet));
                return (
                  <GlassCard>
                    <h3 className="font-medium text-white mb-2">Aktuálne tranzity</h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Planéty na oblohe práve teraz tvoria aspekty k tvojim natálnym pozíciám. Vonkajšie planéty (Jupiter–Pluto) sú dlhodobejšie a dôležitejšie.
                    </p>

                    {important.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-amber-400 uppercase font-semibold mb-2">Dlhodobé (vonkajšie planéty)</p>
                        <div className="space-y-2">
                          {important.slice(0, 6).map((t, i) => (
                            <div key={i} className={`p-3 rounded-xl border ${t.nature === 'harmonic' ? 'bg-emerald-500/10 border-emerald-500/20' : t.nature === 'tense' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-white">{t.transitPlanet} {t.symbol} {t.natalPlanet}</span>
                                <span className="text-xs text-slate-400 ml-auto">orb {t.orb.toFixed(1)}°</span>
                              </div>
                              <p className="text-xs text-slate-300">{t.meaning}</p>
                              <p className="text-[10px] text-slate-500 mt-1">Tranzit {t.transitPlanet} v {t.transitSign} → natálny {t.natalPlanet} v {t.natalSign}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {personal.length > 0 && (
                      <details>
                        <summary className="text-xs text-indigo-700 font-medium cursor-pointer hover:text-indigo-800 select-none">
                          Krátkodobé tranzity ({personal.length}) — Slnko, Mesiac, osobné planéty
                        </summary>
                        <div className="space-y-2 mt-3">
                          {personal.slice(0, 8).map((t, i) => (
                            <div key={i} className={`p-2 rounded-lg border ${t.nature === 'harmonic' ? 'bg-emerald-500/5 border-emerald-500/15' : t.nature === 'tense' ? 'bg-rose-500/5 border-rose-500/15' : 'bg-slate-500/5 border-slate-500/15'}`}>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-white">{t.transitPlanet} {t.symbol} {t.natalPlanet}</span>
                                <span className="text-[10px] text-slate-400 ml-auto">{t.orb.toFixed(1)}°</span>
                              </div>
                              <p className="text-[10px] text-slate-400">{t.meaning}</p>
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
                <h3 className="font-medium text-white mb-2">Astrologické domy (Whole Sign)</h3>
                <p className="text-xs text-slate-500 mb-3">
                  12 domov začína znamením ascendentu. Každý dom predstavuje oblasť života. Planéty v dome ukazujú, aká energia v tej oblasti pôsobí.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {result.houses.map(h => {
                    const planetsInHouse = result.planets.filter(p => result.planetHouses[p.name] === h.number);
                    return (
                      <div key={h.number} className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-700">{h.number}. {h.sign.symbol}</span>
                          <span className="text-[10px] text-slate-500">{h.sign.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">{h.theme}</p>
                        {planetsInHouse.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {planetsInHouse.map(p => (
                              <span key={p.name} title={p.name} className="text-sm">{p.symbol}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-medium text-white mb-2">Karmické uzly</h3>
                <p className="text-xs text-slate-400 mb-3">Severný uzol ukazuje smer vašej evolúcie – kam sa máte posúvať. Južný uzol je vaša komfortná zóna z minulých životov.</p>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Severný uzol (budúcnosť)</span>
                      <span className="text-sm text-indigo-300">{result.northNode.symbol} {result.northNode.name}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Smer rastu: {getNodeDescription(result.northNode.name, 'north')}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Južný uzol (minulosť)</span>
                      <span className="text-sm text-purple-300">{result.southNode.symbol} {result.southNode.name}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Vrodený talent: {getNodeDescription(result.southNode.name, 'south')}</p>
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
                <h3 className="font-medium text-white mb-2">Natálne aspekty</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Uhly medzi planétami v rámci vášho vlastného horoskopu. Každý aspekt je dialóg dvoch planét — buď harmonický (trigon, sextil), napäťový (kvadratúra, opozícia) alebo neutrálny (spojenie, ktoré planétne energie zlučuje).
                </p>

                {/* Súhrn počtu */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-green-50 border border-green-200 text-center">
                    <p className="text-[10px] uppercase text-green-700 font-semibold">Harmonické</p>
                    <p className="text-2xl font-bold text-green-700">{harmonic}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-center">
                    <p className="text-[10px] uppercase text-rose-700 font-semibold">Napäťové</p>
                    <p className="text-2xl font-bold text-rose-700">{tense}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[10px] uppercase text-slate-700 font-semibold">Neutrálne</p>
                    <p className="text-2xl font-bold text-slate-700">{neutral}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2">
                    Top 12 najpresnejších ({natalAspects.length} celkom)
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
                            <strong className="text-slate-800">{a.planet1}</strong>
                            <span className={`text-base ${iconColor}`}>{a.symbol}</span>
                            <strong className="text-slate-800">{a.planet2}</strong>
                            <span className="text-base">{planetSymbols[a.planet2] || ''}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0">orb {a.orb.toFixed(1)}°</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 italic">{a.description}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 italic mt-3">
                  Napäťové aspekty nie sú zlé — sú motorom vývoja. Harmonické sú ľahké, ale často nevedome (môžete ich brať ako samozrejmé).
                </p>
              </GlassCard>
            );
          })()}

          {(() => {
            const today = new Date();
            const transitResult = calculateAstrology(today.getDate(), today.getMonth() + 1, today.getFullYear(), 12, 0);

            const signOrder = ['Baran', 'Býk', 'Blíženci', 'Rak', 'Lev', 'Panna', 'Váhy', 'Škorpión', 'Strelec', 'Kozorožec', 'Vodnár', 'Ryby'];
            const aspectNames: Record<string, string> = {
              conjunction: 'spojenie',
              opposition: 'opozícia',
              square: 'kvadratúra',
              trine: 'trigón',
            };
            const aspectDescriptions: Record<string, string> = {
              conjunction: 'zosilňuje a aktivuje energiu',
              opposition: 'vytvára napätie a výzvu k integrácii protikladov',
              square: 'prináša tlak a potrebu konať',
              trine: 'podporuje plynulý tok a harmóniu',
            };

            function getSignIndex(signName: string): number {
              return signOrder.indexOf(signName);
            }

            function getAspect(transitSignIdx: number, natalSignIdx: number): string | null {
              const diff = Math.abs(transitSignIdx - natalSignIdx);
              const normalizedDiff = diff > 6 ? 12 - diff : diff;
              if (normalizedDiff === 0) return 'conjunction';
              if (normalizedDiff === 6) return 'opposition';
              if (normalizedDiff === 3) return 'square';
              if (normalizedDiff === 4) return 'trine';
              return null;
            }

            const aspects: { transitPlanet: string; transitSign: string; natalPlanet: string; natalSign: string; aspect: string }[] = [];
            const outerTransitPlanets = transitResult.planets.filter(p => ['Jupiter', 'Saturn', 'Urán', 'Neptún', 'Pluto'].includes(p.name));

            outerTransitPlanets.forEach(transit => {
              const transitIdx = getSignIndex(transit.sign.name);
              result.planets.forEach(natal => {
                const natalIdx = getSignIndex(natal.sign.name);
                const aspect = getAspect(transitIdx, natalIdx);
                if (aspect) {
                  aspects.push({
                    transitPlanet: transit.name,
                    transitSign: transit.sign.name,
                    natalPlanet: natal.name,
                    natalSign: natal.sign.name,
                    aspect,
                  });
                }
              });
            });

            if (aspects.length === 0) return null;

            return (
              <GlassCard>
                <h3 className="font-medium text-white mb-2">Aktuálne tranzity</h3>
                <p className="text-xs text-slate-400 mb-4">Porovnanie aktuálnych planetárnych pozícií s vaším natálnym horoskopom</p>
                <div className="space-y-2">
                  {aspects.map((a, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                    >
                      <p className="text-sm text-slate-300">
                        Transit <strong className="text-cyan-300">{a.transitPlanet}</strong> v {a.transitSign} aspektuje váš natálny <strong className="text-indigo-300">{a.natalPlanet}</strong> v {a.natalSign} (<span className="text-amber-300">{aspectNames[a.aspect]}</span>)
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {aspectDescriptions[a.aspect]} – {a.aspect === 'conjunction' ? 'obdobie intenzívnej aktivácie tejto energie vo vašom živote' : a.aspect === 'opposition' ? 'obdobie testovania a hľadania rovnováhy' : a.aspect === 'square' ? 'obdobie testovania vašej energie a trpezlivosti' : 'obdobie podpory a rastu v tejto oblasti'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            );
          })()}

          {/* AI výklad astrológie */}
          {profile && (
            <AIChat
              context={{
                name: profile.name,
                gender: profile.gender,
                birth: {
                  day: profile.birthDay,
                  month: profile.birthMonth,
                  year: profile.birthYear,
                  hour: profile.birthHour,
                  minute: profile.birthMinute,
                  place: profile.birthPlace,
                },
                astrology: result,
                chineseZodiac: calculateChineseZodiac(profile.birthYear),
              }}
              title="✦ AI výklad astrológie"
              initialUserMessage={`Vyhotov mi prosím detailný astrologický výklad. Moje Slnko je v ${result.sunSign.name}, Mesiac v ${result.moonSign.name}, Ascendent v ${result.ascendant.name}. Dominantný element: ${result.dominantElement}. V čínskom horoskope som ${calculateChineseZodiac(profile.birthYear).animal} (${calculateChineseZodiac(profile.birthYear).element}). Prepoj západnú a východnú astrológiu do jedného príbehu.`}
              storageKey={`astrology-${profile.id}`}
            />
          )}

          {manualResult && (
            <button
              onClick={() => setManualResult(null)}
              className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white"
            >
              Nový výpočet
            </button>
          )}
        </div>
      )}
    </div>
  );
}
