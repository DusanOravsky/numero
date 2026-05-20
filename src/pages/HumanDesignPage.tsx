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
import { HD_LINES, HD_PROFILE_PHASES, HD_AUTHORITY_INFO, HD_DEFINITION_INFO } from '../data/hdLines';
import { AIChat } from '../components/AIChat';
import type { GeneKey } from '../data/geneKeys';

const TYPE_DESCRIPTIONS: Record<string, string> = {
  'Manifestor': 'Manifestori sú tu na to, aby začínali a iniciovali. Majú uzavretú a odpudzujúcu auru – nie sú tu na to, aby čakali. Ich úlohou je informovať ostatných pred konaním, čím redukujú odpor okolia. Tvoria asi 9% populácie.',
  'Generátor': 'Generátori sú životná sila planéty – majú nekonečnú energiu sakrálneho centra. Sú tu na to, aby reagovali na to, čo im život prináša. Keď robia prácu, ktorú milujú, sú neúnavní. Tvoria asi 37% populácie.',
  'Manifestujúci Generátor': 'Manifestujúci Generátori kombinujú energiu Generátora s iniciatívou Manifestora. Sú multi-talentovaní a rýchli. Musia reagovať AJ informovať. Tvoria asi 33% populácie.',
  'Projektor': 'Projektori sú tu na to, aby viedli a riadili energiu ostatných. Nemajú konzistentnú vlastnú energiu, ale vidia systémy a ľudí hlboko. Musia čakať na pozvanie do veľkých životných rozhodnutí. Tvoria asi 20% populácie.',
  'Reflektor': 'Reflektori sú najvzácnejší typ – nemajú žiadne definované centrá a odrážajú prostredie okolo seba. Sú barometrom zdravia komunity. Musia čakať 28 dní (lunárny cyklus) pred veľkými rozhodnutiami. Tvoria asi 1% populácie.',
};

const AUTHORITY_DESCRIPTIONS: Record<string, string> = {
  'Emocionálna': 'Vaša pravda sa odhaľuje v čase. Nikdy nerozhodujte v emočnom výkyve – čakajte na emocionálnu jasnosť. Vaša vlna má výkyvy a pravda prichádza v neutrálnom bode.',
  'Sakrálna': 'Váš sakrálny hlas (uh-huh/unh-unh) je vašou pravdou. Reagujte zvukom z brucha na áno/nie otázky. Telo vie skôr ako myseľ.',
  'Slezinová': 'Vaša intuícia je momentálna – hovorí v prítomnom okamihu. Ak ignorujete prvý impulz, stratíte ho. Dôverujte spontánnym pocitom a "viem len tak".',
  'Ego': 'Vaša autorita je sila vôle. Pýtajte sa: "Je to niečo, čomu chcem zaviazať svoju vôľu?" Dodržiavajte sľuby, ale sľubujte len to, čo naozaj chcete.',
  'Sebaprojektovaná': 'Hovorte o veciach nahlas – vaša pravda sa vám odhalí cez váš vlastný hlas. Počúvajte, čo hovoríte, nie čo si myslíte.',
  'Mentálna/Environmentálna': 'Vaša autorita je vonkajšia – potrebujete správne prostredie a dôveryhodných zvukových partnerov na to, aby ste sa počuli a rozhodli.',
  'Lunárna': 'Čakajte 28 dní (celý lunárny cyklus) pred veľkými rozhodnutiami. Diskutujte so ľuďmi, ktorým dôverujete, počas celého cyklu.',
};

