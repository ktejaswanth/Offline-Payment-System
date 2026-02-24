package com.offlinepay.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileRequest {
    private String name;
    private String contact;
    private String profilePic;
    private String bankAccountNumber;
    private String bankIfsc;
    private String bankName;
}
