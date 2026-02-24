package com.offlinepay.backend.controller;

import com.offlinepay.backend.dto.UserProfileRequest;
import com.offlinepay.backend.entity.User;
import com.offlinepay.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null)
            user.setName(request.getName());
        if (request.getContact() != null)
            user.setContact(request.getContact());
        if (request.getProfilePic() != null)
            user.setProfilePic(request.getProfilePic());
        if (request.getBankAccountNumber() != null)
            user.setBankAccountNumber(request.getBankAccountNumber());
        if (request.getBankIfsc() != null)
            user.setBankIfsc(request.getBankIfsc());
        if (request.getBankName() != null)
            user.setBankName(request.getBankName());

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
