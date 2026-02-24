package com.offlinepay.backend.controller;

import com.offlinepay.backend.dto.OfflineTransactionRequest;
import com.offlinepay.backend.entity.OfflineTransaction;
import com.offlinepay.backend.service.OfflineTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offline-transaction")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OfflineTransactionController {

    private final OfflineTransactionService offlineTransactionService;

    // This endpoint is used when the receiver scans the QR code and has internet
    @PostMapping("/verify")
    public ResponseEntity<?> verifyOfflineTransaction(@Valid @RequestBody OfflineTransactionRequest request) {
        try {
            OfflineTransaction transaction = offlineTransactionService.processOfflineTransaction(request);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // This endpoint is used for syncing offline transactions when network is
    // restored
    @PostMapping("/sync")
    public ResponseEntity<?> syncOfflineTransactions(@Valid @RequestBody List<OfflineTransactionRequest> transactions) {
        try {
            offlineTransactionService.syncOfflineTransactions(transactions);
            return ResponseEntity.ok("Synced successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Sync failed: " + e.getMessage());
        }
    }
}
