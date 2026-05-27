import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import {
  hasApiKey,
  streamChat,
  summarizeProfile,
  type ProfileContext,
  type ChatMessage,
} from '../engine/aiInterpretation';
import {
  loadChat as idbLoad,
  saveChat as idbSave,
  clearChat as idbClear,
  migrateFromLocalStorage,
} from '../engine/chatStorage';
import { useTranslation } from '../i18n/useTranslation';

interface Props {
  context: ProfileContext;
  /** Voliteľný titulok */
  title?: string;
  /** Úvodná správa od AI ktorá sa pošle ako prvá user správa (ak nie je, použijeme default integrálny výklad) */
  initialUserMessage?: string;
  /** Storage key pre zachovanie histórie chatu medzi navigáciami */
  storageKey?: string;
}

const DEFAULT_INITIAL =
  'Vyhotov mi prosím integratívny duchovný výklad celej mojej osobnosti — spoj všetky systémy do jedného uceleného textu.';

/**
 * Ľahký markdown rendering — nadpisy + odseky + bullets, bez external lib.
 */
function renderMarkdown(text: string): React.ReactNode {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;
    if (trimmed.startsWith('### ')) {
      return <h4 key={i} className="font-medium text-indigo-300 mt-3 mb-1">{trimmed.slice(4)}</h4>;
    }
    if (trimmed.startsWith('## ')) {
      return <h3 key={i} className="font-semibold text-indigo-200 mt-4 mb-2">{trimmed.slice(3)}</h3>;
    }
    if (trimmed.startsWith('# ')) {
      return <h2 key={i} className="font-bold text-white mt-4 mb-2 text-lg">{trimmed.slice(2)}</h2>;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return <p key={i} className="ml-4 text-slate-300">• {trimmed.slice(2)}</p>;
    }
    // Inline bold **text**
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-slate-300">
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} className="text-white">{p.slice(2, -2)}</strong>
            : <span key={j}>{p}</span>
        )}
      </p>
    );
  });
}

