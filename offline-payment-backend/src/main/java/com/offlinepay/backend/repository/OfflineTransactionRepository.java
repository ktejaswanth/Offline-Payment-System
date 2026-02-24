package com.offlinepay.backend.repository;

import com.offlinepay.backend.entity.OfflineTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OfflineTransactionRepository extends JpaRepository<OfflineTransaction, UUID> {
    Optional<OfflineTransaction> findByNonce(String nonce);
}
