import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from '../i18n/useTranslation';
import { WEEKDAY_SHORT, MONTH_NAMES, displayName, ELEMENT_DISPLAY, ZODIAC_DISPLAY, HD_TYPE_DISPLAY } from '../i18n/entityNames';
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
import { getEnneagramType } from '../data/enneagram';
import { getEtikoterapiaForChakra } from '../data/etikoterapia';
import { deriveDosha } from '../engine/ayurvedaEngine';
import { deriveTCMElement } from '../engine/tcmEngine';
import { getOrvDescription } from '../data/orvDescriptions';
import { getOmvDescription } from '../data/omvDescriptions';
import { getOdvDescription } from '../data/odvDescriptions';
import { getDailyMantra, getDailyQuote } from '../data/mantrasAndQuotes';
import { getDailyTarot, getMonthlyTarot } from '../data/tarotCards';
import { ClientExport } from '../components/ClientExport';
import { getTimezoneFromCoords } from '../data/cities';
import { getGeneKeyByGate } from '../data/geneKeys';
import { calculateBiorhythm } from '../engine/biorhythmEngine';
import { getDailyCrystal } from '../data/crystals';
import { generateDailyStory, generateProfileCard, shareOrDownload } from '../components/ShareStory';
import { getAffirmationsPool, getDailyRituals } from '../data/affirmations';
import { safeGet, safeSet, safeRemove } from '../utils/safeStorage';
import { getTodayNameDays, getFirstName } from '../data/namedays';

