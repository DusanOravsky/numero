import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubject } from '../hooks/useSubject';
import { GlassCard } from '../components/GlassCard';
import { EnergyCard } from '../components/EnergyCard';
import { DateInput } from '../components/DateInput';
import { calculateHumanDesign, CENTER_THEMES } from '../engine/humanDesignEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import { Bodygraph } from '../components/Bodygraph';
import { motion } from 'framer-motion';
import { getGeneKeysForGates } from '../data/geneKeys';
import { getHDLine, getHDProfilePhase, getHDAuthorityInfo, getHDDefinitionInfo } from '../data/hdLines';
import type { GeneKey } from '../data/geneKeys';
import { useTranslation } from '../i18n/useTranslation';
import { displayName, HD_TYPE_DISPLAY, HD_AUTHORITY_DISPLAY, HD_CENTER_DISPLAY, HD_STRATEGY_DISPLAY, HD_NOT_SELF_THEME_DISPLAY, HD_CHANNEL_DISPLAY } from '../i18n/entityNames';
import type { Language } from '../store/useStore';

function getTypeDescription(type: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Manifestor': 'Manifestori sú tu na to, aby začínali a iniciovali. Majú uzavretú a odpudzujúcu auru – nie sú tu na to, aby čakali. Ich úlohou je informovať ostatných pred konaním, čím redukujú odpor okolia. Tvoria asi 9% populácie.',
    'Generátor': 'Generátori sú životná sila planéty – majú nekonečnú energiu sakrálneho centra. Sú tu na to, aby reagovali na to, čo im život prináša. Keď robia prácu, ktorú milujú, sú neúnavní. Tvoria asi 37% populácie.',
    'Manifestujúci Generátor': 'Manifestujúci Generátori kombinujú energiu Generátora s iniciatívou Manifestora. Sú multi-talentovaní a rýchli. Musia reagovať AJ informovať. Tvoria asi 33% populácie.',
    'Projektor': 'Projektori sú tu na to, aby viedli a riadili energiu ostatných. Nemajú konzistentnú vlastnú energiu, ale vidia systémy a ľudí hlboko. Musia čakať na pozvanie do veľkých životných rozhodnutí. Tvoria asi 20% populácie.',
    'Reflektor': 'Reflektori sú najvzácnejší typ – nemajú žiadne definované centrá a odrážajú prostredie okolo seba. Sú barometrom zdravia komunity. Musia čakať 28 dní (lunárny cyklus) pred veľkými rozhodnutiami. Tvoria asi 1% populácie.',
  };
  const en: Record<string, string> = {
    'Manifestor': 'Manifestors are here to initiate and start things. They have a closed and repelling aura — they are not here to wait. Their role is to inform others before acting, which reduces resistance. They make up about 9% of the population.',
    'Generátor': 'Generators are the life force of the planet — they have the inexhaustible energy of the sacral center. They are here to respond to what life brings them. When doing work they love, they are tireless. They make up about 37% of the population.',
    'Manifestujúci Generátor': 'Manifesting Generators combine the energy of a Generator with the initiative of a Manifestor. They are multi-talented and fast. They must respond AND inform. They make up about 33% of the population.',
    'Projektor': 'Projectors are here to guide and direct the energy of others. They do not have consistent energy of their own, but they see systems and people deeply. They must wait for an invitation for major life decisions. They make up about 20% of the population.',
    'Reflektor': 'Reflectors are the rarest type — they have no defined centers and mirror the environment around them. They are a barometer of community health. They must wait 28 days (lunar cycle) before making major decisions. They make up about 1% of the population.',
  };
  return (lang === 'en' ? en : sk)[type] ?? '';
}

function getAuthorityDescription(authority: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Emocionálna': 'Vaša pravda sa odhaľuje v čase. Nikdy nerozhodujte v emočnom výkyve – čakajte na emocionálnu jasnosť. Vaša vlna má výkyvy a pravda prichádza v neutrálnom bode.',
    'Sakrálna': 'Váš sakrálny hlas (uh-huh/unh-unh) je vašou pravdou. Reagujte zvukom z brucha na áno/nie otázky. Telo vie skôr ako myseľ.',
    'Slezinová': 'Vaša intuícia je momentálna – hovorí v prítomnom okamihu. Ak ignorujete prvý impulz, stratíte ho. Dôverujte spontánnym pocitom a "viem len tak".',
    'Ego': 'Vaša autorita je sila vôle. Pýtajte sa: "Je to niečo, čomu chcem zaviazať svoju vôľu?" Dodržiavajte sľuby, ale sľubujte len to, čo naozaj chcete.',
    'Sebaprojektovaná': 'Hovorte o veciach nahlas – vaša pravda sa vám odhalí cez váš vlastný hlas. Počúvajte, čo hovoríte, nie čo si myslíte.',
    'Mentálna/Environmentálna': 'Vaša autorita je vonkajšia – potrebujete správne prostredie a dôveryhodných zvukových partnerov na to, aby ste sa počuli a rozhodli.',
    'Lunárna': 'Čakajte 28 dní (celý lunárny cyklus) pred veľkými rozhodnutiami. Diskutujte so ľuďmi, ktorým dôverujete, počas celého cyklu.',
  };
  const en: Record<string, string> = {
    'Emocionálna': 'Your truth reveals itself over time. Never decide in an emotional wave — wait for emotional clarity. Your wave has ups and downs, and truth comes at the neutral point.',
    'Sakrálna': 'Your sacral voice (uh-huh/unh-unh) is your truth. Respond with gut sounds to yes/no questions. The body knows before the mind.',
    'Slezinová': 'Your intuition is instantaneous — it speaks in the present moment. If you ignore the first impulse, you lose it. Trust spontaneous feelings and "just knowing".',
    'Ego': 'Your authority is willpower. Ask yourself: "Is this something I want to commit my will to?" Keep promises, but only promise what you truly want.',
    'Sebaprojektovaná': 'Speak about things out loud — your truth reveals itself through your own voice. Listen to what you say, not what you think.',
    'Mentálna/Environmentálna': 'Your authority is external — you need the right environment and trusted sounding partners to hear yourself and decide.',
    'Lunárna': 'Wait 28 days (a full lunar cycle) before major decisions. Discuss with people you trust throughout the entire cycle.',
  };
  return (lang === 'en' ? en : sk)[authority] ?? '';
}

