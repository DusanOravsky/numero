import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { DateInput } from '../components/DateInput';
import { calculateKabalah, SEFIROT } from '../engine/kabalahEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import { motion } from 'framer-motion';
import { TreeOfLife } from '../components/TreeOfLife';

export function KabalahPage() {
  const { profiles, activeProfileId } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);
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
        <h1 className="font-serif text-3xl font-bold text-white">Kabala</h1>
        <p className="text-slate-400 mt-1">Strom života a sefírotický systém</p>
      </div>

      {!result && (
        <GlassCard>
          <DateInput onSubmit={handleCalculate} label="Dátum narodenia" />
        </GlassCard>
      )}

      {result && (
        <div className="space-y-6">
          {/* Úvod do Kabaly */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">Čo je Kabala a Strom života</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <strong>Kabala</strong> je staroveká židovská mystická tradícia, ktorá popisuje, ako sa božská energia prejavuje v stvorení. Jej hlavný symbol – <strong>Strom života (Etz Chaim)</strong> – ukazuje 10 svetelných emanácií zvaných <strong>sefiroty</strong>, prepojených 22 cestami. Každá sefira je iná tvár Boha a zároveň archetyp v ľudskej psychike.
              </p>
              <p>
                Strom čítame zhora nadol: od <strong>Keter</strong> (Koruna, čistá božská vôľa) cez postupne hutnejšie sefiroty až po <strong>Malchut</strong> (Kráľovstvo, hmotný svet). Cesta duše vedie obojstranne – energia zostupuje do hmoty <em>(blesk stvorenia)</em> a vedomie sa späť pozdvihuje k Zdroju <em>(cesta návratu)</em>.
              </p>
            </div>
          </GlassCard>

          {/* Tri piliere */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">Tri piliere Stromu života</h3>
            <p className="text-xs text-slate-500 mb-3">
              Sefiroty sú usporiadané do troch zvislých pilierov, ktoré reprezentujú tri základné polarity vedomia. Každá sefira nesie energiu svojho piliera.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1">Pilier Milosrdenstva (vpravo)</p>
                <p className="text-xs text-slate-700">
                  Expanzia, dávanie, mužský princíp, aktívna energia. <strong>Sefiroty:</strong> Chokmah (Múdrosť), Chesed (Milosrdenstvo), Necach (Víťazstvo).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700 font-semibold mb-1">Pilier Stredu (uprostred)</p>
                <p className="text-xs text-slate-700">
                  Rovnováha, vedomie, harmonizácia protikladov. <strong>Sefiroty:</strong> Keter (Koruna), Tiferet (Krása), Jesod (Základ), Malchut (Kráľovstvo).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <p className="text-xs text-rose-700 font-semibold mb-1">Pilier Prísnosti (vľavo)</p>
                <p className="text-xs text-slate-700">
                  Forma, prijímanie, ženský princíp, pasívna/štruktúrujúca energia. <strong>Sefiroty:</strong> Binah (Porozumenie), Geburah (Sila), Hod (Sláva).
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 italic">
              Zdravá psyché potrebuje všetky tri – príliš veľa milosrdenstva = roztečenie, príliš veľa prísnosti = krutosť, stred ich integruje.
            </p>
          </GlassCard>

          {/* 22 ciest */}
          <GlassCard>
            <h3 className="font-medium text-white mb-2">22 ciest medzi sefirotmi</h3>
            <p className="text-sm text-slate-700 mb-2">
              Sefiroty nie sú izolované – spája ich <strong>22 ciest</strong>, ktoré zodpovedajú 22 písmenám hebrejskej abecedy a 22 hlavným kartám tarotu (veľkej arkány). Každá cesta je proces, ktorým duša prechádza pri integrácii dvoch sefír.
            </p>
            <p className="text-xs text-slate-600">
              Vaša osobná „cesta" (zobrazená nižšie) je vlastne výber niekoľkých z týchto 22 ciest – tých, ktoré práve teraz tvoria os vášho vývoja: <strong>od primárnej sefiry cez sekundárnu až po Malchut</strong>, kde sa všetko zhmotňuje.
            </p>
          </GlassCard>

          <GlassCard glow>
            <div className="text-center mb-6">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Vaša primárna sefira</p>
              <h2 className="font-serif text-3xl font-bold text-white mt-2">{result.primarySefira.name}</h2>
              <p className="text-lg text-indigo-300">{result.primarySefira.meaning}</p>
              <p className="text-sm text-slate-400 mt-1">{result.primarySefira.hebrewName}</p>
              <p className="text-xs text-slate-500 mt-3 max-w-md mx-auto">
                Primárna sefira sa určuje z <strong>životného čísla</strong> – zodpovedá energii, ktorú má vaša duša v tomto živote rozpoznať a integrovať. Sekundárna sefira (z dňa narodenia) ukazuje, <strong>cez akú bránu</strong> sa k tejto energii dostávate.
              </p>
            </div>
          </GlassCard>

          {/* Tree of Life vizualizácia (B31) */}
          <TreeOfLife result={result} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-medium text-white mb-3">Primárna sefira: {result.primarySefira.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">Témy</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.primarySefira.themes.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-green-400">Dar</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.gift}</p>
                </div>
                <div>
                  <p className="text-xs text-red-400">Tieň</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.shadow}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Pilier</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.pillar}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Planéta</p>
                  <p className="text-sm text-slate-300">{result.primarySefira.planet}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-medium text-white mb-3">Sekundárna sefira: {result.secondarySefira.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">Témy</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.secondarySefira.themes.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-green-400">Dar</p>
                  <p className="text-sm text-slate-300">{result.secondarySefira.gift}</p>
                </div>
                <div>
                  <p className="text-xs text-red-400">Tieň</p>
                  <p className="text-sm text-slate-300">{result.secondarySefira.shadow}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Vaša cesta po Strome života</h3>
            <p className="text-sm text-indigo-300 font-serif italic mb-3">{result.path}</p>
            <p className="text-sm text-slate-700 mb-3">{result.integration}</p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-600">
                <strong>Prečo cesta vždy končí v Malchut?</strong> Malchut (Kráľovstvo) je sefira hmotného sveta – fyzické telo, peniaze, každodenná realita. V Kabale platí, že akákoľvek duchovná energia má hodnotu len vtedy, keď sa zhmotní v Malchut. Preto je posledným krokom vašej cesty vždy <strong>konkrétna akcia v hmote</strong> (viď „Čin v Malchut" nižšie).
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-3">Životné lekcie</h3>
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
            <h3 className="font-medium text-white mb-2">Čin v Malchut (Kráľovstvo)</h3>
            <p className="text-xs text-slate-400 mb-3">Konkrétny krok pre dnešný deň</p>
            <p className="text-sm text-indigo-300 font-serif">{result.malchutAction}</p>
          </GlassCard>

          {/* Ako pracovať s vašou cestou */}
          <GlassCard>
            <h3 className="font-medium text-white mb-3">Ako pracovať s vašou cestou</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wide mb-1">1. Rozpoznať svoju primárnu energiu</p>
                <p className="text-xs text-slate-700">
                  Pozorujte počas dňa, kedy sa prejavuje energia <strong>{result.primarySefira.name}</strong> ({result.primarySefira.meaning}). Kedy ste v jej dare ({result.primarySefira.gift.toLowerCase()}) a kedy ste v tieni ({result.primarySefira.shadow.toLowerCase()})?
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <p className="text-xs text-purple-700 font-semibold uppercase tracking-wide mb-1">2. Použiť bránu sekundárnej sefiry</p>
                <p className="text-xs text-slate-700">
                  K primárnej energii sa najľahšie dostanete cez <strong>{result.secondarySefira.name}</strong> ({result.secondarySefira.meaning}). Témy ako „{result.secondarySefira.themes.slice(0, 2).join(', ')}" sú vstupnou bránou.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-1">3. Zhmotniť cez Malchut</p>
                <p className="text-xs text-slate-700">
                  Každý deň si zvolte <strong>jednu konkrétnu akciu</strong> v hmote, ktorá vyjadrí dnešnú energiu. Bez tohto kroku zostáva práca abstraktná. Čin pre dnes je v karte vyššie.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <p className="text-xs text-rose-700 font-semibold uppercase tracking-wide mb-1">4. Pracovať s tieňom</p>
                <p className="text-xs text-slate-700">
                  Tieň primárnej sefiry („{result.primarySefira.shadow.toLowerCase()}") sa neignoruje – integruje sa. Keď ho rozpoznáte v sebe, namiesto popretia sa opýtajte: <em>„Čo táto energia chcela ochrániť?"</em>
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">5. Vyvážiť pilier</p>
                <p className="text-xs text-slate-700">
                  Vaša primárna sefira je v pilieri <strong>{result.primarySefira.pillar}</strong>. Vedome dopĺňajte aj druhý pilier:
                  {result.primarySefira.pillar === 'Milosrdenstvo' && ' rozvíjajte aj disciplínu, hranice a štruktúru (pilier Prísnosti).'}
                  {result.primarySefira.pillar === 'Prísnosť' && ' rozvíjajte aj štedrosť, expanziu a otvorenosť (pilier Milosrdenstva).'}
                  {result.primarySefira.pillar === 'Stred' && ' v sebe už máte prístup k oboj polarítam – vašou úlohou je ich harmonizácia v každodenných situáciách.'}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-medium text-white mb-4">Strom života – 10 Sefír</h3>
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

          <button
            onClick={() => setManualResult(null)}
            className="px-4 py-2 rounded-xl text-sm font-medium glass text-slate-400 hover:text-white"
          >
            Nový výpočet
          </button>
        </div>
      )}
    </div>
  );
}
