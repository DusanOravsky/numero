import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubject } from '../hooks/useSubject';
import { useTranslation } from '../i18n/useTranslation';
import { GlassCard } from '../components/GlassCard';
import { DateInput } from '../components/DateInput';
import { calculateKabalah, SEFIROT } from '../engine/kabalahEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import { motion } from 'framer-motion';
import { TreeOfLife } from '../components/TreeOfLife';

export function KabalahPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const profile = useSubject();
  const [manualResult, setManualResult] = useState<KabalahResult | null>(null);

  const profileResult = useMemo<KabalahResult | null>(() => {
    if (!profile) return null;
    const lifePath = reduceToSingle(profile.birthDay + profile.birthMonth + profile.birthYear);
    const dayNum = reduceToSingle(profile.birthDay);
    return calculateKabalah(lifePath, dayNum);
  }, [profile]);

  const result = manualResult ?? profileResult;

  const handleCalculate = (day: number, month: number, year: number) => {
    const lifePath = reduceToSingle(day + month + year);
    const dayNum = reduceToSingle(day);
    setManualResult(calculateKabalah(lifePath, dayNum));
  };

  return (
    <div className="space-y-6">
      <div>
        {profile?.isClient && (
          <button
            onClick={() => navigate(`/clients/${profile.id}`)}
            className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-flex items-center gap-1"
          >
            {t('clients.backToClient')} {profile.name}
          </button>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl font-bold text-white">{t('kabalah.title')}</h1>
          {profile?.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              {language === 'sk' ? 'Klient' : 'Client'}: <strong>{profile.name}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          {profile?.isClient ? (language === 'sk' ? `Kabalistický rozbor klienta ${profile.name}` : `Kabbalistic analysis of client ${profile.name}`) : (language === 'sk' ? 'Strom života a sefírotický systém' : 'Tree of Life and the sefirotic system')}
        </p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} label={t('profile.birthDate')} />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          {/* Úvod do Kabaly */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Čo je Kabala a Strom života' : 'What is Kabbalah and the Tree of Life'}</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                {language === 'sk'
                  ? <><strong>Kabala</strong> je staroveká židovská mystická tradícia, ktorá popisuje, ako sa božská energia prejavuje v stvorení. Jej hlavný symbol – <strong>Strom života (Etz Chaim)</strong> – ukazuje 10 svetelných emanácií zvaných <strong>sefiroty</strong>, prepojených 22 cestami. Každá sefira je iná tvár Boha a zároveň archetyp v ľudskej psychike.</>
                  : <><strong>Kabbalah</strong> is an ancient Jewish mystical tradition that describes how divine energy manifests in creation. Its main symbol – the <strong>Tree of Life (Etz Chaim)</strong> – shows 10 luminous emanations called <strong>sefirot</strong>, connected by 22 paths. Each sefira is a different face of God and simultaneously an archetype in the human psyche.</>
                }
              </p>
              <p>
                {language === 'sk'
                  ? <>Strom čítame zhora nadol: od <strong>Keter</strong> (Koruna, čistá božská vôľa) cez postupne hutnejšie sefiroty až po <strong>Malchut</strong> (Kráľovstvo, hmotný svet). Cesta duše vedie obojstranne – energia zostupuje do hmoty <em>(blesk stvorenia)</em> a vedomie sa späť pozdvihuje k Zdroju <em>(cesta návratu)</em>.</>
                  : <>We read the Tree from top to bottom: from <strong>Keter</strong> (Crown, pure divine will) through progressively denser sefirot down to <strong>Malchut</strong> (Kingdom, the material world). The soul&apos;s path goes both ways – energy descends into matter <em>(the lightning flash of creation)</em> and consciousness ascends back to the Source <em>(the path of return)</em>.</>
                }
              </p>
            </div>
          </GlassCard>

          {/* Tri piliere */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Tri piliere Stromu života' : 'Three Pillars of the Tree of Life'}</h3>
            <p className="text-xs text-slate-500 mb-3">
              {language === 'sk'
                ? 'Sefiroty sú usporiadané do troch zvislých pilierov, ktoré reprezentujú tri základné polarity vedomia. Každá sefira nesie energiu svojho piliera.'
                : 'The sefirot are arranged into three vertical pillars that represent three fundamental polarities of consciousness. Each sefira carries the energy of its pillar.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1">{language === 'sk' ? 'Pilier Milosrdenstva (vpravo)' : 'Pillar of Mercy (right)'}</p>
                <p className="text-xs text-slate-700">
                  {language === 'sk'
                    ? <><strong>Sefiroty:</strong> Chokmah (Múdrosť), Chesed (Milosrdenstvo), Necach (Víťazstvo). Expanzia, dávanie, mužský princíp, aktívna energia.</>
                    : <><strong>Sefirot:</strong> Chokmah (Wisdom), Chesed (Mercy), Netzach (Victory). Expansion, giving, masculine principle, active energy.</>
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700 font-semibold mb-1">{language === 'sk' ? 'Pilier Stredu (uprostred)' : 'Middle Pillar (center)'}</p>
                <p className="text-xs text-slate-700">
                  {language === 'sk'
                    ? <><strong>Sefiroty:</strong> Keter (Koruna), Tiferet (Krása), Jesod (Základ), Malchut (Kráľovstvo). Rovnováha, vedomie, harmonizácia protikladov.</>
                    : <><strong>Sefirot:</strong> Keter (Crown), Tiferet (Beauty), Yesod (Foundation), Malchut (Kingdom). Balance, consciousness, harmonization of opposites.</>
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <p className="text-xs text-rose-700 font-semibold mb-1">{language === 'sk' ? 'Pilier Prísnosti (vľavo)' : 'Pillar of Severity (left)'}</p>
                <p className="text-xs text-slate-700">
                  {language === 'sk'
                    ? <><strong>Sefiroty:</strong> Binah (Porozumenie), Geburah (Sila), Hod (Sláva). Forma, prijímanie, ženský princíp, pasívna/štruktúrujúca energia.</>
                    : <><strong>Sefirot:</strong> Binah (Understanding), Geburah (Strength), Hod (Glory). Form, receiving, feminine principle, passive/structuring energy.</>
                  }
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 italic">
              {language === 'sk'
                ? 'Zdravá psyché potrebuje všetky tri – príliš veľa milosrdenstva = roztečenie, príliš veľa prísnosti = krutosť, stred ich integruje.'
                : 'A healthy psyche needs all three – too much mercy = dissolution, too much severity = cruelty, the middle integrates them.'}
            </p>
          </GlassCard>

          {/* 22 ciest */}
          <GlassCard>
            <h3 className="font-medium text-white mb-2">{language === 'sk' ? '22 ciest medzi sefirotmi' : '22 Paths Between the Sefirot'}</h3>
            <p className="text-sm text-slate-700 mb-2">
              {language === 'sk'
                ? <>Sefiroty nie sú izolované – spája ich <strong>22 ciest</strong>, ktoré zodpovedajú 22 písmenám hebrejskej abecedy a 22 hlavným kartám tarotu (veľkej arkány). Každá cesta je proces, ktorým duša prechádza pri integrácii dvoch sefír.</>
                : <>The sefirot are not isolated – they are connected by <strong>22 paths</strong> corresponding to 22 letters of the Hebrew alphabet and 22 major tarot cards (Major Arcana). Each path is a process through which the soul passes when integrating two sefirot.</>
              }
            </p>
            <p className="text-xs text-slate-600">
              {language === 'sk'
                ? <>Vaša osobná „cesta" (zobrazená nižšie) je vlastne výber niekoľkých z týchto 22 ciest – tých, ktoré práve teraz tvoria os vášho vývoja: <strong>od primárnej sefiry cez sekundárnu až po Malchut</strong>, kde sa všetko zhmotňuje.</>
                : <>Your personal "path" (shown below) is actually a selection of several of these 22 paths – those that currently form the axis of your development: <strong>from the primary sefira through the secondary to Malchut</strong>, where everything materializes.</>
              }
            </p>
          </GlassCard>

          {/* Tvoje čítanie */}
          <GlassCard glow>
            <h3 className="font-medium text-white mb-3">{t('kabalah.yourReading')}</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                {language === 'sk'
                  ? <>Predstav si Strom života ako <strong>mapu tvojej duše</strong>. Máš v nej 10 „staníc" (sefír), z ktorých každá zastupuje inú kvalitu — od čistej inšpirácie hore až po konkrétne činy dole.</>
                  : <>Imagine the Tree of Life as a <strong>map of your soul</strong>. It has 10 "stations" (sefirot), each representing a different quality — from pure inspiration at the top to concrete actions at the bottom.</>
                }
              </p>
              <p>
                {language === 'sk'
                  ? <><strong>Tvoja hlavná stanica</strong> je <span className="text-indigo-300 font-medium">{result.primarySefira.name} ({result.primarySefira.meaning})</span> — to je téma, cez ktorú rastieš. Nie je to niečo, čo „máš" alebo „nemáš" — je to energia, ktorú sa učíš vedome používať.</>
                  : <><strong>Your main station</strong> is <span className="text-indigo-300 font-medium">{result.primarySefira.name} ({result.primarySefira.meaning})</span> — this is the theme through which you grow. It is not something you "have" or "don&apos;t have" — it is an energy you are learning to consciously use.</>
                }
              </p>
              <p>
                <strong>{language === 'sk' ? 'Čo si z toho vziať:' : 'Key takeaways:'}</strong>
              </p>
              <ul className="space-y-1 ml-4">
                <li className="flex items-start gap-2"><span className="text-emerald-400 shrink-0">→</span> {language === 'sk' ? 'Tvoj dar' : 'Your gift'}: {result.primarySefira.gift.toLowerCase()}</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 shrink-0">→</span> {language === 'sk' ? 'Tvoja výzva' : 'Your challenge'}: {result.primarySefira.shadow.toLowerCase()}</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0">→</span> {language === 'sk' ? 'Praktický krok' : 'Practical step'}: {result.malchutAction.toLowerCase()}</li>
              </ul>
            </div>
          </GlassCard>

          {/* Prepojenie so systémami */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Ako to súvisí s ostatnými systémami' : 'How It Connects to Other Systems'}</h3>
            <p className="text-xs text-slate-500 mb-3">
              {language === 'sk'
                ? 'Kabala nie je izolovaný systém — prepája sa s numerológiou aj čakrami. Tu vidíš, kde sa tvoje výsledky stretávajú.'
                : 'Kabbalah is not an isolated system — it connects with numerology and chakras. Here you can see where your results meet.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <p className="text-xs text-indigo-700 font-semibold mb-1">{language === 'sk' ? 'Numerológia → Kabala' : 'Numerology → Kabbalah'}</p>
                <p className="text-xs text-slate-700">
                  {language === 'sk'
                    ? <>Tvoje <strong>životné číslo</strong> určuje primárnu sefiru. Rovnaké číslo, ktoré definuje tvoj charakter v numerológii, definuje aj tvoju duchovnú tému v Kabale.</>
                    : <>Your <strong>life path number</strong> determines the primary sefira. The same number that defines your character in numerology also defines your spiritual theme in Kabbalah.</>
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <p className="text-xs text-purple-700 font-semibold mb-1">{language === 'sk' ? 'Kabala → Čakry' : 'Kabbalah → Chakras'}</p>
                <p className="text-xs text-slate-700">
                  {language === 'sk'
                    ? <>Sefira <strong>{result.primarySefira.name}</strong> zodpovedá <strong>{result.primarySefira.chakra}. čakre</strong>. Keď pracuješ na tejto sefíre, automaticky posilňuješ aj danú čakru.</>
                    : <>Sefira <strong>{result.primarySefira.name}</strong> corresponds to the <strong>{result.primarySefira.chakra}th chakra</strong>. When you work on this sefira, you automatically strengthen the corresponding chakra.</>
                  }
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 italic">
              {language === 'sk'
                ? 'Všetky systémy v tejto appke ukazujú rôzne uhly pohľadu na tú istú osobnosť — nie sú to oddelené informácie, ale časti jednej mapy.'
                : 'All systems in this app show different angles of the same personality — they are not separate information, but parts of one map.'}
            </p>
          </GlassCard>

          <GlassCard glow>
            <div className="text-center mb-6">
              <p className="text-xs text-slate-400 uppercase tracking-wider">{language === 'sk' ? 'Vaša primárna sefira' : 'Your Primary Sefira'}</p>
              <h2 className="font-serif text-3xl font-bold text-white mt-2">{result.primarySefira.name}</h2>
              <p className="text-lg text-indigo-300">{result.primarySefira.meaning}</p>
              <p className="text-sm text-slate-400 mt-1">{result.primarySefira.hebrewName}</p>
              <p className="text-xs text-slate-500 mt-3 max-w-md mx-auto">
                {language === 'sk'
                  ? <>Primárna sefira sa určuje z <strong>životného čísla</strong> – zodpovedá energii, ktorú má vaša duša v tomto živote rozpoznať a integrovať. Sekundárna sefira (z dňa narodenia) ukazuje, <strong>cez akú bránu</strong> sa k tejto energii dostávate.</>
                  : <>The primary sefira is determined from your <strong>life path number</strong> – it corresponds to the energy your soul is meant to recognize and integrate in this life. The secondary sefira (from day of birth) shows <strong>through which gateway</strong> you access this energy.</>
                }
              </p>
            </div>
          </GlassCard>

          {/* Tree of Life vizualizácia (B31) */}
          <TreeOfLife result={result} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-medium text-white mb-3">{t('kabalah.primarySefira')}: {result.primarySefira.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">{language === 'sk' ? 'Témy' : 'Themes'}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.primarySefira.themes.map(th => (
                      <span key={th} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{th}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-green-400">{language === 'sk' ? 'Dar' : 'Gift'}</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.gift}</p>
                </div>
                <div>
                  <p className="text-xs text-red-400">{language === 'sk' ? 'Tieň' : 'Shadow'}</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.shadow}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{language === 'sk' ? 'Pilier' : 'Pillar'}</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.pillar}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{language === 'sk' ? 'Planéta' : 'Planet'}</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.planet}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-medium text-white mb-3">{t('kabalah.secondarySefira')}: {result.secondarySefira.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">{language === 'sk' ? 'Témy' : 'Themes'}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.secondarySefira.themes.map(th => (
                      <span key={th} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{th}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-green-400">{language === 'sk' ? 'Dar' : 'Gift'}</p>
                  <p className="text-sm text-slate-300">{result.secondarySefira.gift}</p>
                </div>
                <div>
                  <p className="text-xs text-red-400">{language === 'sk' ? 'Tieň' : 'Shadow'}</p>
                  <p className="text-sm text-slate-300">{result.secondarySefira.shadow}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Vaša cesta po Strome života' : 'Your Path on the Tree of Life'}</h3>
            <p className="text-sm text-indigo-300 font-serif italic mb-3">{result.path}</p>
            <p className="text-sm text-slate-700 mb-3">{result.integration}</p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-600">
                {language === 'sk'
                  ? <><strong>Prečo cesta vždy končí v Malchut?</strong> Malchut (Kráľovstvo) je sefira hmotného sveta – fyzické telo, peniaze, každodenná realita. V Kabale platí, že akákoľvek duchovná energia má hodnotu len vtedy, keď sa zhmotní v Malchut. Preto je posledným krokom vašej cesty vždy <strong>konkrétna akcia v hmote</strong> (viď „Čin v Malchut" nižšie).</>
                  : <><strong>Why does the path always end in Malchut?</strong> Malchut (Kingdom) is the sefira of the material world – the physical body, money, everyday reality. In Kabbalah, any spiritual energy has value only when it materializes in Malchut. That is why the last step of your path is always a <strong>concrete action in matter</strong> (see "Act in Malchut" below).</>
                }
              </p>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Životné lekcie' : 'Life Lessons'}</h3>
              <div className="space-y-2">
                {result.lifeLessons.map((lesson, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-amber-400 mt-0.5">◆</span>
                    <span className="text-sm text-slate-300">{lesson}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard glow>
              <h3 className="font-medium text-white mb-2">{language === 'sk' ? 'Čin v Malchut (Kráľovstvo)' : 'Act in Malchut (Kingdom)'}</h3>
              <p className="text-xs text-slate-400 mb-3">{language === 'sk' ? 'Konkrétny krok pre dnešný deň' : 'A concrete step for today'}</p>
              <p className="text-sm text-indigo-300 font-serif">{result.malchutAction}</p>
            </GlassCard>
          </div>

          {/* Ako pracovať s vašou cestou */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">{language === 'sk' ? 'Ako pracovať s vašou cestou' : 'How to Work With Your Path'}</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wide mb-1">{language === 'sk' ? '1. Rozpoznať svoju primárnu energiu' : '1. Recognize Your Primary Energy'}</p>
                <p className="text-xs text-slate-700">
                  {language === 'sk'
                    ? <>Pozorujte počas dňa, kedy sa prejavuje energia <strong>{result.primarySefira.name}</strong> ({result.primarySefira.meaning}). Kedy ste v jej dare ({result.primarySefira.gift.toLowerCase()}) a kedy ste v tieni ({result.primarySefira.shadow.toLowerCase()})?</>
                    : <>Observe during the day when the energy of <strong>{result.primarySefira.name}</strong> ({result.primarySefira.meaning}) manifests. When are you in its gift ({result.primarySefira.gift.toLowerCase()}) and when are you in its shadow ({result.primarySefira.shadow.toLowerCase()})?</>
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <p className="text-xs text-purple-700 font-semibold uppercase tracking-wide mb-1">{language === 'sk' ? '2. Použiť bránu sekundárnej sefiry' : '2. Use the Secondary Sefira Gateway'}</p>
                <p className="text-xs text-slate-700">
                  {language === 'sk'
                    ? <>K primárnej energii sa najľahšie dostanete cez <strong>{result.secondarySefira.name}</strong> ({result.secondarySefira.meaning}). Témy ako „{result.secondarySefira.themes.slice(0, 2).join(', ')}" sú vstupnou bránou.</>
                    : <>The easiest way to access your primary energy is through <strong>{result.secondarySefira.name}</strong> ({result.secondarySefira.meaning}). Themes like "{result.secondarySefira.themes.slice(0, 2).join(', ')}" are the gateway.</>
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-1">{language === 'sk' ? '3. Zhmotniť cez Malchut' : '3. Materialize Through Malchut'}</p>
                <p className="text-xs text-slate-700">
                  {language === 'sk'
                    ? <>Každý deň si zvolte <strong>jednu konkrétnu akciu</strong> v hmote, ktorá vyjadrí dnešnú energiu. Bez tohto kroku zostáva práca abstraktná. Čin pre dnes je v karte vyššie.</>
                    : <>Each day, choose <strong>one concrete action</strong> in the material world that expresses today&apos;s energy. Without this step, the work remains abstract. Today&apos;s action is in the card above.</>
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <p className="text-xs text-rose-700 font-semibold uppercase tracking-wide mb-1">{language === 'sk' ? '4. Pracovať s tieňom' : '4. Work With the Shadow'}</p>
                <p className="text-xs text-slate-700">
                  {language === 'sk'
                    ? <>Tieň primárnej sefiry (&ldquo;{result.primarySefira.shadow.toLowerCase()}&rdquo;) sa neignoruje – integruje sa. Keď ho rozpoznáte v sebe, namiesto popretia sa opýtajte: <em>„Čo táto energia chcela ochrániť?"</em></>
                    : <>The shadow of the primary sefira (&ldquo;{result.primarySefira.shadow.toLowerCase()}&rdquo;) is not ignored – it is integrated. When you recognize it in yourself, instead of denial, ask: <em>&ldquo;What was this energy trying to protect?&rdquo;</em></>
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">{language === 'sk' ? '5. Vyvážiť pilier' : '5. Balance the Pillar'}</p>
                <p className="text-xs text-slate-700">
                  {language === 'sk'
                    ? <>Vaša primárna sefira je v pilieri <strong>{result.primarySefira.pillar}</strong>. Vedome dopĺňajte aj druhý pilier:
                      {result.primarySefira.pillar === 'Milosrdenstvo' && ' rozvíjajte aj disciplínu, hranice a štruktúru (pilier Prísnosti).'}
                      {result.primarySefira.pillar === 'Prísnosť' && ' rozvíjajte aj štedrosť, expanziu a otvorenosť (pilier Milosrdenstva).'}
                      {result.primarySefira.pillar === 'Stred' && ' v sebe už máte prístup k oboj polarítam – vašou úlohou je ich harmonizácia v každodenných situáciách.'}</>
                    : <>Your primary sefira is in the <strong>{result.primarySefira.pillar}</strong> pillar. Consciously develop the other pillar as well:
                      {result.primarySefira.pillar === 'Milosrdenstvo' && ' also develop discipline, boundaries, and structure (Pillar of Severity).'}
                      {result.primarySefira.pillar === 'Prísnosť' && ' also develop generosity, expansion, and openness (Pillar of Mercy).'}
                      {result.primarySefira.pillar === 'Stred' && ' you already have access to both polarities – your task is to harmonize them in everyday situations.'}</>
                  }
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-4">{t('kabalah.treeOfLife')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SEFIROT.map((sefira, idx) => (
                <motion.div
                  key={sefira.number}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-3 rounded-xl border ${
                    sefira.name === result.primarySefira.name ? 'border-indigo-500/50 bg-indigo-500/10' :
                    sefira.name === result.secondarySefira.name ? 'border-purple-500/50 bg-purple-500/10' :
                    'border-white/5 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">{sefira.number}</span>
                    <span className="text-sm font-medium text-white">{sefira.name}</span>
                    <span className="text-xs text-slate-500">({sefira.meaning})</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>


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
