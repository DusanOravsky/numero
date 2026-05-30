import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from '../i18n/useTranslation';
import { GlassCard } from '../components/GlassCard';
import { calculateFullNumerology } from '../engine/numerologyEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import { getEnneagramType } from '../data/enneagram';
import { getTimezoneFromCoords } from '../data/cities';

const MAX_COMPARE = 4;

export function ComparePage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clients, profiles, activeProfileId, numerologyMethod } = useStore(
    useShallow(s => ({ clients: s.clients, profiles: s.profiles, activeProfileId: s.activeProfileId, numerologyMethod: s.numerologyMethod }))
  );
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const idsParam = searchParams.get('ids');
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    idsParam ? idsParam.split(',').filter(id => clients.some(c => c.id === id)) : []
  );
  const [includeMyProfile, setIncludeMyProfile] = useState(false);

  const toggle = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  // Memoizované — inak je `selected` nová referencia pri každom rendri a `computed`
  // (drahé calculateAstrology/HumanDesign volania) by sa prepočítavalo zbytočne.
  const selected = useMemo(
    () => selectedIds
      .map(id => clients.find(c => c.id === id))
      .filter((c): c is NonNullable<typeof c> => !!c),
    [selectedIds, clients],
  );

  const computed = useMemo(() => {
    const allPersons: Array<{ id: string; name: string; birthDay: number; birthMonth: number; birthYear: number; birthHour?: number; birthMinute?: number; gender?: 'male' | 'female'; birthLatitude?: number; birthLongitude?: number }> = [
      ...(includeMyProfile && activeProfile ? [{ id: activeProfile.id, name: `${activeProfile.name} (ja)`, birthDay: activeProfile.birthDay, birthMonth: activeProfile.birthMonth, birthYear: activeProfile.birthYear, birthHour: activeProfile.birthHour, birthMinute: activeProfile.birthMinute, gender: activeProfile.gender, birthLatitude: activeProfile.birthLatitude, birthLongitude: activeProfile.birthLongitude }] : []),
      ...selected,
    ];
    return allPersons.map(c => {
      const num = calculateFullNumerology(c.birthDay, c.birthMonth, c.birthYear);
      const dev = calculateDevelopmentalNumerology(c.birthDay, c.birthMonth, c.birthYear);
      const lat = c.birthLatitude ?? 48.15;
      const lon = c.birthLongitude ?? 17.11;
      const tz = getTimezoneFromCoords(lat, lon);
      const astro = calculateAstrology(c.birthDay, c.birthMonth, c.birthYear, c.birthHour ?? 12, c.birthMinute ?? 0, lat, lon, tz);
      const hd = calculateHumanDesign(c.birthDay, c.birthMonth, c.birthYear, c.birthHour ?? 12, c.birthMinute ?? 0, tz);
      const enneagram = deriveEnneagramType(num, dev, numerologyMethod);
      return { client: c, num, dev, astro, hd, enneagram };
    });
  }, [includeMyProfile, activeProfile, selected, numerologyMethod]);

  const rows: { label: string; cells: (data: typeof computed[number]) => React.ReactNode; keyOf?: (data: typeof computed[number]) => string; highlight?: boolean }[] = [
    { label: language === 'sk' ? 'Dátum' : 'Date', cells: d => `${d.client.birthDay}.${d.client.birthMonth}.${d.client.birthYear}` },
    { label: language === 'sk' ? 'Čas' : 'Time', cells: d => d.client.birthHour !== undefined ? `${d.client.birthHour}:${String(d.client.birthMinute || 0).padStart(2, '0')}` : '—' },
    { label: language === 'sk' ? 'Pohlavie' : 'Gender', cells: d => d.client.gender === 'male' ? (language === 'sk' ? 'Muž' : 'Male') : d.client.gender === 'female' ? (language === 'sk' ? 'Žena' : 'Female') : '—', keyOf: d => d.client.gender ?? '', highlight: true },
    { label: language === 'sk' ? 'Životné číslo' : 'Life path number', cells: d => <strong className="text-indigo-700">{d.num.lifePathNumber}</strong>, keyOf: d => String(d.num.lifePathNumber), highlight: true },
    { label: language === 'sk' ? 'ŽČ z (suma)' : 'LP from (sum)', cells: d => d.num.lifePathFrom, keyOf: d => String(d.num.lifePathFrom), highlight: true },
    { label: language === 'sk' ? 'VDD (vek dosp.)' : 'VDD (maturity age)', cells: d => `${d.num.vdd} ${language === 'sk' ? 'r.' : 'y.'}`, keyOf: d => String(d.num.vdd), highlight: true },
    { label: 'ΣT', cells: d => `${d.num.sigmaT} (${d.num.age === 'aquarius' ? (language === 'sk' ? 'Vodnár' : 'Aquarius') : (language === 'sk' ? 'Ryby' : 'Pisces')})`, keyOf: d => `${d.num.sigmaT}|${d.num.age}`, highlight: true },
    { label: language === 'sk' ? 'K1 (psych.)' : 'K1 (psych.)', cells: d => d.dev.circled[0].value, keyOf: d => String(d.dev.circled[0].value), highlight: true },
    { label: language === 'sk' ? 'K2 (mat.)' : 'K2 (mat.)', cells: d => d.dev.circled[1].value, keyOf: d => String(d.dev.circled[1].value), highlight: true },
    { label: language === 'sk' ? 'K3 (poslanie) ★' : 'K3 (mission) ★', cells: d => <strong className="text-amber-700">{d.dev.circled[2].value}</strong>, keyOf: d => String(d.dev.circled[2].value), highlight: true },
    { label: language === 'sk' ? 'K4 (sny)' : 'K4 (dreams)', cells: d => d.dev.circled[3].value, keyOf: d => String(d.dev.circled[3].value), highlight: true },
    { label: language === 'sk' ? 'Polarita ega' : 'Ego polarity', cells: d => d.dev.egoPolarity === 'masculine' ? (language === 'sk' ? 'mužská' : 'masculine') : d.dev.egoPolarity === 'feminine' ? (language === 'sk' ? 'ženská' : 'feminine') : '—', keyOf: d => d.dev.egoPolarity, highlight: true },
    { label: language === 'sk' ? 'Plné roviny' : 'Full planes', cells: d => d.num.fullPlanes.length === 0 ? '—' : d.num.fullPlanes.join(', ') },
    { label: language === 'sk' ? 'Prázdne roviny' : 'Empty planes', cells: d => d.num.emptyPlanes.length === 0 ? '—' : d.num.emptyPlanes.join(', ') },
    { label: language === 'sk' ? 'Izolované čísla' : 'Isolated numbers', cells: d => d.num.isolatedNumbers.length === 0 ? '—' : d.num.isolatedNumbers.join(', ') },
    { label: language === 'sk' ? 'Slnko' : 'Sun', cells: d => `${d.astro.planets.find(p => p.name === 'Slnko')!.sign.name} ${d.astro.planets.find(p => p.name === 'Slnko')!.degree.toFixed(0)}°`, keyOf: d => d.astro.planets.find(p => p.name === 'Slnko')!.sign.name, highlight: true },
    { label: language === 'sk' ? 'Mesiac' : 'Moon', cells: d => `${d.astro.planets.find(p => p.name === 'Mesiac')!.sign.name} ${d.astro.planets.find(p => p.name === 'Mesiac')!.degree.toFixed(0)}°`, keyOf: d => d.astro.planets.find(p => p.name === 'Mesiac')!.sign.name, highlight: true },
    { label: language === 'sk' ? 'Ascendent' : 'Ascendant', cells: d => d.astro.ascendant.name, keyOf: d => d.astro.ascendant.name, highlight: true },
    { label: language === 'sk' ? 'Dominantný živel' : 'Dominant element', cells: d => d.astro.dominantElement, keyOf: d => d.astro.dominantElement, highlight: true },
    { label: language === 'sk' ? 'HD typ' : 'HD type', cells: d => d.hd.type, keyOf: d => d.hd.type, highlight: true },
    { label: language === 'sk' ? 'HD profil' : 'HD profile', cells: d => `${d.hd.profile.line1}/${d.hd.profile.line2}`, keyOf: d => `${d.hd.profile.line1}/${d.hd.profile.line2}`, highlight: true },
    { label: language === 'sk' ? 'HD autorita' : 'HD authority', cells: d => d.hd.authority, keyOf: d => d.hd.authority, highlight: true },
    { label: language === 'sk' ? 'HD def. centrá' : 'HD def. centers', cells: d => `${d.hd.definedCenters.length}/9`, keyOf: d => String(d.hd.definedCenters.length), highlight: true },
    { label: language === 'sk' ? 'HD kanály' : 'HD channels', cells: d => d.hd.channels.length, keyOf: d => String(d.hd.channels.length), highlight: true },
    { label: language === 'sk' ? 'Enneagram typ' : 'Enneagram type', cells: d => { const et = getEnneagramType(d.enneagram.coreType, language); return et ? <strong className="text-emerald-700">{d.enneagram.coreType} ({et.name.split('/')[0].trim()})</strong> : d.enneagram.coreType; }, keyOf: d => String(d.enneagram.coreType), highlight: true },
    { label: language === 'sk' ? 'Enneagram krídlo' : 'Enneagram wing', cells: d => d.enneagram.dominantWing ? `${d.enneagram.dominantWing}w` : '—', keyOf: d => d.enneagram.dominantWing ? String(d.enneagram.dominantWing) : '', highlight: true },
    { label: language === 'sk' ? 'Integrácia →' : 'Integration →', cells: d => d.enneagram.integrationDirection, keyOf: d => String(d.enneagram.integrationDirection), highlight: true },
    { label: language === 'sk' ? 'Stres →' : 'Stress →', cells: d => d.enneagram.disintegrationDirection, keyOf: d => String(d.enneagram.disintegrationDirection), highlight: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">{t('clients.compareTitle')}</h1>
          <p className="text-slate-400 mt-1">{t('clients.compareSubtitle').replace('{max}', String(MAX_COMPARE))}</p>
        </div>
        <button
          onClick={() => navigate('/clients')}
          className="text-sm text-indigo-600 hover:text-indigo-800 underline shrink-0"
        >
          {t('clients.backToClients')}
        </button>
      </div>

      {activeProfile && (
        <GlassCard>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeMyProfile}
              onChange={e => setIncludeMyProfile(e.target.checked)}
              className="w-4 h-4 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-white">{language === 'sk' ? `Zahrnúť môj profil (${activeProfile.name}) do porovnania` : `Include my profile (${activeProfile.name}) in comparison`}</span>
          </label>
        </GlassCard>
      )}

      {clients.length === 0 ? (
        <GlassCard>
          <p className="text-slate-400 text-center py-6">{language === 'sk' ? 'Najprv pridaj klientov na stránke Klienti.' : 'First add clients on the Clients page.'}</p>
        </GlassCard>
      ) : (
        <GlassCard>
          <h3 className="font-medium text-white mb-3">{language === 'sk' ? `Vyber klientov (${selected.length} / ${MAX_COMPARE})` : `Select clients (${selected.length} / ${MAX_COMPARE})`}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {clients.map(c => {
              const isSelected = selectedIds.includes(c.id);
              const disabled = !isSelected && selected.length >= MAX_COMPARE;
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  disabled={disabled}
                  className={`text-left p-3 rounded-xl border transition-colors ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500'
                      : disabled
                        ? 'border-slate-200 opacity-40 cursor-not-allowed'
                        : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-400'}`} />
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.birthDay}.{c.birthMonth}.{c.birthYear}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {computed.length >= 2 && (
        <GlassCard>
          <details>
            <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
              <span className="font-medium text-white">{language === 'sk' ? 'Ako čítať porovnanie' : 'How to read the comparison'}</span>
            </summary>
            <div className="mt-3 space-y-3 mb-4">
              <p className="text-xs text-slate-400">
                {language === 'sk' ? 'Porovnanie ukazuje rovnaké systémy vedľa seba. Hľadaj kde sa ľudia dopĺňajú (rôzne energie = komplementarita) a kde sa zhodujú (rovnaké = rezonancia, ale aj trenie).' : 'Comparison shows the same systems side by side. Look for where people complement each other (different energies = complementarity) and where they match (same = resonance, but also friction).'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-300 font-semibold mb-0.5">{language === 'sk' ? 'Zhody (rovnaké hodnoty)' : 'Matches (same values)'}</p>
                  <p className="text-[11px] text-slate-400">{language === 'sk' ? 'Rovnaký element, typ alebo ŽČ = ľudia si rozumejú intuitívne, ale môžu mať rovnaké slepé miesta.' : 'Same element, type or LP = people understand each other intuitively, but may share the same blind spots.'}</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-300 font-semibold mb-0.5">{language === 'sk' ? 'Rozdiely (komplementarita)' : 'Differences (complementarity)'}</p>
                  <p className="text-[11px] text-slate-400">{language === 'sk' ? 'Rôzne typy/elementy = dopĺňajú sa, ale vyžaduje to porozumenie. Jeden má čo druhému chýba.' : 'Different types/elements = complement each other, but requires understanding. One has what the other lacks.'}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                {language === 'sk' ? 'Tip: Najdôležitejšie riadky sú Životné číslo, HD typ + autorita, a dominantný element. Zvyšok je kontext.' : 'Tip: Most important rows are Life path number, HD type + authority, and dominant element. The rest is context.'}
              </p>
            </div>
          </details>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-2 text-xs uppercase text-slate-500 font-medium sticky left-0 bg-white">{language === 'sk' ? 'Atribút' : 'Attribute'}</th>
                  {computed.map(d => (
                    <th key={d.client.id} className="text-left p-2 text-white font-medium min-w-[140px]">
                      {d.client.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => {
                  const allMatch = !!row.highlight && !!row.keyOf && computed.length >= 2 && (() => {
                    const k0 = row.keyOf!(computed[0]);
                    if (!k0) return false;
                    return computed.every(d => row.keyOf!(d) === k0);
                  })();
                  return (
                    <tr key={row.label} className={`border-b border-slate-100 transition-colors ${allMatch ? 'bg-emerald-50/60' : 'hover:bg-slate-50/40'}`}>
                      <td className={`p-2 text-xs sticky left-0 ${allMatch ? 'bg-emerald-50/60 text-emerald-800 font-semibold' : 'bg-white text-slate-500'}`}>
                        {allMatch && <span className="mr-1">✓</span>}
                        {row.label}
                      </td>
                      {computed.map(d => (
                        <td key={d.client.id} className={`p-2 ${allMatch ? 'text-emerald-900 font-medium' : 'text-slate-700'}`}>{row.cells(d)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}


      {computed.length === 1 && (
        <GlassCard>
          <p className="text-sm text-slate-500 text-center py-4">{language === 'sk' ? 'Vyber ešte aspoň jednu osobu na porovnanie (klienta alebo zaškrtni "môj profil").' : 'Select at least one more person to compare (a client or check "my profile").'}</p>
        </GlassCard>
      )}
    </div>
  );
}
