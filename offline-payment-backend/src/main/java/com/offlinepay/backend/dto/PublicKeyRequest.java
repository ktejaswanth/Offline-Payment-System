package com.offlinepay.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PublicKeyRequest {
    @NotBlank
    private String publicKey;
}
