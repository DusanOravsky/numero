import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';

const SUBJECT_AWARE_PATHS = [
  '/numerology',
  '/astrology',
  '/human-design',
  '/chakras',
  '/kabalah',
  '/theta-healing',
  '/modality',
];

export function SubjectPicker() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profiles, activeProfileId, clients } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isSubjectAware = SUBJECT_AWARE_PATHS.some(p => location.pathname.startsWith(p));

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!isSubjectAware) return null;

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const clientId = searchParams.get('client');
  const activeClient = clientId ? clients.find(c => c.id === clientId) : null;

  const currentLabel = activeClient ? activeClient.name : (activeProfile?.name ?? 'Bez profilu');
  const isViewingClient = !!activeClient;

  function selectProfile() {
    const next = new URLSearchParams(searchParams);
    next.delete('client');
    navigate({ pathname: location.pathname, search: next.toString() }, { replace: true });
    setOpen(false);
  }

  function selectClient(id: string) {
    const next = new URLSearchParams(searchParams);
    next.set('client', id);
    navigate({ pathname: location.pathname, search: next.toString() }, { replace: true });
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
          isViewingClient
            ? 'bg-amber-50 border-amber-300 hover:bg-amber-100'
            : 'bg-white border-slate-300 hover:bg-slate-50'
        }`}
        style={{ color: isViewingClient ? '#92400e' : '#1e293b' }}
        aria-label="Výber profilu alebo klienta"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span style={{ color: isViewingClient ? '#d97706' : '#4f46e5' }}>{isViewingClient ? '♟' : '◉'}</span>
        <span className="max-w-[12rem] truncate" style={{ color: isViewingClient ? '#92400e' : '#1e293b' }}>{currentLabel}</span>
        <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: isViewingClient ? '#92400e' : '#1e293b' }}>▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-h-96 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1" style={{ color: '#1e293b' }}>
          {activeProfile && (
            <button
              type="button"
              onClick={selectProfile}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                !isViewingClient ? 'bg-indigo-50 font-medium' : 'hover:bg-slate-50'
              }`}
              style={{ color: !isViewingClient ? '#3730a3' : '#1e293b' }}
            >
              <span style={{ color: '#4f46e5' }}>◉</span>
              <span className="flex-1 truncate" style={{ color: !isViewingClient ? '#3730a3' : '#1e293b' }}>{activeProfile.name}</span>
              <span className="text-[10px] uppercase" style={{ color: '#64748b' }}>môj profil</span>
            </button>
          )}

          {clients.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border-t border-slate-100 mt-1 pt-2" style={{ color: '#64748b' }}>
                Klienti
              </div>
              {clients.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectClient(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    activeClient?.id === c.id
                      ? 'bg-amber-50 font-medium'
                      : 'hover:bg-slate-50'
                  }`}
                  style={{ color: activeClient?.id === c.id ? '#92400e' : '#1e293b' }}
                >
                  <span style={{ color: '#d97706' }}>♟</span>
                  <span className="flex-1 truncate" style={{ color: activeClient?.id === c.id ? '#92400e' : '#1e293b' }}>{c.name}</span>
                  <span className="text-[10px]" style={{ color: '#64748b' }}>
                    {c.birthDay}.{c.birthMonth}.{c.birthYear}
                  </span>
                </button>
              ))}
            </>
          )}

          {clients.length === 0 && (
            <div className="px-3 py-3 text-xs text-center" style={{ color: '#64748b' }}>
              Žiadni klienti — pridaj ich v sekcii Klienti.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
