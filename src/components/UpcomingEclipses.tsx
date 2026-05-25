import { useMemo, useState } from 'react';
import * as Astronomy from 'astronomy-engine';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../i18n/useTranslation';
import type { Language } from '../store/useStore';

interface EclipseEvent {
  date: Date;
  kind: string;
  type: 'Solar' | 'Lunar';
}

const KIND_INFO: Record<string, { glyph: string; meaning: Record<Language, string> }> = {
  Total: { glyph: '●', meaning: { sk: 'totálne — najsilnejšia transformácia', en: 'total — strongest transformation' } },
  Partial: { glyph: '◐', meaning: { sk: 'čiastočné — postupná zmena', en: 'partial — gradual change' } },
  Annular: { glyph: '○', meaning: { sk: 'prstencové — vzácne, znova-rodenie', en: 'annular — rare, rebirth' } },
  Penumbral: { glyph: '◌', meaning: { sk: 'penumbrálne — jemná energia', en: 'penumbral — subtle energy' } },
};

const KIND_LABEL: Record<string, Record<Language, string>> = {
  Total: { sk: 'totálne', en: 'total' },
  Partial: { sk: 'čiastočné', en: 'partial' },
  Annular: { sk: 'prstencové', en: 'annular' },
  Penumbral: { sk: 'penumbrálne', en: 'penumbral' },
};

/**
 * Najbližších 4 zatmení (Slnka + Mesiaca) v budúcnosti, zoradené chronologicky.
 * Astronomy-engine SearchLunarEclipse a SearchGlobalSolarEclipse vyhľadávajú
 * presne podľa Espenak/Meeus polynómov.
 */
export function UpcomingEclipses() {
  const { language } = useTranslation();
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
      <h3 className="font-medium text-white mb-1">
        {language === 'sk' ? 'Nadchádzajúce zatmenia' : 'Upcoming Eclipses'}
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        {language === 'sk'
          ? 'Zatmenia Slnka a Mesiaca prinášajú silné transformačné okná v cykle ~6 mesiacov. Energie sa mobilizujú niekoľko týždňov pred a po.'
          : 'Solar and Lunar eclipses bring powerful transformation windows in ~6-month cycles. Energies mobilize several weeks before and after.'}
      </p>
      <div className="space-y-2">
        {events.map((e, i) => {
          const info = KIND_INFO[e.kind] || { glyph: '?', meaning: { sk: e.kind, en: e.kind } };
          const kindLabel = KIND_LABEL[e.kind]?.[language] ?? e.kind;
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
                      {e.type === 'Solar'
                        ? (language === 'sk' ? '☉ Slnečné' : '☉ Solar')
                        : (language === 'sk' ? '☽ Mesačné' : '☽ Lunar')
                      } — {kindLabel}
                    </p>
                    <p className="text-xs text-slate-400">{info.meaning[language]}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">
                    {e.date.toLocaleDateString(language === 'sk' ? 'sk-SK' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {daysFromNow >= 0
                      ? (language === 'sk' ? `o ${daysFromNow} dní` : `in ${daysFromNow} days`)
                      : (language === 'sk' ? `pred ${-daysFromNow} dňami` : `${-daysFromNow} days ago`)
                    }
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
