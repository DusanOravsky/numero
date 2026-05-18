import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { PartnerBodygraph } from './PartnerBodygraph';
import { calculateFullNumerology, reduceToSingle } from '../engine/numerologyEngine';
import type { NumerologyResult } from '../engine/numerologyEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { calculatePartnerCompatibility, calculateParentChild } from '../engine/compatibilityEngine';
import { useStore } from '../store/useStore';

interface Client {
  id: string;
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour?: number;
  birthMinute?: number;
  partnerId?: string;
  childrenIds?: string[];
}

interface ClientRelationshipsProps {
  client: Client;
  numerology: NumerologyResult;
  humanDesign: HumanDesignResult;
  showPartnerSelect: boolean;
  setShowPartnerSelect: (show: boolean) => void;
  showChildSelect: boolean;
  setShowChildSelect: (show: boolean) => void;
}

export function ClientRelationships({
  client,
  numerology,
  humanDesign,
  showPartnerSelect,
  setShowPartnerSelect,
  showChildSelect,
  setShowChildSelect,
}: ClientRelationshipsProps) {
  const { clients, updateClient } = useStore();

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
      <h2 className="font-serif text-xl font-bold text-rose-300 mb-3">Vzťahy a rodina</h2>

      {/* Partner */}
      <div className="space-y-4 mb-6">
        <GlassCard>
          <p className="text-xs text-slate-400">
            <strong className="text-rose-300">Partnerská kompatibilita</strong> hodnotí harmonickú zhodu – spoločné hodnoty, rovnaké jazyky lásky a energetickú rezonanciu. Porovnáva životné čísla, spoločné roviny v mriežke, jazyky lásky a ORV prepojenie.
          </p>
        </GlassCard>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Partner</h3>
          {!client.partnerId ? (
            <button onClick={() => setShowPartnerSelect(true)} className="text-xs px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500">+ Priradiť partnera</button>
          ) : (
            <button onClick={() => updateClient(client.id, { partnerId: undefined })} className="text-xs text-red-400 hover:text-red-300">Odstrániť</button>
          )}
        </div>

        {showPartnerSelect && (
          <GlassCard>
            <p className="text-xs text-slate-400 mb-2">Vyberte klienta ako partnera:</p>
            <div className="space-y-1">
              {clients.filter(c => c.id !== client.id).map(c => (
                <button key={c.id} onClick={() => { updateClient(client.id, { partnerId: c.id }); setShowPartnerSelect(false); }}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                  {c.name} ({c.birthDay}.{c.birthMonth}.{c.birthYear})
                </button>
              ))}
            </div>
            <button onClick={() => setShowPartnerSelect(false)} className="text-xs text-slate-400 mt-2">Zrušiť</button>
          </GlassCard>
        )}

        {client.partnerId && (() => {
          const partner = clients.find(c => c.id === client.partnerId);
          if (!partner) return null;
          const partnerNum = calculateFullNumerology(partner.birthDay, partner.birthMonth, partner.birthYear);
          const compat = calculatePartnerCompatibility(numerology, partnerNum, client.name, partner.name);
          const partnerHD = calculateHumanDesign(partner.birthDay, partner.birthMonth, partner.birthYear, partner.birthHour || 12, partner.birthMinute || 0);
          return (
            <div className="space-y-3">
              <GlassCard glow>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-white">{client.name} & {partner.name}</p>
                    <p className="text-xs text-slate-400">ŽČ {numerology.lifePathNumber} + ŽČ {partnerNum.lifePathNumber} | Cieľ vzťahu: {reduceToSingle(numerology.lifePathNumber + partnerNum.lifePathNumber)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-serif font-bold text-rose-300">{compat.overallScore}%</p>
                    <p className="text-xs text-slate-400">kompatibilita</p>
                  </div>
                </div>
              </GlassCard>
              <div className="grid grid-cols-2 gap-3">
                <GlassCard><p className="text-xs text-slate-400">Životné čísla</p><p className="text-sm text-white font-medium">{compat.lifePathCompatibility.score}%</p><p className="text-xs text-slate-300 mt-1">{compat.lifePathCompatibility.description}</p></GlassCard>
                <GlassCard><p className="text-xs text-slate-400">Jazyky lásky</p><p className="text-sm text-white font-medium">{compat.loveLanguageMatch.score}%</p>{compat.loveLanguageMatch.matched.length > 0 && <p className="text-xs text-green-300 mt-1">{compat.loveLanguageMatch.matched.join(', ')}</p>}</GlassCard>
              </div>
              {compat.strengths.length > 0 && (
                <GlassCard>
                  <p className="text-xs text-green-400 uppercase mb-2">Silné stránky</p>
                  {compat.strengths.map((s, i) => <p key={i} className="text-xs text-slate-300 mb-1">+ {s}</p>)}
                </GlassCard>
              )}
              {compat.challenges.length > 0 && (
                <GlassCard>
                  <p className="text-xs text-amber-400 uppercase mb-2">Výzvy</p>
                  {compat.challenges.map((c, i) => <p key={i} className="text-xs text-slate-300 mb-1">! {c}</p>)}
                </GlassCard>
              )}
              <GlassCard>
                <h3 className="text-sm font-medium text-purple-300 mb-3">Human Design kompatibilita</h3>
                <PartnerBodygraph result1={humanDesign} result2={partnerHD} name1={client.name} name2={partner.name} />
              </GlassCard>
              <GlassCard>
                <p className="text-xs text-indigo-400 uppercase mb-2">Odporúčania</p>
                {compat.recommendations.map((r, i) => <p key={i} className="text-xs text-slate-300 mb-1">→ {r}</p>)}
              </GlassCard>
              <GlassCard>
                <p className="text-xs text-rose-400 uppercase mb-2">Rituály pre pár</p>
                {compat.rituals.map((r, i) => <p key={i} className="text-xs text-slate-300 mb-1">♡ {r}</p>)}
              </GlassCard>
            </div>
          );
        })()}
      </div>

      {/* Deti */}
      <div className="space-y-4">
        <GlassCard>
          <p className="text-xs text-slate-400">
            <strong className="text-green-300">Rodič-dieťa kompatibilita</strong> hodnotí doplnkovosť – ako rodič dopĺňa dieťa. Vyšší % znamená že rodič má energie, ktoré dieťa potrebuje rozvíjať. Porovnáva mriežky, VDD, ΣT, cieľ vzťahu a spoločné roviny.
          </p>
        </GlassCard>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Deti</h3>
          <button onClick={() => setShowChildSelect(true)} className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-500">+ Pridať dieťa</button>
        </div>

        {showChildSelect && (
          <GlassCard>
            <p className="text-xs text-slate-400 mb-2">Vyberte klienta ako dieťa:</p>
            <div className="space-y-1">
              {clients.filter(c => c.id !== client.id && !(client.childrenIds || []).includes(c.id)).map(c => (
                <button key={c.id} onClick={() => { updateClient(client.id, { childrenIds: [...(client.childrenIds || []), c.id] }); setShowChildSelect(false); }}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                  {c.name} ({c.birthDay}.{c.birthMonth}.{c.birthYear})
                </button>
              ))}
            </div>
            <button onClick={() => setShowChildSelect(false)} className="text-xs text-slate-400 mt-2">Zrušiť</button>
          </GlassCard>
        )}

        {(client.childrenIds || []).map(childId => {
          const child = clients.find(c => c.id === childId);
          if (!child) return null;
          const childNum = calculateFullNumerology(child.birthDay, child.birthMonth, child.birthYear);
          const pcResult = calculateParentChild(numerology, childNum);
          return (
            <div key={childId} className="space-y-3">
              <GlassCard glow>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-white">{child.name}</p>
                    <p className="text-xs text-slate-400">ŽČ {childNum.lifePathNumber} | {pcResult.parentRole}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-serif font-bold text-green-300">{pcResult.compatibility}%</p>
                      <p className="text-xs text-slate-400">kompatibilita</p>
                    </div>
                    <button onClick={() => updateClient(client.id, { childrenIds: (client.childrenIds || []).filter(i => i !== childId) })}
                      className="text-red-400 hover:text-red-300 text-lg">✕</button>
                  </div>
                </div>
              </GlassCard>
              <GlassCard>
                <p className="text-xs text-cyan-400 uppercase mb-2">Komunikácia</p>
                <p className="text-sm text-slate-300">{pcResult.communicationStyle}</p>
              </GlassCard>
              <GlassCard>
                <p className="text-xs text-purple-400 uppercase mb-2">Emocionálne potreby dieťaťa</p>
                {pcResult.emotionalNeeds.map((n, i) => <p key={i} className="text-xs text-slate-300 mb-1">• {n}</p>)}
              </GlassCard>
              <GlassCard>
                <p className="text-xs text-amber-400 uppercase mb-2">Hranice a potreby</p>
                {pcResult.childNeeds.map((n, i) => <p key={i} className="text-xs text-slate-300 mb-1">★ {n}</p>)}
                {pcResult.boundaries.map((b, i) => <p key={i} className="text-xs text-slate-300 mb-1">⊡ {b}</p>)}
              </GlassCard>
              <GlassCard>
                <p className="text-xs text-indigo-400 uppercase mb-2">Odporúčania</p>
                {pcResult.recommendations.map((r, i) => <p key={i} className="text-xs text-slate-300 mb-1">→ {r}</p>)}
              </GlassCard>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
