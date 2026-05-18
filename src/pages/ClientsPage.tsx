import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';
import { searchCities, findCity } from '../data/cities';
import type { Client } from '../store/useStore';

export function ClientsPage() {
  const navigate = useNavigate();
  const { clients, addClient, updateClient, deleteClient, reports } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<{ name: string }[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const resetForm = () => {
    setName(''); setDay(''); setMonth(''); setYear(''); setHour(''); setMinute(''); setBirthPlace(''); setNotes('');
    setEditingClient(null); setCitySuggestions([]);
  };

  const startEdit = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setDay(String(client.birthDay));
    setMonth(String(client.birthMonth));
    setYear(String(client.birthYear));
    setHour(client.birthHour !== undefined ? String(client.birthHour) : '');
    setMinute(client.birthMinute !== undefined ? String(client.birthMinute) : '');
    setBirthPlace(client.birthPlace || '');
    setNotes(client.notes || '');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !day || !month || !year) return;
    const city = findCity(birthPlace);
    const data = {
      name: name.trim(),
      birthDay: parseInt(day),
      birthMonth: parseInt(month),
      birthYear: parseInt(year),
      birthHour: hour ? parseInt(hour) : undefined,
      birthMinute: minute ? parseInt(minute) : undefined,
      birthPlace: birthPlace.trim() || undefined,
      birthLatitude: city?.lat,
      birthLongitude: city?.lon,
      notes: notes.trim() || undefined,
    };

    if (editingClient) {
      updateClient(editingClient.id, data);
    } else {
      addClient({ id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() });
    }
    setShowForm(false);
    resetForm();
  };

  const clientReports = (clientId: string) => reports.filter(r => r.clientId === clientId);

  if (selectedClient) {
    const cReports = clientReports(selectedClient.id);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedClient(null)} className="text-slate-400 hover:text-white">← Späť</button>
          <h1 className="font-serif text-3xl font-bold text-white">{selectedClient.name}</h1>
        </div>

        <GlassCard>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400">Dátum narodenia</p>
              <p className="text-white font-medium">{selectedClient.birthDay}.{selectedClient.birthMonth}.{selectedClient.birthYear}</p>
            </div>
            {selectedClient.birthHour !== undefined && (
              <div>
                <p className="text-xs text-slate-400">Čas</p>
                <p className="text-white font-medium">{selectedClient.birthHour}:{String(selectedClient.birthMinute || 0).padStart(2, '0')}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400">Pridaný</p>
              <p className="text-white font-medium">{new Date(selectedClient.createdAt).toLocaleDateString('sk-SK')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Počet výkladov</p>
              <p className="text-white font-medium">{cReports.length}</p>
            </div>
          </div>
          {selectedClient.notes && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-slate-400 mb-1">Poznámky</p>
              <p className="text-sm text-slate-300">{selectedClient.notes}</p>
            </div>
          )}
        </GlassCard>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/numerology?client=${selectedClient.id}`)}
            className="px-4 py-2 rounded-xl text-sm bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Numerológia
          </button>
          <button
            onClick={() => navigate(`/astrology?client=${selectedClient.id}`)}
            className="px-4 py-2 rounded-xl text-sm bg-purple-600 text-white hover:bg-purple-500"
          >
            Astrológia
          </button>
          <button
            onClick={() => navigate(`/human-design?client=${selectedClient.id}`)}
            className="px-4 py-2 rounded-xl text-sm bg-cyan-600 text-white hover:bg-cyan-500"
          >
            Human Design
          </button>
          <button
            onClick={() => navigate(`/chakras?client=${selectedClient.id}`)}
            className="px-4 py-2 rounded-xl text-sm bg-green-600 text-white hover:bg-green-500"
          >
            Čakry
          </button>
          <button
            onClick={() => navigate(`/relationships?client=${selectedClient.id}`)}
            className="px-4 py-2 rounded-xl text-sm bg-rose-600 text-white hover:bg-rose-500"
          >
            Vzťahy
          </button>
        </div>

        {cReports.length > 0 && (
          <GlassCard>
            <h3 className="font-medium text-white mb-4">História výkladov</h3>
            <div className="space-y-2">
              {cReports.map(report => (
                <div key={report.id} className="flex items-center justify-between p-3 rounded-xl glass-light">
                  <div>
                    <p className="text-sm font-medium text-white">{report.title}</p>
                    <p className="text-xs text-slate-400">{report.type} | {new Date(report.createdAt).toLocaleDateString('sk-SK')}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        <button
          onClick={() => { if (confirm('Naozaj vymazať klienta a všetky jeho výklady?')) { deleteClient(selectedClient.id); setSelectedClient(null); } }}
          className="px-4 py-2 rounded-xl text-sm text-red-300 border border-red-500/30 hover:bg-red-500/10"
        >
          Vymazať klienta
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Klienti</h1>
          <p className="text-slate-400 mt-1">Správa klientov a história výkladov</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl text-sm bg-indigo-600 text-white hover:bg-indigo-500"
        >
          {showForm ? 'Zrušiť' : '+ Nový klient'}
        </button>
      </div>

      {showForm && (
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Meno klienta</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Meno a priezvisko" className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Dátum narodenia</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Deň" min={1} max={31} value={day} onChange={e => setDay(e.target.value)} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder="Mesiac" min={1} max={12} value={month} onChange={e => setMonth(e.target.value)} className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder="Rok" min={1900} max={2100} value={year} onChange={e => setYear(e.target.value)} className="flex-1 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Čas narodenia (voliteľné)</label>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Hod" min={0} max={23} value={hour} onChange={e => setHour(e.target.value)} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <span className="text-slate-500">:</span>
                <input type="number" placeholder="Min" min={0} max={59} value={minute} onChange={e => setMinute(e.target.value)} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Miesto narodenia (voliteľné – pre astrológiu)</label>
              <div className="relative">
                <input type="text" value={birthPlace} onChange={e => { setBirthPlace(e.target.value); setCitySuggestions(searchCities(e.target.value)); }} placeholder="Napr. Bratislava, Praha..." className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50" />
                {citySuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-lg">
                    {citySuggestions.map(city => (
                      <button key={city.name} type="button" onClick={() => { setBirthPlace(city.name); setCitySuggestions([]); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50">
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Poznámky</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Voliteľné poznámky o klientovi..." rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50 resize-none" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-500 hover:to-violet-500 glow">
              {editingClient ? 'Uložiť zmeny' : 'Pridať klienta'}
            </button>
            {editingClient && <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="w-full py-2 text-sm text-slate-400">Zrušiť úpravy</button>}
          </form>
        </GlassCard>
      )}

      {clients.length === 0 && !showForm && (
        <GlassCard>
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">Zatiaľ nemáte žiadnych klientov</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 rounded-xl bg-indigo-600 text-white">
              Pridať prvého klienta
            </button>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client, idx) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard className="cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => navigate(`/clients/${client.id}`)}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{client.name}</h3>
                  <p className="text-sm text-slate-400">
                    {client.birthDay}.{client.birthMonth}.{client.birthYear}
                    {client.birthHour !== undefined && ` ${client.birthHour}:${String(client.birthMinute || 0).padStart(2, '0')}`}
                    {client.birthPlace && ` | ${client.birthPlace}`}
                  </p>
                  {client.notes && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{client.notes}</p>}
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-xs text-indigo-300">{clientReports(client.id).length} výkladov</span>
                  <button onClick={(e) => { e.stopPropagation(); startEdit(client); }} className="text-[10px] text-slate-400 hover:text-indigo-500">Upraviť</button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
