package com.shotlink.controller;

import com.shotlink.model.dto.response.ApiResponse;
import com.shotlink.model.entity.User;
import com.shotlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(
            @AuthenticationPrincipal Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        // Don't expose password hash
        user.setPasswordHash(null);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateCurrentUser(
            @AuthenticationPrincipal Long userId,
            @RequestBody Map<String, String> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (updates.containsKey("displayName")) {
            user.setDisplayName(updates.get("displayName"));
        }
        if (updates.containsKey("phone")) {
            user.setPhone(updates.get("phone"));
        }
        if (updates.containsKey("city")) {
            user.setCity(updates.get("city"));
        }
        if (updates.containsKey("province")) {
            user.setProvince(updates.get("province"));
        }

        user = userRepository.save(user);
        user.setPasswordHash(null);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
