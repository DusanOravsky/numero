import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { calculateFullNumerology, getGridCount } from '../engine/numerologyEngine';
import type { NumerologyResult } from '../engine/numerologyEngine';
import { calculateAstrology } from '../engine/astrologyEngine';
import type { AstrologyResult } from '../engine/astrologyEngine';
import { calculateHumanDesign } from '../engine/humanDesignEngine';
import type { HumanDesignResult } from '../engine/humanDesignEngine';
import { evaluateChakras } from '../engine/chakraEngine';
import type { ChakraState } from '../engine/chakraEngine';
import { calculateKabalah } from '../engine/kabalahEngine';
import type { KabalahResult } from '../engine/kabalahEngine';
import { calculateThetaHealing } from '../engine/thetaHealingEngine';
import type { ThetaHealingResult } from '../engine/thetaHealingEngine';
import { reduceToSingle } from '../engine/numerologyEngine';
import { ClientSummary } from '../components/ClientSummary';
import { ClientNumerology } from '../components/ClientNumerology';
import { ClientRelationships } from '../components/ClientRelationships';
import { ClientExport } from '../components/ClientExport';

interface AllResults {
  numerology: NumerologyResult;
  astrology: AstrologyResult;
  humanDesign: HumanDesignResult;
  chakras: ChakraState[];
  kabalah: KabalahResult;
  theta: ThetaHealingResult;
}

export function ClientDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, addReport } = useStore();
  const client = clients.find(c => c.id === id);
  const [results, setResults] = useState<AllResults | null>(null);
  const [showPartnerSelect, setShowPartnerSelect] = useState(false);
  const [showChildSelect, setShowChildSelect] = useState(false);

  useEffect(() => {
    if (!client) return;
    const { birthDay: d, birthMonth: m, birthYear: y, birthHour: h, birthMinute: min } = client;

    const numerology = calculateFullNumerology(d, m, y);
    const astrology = calculateAstrology(d, m, y, h ?? 12, min ?? 0);
    const humanDesign = calculateHumanDesign(d, m, y, h ?? 12, min ?? 0);
    const gridCounts = getGridCount(numerology.grid);
    const chakras = evaluateChakras(numerology.lifePathNumber, gridCounts, numerology.isolatedNumbers, humanDesign.definedCenters, astrology.dominantElement);
    const lp = numerology.lifePathNumber > 9 ? reduceToSingle(numerology.lifePathNumber) : numerology.lifePathNumber;
    const kabalah = calculateKabalah(lp, reduceToSingle(d));
    const theta = calculateThetaHealing(lp);

    setResults({ numerology, astrology, humanDesign, chakras, kabalah, theta });

    // Add report max once per day per client
    const today = new Date().toISOString().split('T')[0];
    const reports = useStore.getState().reports;
    if (!reports.some(r => r.clientId === client.id && r.createdAt.startsWith(today))) {
      addReport({
        id: crypto.randomUUID(),
        profileId: '',
        clientId: client.id,
        type: 'Kompletný výklad',
        title: `Výklad pre ${client.name}`,
        data: { lifePathNumber: numerology.lifePathNumber, hdType: humanDesign.type },
        createdAt: new Date().toISOString(),
      });
    }
  }, [client]);

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Klient nebol nájdený</p>
        <button onClick={() => navigate('/clients')} className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white">Späť na klientov</button>
      </div>
    );
  }

  if (!results) return <div className="text-center py-20"><p className="text-slate-400">Počítam...</p></div>;

  const { numerology, astrology, humanDesign, chakras, kabalah, theta } = results;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/clients')} className="text-slate-400 hover:text-white text-sm">← Klienti</button>
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-white">{client.name}</h1>
          <p className="text-slate-400 text-sm">{client.birthDay}.{client.birthMonth}.{client.birthYear}{client.birthHour !== undefined ? ` ${client.birthHour}:${String(client.birthMinute || 0).padStart(2, '0')}` : ''}</p>
        </div>
      </div>

      <ClientSummary
        clientName={client.name}
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
