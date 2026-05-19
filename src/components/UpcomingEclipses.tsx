import { useMemo, useState } from 'react';
import * as Astronomy from 'astronomy-engine';
import { GlassCard } from './GlassCard';

interface EclipseEvent {
  date: Date;
  kind: string;
  type: 'Solar' | 'Lunar';
}

const KIND_INFO: Record<string, { glyph: string; meaning: string }> = {
  Total: { glyph: '●', meaning: 'totálne — najsilnejšia transformácia' },
  Partial: { glyph: '◐', meaning: 'čiastočné — postupná zmena' },
  Annular: { glyph: '○', meaning: 'prsteňové — vzácne, znova-rodenie' },
  Penumbral: { glyph: '◌', meaning: 'penumbrálne — jemná energia' },
};

/**
 * Najbližších 4 zatmení (Slnka + Mesiaca) v budúcnosti, zoradené chronologicky.
 * Astronomy-engine SearchLunarEclipse a SearchGlobalSolarEclipse vyhľadávajú
 * presne podľa Espenak/Meeus polynómov.
 */
export function UpcomingEclipses() {
  const [nowMs] = useState(() => Date.now());
  const events = useMemo<EclipseEvent[]>(() => {
    const now = new Date();
    const result: EclipseEvent[] = [];
    try {
      // 4 najbližšie lunárne
      let le = Astronomy.SearchLunarEclipse(now);
      for (let i = 0; i < 4; i++) {
        result.push({ date: le.peak.date, kind: String(le.kind), type: 'Lunar' });
        le = Astronomy.NextLunarEclipse(le.peak);
      }
      // 4 najbližšie solárne
      let se = Astronomy.SearchGlobalSolarEclipse(now);
      for (let i = 0; i < 4; i++) {
        result.push({ date: se.peak.date, kind: String(se.kind), type: 'Solar' });
        se = Astronomy.NextGlobalSolarEclipse(se.peak);
      }
    } catch {
      // ignore — astronomy-engine version mismatch or unsupported environment
    }
    return result.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 6);
  }, []);

  if (events.length === 0) return null;

  return (
    <GlassCard>
      <h3 className="font-medium text-white mb-1">Nadchádzajúce zatmenia</h3>
      <p className="text-xs text-slate-500 mb-3">
        Zatmenia Slnka a Mesiaca prinášajú silné transformačné okná v cykle ~6 mesiacov. Energie sa mobilizujú niekoľko týždňov pred a po.
      </p>
      <div className="space-y-2">
        {events.map((e, i) => {
          const info = KIND_INFO[e.kind] || { glyph: '?', meaning: e.kind };
          const daysFromNow = Math.round((e.date.getTime() - nowMs) / 86400000);
          return (
            <div
              key={i}
              className={`p-3 rounded-xl border ${
                e.type === 'Solar'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-indigo-500/10 border-indigo-500/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${e.type === 'Solar' ? 'text-amber-400' : 'text-indigo-400'}`}>
                    {info.glyph}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {e.type === 'Solar' ? '☉ Slnečné' : '☽ Mesačné'} — {e.kind}
                    </p>
                    <p className="text-xs text-slate-400">{info.meaning}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">
                    {e.date.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {daysFromNow >= 0 ? `o ${daysFromNow} dní` : `pred ${-daysFromNow} dňami`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
