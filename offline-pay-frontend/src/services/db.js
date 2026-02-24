import { openDB } from 'idb';

const DB_NAME = 'OfflinePayDB';
const DB_VERSION = 1;
const TX_STORE = 'offlineTransactions';
const KEYS_STORE = 'cryptoKeys';

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(TX_STORE)) {
                db.createObjectStore(TX_STORE, { keyPath: 'nonce' });
            }
            if (!db.objectStoreNames.contains(KEYS_STORE)) {
                db.createObjectStore(KEYS_STORE, { keyPath: 'id' });
            }
        },
    });
};

// --- Transactions ---

export const savePendingTransaction = async (tx) => {
    const db = await initDB();
    await db.put(TX_STORE, tx);
};

export const getPendingTransactions = async () => {
    const db = await initDB();
    return db.getAll(TX_STORE);
};

export const clearPendingTransactions = async () => {
    const db = await initDB();
    await db.clear(TX_STORE);
};

export const removeTransaction = async (nonce) => {
    const db = await initDB();
    await db.delete(TX_STORE, nonce);
};

// --- Key Management ---

export const saveKey = async (id, keyData) => {
    const db = await initDB();
    await db.put(KEYS_STORE, { id, keyData });
};

export const getKey = async (id) => {
    const db = await initDB();
    const result = await db.get(KEYS_STORE, id);
    return result ? result.keyData : null;
};