function getGateDescription(gate: number, lang: Language): string {
  const sk: Record<number, string> = {
    1: 'Brána sebavyjadrenia - schopnosť byť autentický a vyjadriť svoju jedinečnú tvorivú silu',
    2: 'Brána smerovania seba - vnútorný kompas, ktorý vás vedie správnym smerom v živote',
    3: 'Brána poriadku a inovácie - schopnosť prinášať nový poriadok do chaosu a inovovať',
    4: 'Brána mentálnych riešení - logické myslenie a hľadanie odpovedí na životné otázky',
    5: 'Brána univerzálnych vzorcov - schopnosť vnímať a nasledovať prirodzené rytmy života',
    6: 'Brána emocionálnej intimity - hlboké citové spojenie a schopnosť otvoriť sa druhým',
    7: 'Brána interakcie a vedenia - prirodzená schopnosť viesť ostatných svojím príkladom',
    8: 'Brána príspevku - túžba prispieť niečím hodnotným do sveta a zanechať stopu',
    9: 'Brána sústredenia a detailov - schopnosť hlbokého zamerania na detaily a vzorce',
    10: 'Brána sebalásky a správania - láska k sebe a autentické správanie v súlade s vlastnou pravdou',
    11: 'Brána myšlienok a pokoja - bohatý vnútorný svet ideí a schopnosť nájsť pokoj v mysli',
    12: 'Brána opatrnosti a vyjadrenia - vedieť kedy hovoriť a kedy mlčať, umenie správneho načasovania',
    13: 'Brána načúvania a pamäte - schopnosť počúvať príbehy druhých a uchovávať múdrosť skúseností',
    14: 'Brána schopností a smerovania - vnútorná sila a zdroje na realizáciu svojho životného smeru',
    15: 'Brána extrémov a lásky k ľudstvu - schopnosť prijať rozmanitosť a milovať ľudstvo v jeho pestrosti',
    16: 'Brána zručností a entuziazmu - nadšenie pre zdokonaľovanie schopností a majstrovstvo',
    17: 'Brána nasledovania a názorov - schopnosť formulovať a zdieľať logické názory a pohľady',
    18: 'Brána nápravy a úsudku - vnútorná potreba zlepšovať a korigovať to, čo nefunguje',
    19: 'Brána túžby a citlivosti - hlboká citlivosť k potrebám druhých a túžba po prepojení',
    20: 'Brána prítomnosti a kontemplácie - schopnosť byť plne prítomný v tomto okamihu',
    21: 'Brána kontroly a lovca - vôľa ovládať svoje prostredie a dosahovať ciele vlastnou silou',
    22: 'Brána pôvabu a otvorenosti - emocionálna hĺbka a schopnosť dotknúť sa druhých svojím prejavom',
    23: 'Brána asimilácie a rozdeľovania - schopnosť zjednodušiť zložité veci a oddeliť podstatné od nepodstatného',
    24: 'Brána racionalizácie a návratu - mentálny proces prehodnocovania a hľadania nového pochopenia',
    25: 'Brána nevinnosti a ducha - čistá láska k životu a spojenie s vyšším duchovným princípom',
    26: 'Brána skrotenia sily a egoizmu - schopnosť strategicky využívať svoje zdroje a presvedčiť ostatných',
    27: 'Brána výživy a starostlivosti - hlboká potreba starať sa o druhých a živiť to, čo rastie',
    28: 'Brána zápasu a hráča - odvaha riskovať a hľadať zmysel aj v náročných životných situáciách',
    29: 'Brána záväzku a vytrvalosti - schopnosť oddať sa niečomu a vytrvať aj napriek prekážkam',
    30: 'Brána túžby a pocitov - hlboké emočné prežívanie a túžba po nových skúsenostiach',
    31: 'Brána vplyvu a vedenia - prirodzená autorita, ktorá inšpiruje ostatných nasledovať',
    32: 'Brána kontinuity a vytrvalosti - schopnosť rozpoznať, čo má trvalú hodnotu a vytrvať',
    33: 'Brána ústupu a súkromia - múdrosť vedieť kedy sa stiahnuť a spracovať skúsenosti v tichu',
    34: 'Brána sily a čistej energie - obrovská životná sila a energia na individuálne dosiahnutie',
    35: 'Brána zmeny a pokroku - neustála túžba po nových zážitkoch a posúvaní sa vpred',
    36: 'Brána krízy a emocionálnej hĺbky - schopnosť prechádzať krízami a nachádzať v nich rast',
    37: 'Brána rodiny a priateľstva - vytváranie harmonických vzťahov založených na dôvere a vernosti',
    38: 'Brána bojovníka a opozície - odvaha stáť si za svojím a bojovať za to, čo má zmysel',
    39: 'Brána provokácie a ducha - schopnosť provokovať rast u seba aj druhých cez výzvy',
    40: 'Brána samoty a odovzdania - potreba času osamote a schopnosť poskytnúť zdroje komunite',
    41: 'Brána fantázie a zmenšovania - bohatá imaginácia a schopnosť začínať nové emocionálne cykly',
    42: 'Brána rastu a dokončenia - schopnosť dokončiť začaté a nájsť v tom naplnenie',
    43: 'Brána vhľadu a prielomu - unikátne mentálne prieniky a schopnosť vidieť veci inak ako ostatní',
    44: 'Brána bdelosti a rozpoznávania vzorcov - intuitívne rozpoznanie opakujúcich sa vzorcov a ich využitie',
    45: 'Brána zhromažďovania a vládcu - prirodzená schopnosť zhromažďovať zdroje a viesť komunitu',
    46: 'Brána sebaurčenia a tela - hlboké spojenie s telom a dôvera v správny čas a miesto',
    47: 'Brána realizácie a porozumenia - schopnosť nájsť zmysel v abstraktných skúsenostiach a zážitkoch',
    48: 'Brána hĺbky a múdrosti - hlboké studne poznania a túžba po dokonalom pochopení',
    49: 'Brána revolúcie a princípov - schopnosť transformovať vzťahy a spoločnosť na základe princípov',
    50: 'Brána hodnôt a strážcu - ochrana hodnôt komunity a zodpovednosť za blaho druhých',
    51: 'Brána šoku a iniciatívy - odvaha čeliť neočakávanému a iniciovat individuálnu transformáciu',
    52: 'Brána nehybnosti a koncentrácie - schopnosť hlbokého sústredenia a pokoja v tichu',
    53: 'Brána začiatku a vývoja - energia nových cyklov a schopnosť začínať nové kapitoly',
    54: 'Brána ambícií a honby - silná vnútorná motivácia a ambícia dosiahnuť duchovný aj materiálny vzostup',
    55: 'Brána hojnosti a ducha - emocionálna hĺbka a schopnosť nájsť hojnosť vo vnútornom svete',
    56: 'Brána stimulácie a rozprávania príbehov - dar rozprávačstva a schopnosť obohatiť druhých príbehmi',
    57: 'Brána intuitívneho vhľadu a jasnosti - okamžitá intuitívna jasnosť a schopnosť vycítiť nebezpečenstvo',
    58: 'Brána radosti a vitality - životná radosť a energia, ktorá inšpiruje k zlepšovaniu kvality života',
    59: 'Brána intimity a sexuality - schopnosť prelamovať bariéry a vytvárať hlboké intímne spojenia',
    60: 'Brána obmedzenia a prijatia - múdrosť prijať obmedzenia ako priestor pre kreatívnu mutáciu',
    61: 'Brána vnútornej pravdy a tajomstva - hlboká túžba poznať vnútornú pravdu a tajomstvá univerza',
    62: 'Brána detailov a vyjadrenia - schopnosť presne pomenovať a vyjadriť fakty a detaily',
    63: 'Brána pochybností a logiky - logické otázky a pochybnosti, ktoré vedú k hlbšiemu porozumeniu',
    64: 'Brána zmätku a imaginácie - bohatá vizuálna imaginácia a schopnosť nájsť poriadok v zmätku',
  };
  const en: Record<number, string> = {
    1: 'Gate of Self-Expression - ability to be authentic and express your unique creative power',
    2: 'Gate of Self-Direction - inner compass that guides you in the right direction in life',
    3: 'Gate of Ordering & Innovation - ability to bring new order from chaos and innovate',
    4: 'Gate of Mental Solutions - logical thinking and finding answers to life questions',
    5: 'Gate of Universal Patterns - ability to perceive and follow natural rhythms of life',
    6: 'Gate of Emotional Intimacy - deep emotional connection and ability to open up to others',
    7: 'Gate of Interaction & Leadership - natural ability to lead others by example',
    8: 'Gate of Contribution - desire to contribute something valuable to the world and leave a mark',
    9: 'Gate of Focus & Detail - ability to deeply focus on details and patterns',
    10: 'Gate of Self-Love & Behavior - love of self and authentic behavior in alignment with your truth',
    11: 'Gate of Ideas & Peace - rich inner world of ideas and ability to find peace of mind',
    12: 'Gate of Caution & Expression - knowing when to speak and when to be silent, the art of right timing',
    13: 'Gate of Listening & Memory - ability to listen to others\' stories and preserve the wisdom of experience',
    14: 'Gate of Skills & Direction - inner strength and resources to realize your life direction',
    15: 'Gate of Extremes & Love of Humanity - ability to embrace diversity and love humanity in its richness',
    16: 'Gate of Skills & Enthusiasm - enthusiasm for perfecting abilities and mastery',
    17: 'Gate of Following & Opinions - ability to formulate and share logical opinions and perspectives',
    18: 'Gate of Correction & Judgment - inner need to improve and correct what does not work',
    19: 'Gate of Longing & Sensitivity - deep sensitivity to others\' needs and desire for connection',
    20: 'Gate of Presence & Contemplation - ability to be fully present in this moment',
    21: 'Gate of Control & the Hunter - will to control your environment and achieve goals by your own strength',
    22: 'Gate of Grace & Openness - emotional depth and ability to touch others with your expression',
    23: 'Gate of Assimilation & Splitting - ability to simplify complex things and separate essential from non-essential',
    24: 'Gate of Rationalization & Return - mental process of re-evaluation and finding new understanding',
    25: 'Gate of Innocence & Spirit - pure love of life and connection to a higher spiritual principle',
    26: 'Gate of Taming Power & Ego - ability to strategically use your resources and convince others',
    27: 'Gate of Nourishment & Caring - deep need to care for others and nourish what grows',
    28: 'Gate of Struggle & the Player - courage to risk and find meaning even in challenging life situations',
    29: 'Gate of Commitment & Perseverance - ability to devote yourself to something and persist despite obstacles',
    30: 'Gate of Desire & Feelings - deep emotional experience and longing for new experiences',
    31: 'Gate of Influence & Leadership - natural authority that inspires others to follow',
    32: 'Gate of Continuity & Persistence - ability to recognize what has lasting value and persist',
    33: 'Gate of Retreat & Privacy - wisdom of knowing when to withdraw and process experiences in silence',
    34: 'Gate of Power & Pure Energy - enormous life force and energy for individual achievement',
    35: 'Gate of Change & Progress - constant desire for new experiences and moving forward',
    36: 'Gate of Crisis & Emotional Depth - ability to go through crises and find growth in them',
    37: 'Gate of Family & Friendship - creating harmonious relationships based on trust and loyalty',
    38: 'Gate of the Warrior & Opposition - courage to stand your ground and fight for what matters',
    39: 'Gate of Provocation & Spirit - ability to provoke growth in yourself and others through challenges',
    40: 'Gate of Solitude & Surrender - need for alone time and ability to provide resources to the community',
    41: 'Gate of Fantasy & Contraction - rich imagination and ability to start new emotional cycles',
    42: 'Gate of Growth & Completion - ability to complete what was started and find fulfillment in it',
    43: 'Gate of Insight & Breakthrough - unique mental breakthroughs and ability to see things differently from others',
    44: 'Gate of Alertness & Pattern Recognition - intuitive recognition of repeating patterns and their use',
    45: 'Gate of Gathering & the Ruler - natural ability to gather resources and lead community',
    46: 'Gate of Self-Determination & Body - deep connection with the body and trust in the right time and place',
    47: 'Gate of Realization & Understanding - ability to find meaning in abstract experiences',
    48: 'Gate of Depth & Wisdom - deep wells of knowledge and desire for complete understanding',
    49: 'Gate of Revolution & Principles - ability to transform relationships and society based on principles',
    50: 'Gate of Values & the Guardian - protecting community values and responsibility for others\' well-being',
    51: 'Gate of Shock & Initiative - courage to face the unexpected and initiate individual transformation',
    52: 'Gate of Stillness & Concentration - ability for deep focus and peace in silence',
    53: 'Gate of Beginnings & Development - energy of new cycles and ability to start new chapters',
    54: 'Gate of Ambition & Drive - strong inner motivation and ambition for spiritual and material ascent',
    55: 'Gate of Abundance & Spirit - emotional depth and ability to find abundance in the inner world',
    56: 'Gate of Stimulation & Storytelling - gift of storytelling and ability to enrich others with stories',
    57: 'Gate of Intuitive Insight & Clarity - instant intuitive clarity and ability to sense danger',
    58: 'Gate of Joy & Vitality - life joy and energy that inspires improving quality of life',
    59: 'Gate of Intimacy & Sexuality - ability to break barriers and create deep intimate connections',
    60: 'Gate of Limitation & Acceptance - wisdom to accept limitations as space for creative mutation',
    61: 'Gate of Inner Truth & Mystery - deep desire to know inner truth and mysteries of the universe',
    62: 'Gate of Details & Expression - ability to precisely name and express facts and details',
    63: 'Gate of Doubt & Logic - logical questions and doubts that lead to deeper understanding',
    64: 'Gate of Confusion & Imagination - rich visual imagination and ability to find order in confusion',
  };
  return (lang === 'en' ? en : sk)[gate] ?? '';
}

