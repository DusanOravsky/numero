import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { VibrationCard } from '../components/VibrationCard';
import { ClientSummary } from '../components/ClientSummary';
import { calculateFullNumerology, calculateORV, calculateOMV, calculateODV, reduceToSingle, getGridCount } from '../engine/numerologyEngine';
import { evaluateChakras } from '../engine/chakraEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import { calculateKabalah } from '../engine/kabalahEngine';
import { calculateThetaHealing } from '../engine/thetaHealingEngine';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import { enneagramTypes } from '../data/enneagram';
import { ETIKOTERAPIA_BY_CHAKRA } from '../data/etikoterapia';
import { deriveDosha } from '../engine/ayurvedaEngine';
import { deriveTCMElement } from '../engine/tcmEngine';
import { orvDescriptions } from '../data/orvDescriptions';
import { omvDescriptions } from '../data/omvDescriptions';
import { odvDescriptions } from '../data/odvDescriptions';
import { getDailyMantra, getDailyQuote } from '../data/mantrasAndQuotes';
import { getDailyTarot } from '../data/tarotCards';
import { ClientExport } from '../components/ClientExport';
import { getTimezoneFromCoords } from '../data/cities';
import { getGeneKeyByGate } from '../data/geneKeys';

export function Dashboard() {
  const navigate = useNavigate();
  const { profiles, activeProfileId, numerologyMethod, clients } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [lastViewedId, setLastViewedId] = useState<string | null>(() => localStorage.getItem('last-viewed-client'));
  const lastClient = lastViewedId ? clients.find(c => c.id === lastViewedId) : null;

  const [today] = useState(() => new Date());
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Lokálna notifikácia — raz denne pri otvorení appky
  useEffect(() => {
    if (!profile) return;
    const enabled = localStorage.getItem('daily-notification') === 'true';
    if (!enabled) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    const todayKey = today.toISOString().split('T')[0];
    const lastNotif = localStorage.getItem('last-daily-notif');
    if (lastNotif === todayKey) return;

    localStorage.setItem('last-daily-notif', todayKey);

    const orv = calculateORV(profile.birthDay, profile.birthMonth, currentYear, currentMonth, currentDay);
    const odv = calculateODV(orv, currentDay, currentMonth);
    const odvLabels: Record<number, string> = { 1: 'Začiatky', 2: 'Vzťahy', 3: 'Kreativita', 4: 'Práca', 5: 'Zmena', 6: 'Láska', 7: 'Introspekcia', 8: 'Manifestácia', 9: 'Uzatváranie' };
    const desc = odvLabels[odv] || '';

    new Notification('Integrálna mapa bytia', {
      body: `Dnešná energia (ODV ${odv}): ${desc}`,
      icon: `${import.meta.env.BASE_URL}icons/logo.svg`,
    });
  }, [profile, today, currentDay, currentMonth, currentYear]);

  let orv = 0, omv = 0, odv = 0;
  if (profile) {
    orv = calculateORV(profile.birthDay, profile.birthMonth, currentYear, currentMonth, currentDay);
    omv = calculateOMV(orv, currentMonth);
    odv = calculateODV(orv, currentDay, currentMonth);
  }

  const universalDay = reduceToSingle(currentDay + currentMonth + currentYear);

  const fullResults = useMemo(() => {
    if (!profile) return null;
    const numerology = calculateFullNumerology(profile.birthDay, profile.birthMonth, profile.birthYear);
    const developmental = calculateDevelopmentalNumerology(profile.birthDay, profile.birthMonth, profile.birthYear);
    const lat = profile.birthLatitude ?? 48.15;
    const lon = profile.birthLongitude ?? 17.11;
    const tz = getTimezoneFromCoords(lat, lon);
    const astrology = calculateAstrology(profile.birthDay, profile.birthMonth, profile.birthYear, profile.birthHour ?? 12, profile.birthMinute ?? 0, lat, lon, tz);
    const humanDesign = calculateHumanDesign(profile.birthDay, profile.birthMonth, profile.birthYear, profile.birthHour ?? 12, profile.birthMinute ?? 0, tz);
    const lp = numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber;
    const kabalah = calculateKabalah(lp, reduceToSingle(profile.birthDay));
    const theta = calculateThetaHealing(lp);
    const enneagram = deriveEnneagramType(numerology, developmental, numerologyMethod);
    const dosha = deriveDosha(numerology, astrology, humanDesign);
    const tcm = deriveTCMElement(numerology, astrology);
    const gridCounts = getGridCount(numerology.grid);
    const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement);
    return { numerology, developmental, astrology, humanDesign, kabalah, theta, enneagram, dosha, tcm, chakras };
  }, [profile, numerologyMethod]);

  const affirmations: Record<number, string> = {
    1: 'Dnes začínam s odvahou a jasnosťou.',
    2: 'Dnes som otvorený/á hlbokému prepojeniu.',
    3: 'Dnes tvorím a vyjadrujem svoju pravdu.',
    4: 'Dnes budujem s trpezlivosťou a láskou.',
    5: 'Dnes vítam nové s dôverou.',
    6: 'Dnes milujem bezpodmienečne.',
    7: 'Dnes počúvam svoju vnútornú múdrosť.',
    8: 'Dnes manifestujem svoju víziu.',
    9: 'Dnes púšťam staré a vytváram priestor.',
  };

  const dailyRituals: Record<number, { morning: string; evening: string; body: string }> = {
    1: {
      morning: 'Ranná meditácia zameraná na vizualizáciu nového začiatku. 5 minút dýchania ohňom (kapalabhati) pre aktiváciu energie.',
      evening: 'Čo nové som dnes začal/a? Kde som prejavil/a odvahu?',
      body: 'Kardio aktivita alebo rýchla prechádzka. Telo potrebuje pohyb a dynamiku.',
    },
    2: {
      morning: 'Ranná meditácia v páre alebo so zameraním na srdcovú čakru. Pomalé, hlboké dýchanie (4-7-8) pre upokojenie.',
      evening: 'Komu som dnes venoval/a pozornosť? Kde som prejavil/a trpezlivosť?',
      body: 'Jemný strečing alebo joga. Telo potrebuje jemnosť a láskavý dotyk.',
    },
    3: {
      morning: 'Ranná tvorivá meditácia – vizualizácia farieb a tvarov. Striedavé dýchanie nozdier (nadi shodhana) pre vyváženie.',
      evening: 'Čo som dnes vytvoril/a? Ako som sa vyjadril/a?',
      body: 'Tanec, spev alebo akákoľvek tvorivá pohybová aktivita. Telo chce tvoriť.',
    },
    4: {
      morning: 'Ranná meditácia na zakorenenie – vizualizácia koreňov do zeme. Boxové dýchanie (4-4-4-4) pre stabilitu.',
      evening: 'Čo som dnes vybudoval/a? Kde som prejavil/a disciplínu?',
      body: 'Silový tréning alebo práca v záhrade. Telo potrebuje pocit stability a sily.',
    },
    5: {
      morning: 'Ranná meditácia na otvorenosť – vizualizácia otvorených dverí a ciest. Energizujúce dýchanie (bhastrika) pre vitalitu.',
      evening: 'Čo nové som dnes zažil/a? Kde som bol/a flexibilný/á?',
      body: 'Nová pohybová aktivita – niečo, čo ste ešte neskúsili. Telo túži po novosti.',
    },
    6: {
      morning: 'Ranná meditácia na srdcovú čakru s mantrou lásky. Dýchanie do srdca (coherent breathing) pre harmóniu.',
      evening: 'Koho som dnes miloval/a? Kde som vytvoril/a harmóniu?',
      body: 'Párová aktivita alebo masáž. Telo potrebuje láskyplný kontakt a starostlivosť.',
    },
    7: {
      morning: 'Hlboká tichá meditácia – 10-15 minút v úplnom tichu. Pomalé brušné dýchanie pre vnútorný pokoj.',
      evening: 'Čo som sa dnes naučil/a? Aký vnútorný hlas som počul/a?',
      body: 'Prechádzka v prírode v tichu. Telo potrebuje pokoj a spojenie s prírodou.',
    },
    8: {
      morning: 'Ranná vizualizácia úspechu a hojnosti. Silové dýchanie (wim hof metóda) pre energiu a odhodlanie.',
      evening: 'Čo som dnes zmanifestoval/a? Kde som prejavil/a svoju silu?',
      body: 'Intenzívny tréning alebo výzva. Telo potrebuje cítiť svoju moc a schopnosti.',
    },
    9: {
      morning: 'Meditácia odpustenia a vďačnosti. Dýchanie s predĺženým výdychom pre uvoľnenie starého.',
      evening: 'Čo som dnes pustil/a? Komu som odpustil/a?',
      body: 'Jemná joga alebo plávanie. Telo potrebuje uvoľnenie a regeneráciu.',
    },
  };

  if (!profile) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <img
            src={`${import.meta.env.BASE_URL}icons/logo.svg`}
            alt="Integrálna mapa bytia"
            className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-6 drop-shadow-lg"
          />
          <h1 className="font-serif text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Integrálna mapa bytia
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
            Váš osobný sprievodca sebapoznaním. Offline. Súkromne. Profesionálne.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-lg hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 glow"
          >
            Začať cestu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-white">
            Vitajte, {profile.name}
          </h1>
          <p className="text-slate-400 mt-1">
            {today.toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Univerzálny deň</p>
          <p className="text-2xl font-serif font-bold text-indigo-400">{universalDay}</p>
        </div>
      </div>

      {lastClient && (
        <div className="relative w-full">
          <button
            onClick={() => navigate(`/clients/${lastClient.id}`)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors text-left"
          >
            <span className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white">♟</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">Posledný klient</p>
              <p className="text-sm font-medium text-amber-900 truncate">{lastClient.name}</p>
            </div>
            <span className="text-amber-600 text-sm">→</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); localStorage.removeItem('last-viewed-client'); setLastViewedId(null); }}
            className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-amber-400 hover:text-amber-700 hover:bg-amber-100 transition-colors"
            aria-label="Skryť posledného klienta"
          >
            ✕
          </button>
        </div>
      )}

      {/* ═══ MORNING BRIEF — vždy viditeľné ═══ */}
      <div className="flex items-center gap-3 pt-2">
        <span className="text-xs uppercase tracking-widest text-indigo-500 font-semibold whitespace-nowrap">Ranný brief</span>
        <div className="flex-1 h-px bg-gradient-to-r from-indigo-300 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <VibrationCard
          title="ORV – Ročná vibrácia"
          value={orv}
          subtitle="Osobná ročná vibrácia"
          icon="✦"
          color="indigo"
          delay={0.1}
          formula={profile ? `D(${profile.birthDay}) + M(${profile.birthMonth}) + R(${currentMonth < profile.birthMonth || (currentMonth === profile.birthMonth && currentDay < profile.birthDay) ? currentYear - 1 : currentYear}) → ${orv}` : ''}
          description="ORV ukazuje energiu celého roka od narodenín do narodenín. Určuje hlavné témy a úlohy, na ktoré sa v danom roku zameriavate. Počíta sa z dňa a mesiaca narodenia + aktuálny rok (od posledných narodenín)."
        />
        <VibrationCard
          title="OMV – Mesačná vibrácia"
          value={omv}
          subtitle="Osobná mesačná vibrácia"
          icon="☽"
          color="purple"
          delay={0.2}
          formula={`M(${currentMonth}) + ORV(${orv}) = ${currentMonth + orv} → ${omv}`}
          description="OMV špecifikuje energiu aktuálneho mesiaca vo vašom osobnom roku. Ukazuje, aké úlohy a témy sú pre vás dôležité práve tento mesiac."
        />
        <VibrationCard
          title="ODV – Denná vibrácia"
          value={odv}
          subtitle="Osobná denná vibrácia"
          icon="☀"
          color="gold"
          delay={0.3}
          formula={`D(${currentDay}) + M(${currentMonth}) + ORV(${orv}) = ${currentDay + currentMonth + orv} → ${odv}`}
          description="ODV je charakteristická energia dnešného dňa. Určuje úlohu a tému konkrétneho dňa – čomu by ste mali venovať pozornosť a aké aktivity sú podporované."
        />
      </div>


      {/* JEDNA VEC NA DNES — syntetizovaná akcia zo všetkých systémov */}
      {fullResults && odvDescriptions[odv] && (
        <GlassCard glow delay={0.33}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl shrink-0">
              🎯
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">Jedna vec na dnes</h3>
              <p className="text-sm text-slate-300">
                {(() => {
                  const odvDayThemes: Record<number, string> = {
                    1: 'začiatkov a iniciatívy', 2: 'spolupráce a vzťahov', 3: 'kreativity a sebavyjadrenia',
                    4: 'práce a budovania', 5: 'zmien a slobody', 6: 'lásky a harmónie',
                    7: 'introspekcie a ticha', 8: 'manifestácie a sily', 9: 'uzatvárania a odpúšťania',
                  };
                  const odvTheme = odvDayThemes[odv] || '';
                  const enneaGrowth = fullResults.enneagram
                    ? enneagramTypes[fullResults.enneagram.integrationDirection]?.name
                    : null;
                  const hdStrategy = fullResults.humanDesign?.strategy?.toLowerCase() || '';

                  if (odv <= 3) return `Dnes je deň ${odvTheme}. ${enneaGrowth ? `Vyskúšaj sa priblížiť k energii „${enneaGrowth}". ` : ''}Pamätaj: tvoja stratégia je „${hdStrategy}".`;
                  if (odv <= 6) return `Energia dňa: ${odvTheme}. ${enneaGrowth ? `Smeruj k „${enneaGrowth}" — ` : ''}dnes je ideálny čas na jednu konkrétnu vec z tejto oblasti. Nemusíš veľa — stačí krok.`;
                  return `Dnes je deň ${odvTheme}. ${enneaGrowth ? `Integračný smer „${enneaGrowth}" ti pomôže. ` : ''}Stratégia: „${hdStrategy}" — počúvaj telo, nie hlavu.`;
                })()}
              </p>
              {dailyRituals[odv] && (
                <p className="text-xs text-amber-300 mt-2 italic">
                  Prax: {dailyRituals[odv].morning}
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Dnešná energia — kompaktný prehľad */}
      <GlassCard delay={0.35}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-white">Dnešná energia</h3>
          {orvDescriptions[orv] && (
            <span className="text-xs text-indigo-300">Rok: {orvDescriptions[orv].title}</span>
          )}
        </div>
        <p className="text-slate-300 font-serif text-lg italic mb-3">
          "{affirmations[odv] || affirmations[1]}"
        </p>
        {fullResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fullResults.enneagram && enneagramTypes[fullResults.enneagram.coreType] && (() => {
              const intType = enneagramTypes[fullResults.enneagram.integrationDirection];
              const growthPath = enneagramTypes[fullResults.enneagram.coreType].growthPath;
              const sentences = growthPath.split('. ').filter(s => s.length > 10);
              if (sentences.length === 0) return (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-700 font-medium">Enneagram: smeruj k {intType?.name}</p>
                </div>
              );
              const dayOfYear = Math.floor((today.getTime() - new Date(currentYear, 0, 0).getTime()) / 86400000);
              const tipIdx = dayOfYear % sentences.length;
              const tip = sentences[tipIdx];
              return (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-700 font-medium">Enneagram: smeruj k {intType?.name}</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5 italic">{tip}{tip.endsWith('.') ? '' : '.'}</p>
                </div>
              );
            })()}
            {(() => {
              const chakraIdx = odv <= 7 ? odv : odv - 7;
              const etiko = ETIKOTERAPIA_BY_CHAKRA[chakraIdx];
              if (!etiko || !etiko.reflectionQuestions.length) return null;
              const questionIdx = (currentDay + currentMonth) % etiko.reflectionQuestions.length;
              return (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <p className="text-xs text-rose-300 italic">„{etiko.reflectionQuestions[questionIdx]}"</p>
                  <p className="text-[10px] text-rose-400 mt-1 font-medium">Cnosť dňa: {etiko.liberatingVirtue}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{etiko.practicalPath}</p>
                </div>
              );
            })()}
            {fullResults.kabalah && (
              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-xs text-violet-700">{fullResults.kabalah.malchutAction}</p>
              </div>
            )}
            {(() => {
              const geneKey = getGeneKeyByGate(odv);
              if (!geneKey) return null;
              return (
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-xs text-cyan-300 font-medium">Gene Key {odv}: {geneKey.shadow} → {geneKey.gift}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{geneKey.giftDescription.slice(0, 80)}…</p>
                </div>
              );
            })()}
          </div>
        )}
        {dailyRituals[odv] && (
          <p className="text-xs mt-3" style={{ color: '#475569' }}><strong style={{ color: '#1e293b' }}>Večer:</strong> {dailyRituals[odv].evening}</p>
        )}
      </GlassCard>

      {/* Mantra + Quote + Tarot — pred Detaily a inšpirácie */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <GlassCard delay={0.42}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-lg shrink-0">
              ॐ
            </div>
            <div className="min-w-0">
              <p className="text-xs text-amber-300 uppercase mb-1">Dnešná mantra</p>
              <p className="text-sm text-slate-300 font-serif italic">"{getDailyMantra(odv)}"</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.44}>
          {(() => {
            const q = getDailyQuote(odv);
            return (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg shrink-0">
                  ❝
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-cyan-300 uppercase mb-1">Dnešný citát</p>
                  <p className="text-sm text-slate-300 font-serif italic">"{q.quote}"</p>
                  <p className="text-xs text-slate-500 mt-1">— {q.author}</p>
                </div>
              </div>
            );
          })()}
        </GlassCard>
        <GlassCard delay={0.46}>
          {(() => {
            const t = getDailyTarot(odv);
            return (
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-lg shrink-0">
                    {t.symbol}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-purple-300 uppercase mb-1">Tarot dňa: {t.name}</p>
                    <p className="text-xs text-slate-400">{t.dailyAdvice}</p>
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="text-[11px] text-purple-400 cursor-pointer hover:text-purple-300">
                    Plný výklad karty {t.name}
                  </summary>
                  <div className="mt-2 space-y-2 text-xs">
                    <p className="text-slate-300"><strong className="text-purple-300">Význam:</strong> {t.meaning}</p>
                    <p className="text-slate-300"><strong className="text-rose-300">Tieň:</strong> {t.shadow}</p>
                    <p className="text-slate-300"><strong className="text-emerald-300">Rada:</strong> {t.advice}</p>
                  </div>
                </details>
              </div>
            );
          })()}
        </GlassCard>
      </div>

      {/* ═══ DETAILY A INŠPIRÁCIE — collapsible ═══ */}
      <details className="group" open>
        <summary className="cursor-pointer list-none flex items-center gap-2 py-2">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Detaily a inšpirácie</span>
          <div className="flex-1 h-px bg-gradient-to-r from-amber-400/30 to-transparent"></div>
          <span className="text-amber-400 transition-transform group-open:rotate-180">▾</span>
        </summary>
        <div className="space-y-6 mt-4">

      {/* Detail dennej energie */}
      {odvDescriptions[odv] && dailyRituals[odv] && (
        <GlassCard delay={0.50}>
          <details open>
            <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
              <span className="font-medium text-white">Detail dennej energie (ODV {odv})</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p className="text-sm text-slate-300">{odvDescriptions[odv].advice}</p>
              <div className="flex flex-wrap gap-1">
                {odvDescriptions[odv].keywords.map(k => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300">{k}</span>
                ))}
              </div>
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 mt-2">
                <p className="text-xs text-green-300">Telo: {dailyRituals[odv].body}</p>
              </div>
            </div>
          </details>
        </GlassCard>
      )}

      {/* Detail mesačnej energie */}
      {omvDescriptions[omv] && (
        <GlassCard delay={0.52}>
          <details open>
            <summary className="cursor-pointer hover:text-purple-300 transition-colors">
              <span className="font-medium text-white">Detail mesačnej energie (OMV {omv})</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p className="text-sm text-slate-300">{omvDescriptions[omv].advice}</p>
              <div className="flex flex-wrap gap-1">
                {omvDescriptions[omv].keywords.map(k => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">{k}</span>
                ))}
              </div>
              <p className="text-xs text-purple-400 italic mt-2">{omvDescriptions[omv].theme}</p>
            </div>
          </details>
        </GlassCard>
      )}

      {/* Mesačný ODV kalendár */}
      {profile && (
        <GlassCard delay={0.54}>
          <details>
            <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
              <span className="font-medium text-white">Kalendár energie — {today.toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' })}</span>
            </summary>
            <div className="mt-3">
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map(d => (
                  <p key={d} className="text-[9px] text-slate-500 font-medium">{d}</p>
                ))}
                {(() => {
                  const firstDay = new Date(currentYear, currentMonth - 1, 1);
                  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
                  const startIdx = (firstDay.getDay() + 6) % 7;
                  const cells = [];
                  for (let i = 0; i < startIdx; i++) cells.push(<div key={`e${i}`} />);
                  for (let d = 1; d <= daysInMonth; d++) {
                    const dayOrv = calculateORV(profile.birthDay, profile.birthMonth, currentYear, currentMonth, d);
                    const dayOdv = calculateODV(dayOrv, d, currentMonth);
                    const isT = d === currentDay;
                    const cat = (dayOdv === 1 || dayOdv === 3 || dayOdv === 8) ? 'creative' :
                                (dayOdv === 4 || dayOdv === 9) ? 'work' :
                                (dayOdv === 2 || dayOdv === 6) ? 'heart' : 'inner';
                    cells.push(
                      <div key={d} className={`p-0.5 rounded ${
                        isT ? 'ring-2 ring-indigo-400' : ''
                      } ${
                        cat === 'creative' ? 'bg-green-500/15' :
                        cat === 'work' ? 'bg-amber-500/15' :
                        cat === 'heart' ? 'bg-rose-500/15' :
                        'bg-violet-500/15'
                      }`}>
                        <p className="text-[10px] text-slate-700 font-medium">{d}</p>
                        <p className={`text-xs font-bold ${
                          cat === 'creative' ? 'text-green-600' :
                          cat === 'work' ? 'text-amber-600' :
                          cat === 'heart' ? 'text-rose-600' :
                          'text-violet-600'
                        }`}>{dayOdv}</p>
                      </div>
                    );
                  }
                  return cells;
                })()}
              </div>
              <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>Tvorivé (1, 3, 8)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Práca (4, 9)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Srdce (2, 6)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500"></span>Vnútro (5, 7)</span>
              </div>
            </div>
          </details>
        </GlassCard>
      )}

        </div>
      </details>

      {/* ═══ HLBŠÍ PROFIL — collapsible (default open) ═══ */}
      <details className="group" open>
        <summary className="cursor-pointer list-none flex items-center gap-2 py-2">
          <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold">Hlbší profil</span>
          <div className="flex-1 h-px bg-gradient-to-r from-violet-400/30 to-transparent"></div>
          <span className="text-violet-400 transition-transform group-open:rotate-180">▾</span>
        </summary>
        <div className="space-y-6 mt-4">

      {/* Integrálny súhrn profilu — v Dashboarde ukáž OBA pohľady na mriežku */}
      {profile && fullResults && (
        <ClientSummary
          clientName={profile.name}
          birthDay={profile.birthDay}
          birthMonth={profile.birthMonth}
          birthYear={profile.birthYear}
          numerology={fullResults.numerology}
          astrology={fullResults.astrology}
          humanDesign={fullResults.humanDesign}
          kabalah={fullResults.kabalah}
          theta={fullResults.theta}
          respectMethodPreference={false}
        />
      )}

      {/* Export vlastného profilu */}
      {profile && fullResults && (
        <ClientExport
          client={{ id: profile.id, name: profile.name, birthDay: profile.birthDay, birthMonth: profile.birthMonth, birthYear: profile.birthYear, birthHour: profile.birthHour, birthMinute: profile.birthMinute, birthPlace: profile.birthPlace }}
          numerology={fullResults.numerology}
          astrology={fullResults.astrology}
          humanDesign={fullResults.humanDesign}
          kabalah={fullResults.kabalah}
          theta={fullResults.theta}
        />
      )}

        </div>
      </details>

    </div>
  );
}
