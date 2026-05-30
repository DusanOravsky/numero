import type { StateStorage } from 'zustand/middleware';
import { safeGet, safeSet, safeRemove } from '../utils/safeStorage';
import { createIdbConnection } from './idbConnection';

const STORE_NAME = 'zustand';

let storageDegraded = false;

export function isStorageDegraded(): boolean {
  return storageDegraded;
}

const conn = createIdbConnection('numero-db', 1, (db) => {
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.createObjectStore(STORE_NAME);
  }
});
const openDb = conn.openDb;

export const indexedDbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const request = store.get(name);
          request.onsuccess = () => resolve(request.result ?? null);
          request.onerror = () => reject(request.error);
        } catch {
          conn.invalidate();
          reject(new Error('Transaction failed, DB connection stale'));
        }
      });
    } catch {
      // Fallback na localStorage cez safeGet — v iOS private mode hodí výnimku
      // aj samotný localStorage, safeGet ju zachytí a vráti null.
      storageDegraded = true;
      return safeGet(name);
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const request = store.put(value, name);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        } catch {
          conn.invalidate();
          reject(new Error('Transaction failed, DB connection stale'));
        }
      });
    } catch {
      // safeSet je tolerantný voči localStorage výnimkám (iOS private mode, quota).
      storageDegraded = true;
      safeSet(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const request = store.delete(name);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        } catch {
          conn.invalidate();
          reject(new Error('Transaction failed, DB connection stale'));
        }
      });
    } catch {
      storageDegraded = true;
      safeRemove(name);
    }
  },
};