function getStrategyDescription(strategy: string, lang: Language): string {
  const sk: Record<string, string> = {
    'Informovať': 'Pred konaním informujte ľudí, ktorých sa to týka. Nemusíte žiadať o povolenie, ale informovanie redukuje odpor.',
    'Reagovať': 'Čakajte na niečo, na čo môžete reagovať – situáciu, otázku, ponuku. Neinicinujte z hlavy. Vaše sakrálne centrum vám povie áno alebo nie.',
    'Reagovať a informovať': 'Reagujte na podnety zo života a pred konaním informujte tých, na ktorých má dopad. Kombinácia oboch prístupov.',
    'Čakať na pozvanie': 'Čakajte na formálne pozvanie do veľkých životných oblastí (kariéra, vzťahy, bývanie). V medzičase kultivujte svoju múdrosť a systémy.',
    'Čakať 28 dní': 'Pred veľkými rozhodnutiami prečkajte celý lunárny cyklus. Diskutujte s dôveryhodnými ľuďmi. Až po 28 dňoch sa rozhodnite.',
  };
  const en: Record<string, string> = {
    'Informovať': 'Inform people affected before acting. You don\'t need to ask permission, but informing reduces resistance.',
    'Reagovať': 'Wait for something to respond to — a situation, question, offer. Don\'t initiate from the mind. Your sacral center will tell you yes or no.',
    'Reagovať a informovať': 'Respond to life\'s prompts and inform those affected before acting. A combination of both approaches.',
    'Čakať na pozvanie': 'Wait for a formal invitation into major life areas (career, relationships, living). Meanwhile, cultivate your wisdom and systems.',
    'Čakať 28 dní': 'Before major decisions, wait through a full lunar cycle. Discuss with trusted people. Decide only after 28 days.',
  };
  return (lang === 'en' ? en : sk)[strategy] ?? '';
}

