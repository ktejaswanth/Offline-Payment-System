package com.offlinepay.backend.controller;

import com.offlinepay.backend.dto.TransactionRequest;
import com.offlinepay.backend.entity.Transaction;
import com.offlinepay.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMoney(@Valid @RequestBody TransactionRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            Transaction transaction = transactionService.processOnlineTransaction(email, request);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getTransactionHistory(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<Transaction> transactions = transactionService.getUserTransactions(email);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
