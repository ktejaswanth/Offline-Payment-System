package com.offlinepay.backend.service;

import com.offlinepay.backend.dto.OfflineTransactionRequest;
import com.offlinepay.backend.entity.OfflineTransaction;
import com.offlinepay.backend.entity.Transaction;
import com.offlinepay.backend.entity.TransactionStatus;
import com.offlinepay.backend.entity.User;
import com.offlinepay.backend.entity.Wallet;
import com.offlinepay.backend.repository.OfflineTransactionRepository;
import com.offlinepay.backend.repository.TransactionRepository;
import com.offlinepay.backend.repository.UserRepository;
import com.offlinepay.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OfflineTransactionService {

    private final OfflineTransactionRepository offlineTransactionRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    @Transactional
    public OfflineTransaction processOfflineTransaction(OfflineTransactionRequest request) {
        // Prevent Replay Attack
        Optional<OfflineTransaction> existing = offlineTransactionRepository.findByNonce(request.getNonce());
        if (existing.isPresent()) {
            throw new RuntimeException("Transaction with this nonce already exists (Replay Attack Detected)");
        }

        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("Cannot send money to yourself");
        }

        // Verify digital signature (Placeholder for actual cryptographic validation)
        boolean isSignatureValid = verifySignature(request, sender);
        if (!isSignatureValid) {
            throw new RuntimeException("Invalid digital signature");
        }

        Wallet senderWallet = walletRepository.findByUser(sender)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));

        if (senderWallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance for offline transaction");
        }

        Wallet receiverWallet = walletRepository.findByUser(receiver)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        // Deduct from sender
        senderWallet.setBalance(senderWallet.getBalance().subtract(request.getAmount()));
        walletRepository.save(senderWallet);

        // Add to receiver
        receiverWallet.setBalance(receiverWallet.getBalance().add(request.getAmount()));
        walletRepository.save(receiverWallet);

        // Save into offline transactions log
        OfflineTransaction offlineTransaction = OfflineTransaction.builder()
                .senderId(request.getSenderId())
                .receiverId(request.getReceiverId())
                .amount(request.getAmount())
                .nonce(request.getNonce())
                .signature(request.getSignature())
                .status(TransactionStatus.COMPLETED)
                .syncedAt(LocalDateTime.now())
                .build();

        offlineTransactionRepository.save(offlineTransaction);

        // Also save to main transactions log
        Transaction transaction = Transaction.builder()
                .sender(sender)
                .receiver(receiver)
                .amount(request.getAmount())
                .status(TransactionStatus.COMPLETED)
                .transactionType("OFFLINE")
                .build();

        transactionRepository.save(transaction);

        return offlineTransaction;
    }

    @Transactional
    public void syncOfflineTransactions(List<OfflineTransactionRequest> transactions) {
        for (OfflineTransactionRequest request : transactions) {
            try {
                processOfflineTransaction(request);
            } catch (Exception e) {
                // Log and continue syncing the rest
                System.err.println("Failed to sync transaction " + request.getNonce() + ": " + e.getMessage());
            }
        }
    }

    private boolean verifySignature(OfflineTransactionRequest request, User sender) {
        try {
            if (sender.getPublicKey() == null || sender.getPublicKey().isBlank()) {
                System.err.println("Sender does not have a registered public key.");
                return false;
            }

            // Decode the SPKI Base64 string from the user
            byte[] pkBytes = java.util.Base64.getDecoder().decode(sender.getPublicKey());
            java.security.spec.X509EncodedKeySpec spec = new java.security.spec.X509EncodedKeySpec(pkBytes);
            java.security.KeyFactory kf = java.security.KeyFactory.getInstance("EC");
            java.security.PublicKey publicKey = kf.generatePublic(spec);

            // Deterministic reconstruction of the payload
            String payloadStr = request.getSenderId() + ":" + request.getReceiverId() + ":" + request.getAmount() + ":"
                    + request.getNonce();
            byte[] data = payloadStr.getBytes(java.nio.charset.StandardCharsets.UTF_8);

            // WebCrypto's ECDSA signature is in P1363 raw (r||s) format instead of DER
            java.security.Signature sig = java.security.Signature.getInstance("SHA256withECDSAinP1363Format");
            sig.initVerify(publicKey);
            sig.update(data);

            // Decode the base64 signature
            byte[] signatureBytes = java.util.Base64.getDecoder().decode(request.getSignature());

            return sig.verify(signatureBytes);
        } catch (Exception e) {
            System.err.println("Digital Signature verification exception: " + e.getMessage());
            return false;
        }
    }
}
