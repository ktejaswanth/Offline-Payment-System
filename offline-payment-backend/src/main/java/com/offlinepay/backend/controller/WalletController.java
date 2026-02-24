package com.offlinepay.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

import com.offlinepay.backend.service.WalletService;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/balance")
    public BigDecimal getBalance(@RequestParam String email) {
        return walletService.getBalance(email);
    }

    @PostMapping("/add")
    public String addMoney(@RequestParam String email,
            @RequestParam BigDecimal amount) {
        return walletService.addMoney(email, amount);
    }

    @PostMapping("/withdraw")
    public String withdrawMoney(@RequestParam String email,
            @RequestParam BigDecimal amount) {
        return walletService.withdrawMoney(email, amount);
    }
}