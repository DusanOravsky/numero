import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { EnergyCard } from '../components/EnergyCard';
import { DateInput } from '../components/DateInput';
import { calculateHumanDesign, CENTER_THEMES } from '../engine/humanDesignEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import { Bodygraph } from '../components/Bodygraph';
import { motion } from 'framer-motion';
import { getGeneKeysForGates } from '../data/geneKeys';
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
  const { profiles, activeProfileId } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [result, setResult] = useState<HumanDesignResult | null>(null);

  const handleCalculate = (day: number, month: number, year: number, hour?: number, minute?: number, lat?: number, lon?: number) => {
    setResult(calculateHumanDesign(day, month, year, hour ?? 12, minute ?? 0)); void lat; void lon;
  };

  useEffect(() => {
    if (profile && !result) {
      setResult(calculateHumanDesign(profile.birthDay, profile.birthMonth, profile.birthYear, profile.birthHour ?? 12, profile.birthMinute ?? 0));
    }
  }, [profile, result]);

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
        <h1 className="font-serif text-3xl font-bold text-white">Human Design</h1>
        <p className="text-slate-400 mt-1">Váš energetický plán</p>
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

          <GlassCard>
            <h3 className="font-medium text-white mb-4 text-center">Bodygraph</h3>
            <Bodygraph result={result} />
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnergyCard title="Profil" value={`${result.profile.line1}/${result.profile.line2}`} subtitle={result.profile.name} color="indigo" delay={0.1} />
            <EnergyCard title="Inkarnačný kríž" value="✝" subtitle={result.incarnationCross} color="gold" delay={0.2} />
            <EnergyCard title="Definované centrá" value={result.definedCenters.length} subtitle={`z 9 centier`} color="cyan" delay={0.3} />
            <EnergyCard title="Kanály" value={result.channels.length} subtitle="aktívne kanály" color="purple" delay={0.4} />
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
            return (
              <GlassCard>
                <h3 className="font-medium text-white mb-4">Génové kľúče</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Génové kľúče (Gene Keys) od Richarda Rudda ukazujú cestu transformácie od tieňa (nízka frekvencia) cez dar (stredná frekvencia) k siddhi (najvyššia frekvencia) pre každú bránu vo vašom dizajne. NLP techniky pomáhajú aktivovať tento transformačný proces.
                </p>
                <div className="space-y-4">
                  {geneKeysList.slice(0, 12).map((gk, idx) => (
                    <motion.div
                      key={gk.gate}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="p-4 rounded-xl glass-light"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-indigo-300">Brána {gk.gate} – Génový kľúč</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-[10px] text-red-400 uppercase">Tieň</p>
                          <p className="text-xs font-medium text-red-300">{gk.shadow}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <p className="text-[10px] text-amber-400 uppercase">Dar</p>
                          <p className="text-xs font-medium text-amber-300">{gk.gift}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-[10px] text-emerald-400 uppercase">Siddhi</p>
                          <p className="text-xs font-medium text-emerald-300">{gk.siddhi}</p>
                        </div>
                      </div>
                      <div className="space-y-1 mb-2">
                        <p className="text-xs text-slate-400"><span className="text-red-400">Tieň:</span> {gk.shadowDescription}</p>
                        <p className="text-xs text-slate-400"><span className="text-amber-400">Dar:</span> {gk.giftDescription}</p>
                        <p className="text-xs text-slate-400"><span className="text-emerald-400">Siddhi:</span> {gk.siddhiDescription}</p>
                      </div>
                      <div className="mt-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <p className="text-[10px] text-indigo-400 uppercase mb-1">NLP technika na transformáciu</p>
                        <p className="text-xs font-medium text-indigo-300">{gk.nlpTechnique}</p>
                        <p className="text-xs text-slate-400 mt-1">{gk.nlpDescription}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            );
          })()}

          <button
            onClick={() => setResult(null)}
            className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white"
          >
            Nový výpočet
          </button>
        </div>
      )}
    </div>
  );
}
