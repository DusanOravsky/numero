import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubject } from '../hooks/useSubject';
import { GlassCard } from '../components/GlassCard';
import { calculateFullNumerology, getGridCount } from '../engine/numerologyEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { evaluateChakras } from '../engine/chakraEngine';
import { deriveDosha } from '../engine/ayurvedaEngine';
import { deriveTCMElement } from '../engine/tcmEngine';
import { DOSHA_INFO } from '../data/ayurveda';
import { TCM_ELEMENTS } from '../data/tcm';
import { BACH_FLOWERS_BY_CHAKRA } from '../data/bachFlowers';
import type { DoshaProfile } from '../data/ayurveda';
import type { TCMResult } from '../engine/tcmEngine';
import type { ChakraState } from '../engine/chakraEngine';
import type { BachFlower } from '../data/bachFlowers';

interface ModalityData {
  dosha: DoshaProfile;
  tcm: TCMResult;
  chakras: ChakraState[];
  blockedChakras: number[];
}

function computeModality(
  day: number, month: number, year: number,
  hour: number = 12, minute: number = 0
): ModalityData {
  const numerology = calculateFullNumerology(day, month, year);
  const astrology = calculateAstrology(day, month, year, hour, minute);
  const hd = calculateHumanDesign(day, month, year, hour, minute);
  const gridCounts = getGridCount(numerology.grid);
  const chakras = evaluateChakras(
    numerology.lifePathNumber,
    gridCounts,
    numerology.isolatedNumbers,
    hd.definedCenters,
    astrology.dominantElement
  );

  const dosha = deriveDosha(numerology, astrology, hd);
  const tcm = deriveTCMElement(numerology, astrology);
  const blockedChakras = chakras
    .filter(c => c.status === 'blocked')
    .map(c => c.chakra.number);

  return { dosha, tcm, chakras, blockedChakras };
}

