import { useMemo, useState } from 'react';

const CLIENTS_PAGE_SIZE = 50;
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';
import { searchCities, findCity } from '../data/cities';
import { isValidDate, calculateLifePath } from '../engine/numerologyEngine';
import { useTranslation } from '../i18n/useTranslation';
import type { Client } from '../store/useStore';

export function ClientsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clients, addClient, updateClient, deleteClient, reports, deleteReport } = useStore(
    useShallow(s => ({ clients: s.clients, addClient: s.addClient, updateClient: s.updateClient, deleteClient: s.deleteClient, reports: s.reports, deleteReport: s.deleteReport }))
  );
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
  // Page-counter pre "Load more" — viazaný na (searchQuery, activeTagFilter) cez state-reset pri zmene filtra.
  const [filterKey, setFilterKey] = useState('');
  const [extraPages, setExtraPages] = useState(0);
  const currentFilterKey = `${searchQuery}|${activeTagFilter ?? ''}`;
  if (currentFilterKey !== filterKey) {
    setFilterKey(currentFilterKey);
    setExtraPages(0);
  }
  const visibleCount = CLIENTS_PAGE_SIZE * (1 + extraPages);

  const resetForm = () => {
    setName(''); setGender(''); setDay(''); setMonth(''); setYear(''); setHour(''); setMinute(''); setBirthPlace(''); setNotes(''); setTagsInput('');
    setEditingClient(null); setCitySuggestions([]);
  };

  const parseTags = (input: string): string[] =>
    input.split(',').map(t => t.trim()).filter(Boolean);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    clients.forEach(c => c.tags?.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [clients]);

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
      setFormError(t('validation.fillName'));
      return;
    }
    const dNum = parseInt(day, 10);
    const mNum = parseInt(month, 10);
    const yNum = parseInt(year, 10);
    if (!dNum || !mNum || !yNum) {
      setFormError(t('validation.fillDate'));
      return;
    }
    if (!isValidDate(dNum, mNum, yNum)) {
      setFormError(`${t('validation.invalidDate')}: ${dNum}.${mNum}.${yNum}`);
      return;
    }
    const city = findCity(birthPlace);
    const data = {
      name: name.trim(),
      gender: gender || undefined,
      birthDay: parseInt(day, 10),
      birthMonth: parseInt(month, 10),
      birthYear: parseInt(year, 10),
      birthHour: hour ? parseInt(hour, 10) : undefined,
      birthMinute: minute ? parseInt(minute, 10) : undefined,
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

  const filteredClients = useMemo(() => {
    let result = clients;
    if (activeTagFilter) {
      result = result.filter(c => c.tags?.includes(activeTagFilter));
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return result;
    return result.filter(c => {
      if (c.name.toLowerCase().includes(q)) return true;
      const dateStr = `${c.birthDay}.${c.birthMonth}.${c.birthYear}`;
      if (dateStr.includes(q)) return true;
      if (String(c.birthYear).includes(q)) return true;
      const lp = calculateLifePath(c.birthDay, c.birthMonth, c.birthYear);
      if (`zc ${lp.number}` === q || `žč ${lp.number}` === q || `${lp.number}` === q) return true;
      if (c.birthPlace && c.birthPlace.toLowerCase().includes(q)) return true;
      if (c.notes && c.notes.toLowerCase().includes(q)) return true;
      if (c.tags?.some(t => t.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [clients, activeTagFilter, searchQuery]);

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
    if (!confirm(t('clients.deleteSelectedConfirm'))) return;
    selectedIds.forEach(id => deleteClient(id));
    exitBulkMode();
  };

  const bulkAddTag = () => {
    if (selectedIds.size === 0) return;
    const tag = prompt(t('clients.addTag'));
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
          <button onClick={() => setSelectedClient(null)} className="text-slate-400 hover:text-white">{t('common.back')}</button>
          <h1 className="font-serif text-3xl font-bold text-white">{selectedClient.name}</h1>
        </div>

        <GlassCard>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400">{t('clients.birthDate')}</p>
              <p className="text-white font-medium">{selectedClient.birthDay}.{selectedClient.birthMonth}.{selectedClient.birthYear}</p>
            </div>
            {selectedClient.birthHour !== undefined && (
              <div>
                <p className="text-xs text-slate-400">{t('clients.time')}</p>
                <p className="text-white font-medium">{selectedClient.birthHour}:{String(selectedClient.birthMinute || 0).padStart(2, '0')}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400">{t('clients.added')}</p>
              <p className="text-white font-medium">{new Date(selectedClient.createdAt).toLocaleDateString('sk-SK')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('clients.readingCount')}</p>
              <p className="text-white font-medium">{cReports.length}</p>
            </div>
          </div>
          {selectedClient.notes && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-slate-400 mb-1">{t('clients.notesLabel')}</p>
              <p className="text-sm text-slate-300">{selectedClient.notes}</p>
            </div>
          )}
          {selectedClient.tags && selectedClient.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-slate-400 mb-2">{t('clients.tagsLabel')}</p>
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
            {t('nav.numerology')}
          </button>
          <button
            onClick={() => navigate(`/astrology?client=${selectedClient.id}`)}
            className="px-4 py-2 rounded-xl text-sm bg-purple-600 text-white hover:bg-purple-500"
          >
            {t('nav.astrology')}
          </button>
          <button
            onClick={() => navigate(`/human-design?client=${selectedClient.id}`)}
            className="px-4 py-2 rounded-xl text-sm bg-cyan-600 text-white hover:bg-cyan-500"
          >
            {t('nav.humanDesign')}
          </button>
          <button
            onClick={() => navigate(`/chakras?client=${selectedClient.id}`)}
            className="px-4 py-2 rounded-xl text-sm bg-green-600 text-white hover:bg-green-500"
          >
            {t('nav.chakras')}
          </button>
          <button
            onClick={() => navigate(`/relationships?client=${selectedClient.id}`)}
            className="px-4 py-2 rounded-xl text-sm bg-rose-600 text-white hover:bg-rose-500"
          >
            {t('nav.relationships')}
          </button>
        </div>

        {cReports.length > 0 && (
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">{t('clients.history')} ({cReports.length})</h3>
              <button
                onClick={() => {
                  if (confirm(t('clients.deleteReadingsConfirm'))) {
                    cReports.forEach(r => deleteReport(r.id));
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/30 hover:bg-red-500/10"
              >
                {t('clients.deleteAll')}
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
                      if (confirm(t('clients.deleteReading'))) deleteReport(report.id);
                    }}
                    className="ml-3 text-red-400 hover:text-red-300 text-sm shrink-0"
                    title={t('clients.deleteReading')}
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
            {t('clients.exportJson')}
          </button>
          <button
            onClick={() => { if (confirm(t('clients.deleteClientConfirm'))) { deleteClient(selectedClient.id); setSelectedClient(null); } }}
            className="px-4 py-2 rounded-xl text-sm text-red-300 border border-red-500/30 hover:bg-red-500/10"
          >
            {t('clients.deleteClient')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">{t('clients.title')}</h1>
          <p className="text-slate-400 mt-1">{t('clients.subtitle')}</p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          {clients.length > 0 && (
            <button
              onClick={() => {
                const exportData = {
                  version: 2,
                  exportedAt: new Date().toISOString(),
                  clients: clients,
                  reports: reports.filter(r => clients.some(c => c.id === r.clientId)),
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `vsetci-klienti-${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 rounded-xl text-sm border border-emerald-500/40 text-emerald-700 hover:bg-emerald-50"
            >
              ↓ Export všetkých ({clients.length})
            </button>
          )}
          <label className="px-4 py-2 rounded-xl text-sm border border-indigo-500/40 text-indigo-700 hover:bg-indigo-50 cursor-pointer">
            {t('clients.importClient')}
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
                    alert(t('clients.importInvalidFile'));
                    return;
                  }
                  // Validácia + sanitizácia. Bránime zlým dátam aj prompt-injection
                  // útokom cez maliciózne pripravený JSON súbor.
                  const c = data.client;
                  // eslint-disable-next-line no-control-regex
                  const safeName = String(c.name || '').replace(/[\x00-\x1F\x7F\r\n]/g, '').trim().slice(0, 80);
                  if (!safeName || !/^[\p{L}\p{M}\d\s\-'.]+$/u.test(safeName)) {
                    alert(t('clients.importInvalidName'));
                    return;
                  }
                  const day = parseInt(String(c.birthDay), 10);
                  const month = parseInt(String(c.birthMonth), 10);
                  const year = parseInt(String(c.birthYear), 10);
                  if (!isValidDate(day, month, year)) {
                    alert(t('clients.importInvalidDate'));
                    return;
                  }
                  const hour = c.birthHour !== undefined ? parseInt(String(c.birthHour), 10) : undefined;
                  const minute = c.birthMinute !== undefined ? parseInt(String(c.birthMinute), 10) : undefined;
                  if (hour !== undefined && (hour < 0 || hour > 23 || isNaN(hour))) {
                    alert(t('clients.importInvalidHour'));
                    return;
                  }
                  if (minute !== undefined && (minute < 0 || minute > 59 || isNaN(minute))) {
                    alert(t('clients.importInvalidMinute'));
                    return;
                  }
                  // eslint-disable-next-line no-control-regex
                  const safePlace = c.birthPlace ? String(c.birthPlace).replace(/[\x00-\x1F\x7F\r\n]/g, '').slice(0, 100) : undefined;
                  // eslint-disable-next-line no-control-regex
                  const safeNotes = c.notes ? String(c.notes).replace(/[\x00-\x1F\x7F]/g, '').slice(0, 2000) : undefined;
                  const safeTags = Array.isArray(c.tags)
                    // eslint-disable-next-line no-control-regex
                    ? c.tags.map((t: unknown) => String(t).replace(/[\x00-\x1F\x7F]/g, '').slice(0, 30)).filter(Boolean).slice(0, 20)
                    : undefined;
                  const importedClient: Client = {
                    id: crypto.randomUUID(),
                    name: safeName,
                    gender: c.gender === 'male' || c.gender === 'female' ? c.gender : undefined,
                    birthDay: day,
                    birthMonth: month,
                    birthYear: year,
                    birthHour: hour,
                    birthMinute: minute,
                    birthPlace: safePlace,
                    birthLatitude: typeof c.birthLatitude === 'number' ? c.birthLatitude : undefined,
                    birthLongitude: typeof c.birthLongitude === 'number' ? c.birthLongitude : undefined,
                    notes: safeNotes,
                    tags: safeTags,
                    createdAt: new Date().toISOString(),
                  };
                  addClient(importedClient);
                  alert(`${importedClient.name} ${t('clients.importSuccess')}`);
                } catch (err) {
                  console.error(err);
                  alert(t('clients.importJsonError'));
                } finally {
                  e.target.value = '';
                }
              }}
            />
          </label>
          {clients.length > 1 && (
            <button
              onClick={() => navigate('/clients/compare')}
              className="px-4 py-2 rounded-xl text-sm border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              {t('clients.compare')}
            </button>
          )}
          {clients.length > 1 && (
            <button
              onClick={() => bulkMode ? exitBulkMode() : setBulkMode(true)}
              className={`px-4 py-2 rounded-xl text-sm border ${bulkMode ? 'bg-amber-500/15 text-amber-700 border-amber-400' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
            >
              {bulkMode ? t('clients.cancelSelection') : t('clients.bulkMode')}
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl text-sm bg-indigo-600 text-white hover:bg-indigo-500"
          >
            {showForm ? t('common.cancel') : t('clients.newClient')}
          </button>
        </div>
      </div>

      {showForm && (
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('profile.name')}</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('clients.namePlaceholder')} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('profile.gender')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setGender('male')} className={`py-2.5 rounded-xl text-sm border-2 transition-all ${gender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{t('common.male')}</button>
                <button type="button" onClick={() => setGender('female')} className={`py-2.5 rounded-xl text-sm border-2 transition-all ${gender === 'female' ? 'border-rose-500 bg-rose-50 text-rose-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{t('common.female')}</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('profile.birthDate')}</label>
              <div className="flex gap-2">
                <input type="number" placeholder={t('profile.day')} min={1} max={31} value={day} onChange={e => setDay(e.target.value)} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder={t('profile.month')} min={1} max={12} value={month} onChange={e => setMonth(e.target.value)} className="w-24 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <input type="number" placeholder={t('profile.year')} min={1900} max={2100} value={year} onChange={e => setYear(e.target.value)} className="flex-1 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{`${t('profile.birthTime')} (${t('common.optional')})`}</label>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder={t('profile.hour')} min={0} max={23} value={hour} onChange={e => setHour(e.target.value)} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
                <span className="text-slate-500">:</span>
                <input type="number" placeholder={t('profile.minute')} min={0} max={59} value={minute} onChange={e => setMinute(e.target.value)} className="w-20 px-3 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white text-center focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{`${t('profile.birthPlace')} (${t('common.optional')})`}</label>
              <div className="relative">
                <input type="text" value={birthPlace} onChange={e => { setBirthPlace(e.target.value); setCitySuggestions(searchCities(e.target.value)); }} placeholder={t('profile.placePlaceholder')} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50" />
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
              <label className="block text-sm text-slate-400 mb-1">{t('clients.notesLabel')}</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('clients.notesPlaceholder')} rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50 resize-none" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('clients.tagsLabel')}</label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder={t('clients.tagsPlaceholder')}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-indigo-500/20 text-white focus:outline-none focus:border-indigo-500/50"
              />
              {allTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[10px] text-slate-500 uppercase mr-1 self-center">{t('clients.existingTags')}</span>
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
              {editingClient ? t('clients.saveChanges') : t('clients.newClient')}
            </button>
            {editingClient && <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="w-full py-2 text-sm text-slate-400">{t('clients.cancelEdit')}</button>}
          </form>
        </GlassCard>
      )}

      {clients.length === 0 && !showForm && (
        <GlassCard>
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">{t('clients.noClients')}</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 rounded-xl bg-indigo-600 text-white">
              {t('clients.addFirst')}
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
            placeholder={t('clients.searchPlaceholder')}
            className="w-full px-4 py-3 pl-10 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-indigo-400"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
              title={t('common.delete')}
            >
              ✕
            </button>
          )}
          {searchQuery && (
            <p className="text-xs text-slate-500 mt-1 px-1">
              {t('clients.foundOf')}: {filteredClients.length} / {clients.length}
            </p>
          )}
        </div>
      )}

      {/* Tag chip filtre */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 uppercase">{t('clients.tagFilter')}</span>
          <button
            onClick={() => setActiveTagFilter(null)}
            className={`text-xs px-3 py-1 rounded-full border ${
              activeTagFilter === null
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('clients.allClients')} ({clients.length})
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
                <strong>{selectedIds.size}</strong> / {filteredClients.length}
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
                {selectedIds.size === filteredClients.length ? t('clients.cancelSelection') : t('clients.selectAll')}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={bulkAddTag}
                disabled={selectedIds.size === 0}
                className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('clients.addTag')}
              </button>
              <button
                onClick={bulkDelete}
                disabled={selectedIds.size === 0}
                className="px-3 py-1.5 rounded-lg text-xs bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('clients.deleteSelected')}
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {clients.length > 0 && filteredClients.length === 0 && (
        <GlassCard>
          <p className="text-center text-slate-400 py-4">
            {t('clients.noMatch')}
            {activeTagFilter && (
              <button onClick={() => setActiveTagFilter(null)} className="ml-2 text-indigo-600 underline">
                {t('clients.clearFilter')}
              </button>
            )}
          </p>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.slice(0, visibleCount).map((client, idx) => {
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
                          <span className="text-xs text-indigo-300">{clientReports(client.id).length} {t('clients.readings')}</span>
                          <button onClick={(e) => { e.stopPropagation(); startEdit(client); }} className="text-xs px-2 py-1 rounded-lg border border-amber-300 text-amber-600 hover:bg-amber-50">{t('clients.editClient')}</button>
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
      {filteredClients.length > visibleCount && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setExtraPages(p => p + 1)}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            {t('clients.loadMore')} ({filteredClients.length - visibleCount})
          </button>
        </div>
      )}
    </div>
  );
}
