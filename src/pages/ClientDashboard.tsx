import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { calculateFullNumerology, getGridCount, reduceToSingle } from '../engine/numerologyEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import { evaluateChakras } from '../engine/chakraEngine';
import { calculateKabalah } from '../engine/kabalahEngine';
import { calculateThetaHealing } from '../engine/thetaHealingEngine';
import { ClientSummary } from '../components/ClientSummary';
import { ClientNumerology } from '../components/ClientNumerology';
import { AIChat } from '../components/AIChat';
import { ClientRelationships } from '../components/ClientRelationships';
import { ClientExport } from '../components/ClientExport';
import { SkeletonClientDashboard } from '../components/Skeleton';

export function ClientDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, addReport } = useStore();
  const client = clients.find(c => c.id === id);
  const [showPartnerSelect, setShowPartnerSelect] = useState(false);
  const [showChildSelect, setShowChildSelect] = useState(false);

  // Derivované výsledky cez useMemo — žiadne setState v useEffect.
  const computedResults = useMemo(() => {
    if (!client) return null;
    const { birthDay: d, birthMonth: m, birthYear: y, birthHour: h, birthMinute: min } = client;

    const numerology = calculateFullNumerology(d, m, y);
    const astrology = calculateAstrology(d, m, y, h ?? 12, min ?? 0);
    const humanDesign = calculateHumanDesign(d, m, y, h ?? 12, min ?? 0);
    const gridCounts = getGridCount(numerology.grid);
    const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement);
    const lp = numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber;
    const kabalah = calculateKabalah(lp, reduceToSingle(d));
    const theta = calculateThetaHealing(lp);
    return { numerology, astrology, humanDesign, chakras, kabalah, theta };
  }, [client]);

  // Side-effect: pridať report max raz za deň pre klienta. Toto je legitímny
  // useEffect (zápis do externého store), nie setState.
  useEffect(() => {
    if (!client || !computedResults) return;
    const today = new Date().toISOString().split('T')[0];
    const reports = useStore.getState().reports;
    if (!reports.some(r => r.clientId === client.id && r.createdAt.startsWith(today))) {
      addReport({
        id: crypto.randomUUID(),
        profileId: '',
        clientId: client.id,
        type: 'Kompletný výklad',
        title: `Výklad pre ${client.name}`,
        data: { lifePathNumber: computedResults.numerology.lifePathNumber, hdType: computedResults.humanDesign.type },
        createdAt: new Date().toISOString(),
      });
    }
  }, [client, computedResults, addReport]);

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Klient nebol nájdený</p>
        <button onClick={() => navigate('/clients')} className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white">Späť na klientov</button>
      </div>
    );
  }

  if (!computedResults) return <SkeletonClientDashboard />;

  const { numerology, astrology, humanDesign, chakras, kabalah, theta } = computedResults;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/clients')} className="text-slate-400 hover:text-white text-sm">← Klienti</button>
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-white">{client.name}</h1>
          <p className="text-slate-400 text-sm">{client.birthDay}.{client.birthMonth}.{client.birthYear}{client.birthHour !== undefined ? ` ${client.birthHour}:${String(client.birthMinute || 0).padStart(2, '0')}` : ''}</p>
        </div>
      </div>

      {/* Quick summary — 3 najdôležitejšie veci na konzultáciu */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
        <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide mb-3">3 veci na konzultáciu</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-xs text-slate-500 mb-0.5">Kto je v jadre</p>
            <p className="text-sm font-medium text-white">ŽČ {numerology.lifePathNumber} — {humanDesign.type}</p>
            <p className="text-[11px] text-slate-400 mt-1">Stratégia: „{humanDesign.strategy.toLowerCase()}"</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-xs text-slate-500 mb-0.5">Ako rozhoduje</p>
            <p className="text-sm font-medium text-white">{humanDesign.authority}</p>
            <p className="text-[11px] text-slate-400 mt-1">Nie-ja téma: „{humanDesign.notSelfTheme.toLowerCase()}"</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-xs text-slate-500 mb-0.5">Aktuálna energia</p>
            <p className="text-sm font-medium text-white">{astrology.sunSign.name} / {astrology.moonSign.name}</p>
            <p className="text-[11px] text-slate-400 mt-1">Element: {astrology.dominantElement}</p>
          </div>
        </div>
      </div>

      <ClientSummary
        clientName={client.name}
        birthDay={client.birthDay}
        birthMonth={client.birthMonth}
        birthYear={client.birthYear}
        numerology={numerology}
        astrology={astrology}
        humanDesign={humanDesign}
        kabalah={kabalah}
        theta={theta}
      />

      {/* AI integrálny výklad pre klienta (D1) */}
      <AIChat
        context={{
          name: client.name,
          gender: client.gender,
          birth: {
            day: client.birthDay,
            month: client.birthMonth,
            year: client.birthYear,
            hour: client.birthHour,
            minute: client.birthMinute,
            place: client.birthPlace,
          },
          numerology,
          astrology,
          humanDesign,
          kabalah,
          theta,
        }}
        title={`✦ AI výklad pre klienta: ${client.name}`}
        initialUserMessage={`Vyhotov mi prosím profesionálny integratívny výklad pre klienta ${client.name}, ktorý môžem použiť počas konzultácie. Zameraj sa na hlavnú životnú tému, silné stránky, výzvy aktuálneho obdobia (ORV) a praktické odporúčania.`}
        storageKey={`client-${client.id}`}
      />

      <ClientNumerology
        numerology={numerology}
        astrology={astrology}
        humanDesign={humanDesign}
        chakras={chakras}
        kabalah={kabalah}
        theta={theta}
        clientId={client.id}
      />

      <ClientRelationships
        client={client}
        numerology={numerology}
        humanDesign={humanDesign}
        showPartnerSelect={showPartnerSelect}
        setShowPartnerSelect={setShowPartnerSelect}
        showChildSelect={showChildSelect}
        setShowChildSelect={setShowChildSelect}
      />

      <ClientExport
        client={client}
        numerology={numerology}
        astrology={astrology}
        humanDesign={humanDesign}
        kabalah={kabalah}
        theta={theta}
      />
    </div>
  );
}
