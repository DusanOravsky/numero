/**
 * Zdieľaná IndexedDB connection factory.
 *
 * Rieši opakovaný boilerplate (instance caching + onclose/onversionchange
 * invalidation + reject) ktorý mali predtým duplicitne `chatStorage.ts` aj
 * `store/indexedDbStorage.ts`. Každé volanie `createIdbConnection` vracia
 * vlastný izolovaný `openDb()` s vlastným cache — connectiony sa nezdieľajú
 * medzi rôznymi databázami.
 */
export interface IdbConnection {
  /** Vráti cached spojenie alebo otvorí nové. */
  openDb: () => Promise<IDBDatabase>;
  /** Zahodí cache — ďalšie openDb otvorí čerstvé spojenie (po stale transaction). */
  invalidate: () => void;
}

export function createIdbConnection(
  dbName: string,
  version: number,
  upgrade: (db: IDBDatabase) => void,
): IdbConnection {
  let dbInstance: IDBDatabase | null = null;
  let dbPromise: Promise<IDBDatabase> | null = null;

  const invalidate = () => { dbInstance = null; dbPromise = null; };

  const openDb = (): Promise<IDBDatabase> => {
    if (dbInstance) return Promise.resolve(dbInstance);
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);
      request.onupgradeneeded = () => upgrade(request.result);
      request.onsuccess = () => {
        dbInstance = request.result;
        // Pri zatvorení / version change invalidovať cache, aby ďalšie volanie
        // otvorilo čerstvé spojenie namiesto stale handle.
        dbInstance.onclose = invalidate;
        dbInstance.onversionchange = () => { dbInstance?.close(); invalidate(); };
        resolve(dbInstance);
      };
      request.onerror = () => {
        dbPromise = null;
        reject(request.error);
      };
    });
    return dbPromise;
  };

  return { openDb, invalidate };
}
