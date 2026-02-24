package com.offlinepay.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

import com.offlinepay.backend.repository.WalletRepository;
import com.offlinepay.backend.repository.UserRepository;
import com.offlinepay.backend.repository.TransactionRepository;
import com.offlinepay.backend.entity.User;
import com.offlinepay.backend.entity.Wallet;
import com.offlinepay.backend.entity.Transaction;
import com.offlinepay.backend.entity.TransactionStatus;

@Service
@RequiredArgsConstructor
public class WalletService {

        private final WalletRepository walletRepository;
        private final UserRepository userRepository;
        private final TransactionRepository transactionRepository;

        public BigDecimal getBalance(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Wallet wallet = walletRepository.findByUser(user)
                                .orElseThrow(() -> new RuntimeException("Wallet not found"));

                return wallet.getBalance();
        }

        public String addMoney(String email, BigDecimal amount) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Wallet wallet = walletRepository.findByUser(user)
                                .orElseThrow(() -> new RuntimeException("Wallet not found"));

                wallet.setBalance(wallet.getBalance().add(amount));
                walletRepository.save(wallet);

                Transaction transaction = Transaction.builder()
                                .sender(user)
                                .receiver(user) // Self transfer for deposit
                                .amount(amount)
                                .status(TransactionStatus.COMPLETED)
                                .transactionType("DEPOSIT")
                                .build();
                transactionRepository.save(transaction);

                return "Money added successfully";
        }

        public String withdrawMoney(String email, BigDecimal amount) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Wallet wallet = walletRepository.findByUser(user)
                                .orElseThrow(() -> new RuntimeException("Wallet not found"));

                if (wallet.getBalance().compareTo(amount) < 0) {
                        throw new RuntimeException("Insufficient balance");
                }

                wallet.setBalance(wallet.getBalance().subtract(amount));
                walletRepository.save(wallet);

                Transaction transaction = Transaction.builder()
                                .sender(user) // Self transfer for withdraw
                                .receiver(user)
                                .amount(amount)
                                .status(TransactionStatus.COMPLETED)
                                .transactionType("WITHDRAWAL")
                                .build();
                transactionRepository.save(transaction);

                return "Money withdrawn successfully";
        }
}