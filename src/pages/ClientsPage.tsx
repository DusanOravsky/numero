import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';
import { searchCities, findCity } from '../data/cities';
import { isValidDate, calculateLifePath } from '../engine/numerologyEngine';
import type { Client } from '../store/useStore';

export function ClientsPage() {
  const navigate = useNavigate();
  const { clients, addClient, updateClient, deleteClient, reports, deleteReport } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<{ name: string }[]>([]);
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formError, setFormError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const resetForm = () => {
    setName(''); setGender(''); setDay(''); setMonth(''); setYear(''); setHour(''); setMinute(''); setBirthPlace(''); setNotes(''); setTagsInput('');
    setEditingClient(null); setCitySuggestions([]);
  };

  const parseTags = (input: string): string[] =>
    input.split(',').map(t => t.trim()).filter(Boolean);

  const allTags = (() => {
    const set = new Set<string>();
    clients.forEach(c => c.tags?.forEach(t => set.add(t)));
    return Array.from(set).sort();
  })();

  const startEdit = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setGender(client.gender || '');
    setDay(String(client.birthDay));
    setMonth(String(client.birthMonth));
    setYear(String(client.birthYear));
    setHour(client.birthHour !== undefined ? String(client.birthHour) : '');
    setMinute(client.birthMinute !== undefined ? String(client.birthMinute) : '');
    setBirthPlace(client.birthPlace || '');
    setNotes(client.notes || '');
    setTagsInput((client.tags || []).join(', '));
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name.trim()) {
      setFormError('Zadajte meno klienta.');
      return;
    }
    const dNum = parseInt(day);
    const mNum = parseInt(month);
    const yNum = parseInt(year);
    if (!dNum || !mNum || !yNum) {
      setFormError('Vyplňte celý dátum narodenia.');
      return;
    }
    if (!isValidDate(dNum, mNum, yNum)) {
      setFormError(`Neplatný dátum: ${dNum}.${mNum}.${yNum}.`);
      return;
    }
    const city = findCity(birthPlace);
    const data = {
      name: name.trim(),
      gender: gender || undefined,
      birthDay: parseInt(day),
      birthMonth: parseInt(month),
      birthYear: parseInt(year),
      birthHour: hour ? parseInt(hour) : undefined,
      birthMinute: minute ? parseInt(minute) : undefined,
      birthPlace: birthPlace.trim() || undefined,
      birthLatitude: city?.lat,
      birthLongitude: city?.lon,
      notes: notes.trim() || undefined,
      tags: parseTags(tagsInput).length > 0 ? parseTags(tagsInput) : undefined,
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

  const filteredClients = (() => {
    let result = clients;
    if (activeTagFilter) {
      result = result.filter(c => c.tags?.includes(activeTagFilter));
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return result;
    return result.filter(c => {
      // Meno
      if (c.name.toLowerCase().includes(q)) return true;
      // Dátum (D.M.RRRR alebo časti)
      const dateStr = `${c.birthDay}.${c.birthMonth}.${c.birthYear}`;
      if (dateStr.includes(q)) return true;
      // Rok narodenia samostatne
      if (String(c.birthYear).includes(q)) return true;
      // Životné číslo
      const lp = calculateLifePath(c.birthDay, c.birthMonth, c.birthYear);
      if (`zc ${lp.number}` === q || `žč ${lp.number}` === q || `${lp.number}` === q) return true;
      // Miesto narodenia
      if (c.birthPlace && c.birthPlace.toLowerCase().includes(q)) return true;
      // Poznámky
      if (c.notes && c.notes.toLowerCase().includes(q)) return true;
      // Tagy
      if (c.tags?.some(t => t.toLowerCase().includes(q))) return true;
      return false;
    });
  })();

  const toggleSelected = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const exitBulkMode = () => {
    setBulkMode(false);
    setSelectedIds(new Set());
  };

  const bulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Vymazať ${selectedIds.size} ${selectedIds.size === 1 ? 'klienta' : 'klientov'} a všetky ich výklady?`)) return;
    selectedIds.forEach(id => deleteClient(id));
    exitBulkMode();
  };

  const bulkAddTag = () => {
    if (selectedIds.size === 0) return;
    const tag = prompt('Pridať tag (jeden alebo viac oddelených čiarkou):');
    if (!tag) return;
    const newTags = parseTags(tag);
    if (newTags.length === 0) return;
    selectedIds.forEach(id => {
      const c = clients.find(x => x.id === id);
      if (!c) return;
      const merged = Array.from(new Set([...(c.tags || []), ...newTags]));
      updateClient(id, { tags: merged });
    });
    exitBulkMode();
  };

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
          {selectedClient.tags && selectedClient.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-slate-400 mb-2">Tagy</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedClient.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {tag}
                  </span>
                ))}
              </div>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">História výkladov ({cReports.length})</h3>
              <button
                onClick={() => {
                  if (confirm(`Vymazať všetkých ${cReports.length} výkladov klienta?`)) {
                    cReports.forEach(r => deleteReport(r.id));
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/30 hover:bg-red-500/10"
              >
                Vymazať všetky
              </button>
            </div>
            <div className="space-y-2">
              {cReports.map(report => (
                <div key={report.id} className="flex items-center justify-between p-3 rounded-xl glass-light">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{report.title}</p>
                    <p className="text-xs text-slate-400">{report.type} | {new Date(report.createdAt).toLocaleDateString('sk-SK')} {new Date(report.createdAt).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Vymazať tento výklad?')) deleteReport(report.id);
                    }}
                    className="ml-3 text-red-400 hover:text-red-300 text-sm shrink-0"
                    title="Vymazať výklad"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const exportData = {
                version: 1,
                exportedAt: new Date().toISOString(),
                client: selectedClient,
                reports: cReports,
              };
              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `klient-${selectedClient.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 rounded-xl text-sm bg-indigo-600 text-white hover:bg-indigo-500"
          >
            ↓ Export JSON
          </button>
          <button
            onClick={() => { if (confirm('Naozaj vymazať klienta a všetky jeho výklady?')) { deleteClient(selectedClient.id); setSelectedClient(null); } }}
            className="px-4 py-2 rounded-xl text-sm text-red-300 border border-red-500/30 hover:bg-red-500/10"
          >
            Vymazať klienta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Klienti</h1>
          <p className="text-slate-400 mt-1">Pridajte klienta (meno + dátum) → kliknite naň pre kompletný výklad. Čas a miesto sa dajú doplniť cez "Upraviť".</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <label className="px-4 py-2 rounded-xl text-sm border border-indigo-500/40 text-indigo-700 hover:bg-indigo-50 cursor-pointer">
            ↑ Import
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const text = await file.text();
                  const data = JSON.parse(text);
                  if (!data.client || !data.client.name || !data.client.birthDay) {
                    alert('Neplatný súbor – chýbajú údaje klienta.');
                    return;
                  }
                  // Vytvor nové ID, aby nedošlo ku konfliktu s existujúcim klientom
                  const newId = crypto.randomUUID();
                  const importedClient: Client = {
                    ...data.client,
                    id: newId,
                    createdAt: new Date().toISOString(),
                    partnerId: undefined,   // referencie nemajú zmysel po importe
                    childrenIds: undefined,
                  };
                  addClient(importedClient);
                  alert(`Klient "${importedClient.name}" bol importovaný.`);
                } catch (err) {
                  console.error(err);
                  alert('Chyba pri čítaní súboru – nie je platný JSON.');
                } finally {
                  e.target.value = '';
                }
              }}
            />
          </label>
          {clients.length > 1 && (
            <button
              onClick={() => bulkMode ? exitBulkMode() : setBulkMode(true)}
              className={`px-4 py-2 rounded-xl text-sm border ${bulkMode ? 'bg-amber-500/15 text-amber-700 border-amber-400' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
            >
              {bulkMode ? '✕ Zrušiť výber' : '☑ Hromadne'}
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl text-sm bg-indigo-600 text-white hover:bg-indigo-500"
          >
            {showForm ? 'Zrušiť' : '+ Nový klient'}
          </button>
        </div>
      </div>

      {showForm && (
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Meno klienta</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Meno a priezvisko" className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Pohlavie</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setGender('male')} className={`py-2.5 rounded-xl text-sm border-2 transition-all ${gender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>♂ Muž</button>
                <button type="button" onClick={() => setGender('female')} className={`py-2.5 rounded-xl text-sm border-2 transition-all ${gender === 'female' ? 'border-rose-500 bg-rose-50 text-rose-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>♀ Žena</button>
              </div>
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
            <div>
              <label className="block text-sm text-slate-400 mb-1">Tagy (oddelené čiarkou)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="napr. rodina, VIP, dieťa"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
              />
              {allTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[10px] text-slate-500 uppercase mr-1 self-center">Existujúce:</span>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const cur = parseTags(tagsInput);
                        if (cur.includes(tag)) return;
                        setTagsInput(cur.length === 0 ? tag : `${tagsInput}, ${tag}`);
                      }}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formError && (
              <p className="text-sm text-rose-600 px-1">{formError}</p>
            )}
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

      {/* Vyhľadávací riadok */}
      {clients.length > 0 && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Hľadať podľa mena, dátumu, ŽČ, miesta alebo poznámok..."
            className="w-full px-4 py-3 pl-10 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-indigo-400"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
              title="Vyčistiť"
            >
              ✕
            </button>
          )}
          {searchQuery && (
            <p className="text-xs text-slate-500 mt-1 px-1">
              Nájdených: {filteredClients.length} z {clients.length}
            </p>
          )}
        </div>
      )}

      {/* Tag chip filtre */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 uppercase">Filter podľa tagu:</span>
          <button
            onClick={() => setActiveTagFilter(null)}
            className={`text-xs px-3 py-1 rounded-full border ${
              activeTagFilter === null
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Všetci ({clients.length})
          </button>
          {allTags.map(tag => {
            const count = clients.filter(c => c.tags?.includes(tag)).length;
            const active = activeTagFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTagFilter(active ? null : tag)}
                className={`text-xs px-3 py-1 rounded-full border ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-indigo-500/10 text-indigo-700 border-indigo-300 hover:bg-indigo-500/20'
                }`}
              >
                {tag} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Bulk-mode toolbar */}
      {bulkMode && (
        <GlassCard>
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-300">
                Vybraných: <strong>{selectedIds.size}</strong> / {filteredClients.length}
              </span>
              <button
                onClick={() => {
                  if (selectedIds.size === filteredClients.length) {
                    setSelectedIds(new Set());
                  } else {
                    setSelectedIds(new Set(filteredClients.map(c => c.id)));
                  }
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 underline"
              >
                {selectedIds.size === filteredClients.length ? 'Zrušiť výber' : 'Vybrať všetkých'}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={bulkAddTag}
                disabled={selectedIds.size === 0}
                className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                + Pridať tag
              </button>
              <button
                onClick={bulkDelete}
                disabled={selectedIds.size === 0}
                className="px-3 py-1.5 rounded-lg text-xs bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Vymazať vybrané
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {clients.length > 0 && filteredClients.length === 0 && (
        <GlassCard>
          <p className="text-center text-slate-400 py-4">
            Žiadny klient nezodpovedá filtrom.
            {activeTagFilter && (
              <button onClick={() => setActiveTagFilter(null)} className="ml-2 text-indigo-600 underline">
                Vyčistiť tag filter
              </button>
            )}
          </p>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client, idx) => {
          const isSelected = selectedIds.has(client.id);
          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard
                className={`cursor-pointer transition-transform ${
                  bulkMode ? (isSelected ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-indigo-300') : 'hover:scale-[1.02]'
                }`}
                onClick={() => bulkMode ? toggleSelected(client.id) : navigate(`/clients/${client.id}`)}
              >
                <div className="flex items-start gap-3">
                  {bulkMode && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelected(client.id)}
                      onClick={e => e.stopPropagation()}
                      className="mt-1 w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium text-white truncate">{client.name}</h3>
                        <p className="text-sm text-slate-400">
                          {client.birthDay}.{client.birthMonth}.{client.birthYear}
                          {client.birthHour !== undefined && ` ${client.birthHour}:${String(client.birthMinute || 0).padStart(2, '0')}`}
                          {client.birthPlace && ` | ${client.birthPlace}`}
                        </p>
                        {client.notes && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{client.notes}</p>}
                        {client.tags && client.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {client.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {!bulkMode && (
                        <div className="text-right flex flex-col items-end gap-1 shrink-0">
                          <span className="text-xs text-indigo-300">{clientReports(client.id).length} výkladov</span>
                          <button onClick={(e) => { e.stopPropagation(); startEdit(client); }} className="text-xs px-2 py-1 rounded-lg border border-amber-300 text-amber-600 hover:bg-amber-50">Upraviť</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
