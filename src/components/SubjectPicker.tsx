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
            ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
            : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
        }`}
        aria-label="Výber profilu alebo klienta"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={isViewingClient ? 'text-amber-600' : 'text-indigo-600'}>{isViewingClient ? '♟' : '◉'}</span>
        <span className="max-w-[12rem] truncate">{currentLabel}</span>
        <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-h-96 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1 mobile-sheet">
          {activeProfile && (
            <button
              type="button"
              onClick={selectProfile}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                !isViewingClient ? 'bg-indigo-50 font-medium text-indigo-800' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="text-indigo-600">◉</span>
              <span className="flex-1 truncate">{activeProfile.name}</span>
              <span className="text-[10px] uppercase text-slate-500">môj profil</span>
            </button>
          )}

          {clients.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border-t border-slate-100 mt-1 pt-2 text-slate-500">
                Klienti
              </div>
              {clients.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectClient(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    activeClient?.id === c.id
                      ? 'bg-amber-50 font-medium text-amber-800'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-amber-600">♟</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-[10px] text-slate-500">
                    {c.birthDay}.{c.birthMonth}.{c.birthYear}
                  </span>
                </button>
              ))}
            </>
          )}

          {clients.length === 0 && (
            <div className="px-3 py-3 text-xs text-center text-slate-500">
              Žiadni klienti — pridaj ich v sekcii Klienti.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
