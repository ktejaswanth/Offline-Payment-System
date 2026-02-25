import { v4 as uuidv4 } from 'uuid';
import { savePendingTransaction, getPendingTransactions, removeTransaction } from './db';
import { signData } from './cryptoService';
import axios from 'axios';

export const createOfflineTransaction = async (senderId, receiverId, amount) => {
    const nonce = uuidv4();

    const payload = {
        senderId,
        receiverId,
        amount,
        nonce
    };

    // Digitally sign the transaction payload
    const signature = await signData(senderId, payload);
    payload.signature = signature;

    // Save offline for later sync/QR display
    await savePendingTransaction(payload);

    return payload; // The full signed payload stringifiable for QR code
};

export const syncTransactions = async () => {
    if (!navigator.onLine) {
        console.log("Still offline, cannot sync.");
        return;
    }

    try {
        const pendingTxs = await getPendingTransactions();
        if (pendingTxs.length === 0) return;

        console.log(`Attempting to sync ${pendingTxs.length} transactions...`);

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Use our backend endpoint
        const response = await axios.post('https://offline-payment-system-backend.onrender.com/api/offline-transaction/sync', pendingTxs, { headers });

        if (response.status === 200) {
            console.log("Sync successful!");
            // clear out the synced successfully
            for (const tx of pendingTxs) {
                await removeTransaction(tx.nonce);
            }
        }
    } catch (e) {
        console.error("Sync failed", e);
    }
}