export function AIChat({ context, title, initialUserMessage, storageKey }: Props) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t('ai.title');
  const keyAvailable = hasApiKey();
  const persistKey = storageKey || `${context.name}-${context.birth.day}-${context.birth.month}-${context.birth.year}`;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string>('');
  const [tokens, setTokens] = useState({ input: 0, output: 0 });
  const [userInput, setUserInput] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Async load z IndexedDB + migrácia z localStorage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const migrated = migrateFromLocalStorage(persistKey);
      if (migrated) {
        await idbSave(persistKey, migrated);
        if (!cancelled) {
          setMessages(migrated.messages);
          setTokens({ input: migrated.totalInputTokens, output: migrated.totalOutputTokens });
        }
      } else {
        const persisted = await idbLoad(persistKey);
        if (!cancelled && persisted) {
          setMessages(persisted.messages);
          setTokens({ input: persisted.totalInputTokens, output: persisted.totalOutputTokens });
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; abortRef.current?.abort(); };
  }, [persistKey]);

  // Auto-scroll na koniec konverzácie
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streamingText]);

  // Persist messages do IndexedDB
  useEffect(() => {
    if (loading) return;
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role !== 'assistant') return;
    idbSave(persistKey, {
      messages,
      totalInputTokens: tokens.input,
      totalOutputTokens: tokens.output,
    });
  }, [messages, tokens, persistKey, loading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || streaming) return;
    setError('');
    setStreaming(true);
    setStreamingText('');

    const newMessages: ChatMessage[] = [...messages, { id: crypto.randomUUID(), role: 'user', content }];
    setMessages(newMessages);
    setUserInput('');

    abortRef.current = new AbortController();
    const summary = summarizeProfile(context);

    let acc = '';
    await streamChat(
      newMessages,
      summary,
      (chunk) => {
        if (chunk.type === 'text' && chunk.delta) {
          acc += chunk.delta;
          setStreamingText(acc);
        } else if (chunk.type === 'done') {
          setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: acc }]);
          setStreamingText('');
          setStreaming(false);
          setTokens(prev => ({
            input: prev.input + (chunk.inputTokens || 0),
            output: prev.output + (chunk.outputTokens || 0),
          }));
        } else if (chunk.type === 'error') {
          setError(chunk.error || t('ai.unknownError'));
          setStreaming(false);
          setStreamingText('');
          // Vrátime user správu ak AI zlyhalo — používateľ ju môže opraviť
          setMessages(prev => prev.slice(0, -1));
          setUserInput(content);
        }
      },
      abortRef.current.signal
    );
  };

  const cancelStream = () => {
    abortRef.current?.abort();
    if (streamingText) {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: streamingText + '\n\n' + t('ai.interrupted') }]);
    }
    setStreamingText('');
    setStreaming(false);
  };

  const startConversation = () => {
    sendMessage(initialUserMessage || DEFAULT_INITIAL);
  };

  const resetChat = () => {
    if (!confirm(t('ai.clearConfirm'))) return;
    setMessages([]);
    setStreamingText('');
    setError('');
    setTokens({ input: 0, output: 0 });
    idbClear(persistKey);
  };

  if (loading) {
    return (
      <GlassCard>
        <h3 className="font-medium text-white mb-2">{resolvedTitle}</h3>
        <p className="text-xs text-slate-500 animate-pulse">{t('ai.loadingHistory')}</p>
      </GlassCard>
    );
  }

  if (!keyAvailable) {
    if (messages.length > 0) {
      return (
        <GlassCard>
          <h3 className="font-medium text-white mb-2">{resolvedTitle} <span className="text-xs text-slate-500 font-normal">{t('ai.savedReading')}</span></h3>
          <div ref={scrollRef} className="max-h-[400px] overflow-y-auto space-y-3 mb-3">
            {messages.filter(m => m.role === 'assistant').map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-xs text-slate-300 whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 italic">
            {t('ai.offlineHint')}
          </p>
        </GlassCard>
      );
    }
    return (
      <GlassCard>
        <h3 className="font-medium text-white mb-2">{resolvedTitle}</h3>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-sm text-amber-700 mb-2">
            <strong>{t('ai.notActivated')}</strong>
          </p>
          <p className="text-xs text-slate-400">
            {t('ai.notActivatedDesc')}
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            {t('ai.apiKeyHint')}
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-white">{resolvedTitle}</h3>
        <span className="text-[11px] text-slate-500 italic">Powered by Claude</span>
      </div>

      {/* Empty state — start conversation */}
      {messages.length === 0 && !streaming && (
        <div className="text-center py-6">
          <p className="text-sm text-slate-400 mb-4">
            Vygeneruj ucelený duchovný výklad spájajúci numerológiu, astrológiu, Human Design, Kabalu a Theta Healing do jedného prirodzene napísaného textu — a potom sa AI môžeš pýtať na čokoľvek.
          </p>
          <button
            onClick={startConversation}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-500 hover:to-violet-500 glow"
          >
            {t('ai.createReading')}
          </button>
          <p className="text-[11px] text-slate-500 mt-3 italic">
            {t('ai.readingTime')}
          </p>
        </div>
      )}

      {/* Conversation history + active stream */}
      {(messages.length > 0 || streaming) && (
        <div
          ref={scrollRef}
          className="max-h-[60vh] overflow-y-auto space-y-3 pr-1"
        >
          {messages.map((m, i) => (
            <div
              key={m.id || i}
              className={`p-3 rounded-xl border ${
                m.role === 'user'
                  ? 'bg-indigo-500/15 border-indigo-500/30 ml-8'
                  : 'bg-slate-800/40 border-slate-700/50 mr-4'
              }`}
            >
              <p className="text-[10px] uppercase mb-1 opacity-60 text-slate-400">
                {m.role === 'user' ? t('ai.you') : t('ai.assistant')}
              </p>
              <div className="text-sm leading-relaxed">
                {m.role === 'assistant' ? renderMarkdown(m.content) : <p className="text-slate-200">{m.content}</p>}
              </div>
            </div>
          ))}

          {/* Active streaming bubble */}
          {streaming && (
            <div className="p-3 rounded-xl border bg-slate-800/40 border-indigo-500/40 mr-4">
              <p className="text-[10px] uppercase mb-1 opacity-60 text-slate-400 flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {t('ai.writing')}
                </motion.span>
              </p>
              <div className="text-sm leading-relaxed min-h-[2rem]">
                {streamingText ? renderMarkdown(streamingText) : (
                  <p className="text-slate-500 italic">{t('ai.preparing')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <p className="text-sm text-rose-300"><strong>{t('ai.errorLabel')}</strong> {error}</p>
        </div>
      )}

      {/* Input + controls — len keď je už nejaká konverzácia alebo prebieha streaming */}
      {(messages.length > 0 || streaming) && (
        <div className="mt-4 space-y-2">
          {streaming ? (
            <button
              onClick={cancelStream}
              className="w-full px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
            >
              {t('ai.stopGeneration')}
            </button>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(userInput); }}
              className="flex gap-2"
            >
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(userInput);
                  }
                }}
                placeholder={t('ai.inputPlaceholder')}
                rows={2}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800/50 border border-indigo-500/30 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ↑
              </button>
            </form>
          )}

          {/* Footer: tokens + reset */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>
              {tokens.input + tokens.output > 0 && (
                <>Tokens: {tokens.input} in + {tokens.output} out</>
              )}
            </span>
            <button
              onClick={resetChat}
              className="text-rose-400 hover:text-rose-300"
            >
              ✕ Resetovať rozhovor
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
