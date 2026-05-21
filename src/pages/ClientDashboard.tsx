import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { calculateFullNumerology, getGridCount, reduceToSingle } from '../engine/numerologyEngine';
import { calculateDevelopmentalNumerology } from '../engine/developmentalNumerologyEngine';
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
import { getTimezoneFromCoords } from '../data/cities';

export function ClientDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, addReport, reports } = useStore();
  const client = clients.find(c => c.id === id);

  useEffect(() => {
    if (client) localStorage.setItem('last-viewed-client', client.id);
  }, [client]);

  const [showPartnerSelect, setShowPartnerSelect] = useState(false);
  const [showChildSelect, setShowChildSelect] = useState(false);

  // Derivované výsledky cez useMemo — žiadne setState v useEffect.
  const computedResults = useMemo(() => {
    if (!client) return null;
    const { birthDay: d, birthMonth: m, birthYear: y, birthHour: h, birthMinute: min } = client;

    const lat = client.birthLatitude ?? 48.15;
    const lon = client.birthLongitude ?? 17.11;
    const tz = getTimezoneFromCoords(lat, lon);
    const numerology = calculateFullNumerology(d, m, y);
    const devNumerology = calculateDevelopmentalNumerology(d, m, y);
    const astrology = calculateAstrology(d, m, y, h ?? 12, min ?? 0, lat, lon, tz);
    const humanDesign = calculateHumanDesign(d, m, y, h ?? 12, min ?? 0, tz);
    const gridCounts = getGridCount(numerology.grid);
    const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement);
    const lp = numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber;
    const kabalah = calculateKabalah(lp, reduceToSingle(d));
    const theta = calculateThetaHealing(lp);
    return { numerology, devNumerology, astrology, humanDesign, chakras, kabalah, theta };
  }, [client]);

  const recordVisit = () => {
    if (!client || !computedResults) return;
    const today = new Date().toISOString().split('T')[0];
    if (reports.some(r => r.clientId === client.id && r.createdAt.startsWith(today))) {
      alert('Návšteva pre tento deň je už zaznamenaná.');
      return;
    }
    addReport({
      id: crypto.randomUUID(),
      profileId: '',
      clientId: client.id,
      type: 'Kompletný výklad',
      title: `Výklad pre ${client.name}`,
      data: { lifePathNumber: computedResults.numerology.lifePathNumber, hdType: computedResults.humanDesign.type },
      createdAt: new Date().toISOString(),
    });
  };

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
            <p className="text-sm font-medium text-indigo-900">ŽČ {numerology.lifePathNumber} — {humanDesign.type}</p>
            <p className="text-[11px] text-slate-500 mt-1">Stratégia: „{humanDesign.strategy.toLowerCase()}"</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-xs text-slate-500 mb-0.5">Ako rozhoduje</p>
            <p className="text-sm font-medium text-indigo-900">{humanDesign.authority}</p>
            <p className="text-[11px] text-slate-500 mt-1">Nie-ja téma: „{humanDesign.notSelfTheme.toLowerCase()}"</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-xs text-slate-500 mb-0.5">Aktuálna energia</p>
            <p className="text-sm font-medium text-indigo-900">{astrology.sunSign.name} / {astrology.moonSign.name}</p>
            <p className="text-[11px] text-slate-500 mt-1">Element: {astrology.dominantElement}</p>
          </div>
        </div>
      </div>

      {/* Záznam návštevy + časová os — história konzultácií */}
      <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-500/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-white">Návštevy klienta</h3>
          <button
            onClick={recordVisit}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            + Zaznamenať dnešnú návštevu
          </button>
        </div>
      </div>

      {(() => {
        const clientReports = reports.filter(r => r.clientId === client.id);
        if (clientReports.length === 0) return null;
        return (
          <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-500/20">
            <details>
              <summary className="cursor-pointer hover:text-indigo-300 transition-colors">
                <span className="font-medium text-white">Časová os ({clientReports.length} návštev)</span>
              </summary>
              <div className="mt-3 space-y-2">
                {clientReports.slice(0, 20).map(r => {
                  const d = new Date(r.createdAt);
                  const reportMonth = d.getMonth() + 1;
                  const reportDay = d.getDate();
                  const reportYear = d.getFullYear();
                  const orv = (() => {
                    const { birthDay: bd, birthMonth: bm } = client;
                    const yr = (reportMonth < bm || (reportMonth === bm && reportDay < bd)) ? reportYear - 1 : reportYear;
                    const digits = `${bd}${bm}${yr}`.split('').map(Number);
                    let sum = digits.reduce((a, b) => a + b, 0);
                    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
                      sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
                    }
                    return sum;
                  })();
                  return (
                    <div key={r.id} className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500 whitespace-nowrap">{d.toLocaleDateString('sk-SK')}</span>
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-[10px]">{orv}</span>
                      <span className="text-slate-400">{r.title}</span>
                    </div>
                  );
                })}
              </div>
            </details>
          </div>
        );
      })()}

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