const GATE_DESCRIPTIONS: Record<number, string> = {
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

const STRATEGY_DESCRIPTIONS: Record<string, string> = {
  'Informovať': 'Pred konaním informujte ľudí, ktorých sa to týka. Nemusíte žiadať o povolenie, ale informovanie redukuje odpor.',
  'Reagovať': 'Čakajte na niečo, na čo môžete reagovať – situáciu, otázku, ponuku. Neinicinujte z hlavy. Vaše sakrálne centrum vám povie áno alebo nie.',
  'Reagovať a informovať': 'Reagujte na podnety zo života a pred konaním informujte tých, na ktorých má dopad. Kombinácia oboch prístupov.',
  'Čakať na pozvanie': 'Čakajte na formálne pozvanie do veľkých životných oblastí (kariéra, vzťahy, bývanie). V medzičase kultivujte svoju múdrosť a systémy.',
  'Čakať 28 dní': 'Pred veľkými rozhodnutiami prečkajte celý lunárny cyklus. Diskutujte s dôveryhodnými ľuďmi. Až po 28 dňoch sa rozhodnite.',
};

export function HumanDesignPage() {
  const navigate = useNavigate();
  const subject = useSubject();
  const [manualResult, setManualResult] = useState<HumanDesignResult | null>(null);

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
            ← Späť na klienta {subject.name}
          </button>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl font-bold text-white">Human Design</h1>
          {subject?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              Klient: <strong>{subject.name}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          {subject?.isClient ? `Energetický plán klienta ${subject.name}` : 'Váš energetický plán'}
        </p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} showTime showPlace label="Dátum a čas narodenia (pre presný HD)" />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          <GlassCard>
            <p className="text-sm text-slate-400">
              <strong className="text-white">Human Design</strong> je systém sebapoznania, ktorý kombinuje astrológiu, I-Ching, Kabalu, hinduistický systém čakier a kvantovú fyziku. Ukazuje, ako ste energeticky navrhnutí -- ako správne rozhodovať, kde máte konzistentnú energiu a kde ste otvorení vonkajším vplyvom.
            </p>
          </GlassCard>

          {/* Jednoducho povedané — personalizované takeaway */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">Čo si z toho vziať</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                Tvoj Human Design ti hovorí <strong className="text-white">tri praktické veci</strong>, ktoré môžeš hneď začať používať:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                  <p className="text-xs text-indigo-700 font-semibold mb-1">1. Ako rozhodovať</p>
                  <p className="text-xs text-slate-700">
                    Tvoja autorita (<strong>{result.authority}</strong>) ti ukazuje, ako sa dopracovať k správnemu rozhodnutiu — nie hlavou, ale {result.authority === 'Emocionálna' ? 'čakaním na emocionálnu jasnosť' : result.authority === 'Sakrálna' ? 'reakciou z brucha (uh-huh / unh-unh)' : result.authority === 'Slezinová' ? 'prvotnou intuíciou v momente' : 'tvojím vnútorným kompasom'}.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-xs text-emerald-700 font-semibold mb-1">2. Ako fungovať vo svete</p>
                  <p className="text-xs text-slate-700">
                    Ako <strong>{result.type}</strong> je tvoja stratégia „<strong>{result.strategy.toLowerCase()}</strong>". To nie je obmedzenie — je to spôsob, ako sa ti otvárajú správne príležitosti.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <p className="text-xs text-rose-700 font-semibold mb-1">3. Kedy niečo nie je pre teba</p>
                  <p className="text-xs text-slate-700">
                    Keď cítiš „<strong>{result.notSelfTheme.toLowerCase()}</strong>" — je to signál, že žiješ mimo svoj dizajn. Nie je to chyba, len navigačný bod.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Tvoje čítanie — personalizovaný sprievodca HD */}
          <GlassCard>
            <details open>
              <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
                <span className="font-medium text-white">Tvoje čítanie — ako pracovať s Human Design</span>
              </summary>
              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-400">
                  Human Design nie je návod „ako byť". Je to mapa tvojho energetického systému — ukazuje, ako si navrhnutý fungovať, keď si v súlade sám so sebou. Nie je čo opravovať, len pochopiť.
                </p>

                {/* Hlavný typ + stratégia */}
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-xs font-semibold text-indigo-300 mb-1">
                    Si {result.type} — tvoja stratégia: „{result.strategy.toLowerCase()}"
                  </p>
                  <p className="text-xs text-slate-300">{TYPE_DESCRIPTIONS[result.type]}</p>
                  <p className="text-xs text-slate-400 mt-2 italic">
                    Prakticky: {result.type === 'Generátor' || result.type === 'Manifestujúci Generátor'
                      ? 'Čakaj na veci, na ktoré reaguješ „áno" z brucha. Neinicializuj z hlavy — nechaj život prísť k tebe.'
                      : result.type === 'Manifestor'
                      ? 'Konaj keď cítiš vnútorný impulz, ale informuj ľudí okolo seba predtým. Redukuje to odpor.'
                      : result.type === 'Projektor'
                      ? 'Kultivuj svoju múdrosť a videnie. Veľké príležitosti prídu ako pozvanie — netreba sa pretláčať.'
                      : 'Daj si 28 dní pred veľkými rozhodnutiami. Diskutuj s ľuďmi, ktorým veríš.'}
                  </p>
                </div>

                {/* Autorita */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-semibold text-emerald-300 mb-1">
                    Tvoja autorita: {result.authority}
                  </p>
                  <p className="text-xs text-slate-300">{AUTHORITY_DESCRIPTIONS[result.authority]}</p>
                </div>

                {/* Otvorené centrá — kde si zraniteľný */}
                {result.openCenters.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs font-semibold text-amber-300 mb-2">
                      Tvoje otvorené centrá ({result.openCenters.length}): kde absorbujuješ cudziu energiu
                    </p>
                    <p className="text-[11px] text-slate-400 mb-2">
                      V týchto oblastiach si ovplyvniteľný okolím. Kľúčová otázka pri každom: „Je toto moja energia, alebo ju beriem od niekoho iného?"
                    </p>
                    <div className="space-y-1.5">
                      {result.openCenters.map(c => (
                        <div key={c} className="pl-3 border-l-2 border-amber-500/30">
                          <p className="text-[11px] text-slate-300">
                            <strong className="text-amber-300">{c}</strong> — {CENTER_THEMES[c] || ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nie-ja téma */}
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-xs font-semibold text-rose-300 mb-1">
                    Keď cítiš „{result.notSelfTheme.toLowerCase()}" — žiješ mimo dizajn
                  </p>
                  <p className="text-xs text-slate-300">
                    Nie je to chyba ani problém. Je to navigačný signál — niečo v tvojom živote nefunguje podľa tvojho dizajnu.
                    Vráť sa k stratégii ({result.strategy.toLowerCase()}) a autorite ({result.authority.toLowerCase()}).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">Praktický tip</p>
                  <p className="text-xs text-slate-300">
                    Nezačínaj od brán a kanálov — začni od stratégie a autority. To sú tvoje dva najdôležitejšie nástroje na každý deň. Všetko ostatné je kontext.
                  </p>
                </div>
              </div>
            </details>
          </GlassCard>

          <GlassCard glow>
            <div className={`p-6 rounded-xl bg-gradient-to-br ${typeColors[result.type] || typeColors['Generátor']}`}>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Váš typ</p>
              <h2 className="font-serif text-3xl font-bold text-white mt-1">{result.type}</h2>
              <p className="text-sm text-slate-300 mt-2">{TYPE_DESCRIPTIONS[result.type]}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Stratégia</p>
                  <p className="text-sm font-medium text-white">{result.strategy}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Autorita</p>
                  <p className="text-sm font-medium text-white">{result.authority}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Nie-ja téma</p>
                  <p className="text-sm font-medium text-rose-300">{result.notSelfTheme}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnergyCard title="Profil" value={`${result.profile.line1}/${result.profile.line2}`} subtitle={result.profile.name} color="indigo" delay={0.1} />
            <EnergyCard title="Inkarnačný kríž" value="✝" subtitle={result.incarnationCross} color="gold" delay={0.2} />
            <EnergyCard title="Definované centrá" value={result.definedCenters.length} subtitle={`z 9 centier`} color="cyan" delay={0.3} />
            <EnergyCard title="Kanály" value={result.channels.length} subtitle="aktívne kanály" color="purple" delay={0.4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <h3 className="font-medium text-white mb-2">Stratégia: {result.strategy}</h3>
              <p className="text-sm text-slate-300">{STRATEGY_DESCRIPTIONS[result.strategy]}</p>
            </GlassCard>
            <GlassCard>
              <h3 className="font-medium text-white mb-2">Autorita: {result.authority}</h3>
              <p className="text-sm text-slate-300">{AUTHORITY_DESCRIPTIONS[result.authority]}</p>
            </GlassCard>
          </div>

          {/* Ako čítať bodygraph — vysvetlenie pre laikov */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">Ako čítať bodygraph</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <p className="font-semibold text-indigo-700 mb-1">Farebné štvorce = Definované centrá</p>
                <p>Energia, ktorú máš konzistentne. Je to tvoja spoľahlivá sila — vždy funguje rovnako, bez ohľadu na to, kto je okolo teba.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-700 mb-1">Biele štvorce = Otvorené centrá</p>
                <p>Tu absorbujúeš energiu od iných. Nie je to slabosť — je to miesto, kde sa učíš a získavaš múdrosť. Ale tiež miesto, kde ťa svet ovplyvňuje.</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <p className="font-semibold text-indigo-700 mb-1">Hrubé čiary = Aktívne kanály</p>
                <p>Spojenie dvoch centier = konzistentná životná téma a dar. Kanál je vždy aktívny — je to niečo, čo v tebe „beží" neustále.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-700 mb-1">Čísla pri centrách = Brány</p>
                <p>Brána je „pol kanála" — máš tú energiu, ale hľadáš prepojenie s niekým, kto má druhú polovicu. Číslo brány zodpovedá hexagramu I-Ching.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-4 text-center">Bodygraph</h3>
            <div className="pb-8">
              <Bodygraph result={result} />
            </div>
          </GlassCard>

          {/* Detailný výpis brán — zoskupené podľa dôležitosti */}
          {(() => {
            const LINE_NAMES: Record<number, string> = {
              1: 'Skúmajúci', 2: 'Pustovník', 3: 'Mučeník', 4: 'Oportunista', 5: 'Heretik', 6: 'Vzor',
            };
            const PLANET_GROUPS = {
              core: ['Slnko', 'Zem'],
              karmic: ['Severný uzol', 'Južný uzol'],
              personal: ['Mesiac', 'Merkúr', 'Venuša', 'Mars'],
              outer: ['Jupiter', 'Saturn', 'Urán', 'Neptún', 'Pluto'],
            };
            const PLANET_GROUP_INFO: Record<string, { label: string; desc: string; color: string; border: string }> = {
              core: { label: 'Jadro (Slnko + Zem)', desc: 'Tvoja hlavná životná téma — kto si a na čom stojíš. Najdôležitejšie brány.', color: 'bg-amber-500/15', border: 'border-amber-500/30' },
              karmic: { label: 'Karmické (Uzly)', desc: 'Odkiaľ prichádzaš (Juh) a kam smeruješ (Sever). Životná evolúcia.', color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              personal: { label: 'Osobné planéty', desc: 'Emócie, myslenie, láska, akcia — denná energia.', color: 'bg-slate-500/10', border: 'border-slate-500/20' },
              outer: { label: 'Generačné planéty', desc: 'Zdieľané s rovesníkmi — dlhodobé témy a kolektívne vzorce.', color: 'bg-slate-500/5', border: 'border-slate-500/10' },
            };

            const renderGate = (g: { gate: number; line: number; planet: string }, side: 'p' | 'd') => (
              <div key={`${side}-${g.gate}-${g.planet}`} className="flex items-start gap-2">
                <span className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 ${side === 'p' ? 'bg-amber-500/30 text-amber-200' : 'bg-violet-500/30 text-violet-200'}`}>{g.gate}</span>
                <div className="min-w-0">
                  <p className="text-xs text-white">
                    <strong>{g.gate}.{g.line}</strong> <span className="text-slate-500">({LINE_NAMES[g.line] || `L${g.line}`})</span>
                    <span className={`ml-2 text-[10px] ${side === 'p' ? 'text-amber-400' : 'text-violet-400'}`}>{g.planet}</span>
                  </p>
                  {GATE_DESCRIPTIONS[g.gate] && (
                    <p className="text-[11px] text-slate-400">{GATE_DESCRIPTIONS[g.gate]}</p>
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
                <h3 className="font-medium text-white mb-2">Tvoje aktívne brány</h3>
                <p className="text-xs text-slate-500 mb-2">
                  Brány sú špecifické energie. <span className="text-amber-300">Vedomé</span> = vieš o nich.
                  <span className="text-violet-300 ml-1">Nevedomé</span> = vidia ich iní, ty nie.
                  Číslo za bodkou je línia (1=skúmajúci, 2=pustovník, 3=mučeník, 4=oportunista, 5=heretik, 6=vzor).
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
            const line1 = HD_LINES[result.profile.line1];
            const line2 = HD_LINES[result.profile.line2];
            const profileKey = `${result.profile.line1}/${result.profile.line2}`;
            const phaseHint = HD_PROFILE_PHASES[profileKey];
            return (
              <GlassCard>
                <h3 className="font-medium text-white mb-3">
                  Profil {profileKey} — vedomá línia {result.profile.line1} ({line1?.shortLabel}) + nevedomá línia {result.profile.line2} ({line2?.shortLabel})
                </h3>
                {phaseHint && (
                  <p className="text-sm text-indigo-700 mb-3 italic">{phaseHint}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {line1 && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <p className="text-xs text-amber-300 uppercase mb-1">
                        Línia {line1.line} (vedomá) — {line1.archetype}
                      </p>
                      <p className="text-sm text-slate-300 mb-2">{line1.conscious}</p>
                      <p className="text-xs text-rose-700"><strong>Tieň:</strong> {line1.shadow}</p>
                      <p className="text-xs text-emerald-700 mt-1"><strong>Signature:</strong> {line1.signature}</p>
                    </div>
                  )}
                  {line2 && (
                    <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
                      <p className="text-xs text-violet-300 uppercase mb-1">
                        Línia {line2.line} (nevedomá) — {line2.archetype}
                      </p>
                      <p className="text-sm text-slate-300 mb-2">{line2.unconscious}</p>
                      <p className="text-xs text-rose-700"><strong>Tieň:</strong> {line2.shadow}</p>
                      <p className="text-xs text-emerald-700 mt-1"><strong>Signature:</strong> {line2.signature}</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })()}

          {/* Authority detail with wave (B16) + Definition type (B17) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HD_AUTHORITY_INFO[result.authority] && (
              <GlassCard>
                <h3 className="font-medium text-white mb-1">Autorita: {result.authority}</h3>
                <p className="text-xs text-slate-400 mb-2"><strong>Vlna:</strong> {HD_AUTHORITY_INFO[result.authority].wave}</p>
                <p className="text-sm text-emerald-700"><strong>Ako počúvať:</strong> {HD_AUTHORITY_INFO[result.authority].how}</p>
              </GlassCard>
            )}
            {HD_DEFINITION_INFO[result.definition] && (
              <GlassCard>
                <h3 className="font-medium text-white mb-1">Definícia: {result.definition}</h3>
                <p className="text-xs text-slate-400 mb-2">{HD_DEFINITION_INFO[result.definition].description}</p>
                <p className="text-sm text-indigo-700"><strong>Lekcia:</strong> {HD_DEFINITION_INFO[result.definition].lesson}</p>
              </GlassCard>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <h3 className="font-medium text-white mb-2">Profil {result.profile.line1}/{result.profile.line2} – {result.profile.name}</h3>
              <p className="text-sm text-slate-300">{result.profile.description}</p>
            </GlassCard>
            <GlassCard>
              <h3 className="font-medium text-white mb-2">Inkarnačný kríž</h3>
              <p className="text-xs text-slate-400 mb-2">Inkarnačný kríž predstavuje vašu životnú tému a účel -- to, prečo ste tu. Je to kombinácia brán vášho vedomého a nevedomého Slnka a Zeme.</p>
              <p className="text-sm text-slate-300 font-medium">{result.incarnationCross}</p>
              {result.personalityGates[0] && GATE_DESCRIPTIONS[result.personalityGates[0].gate] && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-400 uppercase mb-1">Brána {result.personalityGates[0].gate} (Slnko)</p>
                  <p className="text-xs text-slate-300">{GATE_DESCRIPTIONS[result.personalityGates[0].gate]}</p>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <p className="text-xs text-slate-400 mb-1">Definované centrá: {result.definedCenters.length} z 9</p>
              <p className="text-sm text-slate-300">
                {result.definedCenters.length >= 7
                  ? 'Väčšina vašej energie je definovaná a konzistentná. Máte stabilný a spoľahlivý energetický systém s menšou otvorenosťou voči vonkajším vplyvom.'
                  : result.definedCenters.length >= 4
                  ? 'Máte vyváženú kombináciu definovanej a otvorenej energie. Niektoré oblasti sú spoľahlivé, v iných sa učíte a absorbujete od okolia.'
                  : 'Väčšina vašej energie je otvorená a premenlivá. Ste veľmi citliví na prostredie a absorbujete energiu ostatných -- to je vaša múdrosť, nie slabosť.'}
              </p>
            </GlassCard>
            <GlassCard>
              <p className="text-xs text-slate-400 mb-1">Kanály: {result.channels.length}</p>
              <p className="text-sm text-slate-300">
                {result.channels.length === 0
                  ? 'Nemáte žiadne plné kanály. Vaša energia prúdi voľnejšie a ste otvorenejší vonkajším vplyvom.'
                  : result.channels.length <= 2
                  ? 'Máte niekoľko aktívnych kanálov, ktoré vytvárajú konzistentný tok energie medzi centrami a definujú vaše silné stránky.'
                  : 'Máte viacero aktívnych kanálov, čo znamená silný a komplexný energetický systém s jasnými životnými témami a darmi.'}
              </p>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-medium text-white mb-2">Definované centrá</h3>
              <p className="text-xs text-slate-400 mb-3">Definované centrá sú vaše konzistentné a spoľahlivé energie. Tu máte stabilnú energiu, na ktorú sa môžete spoľahnúť.</p>
              <div className="space-y-2">
                {result.definedCenters.map((center, idx) => (
                  <motion.div
                    key={center}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                  >
                    <span className="text-sm font-medium text-green-300">{center}</span>
                    <span className="text-xs text-slate-400">{CENTER_THEMES[center] || ''}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-medium text-white mb-2">Otvorené centrá</h3>
              <p className="text-xs text-slate-400 mb-3">Otvorené centrá nie sú slabosti -- sú to oblasti, kde absorbujete a zosilňujete energiu okolia. Práve tu sa učíte a získavate múdrosť, ak sa nenechávate kondicionovať.</p>
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
                      <span className="text-sm font-medium text-amber-300">{center}</span>
                      <span className="text-xs text-slate-400">{CENTER_THEMES[center] || ''}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Zosilňujete túto energiu od ostatných. Otázka: "Je to moja energia alebo cudzia?"</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {result.channels.length > 0 && (
            <GlassCard>
              <h3 className="font-medium text-white mb-4">Aktívne kanály</h3>
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
                      <span className="text-sm font-medium text-white">{channel.name}</span>
                      <span className="text-xs text-indigo-300">{channel.gates[0]}-{channel.gates[1]}</span>
                    </div>
                    <span className="text-xs text-slate-400">{channel.centers[0]} → {channel.centers[1]}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* GENOVE KLUCE */}
          {(() => {
            const allGates = [...new Set([
              ...result.personalityGates.map(g => g.gate),
              ...result.designGates.map(g => g.gate),
            ])];
            const geneKeysList: GeneKey[] = getGeneKeysForGates(allGates);
            if (geneKeysList.length === 0) return null;

            // Najdôležitejšie: Slnko personality + Slnko design (inkarnačný kríž)
            const sunGate = result.personalityGates.find(g => g.planet === 'Slnko')?.gate;
            const earthGate = result.personalityGates.find(g => g.planet === 'Zem')?.gate;
            const primaryGates = [sunGate, earthGate].filter((g): g is number => g !== undefined);
            const primaryKeys = geneKeysList.filter(gk => primaryGates.includes(gk.gate));
            const secondaryKeys = geneKeysList.filter(gk => !primaryGates.includes(gk.gate));

            return (
              <>
                <GlassCard>
                  <h3 className="font-medium text-white mb-3">Génové kľúče — čo to je a čo si z toho vziať</h3>
                  <div className="space-y-3 text-sm text-slate-300">
                    <p>
                      Každá brána v tvojom dizajne má <strong className="text-white">tri frekvencie</strong> — ako tri poschodia toho istého domu:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-xs font-bold text-red-300">Tieň</p>
                        <p className="text-[10px] text-slate-400">Keď si pod tlakom, nevedomý. Kde „uviazneš".</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs font-bold text-amber-300">Dar</p>
                        <p className="text-[10px] text-slate-400">Keď si vedomý a autentický. Tvoja sila.</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs font-bold text-emerald-300">Siddhi</p>
                        <p className="text-[10px] text-slate-400">Najvyššia forma. Vzácna, ale ukazuje smer.</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      Prakticky: rozpoznaj tieň (bez súdenia), žij dar (vedomá voľba). Siddhi príde samo, keď prestaneš tlačiť.
                    </p>
                  </div>
                </GlassCard>

                {/* Primárne kľúče — Slnko + Zem (najdôležitejšie) */}
                {primaryKeys.length > 0 && (
                  <GlassCard glow>
                    <h3 className="font-medium text-white mb-2">Tvoje hlavné génové kľúče</h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Tieto sú z tvojho vedomého Slnka a Zeme — definujú tvoju <strong>životnú tému</strong>. Ak pracuješ len s dvoma kľúčmi, vyber si tieto.
                    </p>
                    <div className="space-y-4">
                      {primaryKeys.map(gk => (
                        <div key={gk.gate} className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-9 h-9 rounded-full bg-indigo-500/30 text-indigo-200 font-bold flex items-center justify-center">{gk.gate}</span>
                            <div>
                              <p className="text-sm font-medium text-white">Génový kľúč {gk.gate}</p>
                              <p className="text-[10px] text-slate-400">{gk.gate === sunGate ? 'Vedomé Slnko — tvoja hlavná životná téma' : 'Vedomá Zem — tvoje zakotvenie'}</p>
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
                            <p><span className="text-red-400 font-medium">Tieň:</span> {gk.shadowDescription}</p>
                            <p><span className="text-amber-400 font-medium">Dar:</span> {gk.giftDescription}</p>
                          </div>

                          <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-[10px] text-emerald-400 uppercase mb-1">Čo s tým prakticky</p>
                            <p className="text-xs text-slate-300">
                              Keď zistíš, že si v tieni (<em>{gk.shadow.toLowerCase()}</em>) — zastav sa. Nie je to chyba, je to signál.
                              Vedomá voľba: prejdi k daru (<em>{gk.gift.toLowerCase()}</em>).
                              {gk.nlpTechnique && <> Technika: <strong>{gk.nlpTechnique}</strong> — {gk.nlpDescription}</>}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Ostatné kľúče — collapsible */}
                {secondaryKeys.length > 0 && (
                  <GlassCard>
                    <details>
                      <summary className="text-sm font-medium text-indigo-700 cursor-pointer hover:text-indigo-800 select-none">
                        Ďalšie génové kľúče ({secondaryKeys.length}) — planéty a design
                      </summary>
                      <p className="text-xs text-slate-500 mt-2 mb-4">
                        Tieto kľúče sú z ďalších planét a nevedomého dizajnu. Sú dôležité, ale nie tak urgentné ako hlavné dva.
                      </p>
                      <div className="space-y-3 mt-3">
                        {secondaryKeys.map(gk => (
                          <div key={gk.gate} className="p-3 rounded-xl glass-light">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-7 h-7 rounded-full bg-slate-700/50 text-slate-300 font-bold text-xs flex items-center justify-center">{gk.gate}</span>
                              <span className="text-sm text-white">Kľúč {gk.gate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs mb-2">
                              <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-300">{gk.shadow}</span>
                              <span className="text-slate-500">→</span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300">{gk.gift}</span>
                              <span className="text-slate-500">→</span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">{gk.siddhi}</span>
                            </div>
                            <p className="text-xs text-slate-400">{gk.shadowDescription}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </GlassCard>
                )}
              </>
            );
          })()}

          {/* Variable — 4 šípky (PHS, Environment, Motivation, Perspective) */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">Variable — strava, prostredie, motivácia</h3>
            <p className="text-xs text-slate-500 mb-4">
              4 „šípky" v tvojom HD grafe ukazujú ako tvoje telo a myseľ optimálne fungujú — aké jedlo, prostredie a spôsob myslenia ti vyhovuje.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-green-400 uppercase mb-1">Strava (PHS Digestion)</p>
                <p className="text-sm text-white font-medium">{result.variable.digestion.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{result.variable.digestion.description}</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-xs text-cyan-400 uppercase mb-1">Prostredie (Environment)</p>
                <p className="text-sm text-white font-medium">{result.variable.environment.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{result.variable.environment.description}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-400 uppercase mb-1">Motivácia (čo ťa poháňa)</p>
                <p className="text-sm text-white font-medium">{result.variable.motivation.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{result.variable.motivation.description}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-400 uppercase mb-1">Perspektíva (ako vidíš svet)</p>
                <p className="text-sm text-white font-medium">{result.variable.perspective.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{result.variable.perspective.description}</p>
              </div>
            </div>
          </GlassCard>

          {/* AI výklad Human Design */}
          {subject && (
            <AIChat
              context={{
                name: subject.name,
                gender: subject.gender,
                birth: {
                  day: subject.birthDay,
                  month: subject.birthMonth,
                  year: subject.birthYear,
                  hour: subject.birthHour,
                  minute: subject.birthMinute,
                  place: subject.birthPlace,
                },
                humanDesign: result,
              }}
              title="✦ AI výklad Human Design"
              initialUserMessage={`Vyhotov mi prosím detailný výklad môjho Human Designu. Som ${result.type}, profil ${result.profile.line1}/${result.profile.line2} (${result.profile.name}), autorita ${result.authority}, stratégia "${result.strategy}". Inkarnačný kríž: ${result.incarnationCross}. Definované centrá: ${result.definedCenters.join(', ')}. Otvorené: ${result.openCenters.join(', ')}. Kanály: ${result.channels.map(c => c.name).join(', ')}. Vysvetli čo to znamená pre môj život, vzťahy a rozhodovanie.`}
              storageKey={`hd-${subject.id}`}
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