export function ModalityPage() {
  const navigate = useNavigate();
  const profile = useSubject();

  const data = useMemo<ModalityData | null>(() => {
    if (!profile) return null;
    return computeModality(
      profile.birthDay,
      profile.birthMonth,
      profile.birthYear,
      profile.birthHour ?? 12,
      profile.birthMinute ?? 0
    );
  }, [profile]);

  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-bold text-white">Modality</h1>
        <GlassCard>
          <p className="text-slate-400">Najprv vytvorte profil v Nastaveniach.</p>
        </GlassCard>
      </div>
    );
  }

  if (!data) return null;

  const primaryDosha = DOSHA_INFO[data.dosha.primary];
  const secondaryDosha = data.dosha.secondary ? DOSHA_INFO[data.dosha.secondary] : null;
  const primaryTCM = TCM_ELEMENTS[data.tcm.primary];
  const secondaryTCM = TCM_ELEMENTS[data.tcm.secondary];

  // Collect Bach flowers for blocked chakras
  const recommendedFlowers: BachFlower[] = [];
  for (const chakraNum of data.blockedChakras) {
    const flowers = BACH_FLOWERS_BY_CHAKRA[chakraNum];
    if (flowers) {
      recommendedFlowers.push(...flowers);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        {profile.isClient && (
          <button
            onClick={() => navigate(`/clients/${profile.id}`)}
            className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-flex items-center gap-1"
          >
            ← Späť na klienta {profile.name}
          </button>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl font-bold text-white">Modality</h1>
          {profile.isClient && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
              Klient: <strong>{profile.name}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          Ayurvéda, Tradičná čínska medicína a Bachove kvetové esencie
        </p>
      </div>

      {/* Ayurvéda */}
      <GlassCard delay={0.1}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">☘</span> Ayurvéda — Dóša profil
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary dosha */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <DoshaBadge dosha={data.dosha.primary} size="lg" />
              <div>
                <p className="text-sm text-slate-400">Primárna dóša</p>
                <p className="text-lg font-bold text-white">{primaryDosha.name}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Element:</span> {primaryDosha.element}
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Typ tela:</span> {primaryDosha.bodyType}
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Myseľ:</span> {primaryDosha.mind}
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Najsilnejšia sezóna:</span> {primaryDosha.season}
            </p>

            {/* Balance bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Dominancia</span>
                <span>{data.dosha.balance}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                  style={{ width: `${data.dosha.balance}%` }}
                />
              </div>
            </div>
          </div>

          {/* Secondary dosha */}
          <div className="space-y-3">
            {secondaryDosha ? (
              <>
                <div className="flex items-center gap-3">
                  <DoshaBadge dosha={data.dosha.secondary!} size="lg" />
                  <div>
                    <p className="text-sm text-slate-400">Sekundárna dóša</p>
                    <p className="text-lg font-bold text-white">{secondaryDosha.name}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300">
                  <span className="text-slate-500">Element:</span> {secondaryDosha.element}
                </p>
                <p className="text-sm text-slate-300">
                  <span className="text-slate-500">Typ tela:</span> {secondaryDosha.bodyType}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400 italic">
                Jednodóšový typ — jasná dominancia {primaryDosha.name}.
              </p>
            )}
          </div>
        </div>

        {/* Strengths + tips */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">Silné stránky</h3>
            <ul className="space-y-1">
              {primaryDosha.strengths.map((s, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">Znaky nerovnováhy</h3>
            <ul className="space-y-1">
              {primaryDosha.imbalanceSigns.map((s, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">Tipy na balancovanie</h3>
          <ul className="space-y-1">
            {primaryDosha.balanceTips.map((tip, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>

      {/* TCM */}
      <GlassCard delay={0.2}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">☯</span> Tradičná čínska medicína — 5 elementov
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary element */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TCMBadge element={data.tcm.primary} />
              <div>
                <p className="text-sm text-slate-400">Primárny element</p>
                <p className="text-lg font-bold text-white">{primaryTCM.name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-500">Sezóna:</span> {primaryTCM.season}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Orgán:</span> {primaryTCM.organ}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Emócia:</span> {primaryTCM.emotion}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Cnosť:</span> {primaryTCM.virtue}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Farba:</span> {primaryTCM.color}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Chuť:</span> {primaryTCM.taste}
              </p>
            </div>
          </div>

          {/* Secondary element */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TCMBadge element={data.tcm.secondary} />
              <div>
                <p className="text-sm text-slate-400">Sekundárny element</p>
                <p className="text-lg font-bold text-white">{secondaryTCM.name}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-500">Sezóna:</span> {secondaryTCM.season}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Orgán:</span> {secondaryTCM.organ}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Emócia:</span> {secondaryTCM.emotion}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">Znaky sily</h3>
            <p className="text-sm text-slate-300">{primaryTCM.strengthSign}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">Znaky slabosti</h3>
            <p className="text-sm text-slate-300">{primaryTCM.weaknessSign}</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">Tip na harmonizáciu</h3>
          <p className="text-sm text-slate-300">{primaryTCM.balanceTip}</p>
        </div>
      </GlassCard>

      {/* Bach Flowers */}
      <GlassCard delay={0.3}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">✿</span> Bachove kvetové esencie
        </h2>

        {data.blockedChakras.length === 0 ? (
          <p className="text-sm text-slate-400 italic">
            Žiadna čakra nie je blokovaná — gratulujeme k energetickej rovnováhe!
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-4">
              Odporúčané esencie pre blokované čakry ({data.blockedChakras.map(n => `${n}.`).join(' ')}):
            </p>
            <div className="space-y-4">
              {data.blockedChakras.map(chakraNum => {
                const flowers = BACH_FLOWERS_BY_CHAKRA[chakraNum];
                if (!flowers) return null;
                const chakraState = data.chakras.find(c => c.chakra.number === chakraNum);
                return (
                  <div key={chakraNum} className="border border-slate-700 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-rose-400 mb-3">
                      {chakraState?.chakra.name} (skóre: {chakraState?.score})
                    </h3>
                    <div className="grid gap-3">
                      {flowers.map(flower => (
                        <FlowerCard key={flower.name} flower={flower} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p className="text-xs text-slate-500 mt-4 italic">
          Bachove kvetové esencie sú jemná energetická podpora. Nie sú náhradou za odbornú lekársku starostlivosť.
        </p>
      </GlassCard>
    </div>
  );
}

// ─── Helper components ─────────────────────────────────────────────

function DoshaBadge({ dosha, size = 'md' }: { dosha: 'vata' | 'pitta' | 'kapha'; size?: 'md' | 'lg' }) {
  const colors = {
    vata: 'from-sky-400 to-blue-600',
    pitta: 'from-orange-400 to-red-600',
    kapha: 'from-emerald-400 to-green-600',
  };
  const sizeClass = size === 'lg' ? 'w-12 h-12 text-lg' : 'w-8 h-8 text-sm';
  const icons = { vata: '💨', pitta: '🔥', kapha: '🌍' };

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${colors[dosha]} flex items-center justify-center`}>
      {icons[dosha]}
    </div>
  );
}

function TCMBadge({ element }: { element: string }) {
  const config: Record<string, { icon: string; gradient: string }> = {
    drevo: { icon: '🌳', gradient: 'from-green-400 to-emerald-600' },
    ohen: { icon: '🔥', gradient: 'from-red-400 to-orange-600' },
    zem: { icon: '⛰', gradient: 'from-yellow-400 to-amber-600' },
    kov: { icon: '⚒', gradient: 'from-slate-300 to-slate-500' },
    voda: { icon: '💧', gradient: 'from-blue-400 to-indigo-600' },
  };
  const c = config[element] ?? { icon: '?', gradient: 'from-slate-400 to-slate-600' };

  return (
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-lg`}>
      {c.icon}
    </div>
  );
}

function FlowerCard({ flower }: { flower: BachFlower }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white">{flower.name}</span>
        <span className="text-xs text-slate-500 italic">{flower.latinName}</span>
      </div>
      <p className="text-xs text-rose-300">
        <span className="text-slate-500">Stav:</span> {flower.emotionalState}
      </p>
      <p className="text-xs text-emerald-300">
        <span className="text-slate-500">Pomáha:</span> {flower.helps}
      </p>
      <p className="text-xs text-indigo-300 italic">
        &ldquo;{flower.affirmation}&rdquo;
      </p>
    </div>
  );
}
