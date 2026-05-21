import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { calculateFullNumerology } from '../engine/numerologyEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import { enneagramTypes } from '../data/enneagram';
import { getTimezoneFromCoords } from '../data/cities';

const MAX_COMPARE = 4;

export function ComparePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clients, profiles, activeProfileId, numerologyMethod } = useStore();
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

  const selected = selectedIds
    .map(id => clients.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c);

  const allPersons: Array<{ id: string; name: string; birthDay: number; birthMonth: number; birthYear: number; birthHour?: number; birthMinute?: number; gender?: 'male' | 'female'; birthLatitude?: number; birthLongitude?: number }> = [
    ...(includeMyProfile && activeProfile ? [{ id: activeProfile.id, name: `${activeProfile.name} (ja)`, birthDay: activeProfile.birthDay, birthMonth: activeProfile.birthMonth, birthYear: activeProfile.birthYear, birthHour: activeProfile.birthHour, birthMinute: activeProfile.birthMinute, gender: activeProfile.gender, birthLatitude: activeProfile.birthLatitude, birthLongitude: activeProfile.birthLongitude }] : []),
    ...selected,
  ];

  const computed = useMemo(() => allPersons.map(c => {
    const num = calculateFullNumerology(c.birthDay, c.birthMonth, c.birthYear);
    const dev = calculateDevelopmentalNumerology(c.birthDay, c.birthMonth, c.birthYear);
    const lat = c.birthLatitude ?? 48.15;
    const lon = c.birthLongitude ?? 17.11;
    const tz = getTimezoneFromCoords(lat, lon);
    const astro = calculateAstrology(c.birthDay, c.birthMonth, c.birthYear, c.birthHour ?? 12, c.birthMinute ?? 0, lat, lon, tz);
    const hd = calculateHumanDesign(c.birthDay, c.birthMonth, c.birthYear, c.birthHour ?? 12, c.birthMinute ?? 0, tz);
    const enneagram = deriveEnneagramType(num, dev, numerologyMethod);
    return { client: c, num, dev, astro, hd, enneagram };
  }), [allPersons, numerologyMethod]);

  const rows: { label: string; cells: (data: typeof computed[number]) => React.ReactNode; keyOf?: (data: typeof computed[number]) => string; highlight?: boolean }[] = [
    { label: 'Dátum', cells: d => `${d.client.birthDay}.${d.client.birthMonth}.${d.client.birthYear}` },
    { label: 'Čas', cells: d => d.client.birthHour !== undefined ? `${d.client.birthHour}:${String(d.client.birthMinute || 0).padStart(2, '0')}` : '—' },
    { label: 'Pohlavie', cells: d => d.client.gender === 'male' ? 'Muž' : d.client.gender === 'female' ? 'Žena' : '—', keyOf: d => d.client.gender ?? '', highlight: true },
    { label: 'Životné číslo', cells: d => <strong className="text-indigo-700">{d.num.lifePathNumber}</strong>, keyOf: d => String(d.num.lifePathNumber), highlight: true },
    { label: 'ŽČ z (suma)', cells: d => d.num.lifePathFrom, keyOf: d => String(d.num.lifePathFrom), highlight: true },
    { label: 'VDD (vek dosp.)', cells: d => `${d.num.vdd} r.`, keyOf: d => String(d.num.vdd), highlight: true },
    { label: 'ΣT', cells: d => `${d.num.sigmaT} (${d.num.age === 'aquarius' ? 'Vodnár' : 'Ryby'})`, keyOf: d => `${d.num.sigmaT}|${d.num.age}`, highlight: true },
    { label: 'K1 (psych.)', cells: d => d.dev.circled[0].value, keyOf: d => String(d.dev.circled[0].value), highlight: true },
    { label: 'K2 (mat.)', cells: d => d.dev.circled[1].value, keyOf: d => String(d.dev.circled[1].value), highlight: true },
    { label: 'K3 (poslanie) ★', cells: d => <strong className="text-amber-700">{d.dev.circled[2].value}</strong>, keyOf: d => String(d.dev.circled[2].value), highlight: true },
    { label: 'K4 (sny)', cells: d => d.dev.circled[3].value, keyOf: d => String(d.dev.circled[3].value), highlight: true },
    { label: 'Polarita ega', cells: d => d.dev.egoPolarity === 'masculine' ? 'mužská' : d.dev.egoPolarity === 'feminine' ? 'ženská' : '—', keyOf: d => d.dev.egoPolarity, highlight: true },
    { label: 'Plné roviny', cells: d => d.num.fullPlanes.length === 0 ? '—' : d.num.fullPlanes.join(', ') },
    { label: 'Prázdne roviny', cells: d => d.num.emptyPlanes.length === 0 ? '—' : d.num.emptyPlanes.join(', ') },
    { label: 'Izolované čísla', cells: d => d.num.isolatedNumbers.length === 0 ? '—' : d.num.isolatedNumbers.join(', ') },
    { label: 'Slnko', cells: d => `${d.astro.planets.find(p => p.name === 'Slnko')!.sign.name} ${d.astro.planets.find(p => p.name === 'Slnko')!.degree.toFixed(0)}°`, keyOf: d => d.astro.planets.find(p => p.name === 'Slnko')!.sign.name, highlight: true },
    { label: 'Mesiac', cells: d => `${d.astro.planets.find(p => p.name === 'Mesiac')!.sign.name} ${d.astro.planets.find(p => p.name === 'Mesiac')!.degree.toFixed(0)}°`, keyOf: d => d.astro.planets.find(p => p.name === 'Mesiac')!.sign.name, highlight: true },
    { label: 'Ascendent', cells: d => d.astro.ascendant.name, keyOf: d => d.astro.ascendant.name, highlight: true },
    { label: 'Dominantný živel', cells: d => d.astro.dominantElement, keyOf: d => d.astro.dominantElement, highlight: true },
    { label: 'HD typ', cells: d => d.hd.type, keyOf: d => d.hd.type, highlight: true },
    { label: 'HD profil', cells: d => `${d.hd.profile.line1}/${d.hd.profile.line2}`, keyOf: d => `${d.hd.profile.line1}/${d.hd.profile.line2}`, highlight: true },
    { label: 'HD autorita', cells: d => d.hd.authority, keyOf: d => d.hd.authority, highlight: true },
    { label: 'HD def. centrá', cells: d => `${d.hd.definedCenters.length}/9`, keyOf: d => String(d.hd.definedCenters.length), highlight: true },
    { label: 'HD kanály', cells: d => d.hd.channels.length, keyOf: d => String(d.hd.channels.length), highlight: true },
    { label: 'Enneagram typ', cells: d => { const t = enneagramTypes[d.enneagram.coreType]; return t ? <strong className="text-emerald-700">{d.enneagram.coreType} ({t.name.split('/')[0].trim()})</strong> : d.enneagram.coreType; }, keyOf: d => String(d.enneagram.coreType), highlight: true },
    { label: 'Enneagram krídlo', cells: d => d.enneagram.dominantWing ? `${d.enneagram.dominantWing}w` : '—', keyOf: d => d.enneagram.dominantWing ? String(d.enneagram.dominantWing) : '', highlight: true },
    { label: 'Integrácia →', cells: d => d.enneagram.integrationDirection, keyOf: d => String(d.enneagram.integrationDirection), highlight: true },
    { label: 'Stres →', cells: d => d.enneagram.disintegrationDirection, keyOf: d => String(d.enneagram.disintegrationDirection), highlight: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Porovnanie klientov</h1>
          <p className="text-slate-400 mt-1">Vyber 2–{MAX_COMPARE} klientov a porovnaj kľúčové numerologické, astrologické a HD údaje vedľa seba.</p>
        </div>
        <button
          onClick={() => navigate('/clients')}
          className="text-sm text-indigo-600 hover:text-indigo-800 underline shrink-0"
        >
          Späť na klientov
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
            <span className="text-sm text-white">Zahrnúť môj profil ({activeProfile.name}) do porovnania</span>
          </label>
        </GlassCard>
      )}

      {clients.length === 0 ? (
        <GlassCard>
          <p className="text-slate-400 text-center py-6">Najprv pridaj klientov na stránke Klienti.</p>
        </GlassCard>
      ) : (
        <GlassCard>
          <h3 className="font-medium text-white mb-3">Vyber klientov ({selected.length} / {MAX_COMPARE})</h3>
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
              <span className="font-medium text-white">Ako čítať porovnanie</span>
            </summary>
            <div className="mt-3 space-y-3 mb-4">
              <p className="text-xs text-slate-400">
                Porovnanie ukazuje rovnaké systémy vedľa seba. Hľadaj kde sa ľudia dopĺňajú (rôzne energie = komplementarita) a kde sa zhodujú (rovnaké = rezonancia, ale aj trenie).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-300 font-semibold mb-0.5">Zhody (rovnaké hodnoty)</p>
                  <p className="text-[11px] text-slate-400">Rovnaký element, typ alebo ŽČ = ľudia si rozumejú intuitívne, ale môžu mať rovnaké slepé miesta.</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-300 font-semibold mb-0.5">Rozdiely (komplementarita)</p>
                  <p className="text-[11px] text-slate-400">Rôzne typy/elementy = dopĺňajú sa, ale vyžaduje to porozumenie. Jeden má čo druhému chýba.</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Tip: Najdôležitejšie riadky sú Životné číslo, HD typ + autorita, a dominantný element. Zvyšok je kontext.
              </p>
            </div>
          </details>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-2 text-xs uppercase text-slate-500 font-medium sticky left-0 bg-white">Atribút</th>
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
          <p className="text-sm text-slate-500 text-center py-4">Vyber ešte aspoň jednu osobu na porovnanie (klienta alebo zaškrtni "môj profil").</p>
        </GlassCard>
      )}
    </div>
  );
}
