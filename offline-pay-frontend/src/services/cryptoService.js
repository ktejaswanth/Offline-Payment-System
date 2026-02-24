import { saveKey, getKey } from './db.js';

export const generateKeyPair = async (userId) => {
    const existing = await getKey(`private_${userId}`);
    if (existing) return; // Already exists

    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256"
        },
        true,
        ["sign", "verify"]
    );

    const privateKeyRaw = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
    await saveKey(`private_${userId}`, privateKeyRaw);

    // Export public key as SPKI for the backend
    const publicKeyRaw = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(publicKeyRaw)));
}

export const signData = async (userId, dataPayload) => {
    const rawKey = await getKey(`private_${userId}`);
    if (!rawKey) throw new Error("No private key found for user. Please login while online first.");

    const privateKey = await window.crypto.subtle.importKey(
        "jwk",
        rawKey,
        {
            name: "ECDSA",
            namedCurve: "P-256"
        },
        true,
        ["sign"]
    );

    const encoder = new TextEncoder();
    // Deterministic payload string for signing
    const payloadStr = `${dataPayload.senderId}:${dataPayload.receiverId}:${dataPayload.amount}:${dataPayload.nonce}`;
    const data = encoder.encode(payloadStr);

    const signature = await window.crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" },
        },
        privateKey,
        data
    );

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
};
