import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { calculateFullNumerology } from '../engine/numerologyEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { deriveEnneagramType } from '../engine/enneagramEngine';
import { enneagramTypes } from '../data/enneagram';

const MAX_COMPARE = 4;

export function ComparePage() {
  const navigate = useNavigate();
  const { clients, profiles, activeProfileId, numerologyMethod } = useStore();
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  const allPersons: Array<{ id: string; name: string; birthDay: number; birthMonth: number; birthYear: number; birthHour?: number; birthMinute?: number; gender?: 'male' | 'female' }> = [
    ...(includeMyProfile && activeProfile ? [{ id: activeProfile.id, name: `${activeProfile.name} (ja)`, birthDay: activeProfile.birthDay, birthMonth: activeProfile.birthMonth, birthYear: activeProfile.birthYear, birthHour: activeProfile.birthHour, birthMinute: activeProfile.birthMinute, gender: activeProfile.gender }] : []),
    ...selected,
  ];

  const computed = allPersons.map(c => {
    const num = calculateFullNumerology(c.birthDay, c.birthMonth, c.birthYear);
    const dev = calculateDevelopmentalNumerology(c.birthDay, c.birthMonth, c.birthYear);
    const astro = calculateAstrology(c.birthDay, c.birthMonth, c.birthYear, c.birthHour ?? 12, c.birthMinute ?? 0);
    const hd = calculateHumanDesign(c.birthDay, c.birthMonth, c.birthYear, c.birthHour ?? 12, c.birthMinute ?? 0);
    const enneagram = deriveEnneagramType(num, dev, numerologyMethod);
    return { client: c, num, dev, astro, hd, enneagram };
  });

  const rows: { label: string; cells: (data: typeof computed[number]) => React.ReactNode }[] = [
    { label: 'Dátum', cells: d => `${d.client.birthDay}.${d.client.birthMonth}.${d.client.birthYear}` },
    { label: 'Čas', cells: d => d.client.birthHour !== undefined ? `${d.client.birthHour}:${String(d.client.birthMinute || 0).padStart(2, '0')}` : '—' },
    { label: 'Pohlavie', cells: d => d.client.gender === 'male' ? 'Muž' : d.client.gender === 'female' ? 'Žena' : '—' },
    { label: 'Životné číslo', cells: d => <strong className="text-indigo-700">{d.num.lifePathNumber}</strong> },
    { label: 'ŽČ z (suma)', cells: d => d.num.lifePathFrom },
    { label: 'VDD (vek dosp.)', cells: d => `${d.num.vdd} r.` },
    { label: 'ΣT', cells: d => `${d.num.sigmaT} (${d.num.age === 'aquarius' ? 'Vodnár' : 'Ryby'})` },
    { label: 'K1 (psych.)', cells: d => d.dev.circled[0].value },
    { label: 'K2 (mat.)', cells: d => d.dev.circled[1].value },
    { label: 'K3 (poslanie) ★', cells: d => <strong className="text-amber-700">{d.dev.circled[2].value}</strong> },
    { label: 'K4 (sny)', cells: d => d.dev.circled[3].value },
    { label: 'Polarita ega', cells: d => d.dev.egoPolarity === 'masculine' ? 'mužská' : d.dev.egoPolarity === 'feminine' ? 'ženská' : '—' },
    { label: 'Plné roviny', cells: d => d.num.fullPlanes.length === 0 ? '—' : d.num.fullPlanes.join(', ') },
    { label: 'Prázdne roviny', cells: d => d.num.emptyPlanes.length === 0 ? '—' : d.num.emptyPlanes.join(', ') },
    { label: 'Izolované čísla', cells: d => d.num.isolatedNumbers.length === 0 ? '—' : d.num.isolatedNumbers.join(', ') },
    { label: 'Slnko', cells: d => `${d.astro.planets.find(p => p.name === 'Slnko')!.sign.name} ${d.astro.planets.find(p => p.name === 'Slnko')!.degree.toFixed(0)}°` },
    { label: 'Mesiac', cells: d => `${d.astro.planets.find(p => p.name === 'Mesiac')!.sign.name} ${d.astro.planets.find(p => p.name === 'Mesiac')!.degree.toFixed(0)}°` },
    { label: 'Ascendent', cells: d => d.astro.ascendant.name },
    { label: 'Dominantný živel', cells: d => d.astro.dominantElement },
    { label: 'HD typ', cells: d => d.hd.type },
    { label: 'HD profil', cells: d => `${d.hd.profile.line1}/${d.hd.profile.line2}` },
    { label: 'HD autorita', cells: d => d.hd.authority },
    { label: 'HD def. centrá', cells: d => `${d.hd.definedCenters.length}/9` },
    { label: 'HD kanály', cells: d => d.hd.channels.length },
    { label: 'Enneagram typ', cells: d => { const t = enneagramTypes[d.enneagram.coreType]; return t ? <strong className="text-emerald-700">{d.enneagram.coreType} ({t.name.split('/')[0].trim()})</strong> : d.enneagram.coreType; } },
    { label: 'Enneagram krídlo', cells: d => d.enneagram.dominantWing ? `${d.enneagram.dominantWing}w` : '—' },
    { label: 'Integrácia →', cells: d => d.enneagram.integrationDirection },
    { label: 'Stres →', cells: d => d.enneagram.disintegrationDirection },
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
          <details open>
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
                {rows.map(row => (
                  <tr key={row.label} className="border-b border-slate-100 hover:bg-slate-50/40">
                    <td className="p-2 text-xs text-slate-500 sticky left-0 bg-white">{row.label}</td>
                    {computed.map(d => (
                      <td key={d.client.id} className="p-2 text-slate-700">{row.cells(d)}</td>
                    ))}
                  </tr>
                ))}
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