export function HumanDesignPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const subject = useSubject();
  const [manualResult, setManualResult] = useState<HumanDesignResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'genekeys'>('overview');

  const profileResult = useMemo<HumanDesignResult | null>(() => {
    if (!subject) return null;
    return calculateHumanDesign(
      subject.birthDay, subject.birthMonth, subject.birthYear,
      subject.birthHour ?? 12, subject.birthMinute ?? 0,
      subject.timezoneOffset
    );
  }, [subject]);

  const result = manualResult ?? profileResult;

  const handleCalculate = (day: number, month: number, year: number, hour?: number, minute?: number, lat?: number, lon?: number) => {
    // Pri manuálnom výpočte odhadneme tz z lon ak je dostupný, inak default CET.
    const tz = lon !== undefined ? Math.round(lon / 15) : 1;
    setManualResult(calculateHumanDesign(day, month, year, hour ?? 12, minute ?? 0, tz));
    void lat;
  };

  const typeColors: Record<string, string> = {
    'Manifestor': 'from-red-500/20 to-rose-500/20',
    'Generátor': 'from-orange-500/20 to-amber-500/20',
    'Manifestujúci Generátor': 'from-yellow-500/20 to-orange-500/20',
    'Projektor': 'from-blue-500/20 to-indigo-500/20',
    'Reflektor': 'from-white/10 to-slate-500/20',
  };

  return (
    <div className="space-y-6">
      <div>
        {subject?.isClient && (
          <button
            onClick={() => navigate(`/clients/${subject.id}`)}
            className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-flex items-center gap-1"
          >
            ← {t('clients.backToClient')} {subject.name}
          </button>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl font-bold text-white">{t('hd.title')}</h1>
          {subject?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              {language === 'sk' ? 'Klient' : 'Client'}: <strong>{subject.name}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          {subject?.isClient
            ? (language === 'sk' ? `Energetický plán klienta ${subject.name}` : `Energy blueprint for ${subject.name}`)
            : (language === 'sk' ? 'Váš energetický plán' : 'Your energy blueprint')}
        </p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} showTime showPlace label={language === 'sk' ? 'Dátum a čas narodenia (pre presný HD)' : 'Date and time of birth (for accurate HD)'} />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white glow'
                  : 'glass text-slate-400 hover:text-white'
              }`}
            >
              {t('hd.tabOverview')}
            </button>
            <button
              onClick={() => setActiveTab('genekeys')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'genekeys'
                  ? 'bg-indigo-600 text-white glow'
                  : 'glass text-slate-400 hover:text-white'
              }`}
            >
              {t('hd.tabGeneKeys')}
            </button>
            {manualResult && (
              <button
                onClick={() => setManualResult(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white ml-auto"
              >
                {t('common.newCalculation')}
              </button>
            )}
          </div>

          {activeTab === 'overview' && (
            <GlassCard>
              <p className="text-sm text-slate-400">
                <strong className="text-white">Human Design</strong> {language === 'sk'
                  ? 'je systém sebapoznania, ktorý kombinuje astrológiu, I-Ching, Kabalu, hinduistický systém čakier a kvantovú fyziku. Ukazuje, ako ste energeticky navrhnutí -- ako správne rozhodovať, kde máte konzistentnú energiu a kde ste otvorení vonkajším vplyvom.'
                  : 'is a self-knowledge system that combines astrology, I-Ching, Kabbalah, the Hindu chakra system, and quantum physics. It shows how you are energetically designed — how to make correct decisions, where you have consistent energy, and where you are open to external influences.'}
              </p>
            </GlassCard>
          )}

          {activeTab === 'overview' && <>
          {/* Jednoducho povedané — personalizované takeaway */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{t('hd.whatToTakeAway')}</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                {language === 'sk'
                  ? <>Tvoj Human Design ti hovorí <strong className="text-white">tri praktické veci</strong>, ktoré môžeš hneď začať používať:</>
                  : <>Your Human Design tells you <strong className="text-white">three practical things</strong> you can start using right away:</>}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                  <p className="text-xs text-indigo-700 font-semibold mb-1">{language === 'sk' ? '1. Ako rozhodovať' : '1. How to decide'}</p>
                  <p className="text-xs text-slate-700">
                    {language === 'sk'
                      ? <>Tvoja autorita (<strong>{displayName(HD_AUTHORITY_DISPLAY, result.authority, language)}</strong>) ti ukazuje, ako sa dopracovať k správnemu rozhodnutiu — nie hlavou, ale {result.authority === 'Emocionálna' ? 'čakaním na emocionálnu jasnosť' : result.authority === 'Sakrálna' ? 'reakciou z brucha (uh-huh / unh-unh)' : result.authority === 'Slezinová' ? 'prvotnou intuíciou v momente' : 'tvojím vnútorným kompasom'}.</>
                      : <>Your authority (<strong>{displayName(HD_AUTHORITY_DISPLAY, result.authority, language)}</strong>) shows you how to reach correct decisions — not with the mind, but {result.authority === 'Emocionálna' ? 'by waiting for emotional clarity' : result.authority === 'Sakrálna' ? 'by gut response (uh-huh / unh-unh)' : result.authority === 'Slezinová' ? 'by first intuitive hit in the moment' : 'through your inner compass'}.</>}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-xs text-emerald-700 font-semibold mb-1">{language === 'sk' ? '2. Ako fungovať vo svete' : '2. How to operate in the world'}</p>
                  <p className="text-xs text-slate-700">
                    {language === 'sk'
                      ? <>Ako <strong>{displayName(HD_TYPE_DISPLAY, result.type, language)}</strong> je tvoja stratégia „<strong>{displayName(HD_STRATEGY_DISPLAY, result.strategy, language).toLowerCase()}</strong>". To nie je obmedzenie — je to spôsob, ako sa ti otvárajú správne príležitosti.</>
                      : <>As a <strong>{displayName(HD_TYPE_DISPLAY, result.type, language)}</strong>, your strategy is "<strong>{displayName(HD_STRATEGY_DISPLAY, result.strategy, language).toLowerCase()}</strong>". This is not a limitation — it is how the right opportunities open up for you.</>}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <p className="text-xs text-rose-700 font-semibold mb-1">{language === 'sk' ? '3. Kedy niečo nie je pre teba' : '3. When something is not for you'}</p>
                  <p className="text-xs text-slate-700">
                    {language === 'sk'
                      ? <>Keď cítiš „<strong>{displayName(HD_NOT_SELF_THEME_DISPLAY, result.notSelfTheme, language).toLowerCase()}</strong>" — je to signál, že žiješ mimo svoj dizajn. Nie je to chyba, len navigačný bod.</>
                      : <>When you feel "<strong>{displayName(HD_NOT_SELF_THEME_DISPLAY, result.notSelfTheme, language).toLowerCase()}</strong>" — it is a signal that you are living outside your design. It is not a mistake, just a navigation point.</>}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Tvoje čítanie — personalizovaný sprievodca HD */}
          <GlassCard>
            <details open>
              <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
                <span className="font-medium text-white">{t('hd.yourReading')}</span>
              </summary>
              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-400">
                  {language === 'sk'
                    ? 'Human Design nie je návod „ako byť". Je to mapa tvojho energetického systému — ukazuje, ako si navrhnutý fungovať, keď si v súlade sám so sebou. Nie je čo opravovať, len pochopiť.'
                    : 'Human Design is not a manual on "how to be". It is a map of your energy system — it shows how you are designed to function when aligned with yourself. There is nothing to fix, only to understand.'}
                </p>

                {/* Hlavný typ + stratégia */}
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-xs font-semibold text-indigo-300 mb-1">
                    {language === 'sk'
                      ? <>Si {displayName(HD_TYPE_DISPLAY, result.type, language)} — tvoja stratégia: „{displayName(HD_STRATEGY_DISPLAY, result.strategy, language).toLowerCase()}"</>
                      : <>You are a {displayName(HD_TYPE_DISPLAY, result.type, language)} — your strategy: "{displayName(HD_STRATEGY_DISPLAY, result.strategy, language).toLowerCase()}"</>}
                  </p>
                  <p className="text-xs text-slate-300">{getTypeDescription(result.type, language)}</p>
                  <p className="text-xs text-slate-400 mt-2 italic">
                    {language === 'sk'
                      ? <>Prakticky: {result.type === 'Generátor' || result.type === 'Manifestujúci Generátor'
                        ? 'Čakaj na veci, na ktoré reaguješ „áno" z brucha. Neinicializuj z hlavy — nechaj život prísť k tebe.'
                        : result.type === 'Manifestor'
                        ? 'Konaj keď cítiš vnútorný impulz, ale informuj ľudí okolo seba predtým. Redukuje to odpor.'
                        : result.type === 'Projektor'
                        ? 'Kultivuj svoju múdrosť a videnie. Veľké príležitosti prídu ako pozvanie — netreba sa pretláčať.'
                        : 'Daj si 28 dní pred veľkými rozhodnutiami. Diskutuj s ľuďmi, ktorým veríš.'}</>
                      : <>Practically: {result.type === 'Generátor' || result.type === 'Manifestujúci Generátor'
                        ? 'Wait for things you respond to with a "yes" from your gut. Don\'t initiate from the mind — let life come to you.'
                        : result.type === 'Manifestor'
                        ? 'Act when you feel the inner impulse, but inform people around you beforehand. It reduces resistance.'
                        : result.type === 'Projektor'
                        ? 'Cultivate your wisdom and vision. Big opportunities come as invitations — no need to push through.'
                        : 'Give yourself 28 days before major decisions. Discuss with people you trust.'}</>}
                  </p>
                </div>

                {/* Autorita */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-semibold text-emerald-300 mb-1">
                    {language === 'sk' ? 'Tvoja autorita' : 'Your authority'}: {displayName(HD_AUTHORITY_DISPLAY, result.authority, language)}
                  </p>
                  <p className="text-xs text-slate-300">{getAuthorityDescription(result.authority, language)}</p>
                </div>

                {/* Otvorené centrá — kde si zraniteľný */}
                {result.openCenters.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs font-semibold text-amber-300 mb-2">
                      {language === 'sk'
                        ? `Tvoje otvorené centrá (${result.openCenters.length}): kde absorbujuješ cudziu energiu`
                        : `Your open centers (${result.openCenters.length}): where you absorb others' energy`}
                    </p>
                    <p className="text-[11px] text-slate-400 mb-2">
                      {language === 'sk'
                        ? 'V týchto oblastiach si ovplyvniteľný okolím. Kľúčová otázka pri každom: „Je toto moja energia, alebo ju beriem od niekoho iného?"'
                        : 'In these areas you are influenced by your environment. Key question for each: "Is this my energy, or am I taking it from someone else?"'}
                    </p>
                    <div className="space-y-1.5">
                      {result.openCenters.map(c => (
                        <div key={c} className="pl-3 border-l-2 border-amber-500/30">
                          <p className="text-[11px] text-slate-300">
                            <strong className="text-amber-300">{displayName(HD_CENTER_DISPLAY, c, language)}</strong> — {CENTER_THEMES[c] || ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nie-ja téma */}
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-xs font-semibold text-rose-300 mb-1">
                    {language === 'sk'
                      ? `Keď cítiš „${displayName(HD_NOT_SELF_THEME_DISPLAY, result.notSelfTheme, language).toLowerCase()}" — žiješ mimo dizajn`
                      : `When you feel "${displayName(HD_NOT_SELF_THEME_DISPLAY, result.notSelfTheme, language).toLowerCase()}" — you are living outside your design`}
                  </p>
                  <p className="text-xs text-slate-300">
                    {language === 'sk'
                      ? `Nie je to chyba ani problém. Je to navigačný signál — niečo v tvojom živote nefunguje podľa tvojho dizajnu. Vráť sa k stratégii (${displayName(HD_STRATEGY_DISPLAY, result.strategy, language).toLowerCase()}) a autorite (${displayName(HD_AUTHORITY_DISPLAY, result.authority, language).toLowerCase()}).`
                      : `This is not a mistake or a problem. It is a navigation signal — something in your life is not working according to your design. Return to your strategy (${displayName(HD_STRATEGY_DISPLAY, result.strategy, language).toLowerCase()}) and authority (${displayName(HD_AUTHORITY_DISPLAY, result.authority, language).toLowerCase()}).`}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">{language === 'sk' ? 'Praktický tip' : 'Practical tip'}</p>
                  <p className="text-xs text-slate-300">
                    {language === 'sk'
                      ? 'Nezačínaj od brán a kanálov — začni od stratégie a autority. To sú tvoje dva najdôležitejšie nástroje na každý deň. Všetko ostatné je kontext.'
                      : 'Don\'t start with gates and channels — start with strategy and authority. These are your two most important daily tools. Everything else is context.'}
                  </p>
                </div>
              </div>
            </details>
          </GlassCard>

          <GlassCard glow>
            <div className={`p-6 rounded-xl bg-gradient-to-br ${typeColors[result.type] || typeColors['Generátor']}`}>
              <p className="text-xs uppercase tracking-wider text-slate-500">{t('hd.yourType')}</p>
              <h2 className="font-serif text-3xl font-bold mt-1 text-slate-900">{displayName(HD_TYPE_DISPLAY, result.type, language)}</h2>
              <p className="text-sm mt-2 text-slate-700">{getTypeDescription(result.type, language)}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">{t('hd.strategy')}</p>
                  <p className="text-sm font-medium text-slate-900">{displayName(HD_STRATEGY_DISPLAY, result.strategy, language)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">{t('hd.authority')}</p>
                  <p className="text-sm font-medium text-slate-900">{displayName(HD_AUTHORITY_DISPLAY, result.authority, language)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">{t('hd.notSelfTheme')}</p>
                  <p className="text-sm font-medium text-rose-600">{displayName(HD_NOT_SELF_THEME_DISPLAY, result.notSelfTheme, language)}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnergyCard title={t('hd.profile')} value={`${result.profile.line1}/${result.profile.line2}`} subtitle={result.profile.name} color="indigo" delay={0.1} />
            <EnergyCard title={t('hd.cross')} value="✝" subtitle={result.incarnationCross} color="gold" delay={0.2} />
            <EnergyCard title={t('hd.definedCenters')} value={result.definedCenters.length} subtitle={language === 'sk' ? 'z 9 centier' : 'of 9 centers'} color="cyan" delay={0.3} />
            <EnergyCard title={t('hd.channels')} value={result.channels.length} subtitle={language === 'sk' ? 'aktívne kanály' : 'active channels'} color="purple" delay={0.4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <h3 className="font-medium text-white mb-2">{t('hd.strategy')}: {displayName(HD_STRATEGY_DISPLAY, result.strategy, language)}</h3>
              <p className="text-sm text-slate-300">{getStrategyDescription(result.strategy, language)}</p>
            </GlassCard>
            <GlassCard>
              <h3 className="font-medium text-white mb-2">{t('hd.authority')}: {displayName(HD_AUTHORITY_DISPLAY, result.authority, language)}</h3>
              <p className="text-sm text-slate-300">{getAuthorityDescription(result.authority, language)}</p>
            </GlassCard>
          </div>

          {/* Ako čítať bodygraph — vysvetlenie pre laikov */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{t('hd.howToReadBodygraph')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <p className="font-semibold text-indigo-700 mb-1">{language === 'sk' ? 'Farebné štvorce = Definované centrá' : 'Colored squares = Defined centers'}</p>
                <p>{language === 'sk'
                  ? 'Energia, ktorú máš konzistentne. Je to tvoja spoľahlivá sila — vždy funguje rovnako, bez ohľadu na to, kto je okolo teba.'
                  : 'Energy you have consistently. This is your reliable strength — always works the same regardless of who is around you.'
                }</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-700 mb-1">{language === 'sk' ? 'Biele štvorce = Otvorené centrá' : 'White squares = Open centers'}</p>
                <p>{language === 'sk'
                  ? 'Tu absorbujúeš energiu od iných. Nie je to slabosť — je to miesto, kde sa učíš a získavaš múdrosť. Ale tiež miesto, kde ťa svet ovplyvňuje.'
                  : 'Here you absorb energy from others. This is not a weakness — it is where you learn and gain wisdom. But also where the world influences you.'
                }</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <p className="font-semibold text-indigo-700 mb-1">{language === 'sk' ? 'Hrubé čiary = Aktívne kanály' : 'Bold lines = Active channels'}</p>
                <p>{language === 'sk'
                  ? 'Spojenie dvoch centier = konzistentná životná téma a dar. Kanál je vždy aktívny — je to niečo, čo v tebe „beží" neustále.'
                  : 'Connection of two centers = a consistent life theme and gift. A channel is always active — it is something that "runs" in you constantly.'
                }</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-700 mb-1">{language === 'sk' ? 'Čísla pri centrách = Brány' : 'Numbers at centers = Gates'}</p>
                <p>{language === 'sk'
                  ? 'Brána je „pol kanála" — máš tú energiu, ale hľadáš prepojenie s niekým, kto má druhú polovicu. Číslo brány zodpovedá hexagramu I-Ching.'
                  : 'A gate is "half a channel" — you have the energy, but you seek connection with someone who has the other half. The gate number corresponds to an I-Ching hexagram.'
                }</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-4 text-center">{t('hd.bodygraph')}</h3>
            <div className="pb-8">
              <Bodygraph result={result} />
            </div>
          </GlassCard>

          {/* Detailný výpis brán — zoskupené podľa dôležitosti */}
          {(() => {
            const LINE_NAMES: Record<number, string> = language === 'sk'
              ? { 1: 'Skúmajúci', 2: 'Pustovník', 3: 'Mučeník', 4: 'Oportunista', 5: 'Heretik', 6: 'Vzor' }
              : { 1: 'Investigator', 2: 'Hermit', 3: 'Martyr', 4: 'Opportunist', 5: 'Heretic', 6: 'Role Model' };
            const PLANET_GROUPS = {
              core: ['Slnko', 'Zem'],
              karmic: ['Severný uzol', 'Južný uzol'],
              personal: ['Mesiac', 'Merkúr', 'Venuša', 'Mars'],
              outer: ['Jupiter', 'Saturn', 'Urán', 'Neptún', 'Pluto'],
            };
            const PLANET_GROUP_INFO: Record<string, { label: string; desc: string; color: string; border: string }> = language === 'sk' ? {
              core: { label: 'Jadro (Slnko + Zem)', desc: 'Tvoja hlavná životná téma — kto si a na čom stojíš. Najdôležitejšie brány.', color: 'bg-amber-500/15', border: 'border-amber-500/30' },
              karmic: { label: 'Karmické (Uzly)', desc: 'Odkiaľ prichádzaš (Juh) a kam smeruješ (Sever). Životná evolúcia.', color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              personal: { label: 'Osobné planéty', desc: 'Emócie, myslenie, láska, akcia — denná energia.', color: 'bg-slate-500/10', border: 'border-slate-500/20' },
              outer: { label: 'Generačné planéty', desc: 'Zdieľané s rovesníkmi — dlhodobé témy a kolektívne vzorce.', color: 'bg-slate-500/5', border: 'border-slate-500/10' },
            } : {
              core: { label: 'Core (Sun + Earth)', desc: 'Your main life theme — who you are and what you stand on. Most important gates.', color: 'bg-amber-500/15', border: 'border-amber-500/30' },
              karmic: { label: 'Karmic (Nodes)', desc: 'Where you come from (South) and where you are heading (North). Life evolution.', color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              personal: { label: 'Personal planets', desc: 'Emotions, thinking, love, action — daily energy.', color: 'bg-slate-500/10', border: 'border-slate-500/20' },
              outer: { label: 'Generational planets', desc: 'Shared with peers — long-term themes and collective patterns.', color: 'bg-slate-500/5', border: 'border-slate-500/10' },
            };

            const renderGate = (g: { gate: number; line: number; planet: string }, side: 'p' | 'd') => (
              <div key={`${side}-${g.gate}-${g.planet}`} className="flex items-start gap-2">
                <span className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 ${side === 'p' ? 'bg-amber-500/30 text-amber-200' : 'bg-violet-500/30 text-violet-200'}`}>{g.gate}</span>
                <div className="min-w-0">
                  <p className="text-xs text-white">
                    <strong>{g.gate}.{g.line}</strong> <span className="text-slate-500">({LINE_NAMES[g.line] || `L${g.line}`})</span>
                    <span className={`ml-2 text-[10px] ${side === 'p' ? 'text-amber-400' : 'text-violet-400'}`}>{g.planet}</span>
                  </p>
                  {getGateDescription(g.gate, language) && (
                    <p className="text-[11px] text-slate-400">{getGateDescription(g.gate, language)}</p>
                  )}
                </div>
              </div>
            );

            const allGates = [
              ...result.personalityGates.map(g => ({ ...g, side: 'p' as const })),
              ...result.designGates.map(g => ({ ...g, side: 'd' as const })),
            ];

            return (
              <GlassCard>
                <h3 className="font-medium text-white mb-2">{language === 'sk' ? 'Tvoje aktívne brány' : 'Your active gates'}</h3>
                <p className="text-xs text-slate-500 mb-2">
                  {language === 'sk'
                    ? <>Brány sú špecifické energie. <span className="text-amber-300">Vedomé</span> = vieš o nich. <span className="text-violet-300 ml-1">Nevedomé</span> = vidia ich iní, ty nie. Číslo za bodkou je línia (1=skúmajúci, 2=pustovník, 3=mučeník, 4=oportunista, 5=heretik, 6=vzor).</>
                    : <>Gates are specific energies. <span className="text-amber-300">Conscious</span> = you know about them. <span className="text-violet-300 ml-1">Unconscious</span> = others see them, you don't. Number after the dot is the line (1=investigator, 2=hermit, 3=martyr, 4=opportunist, 5=heretic, 6=role model).</>}
                </p>

                {/* Core + Karmic — vedľa seba */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className={`p-3 rounded-xl ${PLANET_GROUP_INFO.core.color} border ${PLANET_GROUP_INFO.core.border}`}>
                    <p className="text-xs text-amber-400 font-semibold mb-1">{PLANET_GROUP_INFO.core.label}</p>
                    <p className="text-[11px] text-slate-400 mb-2">{PLANET_GROUP_INFO.core.desc}</p>
                    <div className="space-y-2">
                      {allGates.filter(g => PLANET_GROUPS.core.includes(g.planet)).map(g => renderGate(g, g.side))}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl ${PLANET_GROUP_INFO.karmic.color} border ${PLANET_GROUP_INFO.karmic.border}`}>
                    <p className="text-xs text-indigo-400 font-semibold mb-1">{PLANET_GROUP_INFO.karmic.label}</p>
                    <p className="text-[11px] text-slate-400 mb-2">{PLANET_GROUP_INFO.karmic.desc}</p>
                    <div className="space-y-2">
                      {allGates.filter(g => PLANET_GROUPS.karmic.includes(g.planet)).map(g => renderGate(g, g.side))}
                    </div>
                  </div>
                </div>

                {/* Personal — collapsible */}
                <details className="mb-3">
                  <summary className={`p-3 rounded-xl ${PLANET_GROUP_INFO.personal.color} border ${PLANET_GROUP_INFO.personal.border} cursor-pointer`}>
                    <span className="text-xs text-slate-300 font-semibold">{PLANET_GROUP_INFO.personal.label}</span>
                    <span className="text-[11px] text-slate-500 ml-2">{PLANET_GROUP_INFO.personal.desc}</span>
                  </summary>
                  <div className="mt-2 p-3 space-y-2">
                    {allGates.filter(g => PLANET_GROUPS.personal.includes(g.planet)).map(g => renderGate(g, g.side))}
                  </div>
                </details>

                {/* Outer — collapsible */}
                <details>
                  <summary className={`p-3 rounded-xl ${PLANET_GROUP_INFO.outer.color} border ${PLANET_GROUP_INFO.outer.border} cursor-pointer`}>
                    <span className="text-xs text-slate-400 font-semibold">{PLANET_GROUP_INFO.outer.label}</span>
                    <span className="text-[11px] text-slate-500 ml-2">{PLANET_GROUP_INFO.outer.desc}</span>
                  </summary>
                  <div className="mt-2 p-3 space-y-2">
                    {allGates.filter(g => PLANET_GROUPS.outer.includes(g.planet)).map(g => renderGate(g, g.side))}
                  </div>
                </details>
              </GlassCard>
            );
          })()}


          {/* Detailný popis 6 línií podľa profilu */}
          {(() => {
            const line1 = getHDLine(result.profile.line1, language);
            const line2 = getHDLine(result.profile.line2, language);
            const profileKey = `${result.profile.line1}/${result.profile.line2}`;
            const phaseHint = getHDProfilePhase(profileKey, language);
            return (
              <GlassCard>
                <h3 className="font-medium text-white mb-3">
                  {language === 'sk'
                    ? <>{t('hd.profile')} {profileKey} — vedomá línia {result.profile.line1} ({line1?.shortLabel}) + nevedomá línia {result.profile.line2} ({line2?.shortLabel})</>
                    : <>{t('hd.profile')} {profileKey} — conscious line {result.profile.line1} ({line1?.shortLabel}) + unconscious line {result.profile.line2} ({line2?.shortLabel})</>}
                </h3>
                {phaseHint && (
                  <p className="text-sm text-indigo-700 mb-3 italic">{phaseHint}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {line1 && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <p className="text-xs text-amber-300 uppercase mb-1">
                        {language === 'sk' ? `Línia ${line1.line} (vedomá)` : `Line ${line1.line} (conscious)`} — {line1.archetype}
                      </p>
                      <p className="text-sm text-slate-300 mb-2">{line1.conscious}</p>
                      <p className="text-xs text-rose-700"><strong>{language === 'sk' ? 'Tieň' : 'Shadow'}:</strong> {line1.shadow}</p>
                      <p className="text-xs text-emerald-700 mt-1"><strong>Signature:</strong> {line1.signature}</p>
                    </div>
                  )}
                  {line2 && (
                    <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
                      <p className="text-xs text-violet-300 uppercase mb-1">
                        {language === 'sk' ? `Línia ${line2.line} (nevedomá)` : `Line ${line2.line} (unconscious)`} — {line2.archetype}
                      </p>
                      <p className="text-sm text-slate-300 mb-2">{line2.unconscious}</p>
                      <p className="text-xs text-rose-700"><strong>{language === 'sk' ? 'Tieň' : 'Shadow'}:</strong> {line2.shadow}</p>
                      <p className="text-xs text-emerald-700 mt-1"><strong>Signature:</strong> {line2.signature}</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })()}

          {/* Authority detail with wave (B16) + Definition type (B17) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getHDAuthorityInfo(result.authority, language) && (
              <GlassCard>
                <h3 className="font-medium text-white mb-1">{t('hd.authority')}: {displayName(HD_AUTHORITY_DISPLAY, result.authority, language)}</h3>
                <p className="text-xs text-slate-400 mb-2"><strong>{language === 'sk' ? 'Vlna' : 'Wave'}:</strong> {getHDAuthorityInfo(result.authority, language).wave}</p>
                <p className="text-sm text-emerald-700"><strong>{language === 'sk' ? 'Ako počúvať' : 'How to listen'}:</strong> {getHDAuthorityInfo(result.authority, language).how}</p>
              </GlassCard>
            )}
            {getHDDefinitionInfo(result.definition, language) && (
              <GlassCard>
                <h3 className="font-medium text-white mb-1">{t('hd.definition')}: {result.definition}</h3>
                <p className="text-xs text-slate-400 mb-2">{getHDDefinitionInfo(result.definition, language).description}</p>
                <p className="text-sm text-indigo-700"><strong>{language === 'sk' ? 'Lekcia' : 'Lesson'}:</strong> {getHDDefinitionInfo(result.definition, language).lesson}</p>
              </GlassCard>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <h3 className="font-medium text-white mb-2">{t('hd.profile')} {result.profile.line1}/{result.profile.line2} – {result.profile.name}</h3>
              <p className="text-sm text-slate-300">{result.profile.description}</p>
            </GlassCard>
            <GlassCard>
              <h3 className="font-medium text-white mb-2">{t('hd.cross')}</h3>
              <p className="text-xs text-slate-400 mb-2">{language === 'sk' ? 'Inkarnačný kríž predstavuje vašu životnú tému a účel -- to, prečo ste tu. Je to kombinácia brán vášho vedomého a nevedomého Slnka a Zeme.' : 'The Incarnation Cross represents your life theme and purpose — why you are here. It is a combination of the gates of your conscious and unconscious Sun and Earth.'}</p>
              <p className="text-sm text-slate-300 font-medium">{result.incarnationCross}</p>
              {result.personalityGates[0] && getGateDescription(result.personalityGates[0].gate, language) && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-400 uppercase mb-1">{language === 'sk' ? 'Brána' : 'Gate'} {result.personalityGates[0].gate} ({language === 'sk' ? 'Slnko' : 'Sun'})</p>
                  <p className="text-xs text-slate-300">{getGateDescription(result.personalityGates[0].gate, language)}</p>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <p className="text-xs text-slate-400 mb-1">{language === 'sk' ? 'Definované centrá' : 'Defined centers'}: {result.definedCenters.length} {language === 'sk' ? 'z 9' : 'of 9'}</p>
              <p className="text-sm text-slate-300">
                {result.definedCenters.length >= 7
                  ? (language === 'sk' ? 'Väčšina vašej energie je definovaná a konzistentná. Máte stabilný a spoľahlivý energetický systém s menšou otvorenosťou voči vonkajším vplyvom.' : 'Most of your energy is defined and consistent. You have a stable and reliable energy system with less openness to external influences.')
                  : result.definedCenters.length >= 4
                  ? (language === 'sk' ? 'Máte vyváženú kombináciu definovanej a otvorenej energie. Niektoré oblasti sú spoľahlivé, v iných sa učíte a absorbujete od okolia.' : 'You have a balanced combination of defined and open energy. Some areas are reliable, in others you learn and absorb from your environment.')
                  : (language === 'sk' ? 'Väčšina vašej energie je otvorená a premenlivá. Ste veľmi citliví na prostredie a absorbujete energiu ostatných -- to je vaša múdrosť, nie slabosť.' : 'Most of your energy is open and variable. You are very sensitive to your environment and absorb others\' energy — this is your wisdom, not a weakness.')}
              </p>
            </GlassCard>
            <GlassCard>
              <p className="text-xs text-slate-400 mb-1">{language === 'sk' ? 'Kanály' : 'Channels'}: {result.channels.length}</p>
              <p className="text-sm text-slate-300">
                {result.channels.length === 0
                  ? (language === 'sk' ? 'Nemáte žiadne plné kanály. Vaša energia prúdi voľnejšie a ste otvorenejší vonkajším vplyvom.' : 'You have no full channels. Your energy flows more freely and you are more open to external influences.')
                  : result.channels.length <= 2
                  ? (language === 'sk' ? 'Máte niekoľko aktívnych kanálov, ktoré vytvárajú konzistentný tok energie medzi centrami a definujú vaše silné stránky.' : 'You have a few active channels that create a consistent energy flow between centers and define your strengths.')
                  : (language === 'sk' ? 'Máte viacero aktívnych kanálov, čo znamená silný a komplexný energetický systém s jasnými životnými témami a darmi.' : 'You have multiple active channels, meaning a strong and complex energy system with clear life themes and gifts.')}
              </p>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-medium text-white mb-2">{t('hd.definedCenters')}</h3>
              <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Definované centrá sú vaše konzistentné a spoľahlivé energie. Tu máte stabilnú energiu, na ktorú sa môžete spoľahnúť.' : 'Defined centers are your consistent and reliable energies. Here you have stable energy you can count on.'}</p>
              <div className="space-y-2">
                {result.definedCenters.map((center, idx) => (
                  <motion.div
                    key={center}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                  >
                    <span className="text-sm font-medium text-green-300">{displayName(HD_CENTER_DISPLAY, center, language)}</span>
                    <span className="text-xs text-slate-400">{CENTER_THEMES[center] || ''}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-medium text-white mb-2">{t('hd.openCenters')}</h3>
              <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Otvorené centrá nie sú slabosti -- sú to oblasti, kde absorbujete a zosilňujete energiu okolia. Práve tu sa učíte a získavate múdrosť, ak sa nenechávate kondicionovať.' : 'Open centers are not weaknesses — they are areas where you absorb and amplify the energy around you. This is where you learn and gain wisdom, if you don\'t let yourself be conditioned.'}</p>
              <div className="space-y-2">
                {result.openCenters.map((center, idx) => (
                  <motion.div
                    key={center}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-amber-300">{displayName(HD_CENTER_DISPLAY, center, language)}</span>
                      <span className="text-xs text-slate-400">{CENTER_THEMES[center] || ''}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{language === 'sk' ? 'Zosilňujete túto energiu od ostatných. Otázka: "Je to moja energia alebo cudzia?"' : 'You amplify this energy from others. Question: "Is this my energy or someone else\'s?"'}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Variable — 4 šípky (PHS, Environment, Motivation, Perspective) */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{t('hd.variable')}</h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'sk'
                ? '4 „šípky" v tvojom HD grafe ukazujú ako tvoje telo a myseľ optimálne fungujú — aké jedlo, prostredie a spôsob myslenia ti vyhovuje.'
                : 'The 4 "arrows" in your HD chart show how your body and mind function optimally — what food, environment, and way of thinking suits you.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-green-400 uppercase mb-1">{t('hd.digestion')}</p>
                <p className="text-sm text-white font-medium">{result.variable.digestion.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{result.variable.digestion.description}</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-xs text-cyan-400 uppercase mb-1">{t('hd.environment')}</p>
                <p className="text-sm text-white font-medium">{result.variable.environment.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{result.variable.environment.description}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-400 uppercase mb-1">{t('hd.motivation')}</p>
                <p className="text-sm text-white font-medium">{result.variable.motivation.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{result.variable.motivation.description}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-400 uppercase mb-1">{t('hd.perspective')}</p>
                <p className="text-sm text-white font-medium">{result.variable.perspective.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{result.variable.perspective.description}</p>
              </div>
            </div>
          </GlassCard>

          {result.channels.length > 0 && (
            <GlassCard>
              <h3 className="font-medium text-white mb-4">{t('hd.activeChannels')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.channels.map((channel, idx) => (
                  <motion.div
                    key={`${channel.gates[0]}-${channel.gates[1]}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded-xl glass-light"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{displayName(HD_CHANNEL_DISPLAY, channel.name, language)}</span>
                      <span className="text-xs text-indigo-300">{channel.gates[0]}-{channel.gates[1]}</span>
                    </div>
                    <span className="text-xs text-slate-400">{displayName(HD_CENTER_DISPLAY, channel.centers[0], language)} → {displayName(HD_CENTER_DISPLAY, channel.centers[1], language)}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          </>}

          {activeTab === 'genekeys' && <>
          {/* GENOVE KLUCE */}
          {(() => {
            const allGates = [...new Set([
              ...result.personalityGates.map(g => g.gate),
              ...result.designGates.map(g => g.gate),
            ])];
            const geneKeysList: GeneKey[] = getGeneKeysForGates(allGates, language);
            if (geneKeysList.length === 0) return null;

            // 3 hlavné: Slnko (Life's Work), Zem (Evolution), Mars (Radiance)
            const sunGate = result.personalityGates.find(g => g.planet === 'Slnko')?.gate;
            const earthGate = result.personalityGates.find(g => g.planet === 'Zem')?.gate;
            const marsGate = result.personalityGates.find(g => g.planet === 'Mars')?.gate;
            const primaryGates = [sunGate, earthGate, marsGate].filter((g): g is number => g !== undefined);
            const primaryKeys = geneKeysList.filter(gk => primaryGates.includes(gk.gate));
            const secondaryKeys = geneKeysList.filter(gk => !primaryGates.includes(gk.gate));

            return (
              <>
                <GlassCard>
                  <h3 className="font-medium text-white mb-3">{t('hd.geneKeys')}</h3>
                  <div className="space-y-3 text-sm text-slate-300">
                    <p>
                      {language === 'sk'
                        ? <>Génové kľúče (Gene Keys) sú systém sebapoznania vytvorený Richardom Ruddom. Vychádzajú z 64 hexagramov I-Ťing — rovnako ako brány v Human Designe. Každá brána, ktorú máš aktívnu vo svojom dizajne, je zároveň <strong className="text-white">génový kľúč</strong> — cesta transformácie od nevedomého vzorca (tieň) cez vedomé žitie (dar) k najvyššiemu potenciálu (siddhi).</>
                        : <>Gene Keys is a self-knowledge system created by Richard Rudd. They stem from the 64 hexagrams of the I Ching — the same as gates in Human Design. Each gate active in your design is also a <strong className="text-white">Gene Key</strong> — a path of transformation from an unconscious pattern (shadow) through conscious living (gift) to the highest potential (siddhi).</>}
                    </p>
                    <p>
                      {language === 'sk'
                        ? <>Každá brána v tvojom dizajne má <strong className="text-white">tri frekvencie</strong> — ako tri poschodia toho istého domu:</>
                        : <>Each gate in your design has <strong className="text-white">three frequencies</strong> — like three floors of the same house:</>}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-xs font-bold text-red-300">{language === 'sk' ? 'Tieň' : 'Shadow'}</p>
                        <p className="text-[10px] text-slate-400">{language === 'sk' ? 'Keď si pod tlakom, nevedomý. Kde „uviazneš".' : 'When under pressure, unconscious. Where you get "stuck".'}</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs font-bold text-amber-300">{language === 'sk' ? 'Dar' : 'Gift'}</p>
                        <p className="text-[10px] text-slate-400">{language === 'sk' ? 'Keď si vedomý a autentický. Tvoja sila.' : 'When conscious and authentic. Your strength.'}</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs font-bold text-emerald-300">Siddhi</p>
                        <p className="text-[10px] text-slate-400">{language === 'sk' ? 'Najvyššia forma. Vzácna, ale ukazuje smer.' : 'Highest form. Rare, but shows the direction.'}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      {language === 'sk'
                        ? 'Prakticky: rozpoznaj tieň (bez súdenia), žij dar (vedomá voľba). Siddhi príde samo, keď prestaneš tlačiť.'
                        : 'Practically: recognize the shadow (without judgment), live the gift (conscious choice). Siddhi comes on its own when you stop pushing.'}
                    </p>
                  </div>
                </GlassCard>

                {/* Primárne kľúče — Tvoje čítanie */}
                {primaryKeys.length > 0 && (
                  <GlassCard glow>
                    <details open>
                      <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
                        <span className="font-medium text-white">{language === 'sk' ? 'Tvoje čítanie — tvoje hlavné génové kľúče' : 'Your reading — your main Gene Keys'}</span>
                      </summary>
                      <p className="text-xs text-slate-500 mt-2 mb-4">
                        {language === 'sk'
                          ? <>Tieto tri kľúče tvoria tvoju <strong>Aktivačnú sekvenciu</strong> — Slnko (životné dielo), Zem (zakotvenie) a Mars (vyžarovanie). Sú najdôležitejšie pre tvoju transformáciu.</>
                          : <>These three keys form your <strong>Activation Sequence</strong> — Sun (life's work), Earth (grounding) and Mars (radiance). They are the most important for your transformation.</>}
                      </p>
                    <div className="space-y-4">
                      {primaryKeys.map(gk => (
                        <div key={gk.gate} className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-9 h-9 rounded-full bg-indigo-500/30 text-indigo-200 font-bold flex items-center justify-center">{gk.gate}</span>
                            <div>
                              <p className="text-sm font-medium text-white">{language === 'sk' ? 'Génový kľúč' : 'Gene Key'} {gk.gate}</p>
                              <p className="text-[10px] text-slate-400">{gk.gate === sunGate ? (language === 'sk' ? 'Vedomé Slnko — Life\'s Work (životné dielo)' : 'Conscious Sun — Life\'s Work') : gk.gate === earthGate ? (language === 'sk' ? 'Vedomá Zem — Evolution (zakotvenie)' : 'Conscious Earth — Evolution (grounding)') : (language === 'sk' ? 'Vedomý Mars — Radiance (vyžarovanie)' : 'Conscious Mars — Radiance')}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3 text-sm">
                            <span className="text-red-300 font-medium">{gk.shadow}</span>
                            <span className="text-slate-500">→</span>
                            <span className="text-amber-300 font-medium">{gk.gift}</span>
                            <span className="text-slate-500">→</span>
                            <span className="text-emerald-300 font-medium">{gk.siddhi}</span>
                          </div>

                          <div className="space-y-2 text-xs text-slate-400">
                            <p><span className="text-red-400 font-medium">{language === 'sk' ? 'Tieň' : 'Shadow'}:</span> {gk.shadowDescription}</p>
                            <p><span className="text-amber-400 font-medium">{language === 'sk' ? 'Dar' : 'Gift'}:</span> {gk.giftDescription}</p>
                          </div>

                          <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-[10px] text-emerald-400 uppercase mb-1">{language === 'sk' ? 'Čo s tým prakticky' : 'What to do practically'}</p>
                            <p className="text-xs text-slate-300">
                              {language === 'sk'
                                ? <>Keď zistíš, že si v tieni (<em>{gk.shadow.toLowerCase()}</em>) — zastav sa. Nie je to chyba, je to signál. Vedomá voľba: prejdi k daru (<em>{gk.gift.toLowerCase()}</em>).</>
                                : <>When you notice you are in the shadow (<em>{gk.shadow.toLowerCase()}</em>) — pause. It is not a mistake, it is a signal. Conscious choice: move toward the gift (<em>{gk.gift.toLowerCase()}</em>).</>}
                              {gk.nlpTechnique && <> {language === 'sk' ? 'Technika:' : 'Technique:'} <strong>{gk.nlpTechnique}</strong> — {gk.nlpDescription}</>}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    </details>
                  </GlassCard>
                )}

                {/* Ostatné kľúče — collapsible */}
                {secondaryKeys.length > 0 && (
                  <GlassCard>
                    <details>
                      <summary className="text-sm font-medium text-indigo-700 cursor-pointer hover:text-indigo-800 select-none">
                        {language === 'sk' ? `Ďalšie génové kľúče (${secondaryKeys.length}) — planéty a design` : `Other Gene Keys (${secondaryKeys.length}) — planets and design`}
                      </summary>
                      <p className="text-xs text-slate-500 mt-2 mb-4">
                        {language === 'sk'
                          ? 'Tieto kľúče sú z ďalších planét a nevedomého dizajnu. Sú dôležité, ale nie tak urgentné ako hlavné dva.'
                          : 'These keys come from other planets and the unconscious design. They are important, but not as urgent as the main two.'}
                      </p>
                      <div className="space-y-3 mt-3">
                        {secondaryKeys.map(gk => (
                          <div key={gk.gate} className="p-3 rounded-xl glass-light">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-7 h-7 rounded-full bg-slate-700/50 text-slate-300 font-bold text-xs flex items-center justify-center">{gk.gate}</span>
                              <span className="text-sm text-white">{language === 'sk' ? 'Kľúč' : 'Key'} {gk.gate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs mb-2">
                              <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-300">{gk.shadow}</span>
                              <span className="text-slate-500">→</span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300">{gk.gift}</span>
                              <span className="text-slate-500">→</span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">{gk.siddhi}</span>
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-400">
                              <p><span className="text-red-400 font-medium">{language === 'sk' ? 'Tieň' : 'Shadow'}:</span> {gk.shadowDescription}</p>
                              <p><span className="text-amber-400 font-medium">{language === 'sk' ? 'Dar' : 'Gift'}:</span> {gk.giftDescription}</p>
                              <p><span className="text-emerald-400 font-medium">Siddhi:</span> {gk.siddhiDescription}</p>
                            </div>
                            {gk.nlpTechnique && (
                              <div className="mt-2 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                <p className="text-[10px] text-violet-300 font-medium mb-0.5">{gk.nlpTechnique}</p>
                                <p className="text-[10px] text-slate-400">{gk.nlpDescription}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  </GlassCard>
                )}
              </>
            );
          })()}

          </>}

        </div>
      )}
    </div>
  );
}