export function Dashboard() {
  const navigate = useNavigate();
  const { profiles, activeProfileId, numerologyMethod, clients } = useStore(
    useShallow(s => ({ profiles: s.profiles, activeProfileId: s.activeProfileId, numerologyMethod: s.numerologyMethod, clients: s.clients }))
  );
  const { t, language } = useTranslation();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [lastViewedId, setLastViewedId] = useState<string | null>(() => safeGet('last-viewed-client'));
  const lastClient = lastViewedId ? clients.find(c => c.id === lastViewedId) : null;

  const [today] = useState(() => new Date());
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Lokálna notifikácia — raz denne pri otvorení appky
  useEffect(() => {
    if (!profile) return;
    const enabled = safeGet('daily-notification') === 'true';
    if (!enabled) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    const todayKey = today.toISOString().split('T')[0];
    const lastNotif = safeGet('last-daily-notif');
    if (lastNotif === todayKey) return;

    safeSet('last-daily-notif', todayKey);

    const orv = calculateORV(profile.birthDay, profile.birthMonth, currentYear, currentMonth, currentDay);
    const odv = calculateODV(orv, currentDay, currentMonth);
    const odvLabels: Record<number, string> = { 1: t('dashboard.odvLabels1'), 2: t('dashboard.odvLabels2'), 3: t('dashboard.odvLabels3'), 4: t('dashboard.odvLabels4'), 5: t('dashboard.odvLabels5'), 6: t('dashboard.odvLabels6'), 7: t('dashboard.odvLabels7'), 8: t('dashboard.odvLabels8'), 9: t('dashboard.odvLabels9') };
    const desc = odvLabels[odv] || '';

    new Notification(language === 'sk' ? 'Integrálna mapa bytia' : 'Integral Map of Being', {
      body: language === 'sk' ? `Dnešná energia (ODV ${odv}): ${desc}` : `Today's energy (ODV ${odv}): ${desc}`,
      icon: `${import.meta.env.BASE_URL}icons/logo.svg`,
    });
  }, [profile, today, currentDay, currentMonth, currentYear, language, t]);

  const { orv, omv, odv } = useMemo(() => {
    if (!profile) return { orv: 0, omv: 0, odv: 0 };
    const orvVal = calculateORV(profile.birthDay, profile.birthMonth, currentYear, currentMonth, currentDay);
    return {
      orv: orvVal,
      omv: calculateOMV(orvVal, currentMonth),
      odv: calculateODV(orvVal, currentDay, currentMonth),
    };
  }, [profile, currentYear, currentMonth, currentDay]);

  const universalDay = useMemo(
    () => reduceToSingle(currentDay + currentMonth + currentYear),
    [currentDay, currentMonth, currentYear]
  );

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
    const kabalah = calculateKabalah(lp, reduceToSingle(profile.birthDay), language);
    const theta = calculateThetaHealing(lp, language);
    const enneagram = deriveEnneagramType(numerology, developmental, numerologyMethod);
    const dosha = deriveDosha(numerology, astrology, humanDesign);
    const tcm = deriveTCMElement(numerology, astrology);
    const gridCounts = getGridCount(numerology.grid);
    const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement, language);
    return { numerology, developmental, astrology, humanDesign, kabalah, theta, enneagram, dosha, tcm, chakras };
  }, [profile, numerologyMethod, language]);

  const dayOfYear = useMemo(
    () => Math.floor((today.getTime() - new Date(currentYear, 0, 0).getTime()) / 86400000),
    [today, currentYear]
  );

  const affirmations: Record<number, string> = useMemo(() => {
    const pool = getAffirmationsPool(language);
    return Object.fromEntries(
      Object.entries(pool).map(([k, v]) => [k, v[dayOfYear % v.length]])
    );
  }, [language, dayOfYear]);

  const dailyRituals = useMemo(() => getDailyRituals(language), [language]);

  const nameDayInfo = useMemo(() => {
    if (language !== 'sk') return null;
    const todayNames = getTodayNameDays();
    if (todayNames.length === 0) return null;
    const profileFirstName = profile ? getFirstName(profile.name) : '';
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const isProfileNameDay = todayNames.some(n => norm(n) === norm(profileFirstName));
    const clientMatches = clients
      .filter(c => todayNames.some(n => norm(n) === norm(getFirstName(c.name))))
      .map(c => c.name);
    return { todayNames, isProfileNameDay, clientMatches };
  }, [language, profile, clients]);

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
            alt={t('dashboard.appTitle')}
            className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-6 drop-shadow-lg"
          />
          <h1 className="font-serif text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent mb-4 landing-title">
            {t('dashboard.appTitle')}
          </h1>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
            {t('dashboard.appSubtitle')}
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-lg hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 glow"
          >
            {t('dashboard.startJourney')}
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
            {t('dashboard.welcome')}, {profile.name}
          </h1>
          <p className="text-slate-400 mt-1">
            {today.toLocaleDateString(language === 'sk' ? 'sk-SK' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">{t('dashboard.universalDay')}</p>
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
              <p className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">{t('dashboard.lastClient')}</p>
              <p className="text-sm font-medium text-amber-900 truncate">{lastClient.name}</p>
            </div>
            <span className="text-amber-600 text-sm">→</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); safeRemove('last-viewed-client'); setLastViewedId(null); }}
            className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-amber-400 hover:text-amber-700 hover:bg-amber-100 transition-colors"
            aria-label={t('dashboard.hideLastClient')}
          >
            ✕
          </button>
        </div>
      )}

      {nameDayInfo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${nameDayInfo.isProfileNameDay ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300' : 'bg-violet-50 border-violet-200'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{nameDayInfo.isProfileNameDay ? '🎉' : '🗓'}</span>
            <p className="text-xs uppercase tracking-wider text-violet-700 font-semibold">Meniny</p>
          </div>
          {nameDayInfo.isProfileNameDay ? (
            <p className="text-sm text-amber-900 font-medium">
              Všetko najlepšie k meninám, {getFirstName(profile.name)}! 🎂
            </p>
          ) : (
            <p className="text-sm text-violet-900">
              Dnes má meniny: <strong>{nameDayInfo.todayNames.join(', ')}</strong>
            </p>
          )}
          {nameDayInfo.clientMatches.length > 0 && (
            <p className="text-xs text-violet-700 mt-1">
              📋 Klient{nameDayInfo.clientMatches.length > 1 ? 'i' : ''} s meninami dnes: <strong>{nameDayInfo.clientMatches.join(', ')}</strong>
            </p>
          )}
        </motion.div>
      )}

      {/* ═══ MORNING BRIEF — vždy viditeľné ═══ */}
      <div className="flex items-center gap-3 pt-2">
        <span className="text-xs uppercase tracking-widest text-indigo-500 font-semibold whitespace-nowrap">{t('dashboard.morningBrief')}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-indigo-300 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <VibrationCard
          title={language === 'sk' ? 'ODV – Denná vibrácia' : 'ODV – Daily vibration'}
          value={odv}
          subtitle={language === 'sk' ? 'Osobná denná vibrácia' : 'Personal daily vibration'}
          icon="☀"
          color="gold"
          delay={0.1}
          formula={`D(${currentDay}) + M(${currentMonth}) + ORV(${orv}) = ${currentDay + currentMonth + orv} → ${odv}`}
          description={language === 'sk' ? 'ODV je charakteristická energia dnešného dňa. Určuje úlohu a tému konkrétneho dňa – čomu by ste mali venovať pozornosť a aké aktivity sú podporované.' : 'ODV is the characteristic energy of today. It determines the task and theme of the specific day — what you should pay attention to and which activities are supported.'}
        />
        <VibrationCard
          title={language === 'sk' ? 'OMV – Mesačná vibrácia' : 'OMV – Monthly vibration'}
          value={omv}
          subtitle={language === 'sk' ? 'Osobná mesačná vibrácia' : 'Personal monthly vibration'}
          icon="☽"
          color="purple"
          delay={0.2}
          formula={`M(${currentMonth}) + ORV(${orv}) = ${currentMonth + orv} → ${omv}`}
          description={language === 'sk' ? 'OMV špecifikuje energiu aktuálneho mesiaca vo vašom osobnom roku. Ukazuje, aké úlohy a témy sú pre vás dôležité práve tento mesiac.' : 'OMV specifies the energy of the current month in your personal year. It shows what tasks and themes are important for you this month.'}
        />
        <VibrationCard
          title={language === 'sk' ? 'ORV – Ročná vibrácia' : 'ORV – Yearly vibration'}
          value={orv}
          subtitle={language === 'sk' ? 'Osobná ročná vibrácia' : 'Personal yearly vibration'}
          icon="✦"
          color="indigo"
          delay={0.3}
          formula={profile ? `D(${profile.birthDay}) + M(${profile.birthMonth}) + R(${currentMonth < profile.birthMonth || (currentMonth === profile.birthMonth && currentDay < profile.birthDay) ? currentYear - 1 : currentYear}) → ${orv}` : ''}
          description={language === 'sk' ? 'ORV ukazuje energiu celého roka od narodenín do narodenín. Určuje hlavné témy a úlohy, na ktoré sa v danom roku zameriavate. Počíta sa z dňa a mesiaca narodenia + aktuálny rok (od posledných narodenín).' : 'ORV shows the energy of the entire year from birthday to birthday. It determines the main themes and tasks you focus on in a given year. It is calculated from the day and month of birth + current year (from the last birthday).'}
        />
      </div>


      {/* JEDNA VEC NA DNES — syntetizovaná akcia zo všetkých systémov */}
      {fullResults && getOdvDescription(odv, language) && (
        <GlassCard glow delay={0.33}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl shrink-0">
              🎯
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">{t('dashboard.todayDo')}</h3>
              <p className="text-sm text-slate-300">
                {(() => {
                  const odvDayThemes: Record<number, string> = language === 'sk'
                    ? { 1: 'začiatkov a iniciatívy', 2: 'spolupráce a vzťahov', 3: 'kreativity a sebavyjadrenia', 4: 'práce a budovania', 5: 'zmien a slobody', 6: 'lásky a harmónie', 7: 'introspekcie a ticha', 8: 'manifestácie a sily', 9: 'uzatvárania a odpúšťania' }
                    : { 1: 'beginnings and initiative', 2: 'cooperation and relationships', 3: 'creativity and self-expression', 4: 'work and building', 5: 'change and freedom', 6: 'love and harmony', 7: 'introspection and silence', 8: 'manifestation and power', 9: 'closure and forgiveness' };
                  const odvTheme = odvDayThemes[odv] || '';
                  const enneaGrowth = fullResults.enneagram
                    ? getEnneagramType(fullResults.enneagram.integrationDirection, language)?.name
                    : null;
                  const hdStrategy = fullResults.humanDesign?.strategy?.toLowerCase() || '';

                  if (language === 'sk') {
                    if (odv <= 3) return `Dnes je deň ${odvTheme}. ${enneaGrowth ? `Vyskúšaj sa priblížiť k energii „${enneaGrowth}". ` : ''}Pamätaj: tvoja stratégia je „${hdStrategy}".`;
                    if (odv <= 6) return `Energia dňa: ${odvTheme}. ${enneaGrowth ? `Smeruj k „${enneaGrowth}" — ` : ''}dnes je ideálny čas na jednu konkrétnu vec z tejto oblasti. Nemusíš veľa — stačí krok.`;
                    return `Dnes je deň ${odvTheme}. ${enneaGrowth ? `Integračný smer „${enneaGrowth}" ti pomôže. ` : ''}Stratégia: „${hdStrategy}" — počúvaj telo, nie hlavu.`;
                  } else {
                    if (odv <= 3) return `Today is a day of ${odvTheme}. ${enneaGrowth ? `Try to move toward the energy of "${enneaGrowth}". ` : ''}Remember: your strategy is "${hdStrategy}".`;
                    if (odv <= 6) return `Energy of the day: ${odvTheme}. ${enneaGrowth ? `Move toward "${enneaGrowth}" — ` : ''}today is the ideal time for one specific thing from this area. You don't need much — just a step.`;
                    return `Today is a day of ${odvTheme}. ${enneaGrowth ? `Integration direction "${enneaGrowth}" will help you. ` : ''}Strategy: "${hdStrategy}" — listen to the body, not the mind.`;
                  }
                })()}
              </p>
              {dailyRituals[odv] && (
                <p className="text-xs text-amber-300 mt-2 italic">
                  {t('dashboard.morning')}: {dailyRituals[odv].morning}
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Biorytmus + Kryštál dňa */}
      {profile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <GlassCard delay={0.34}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">〰️</span>
              <p className="text-xs text-slate-500 uppercase font-medium">{t('dashboard.biorhythm')}</p>
            </div>
            {(() => {
              const br = calculateBiorhythm(profile.birthDay, profile.birthMonth, profile.birthYear);
              const bar = (val: number, color: string) => (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.abs(val)}%`, marginLeft: val < 0 ? `${100 - Math.abs(val)}%` : '0' }} />
                  </div>
                  <span className={`text-xs font-bold w-10 text-right ${val > 50 ? 'text-emerald-600' : val < -50 ? 'text-rose-600' : 'text-slate-500'}`}>{val > 0 ? '+' : ''}{val}%</span>
                </div>
              );
              return (
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-red-400 uppercase">{t('dashboard.physical')}</p>
                    {bar(br.physical, br.physical > 0 ? 'bg-red-400' : 'bg-red-200')}
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-400 uppercase">{t('dashboard.emotional')}</p>
                    {bar(br.emotional, br.emotional > 0 ? 'bg-blue-400' : 'bg-blue-200')}
                  </div>
                  <div>
                    <p className="text-[10px] text-green-400 uppercase">{t('dashboard.intellectual')}</p>
                    {bar(br.intellectual, br.intellectual > 0 ? 'bg-green-400' : 'bg-green-200')}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">
                    {br.physicalPhase === 'critical' || br.emotionalPhase === 'critical' || br.intellectualPhase === 'critical'
                      ? `⚠️ ${t('dashboard.bioTipCritical')}`
                      : br.physical > 70 || br.intellectual > 70 || br.emotional > 70 ? `💪 ${t('dashboard.bioTipHigh')}`
                      : `${t('dashboard.bioTipLow')}`}
                  </p>
                </div>
              );
            })()}
          </GlassCard>
          <GlassCard delay={0.34}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💎</span>
              <p className="text-xs text-slate-500 uppercase font-medium">{t('dashboard.crystalOfDay')}</p>
            </div>
            {(() => {
              const crystal = getDailyCrystal(odv, language);
              return (
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: crystal.color, borderColor: crystal.color + '80' }} />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{crystal.name}</p>
                      <p className="text-[10px] text-slate-500">{crystal.properties}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 italic">{crystal.usage}</p>
                </div>
              );
            })()}
          </GlassCard>
        </div>
      )}

      {/* Zdieľanie — share buttons */}
      {profile && fullResults && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={async () => {
              const isDark = document.documentElement.classList.contains('dark');
              const crystal = getDailyCrystal(odv, language);
              const blob = await generateDailyStory({
                odvNumber: odv,
                affirmation: affirmations[odv] || affirmations[1],
                crystal: crystal.name,
                isDark,
                language,
              });
              await shareOrDownload(blob, `energia-${odv}.png`);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            {language === 'sk' ? '📤 Denná energia' : '📤 Daily energy'}
          </button>
          <button
            onClick={async () => {
              const isDark = document.documentElement.classList.contains('dark');
              const lp = fullResults.numerology.lifePathNumber;
              const hdType = displayName(HD_TYPE_DISPLAY, fullResults.humanDesign.type, language);
              const hdProfile = `${fullResults.humanDesign.profile.line1}/${fullResults.humanDesign.profile.line2}`;
              const element = displayName(ELEMENT_DISPLAY, fullResults.astrology.dominantElement, language);
              const sunSign = displayName(ZODIAC_DISPLAY, fullResults.astrology.sunSign.name, language);
              const enneaType = fullResults.enneagram?.coreType ?? 0;
              const blob = await generateProfileCard({
                name: profile.name,
                lifePathNumber: lp,
                hdType,
                hdProfile,
                element,
                sunSign,
                enneagramType: enneaType,
                isDark,
                language,
              });
              await shareOrDownload(blob, `profil-${profile.name}.png`);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
          >
            {language === 'sk' ? '📤 Môj profil' : '📤 My profile'}
          </button>
        </div>
      )}

      {/* Dnešná energia — kompaktný prehľad */}
      <GlassCard delay={0.35}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-white">{t('dashboard.todayEnergy')}</h3>
          {getOrvDescription(orv, language) && (
            <span className="text-xs text-indigo-300">{t('dashboard.yearLabel')} {getOrvDescription(orv, language).title}</span>
          )}
        </div>
        <p className="text-slate-300 font-serif text-lg italic mb-2">
          "{affirmations[odv] || affirmations[1]}"
        </p>
        <p className="text-[10px] text-slate-500 mb-3">
          {(() => {
            const m = currentMonth;
            if (m >= 3 && m <= 5) return `🌱 ${t('dashboard.seasonSpring')}`;
            if (m >= 6 && m <= 8) return `☀️ ${t('dashboard.seasonSummer')}`;
            if (m >= 9 && m <= 11) return `🍂 ${t('dashboard.seasonAutumn')}`;
            return `❄️ ${t('dashboard.seasonWinter')}`;
          })()}
        </p>
        {fullResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fullResults.enneagram && getEnneagramType(fullResults.enneagram.coreType, language) && (() => {
              const intType = getEnneagramType(fullResults.enneagram.integrationDirection, language);
              const growthPath = getEnneagramType(fullResults.enneagram.coreType, language).growthPath;
              const sentences = growthPath.split('. ').filter(s => s.length > 10);
              if (sentences.length === 0) return (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-700 font-medium">{t('dashboard.enneagramGrowth')} {intType?.name}</p>
                </div>
              );
              const dayOfYear = Math.floor((today.getTime() - new Date(currentYear, 0, 0).getTime()) / 86400000);
              const tipIdx = dayOfYear % sentences.length;
              const tip = sentences[tipIdx];
              return (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-700 font-medium">{t('dashboard.enneagramGrowth')} {intType?.name}</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5 italic">{tip}{tip.endsWith('.') ? '' : '.'}</p>
                </div>
              );
            })()}
            {(() => {
              const chakraIdx = odv <= 7 ? odv : odv - 7;
              const etiko = getEtikoterapiaForChakra(chakraIdx, language);
              if (!etiko || !etiko.reflectionQuestions.length) return null;
              const questionIdx = (currentDay + currentMonth) % etiko.reflectionQuestions.length;
              return (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <p className="text-xs text-rose-300 italic">„{etiko.reflectionQuestions[questionIdx]}"</p>
                  <p className="text-[10px] text-rose-400 mt-1 font-medium">{t('dashboard.virtueOfDay')} {etiko.liberatingVirtue}</p>
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
              const geneKey = getGeneKeyByGate(odv, language);
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
          <p className="text-xs mt-3 text-slate-600"><strong className="text-slate-800">{t('dashboard.eveningLabel')}</strong> {dailyRituals[odv].evening}</p>
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
              <p className="text-xs text-amber-300 uppercase mb-1">{t('dashboard.todayMantra')}</p>
              <p className="text-sm text-slate-300 font-serif italic">"{getDailyMantra(odv, undefined, language)}"</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.44}>
          {(() => {
            const q = getDailyQuote(odv, undefined, language);
            return (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg shrink-0">
                  ❝
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-cyan-300 uppercase mb-1">{t('dashboard.todayQuote')}</p>
                  <p className="text-sm text-slate-300 font-serif italic">"{q.quote}"</p>
                  <p className="text-xs text-slate-500 mt-1">— {q.author}</p>
                </div>
              </div>
            );
          })()}
        </GlassCard>
        <GlassCard delay={0.46}>
          {(() => {
            const tarot = getDailyTarot(odv, language);
            const mt = getMonthlyTarot(omv, language);
            return (
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-lg shrink-0">
                    {tarot.symbol}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-purple-300 uppercase mb-1">{t('dashboard.tarotOfDay')} {tarot.name}</p>
                    <p className="text-xs text-slate-400">{tarot.dailyAdvice}</p>
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="text-[11px] text-purple-400 cursor-pointer hover:text-purple-300">
                    {t('dashboard.tarotFullReading')} {tarot.name}
                  </summary>
                  <div className="mt-2 space-y-2 text-xs">
                    <p className="text-slate-300"><strong className="text-purple-300">{t('dashboard.tarotMeaning')}</strong> {tarot.meaning}</p>
                    <p className="text-slate-300"><strong className="text-rose-300">{t('dashboard.tarotShadow')}</strong> {tarot.shadow}</p>
                    <p className="text-slate-300"><strong className="text-emerald-300">{t('dashboard.tarotAdvice')}</strong> {tarot.advice}</p>
                  </div>
                </details>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{mt.symbol}</span>
                    <div>
                      <p className="text-[10px] text-indigo-400 uppercase">{t('dashboard.monthCard')} {mt.name}</p>
                      <p className="text-[10px] text-slate-400">{mt.monthlyAdvice}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </GlassCard>
      </div>

      {/* ═══ DETAILY A INŠPIRÁCIE — collapsible ═══ */}
      <details className="group" open>
        <summary className="cursor-pointer list-none flex items-center gap-2 py-2">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">{t('dashboard.detailsSection')}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-amber-400/30 to-transparent"></div>
          <span className="text-amber-400 transition-transform group-open:rotate-180">▾</span>
        </summary>
        <div className="space-y-6 mt-4">

      {/* Detail dennej energie */}
      {getOdvDescription(odv, language) && dailyRituals[odv] && (
        <GlassCard delay={0.50}>
          <details open>
            <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
              <span className="font-medium text-white">{t('dashboard.dailyEnergyDetail')} (ODV {odv})</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p className="text-sm text-slate-300">{getOdvDescription(odv, language).advice}</p>
              <div className="flex flex-wrap gap-1">
                {getOdvDescription(odv, language).keywords.map(k => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300">{k}</span>
                ))}
              </div>
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 mt-2">
                <p className="text-xs text-green-300">{t('dashboard.body')}: {dailyRituals[odv].body}</p>
              </div>
            </div>
          </details>
        </GlassCard>
      )}

      {/* Detail mesačnej energie */}
      {getOmvDescription(omv, language) && (
        <GlassCard delay={0.52}>
          <details open>
            <summary className="cursor-pointer hover:text-purple-300 transition-colors">
              <span className="font-medium text-white">{t('dashboard.monthlyEnergyDetail')} (OMV {omv})</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p className="text-sm text-slate-300">{getOmvDescription(omv, language).advice}</p>
              <div className="flex flex-wrap gap-1">
                {getOmvDescription(omv, language).keywords.map(k => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">{k}</span>
                ))}
              </div>
              <p className="text-xs text-purple-400 italic mt-2">{getOmvDescription(omv, language).theme}</p>
            </div>
          </details>
        </GlassCard>
      )}

      {/* Mesačný ODV kalendár */}
      {profile && (
        <GlassCard delay={0.54}>
          <details>
            <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
              <span className="font-medium text-white">{t('dashboard.energyCalendar')} — {MONTH_NAMES[language][currentMonth - 1]} {currentYear}</span>
            </summary>
            <div className="mt-3">
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAY_SHORT[language].map(d => (
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
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>{t('dashboard.creative')}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>{t('dashboard.work')}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>{t('dashboard.heart')}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500"></span>{t('dashboard.inner')}</span>
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
          <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold">{t('dashboard.deeperProfile')}</span>
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
