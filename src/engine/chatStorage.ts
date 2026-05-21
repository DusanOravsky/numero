const DB_NAME = 'numero-chat';
const STORE_NAME = 'chats';
const DB_VERSION = 1;

export interface PersistedChat {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  totalInputTokens: number;
  totalOutputTokens: number;
}

let dbInstance: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => {
      dbInstance = req.result;
      dbInstance.onclose = () => { dbInstance = null; dbPromise = null; };
      resolve(dbInstance);
    };
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  });
  return dbPromise;
}

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

export async function saveChat(key: string, chat: PersistedChat): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const request = tx.objectStore(STORE_NAME).put(chat, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch { /* ignore */ }
}

export async function clearChat(key: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
  } catch { /* ignore */ }
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
