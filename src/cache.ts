/* eslint-disable no-shadow */

interface CacheEntry<T> {
  version: string;
  value: T;
}

export class Store {
  readonly dbp: Promise<IDBDatabase>;

  constructor(dbName = "tg-cache", readonly storeName = "keyval") {
    this.dbp = new Promise((resolve, reject) => {
      const openreq = indexedDB.open(dbName, 1);
      openreq.onerror = () => reject(openreq.error);
      openreq.onsuccess = () => resolve(openreq.result);

      // First time setup: create an empty object store
      openreq.onupgradeneeded = () => {
        openreq.result.createObjectStore(storeName);
      };
    });
  }

  withIDBStore(
    type: IDBTransactionMode,
    callback: (store: IDBObjectStore) => void
  ): Promise<void> {
    return this.dbp.then(
      (db) =>
        new Promise<void>((resolve, reject) => {
          const transaction = db.transaction(this.storeName, type);
          transaction.oncomplete = () => resolve();
          transaction.onabort = () => reject(transaction.error);
          transaction.onerror = () => reject(transaction.error);
          callback(transaction.objectStore(this.storeName));
        })
    );
  }
}

let defaultStore: Store;

function getDefaultStore() {
  if (!defaultStore) defaultStore = new Store();
  return defaultStore;
}

export function get<Type>(
  key: IDBValidKey,
  store = getDefaultStore()
): Promise<CacheEntry<Type>> {
  let req: IDBRequest;
  return store
    .withIDBStore("readonly", (store) => {
      req = store.get(key);
    })
    .then(() => req.result);
}

export function set<Type>(
  key: IDBValidKey,
  value: Type,
  version: string,
  store = getDefaultStore()
): Promise<void> {
  return store.withIDBStore("readwrite", (store) => {
    store.put({ version, value }, key);
  });
}

export function del(
  key: IDBValidKey,
  store = getDefaultStore()
): Promise<void> {
  return store.withIDBStore("readwrite", (store) => {
    store.delete(key);
  });
}

export function clear(store = getDefaultStore()): Promise<void> {
  return store.withIDBStore("readwrite", (store) => {
    store.clear();
  });
}

export function keys(store = getDefaultStore()): Promise<IDBValidKey[]> {
  const dbkeys: IDBValidKey[] = [];

  return store
    .withIDBStore("readonly", (store) => {
      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // And openKeyCursor isn't supported by Safari.
      (store.openKeyCursor || store.openCursor).call(
        store
      ).onsuccess = function () {
        if (!this.result) return;
        dbkeys.push(this.result.key);
        this.result.continue();
      };
    })
    .then(() => dbkeys);
}

export default {
  get,
  set,
  keys,
  del,
  clear,
};
