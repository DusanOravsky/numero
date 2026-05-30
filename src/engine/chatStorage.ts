import { createIdbConnection } from '../store/idbConnection';

const STORE_NAME = 'chats';

const MAX_MESSAGES_PER_CHAT = 50;
const CHAT_TTL_DAYS = 90;

export interface PersistedChat {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  totalInputTokens: number;
  totalOutputTokens: number;
  updatedAt?: number;
}

const { openDb: openDB } = createIdbConnection('numero-chat', 1, (db) => {
  db.createObjectStore(STORE_NAME);
});

export async function loadChat(key: string): Promise<PersistedChat | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function saveChat(key: string, chat: PersistedChat): Promise<boolean> {
  try {
    const trimmed: PersistedChat = {
      ...chat,
      messages: chat.messages.slice(-MAX_MESSAGES_PER_CHAT),
      updatedAt: Date.now(),
    };
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const request = tx.objectStore(STORE_NAME).put(trimmed, key);
      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.warn('[chatStorage] Failed to save chat:', request.error);
        resolve(false);
      };
    });
  } catch (e) {
    console.warn('[chatStorage] saveChat error (quota exceeded?):', e);
    return false;
  }
}

export async function clearChat(key: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
  } catch (e) {
    console.warn('[chatStorage] clearChat error:', e);
  }
}

export function migrateFromLocalStorage(key: string): PersistedChat | null {
  try {
    const raw = localStorage.getItem(`ai-chat-${key}`);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedChat;
    localStorage.removeItem(`ai-chat-${key}`);
    return data;
  } catch {
    return null;
  }
}

export async function cleanupOldChats(): Promise<number> {
  const cutoff = Date.now() - CHAT_TTL_DAYS * 24 * 60 * 60 * 1000;
  let removed = 0;
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const allKeys = await new Promise<IDBValidKey[]>((resolve) => {
      const req = store.getAllKeys();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve([]);
    });
    for (const key of allKeys) {
      const chat = await new Promise<PersistedChat | null>((resolve) => {
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => resolve(null);
      });
      if (chat && chat.updatedAt && chat.updatedAt < cutoff) {
        store.delete(key);
        removed++;
      }
    }
  } catch (e) {
    console.warn('[chatStorage] cleanup error:', e);
  }
  return removed;
}

export async function getStorageEstimate(): Promise<{ usageMB: number; quotaMB: number; percent: number } | null> {
  if (!navigator.storage?.estimate) return null;
  try {
    const { usage, quota } = await navigator.storage.estimate();
    if (!usage || !quota) return null;
    const usageMB = Math.round(usage / 1024 / 1024 * 10) / 10;
    const quotaMB = Math.round(quota / 1024 / 1024);
    const percent = Math.round((usage / quota) * 100);
    return { usageMB, quotaMB, percent };
  } catch {
    return null;
  }
}
