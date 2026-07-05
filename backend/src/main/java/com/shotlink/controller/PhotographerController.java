package com.shotlink.controller;

import com.shotlink.model.dto.response.ApiResponse;
import com.shotlink.model.entity.PhotographerProfile;
import com.shotlink.model.entity.User;
import com.shotlink.model.enums.ProfileStatus;
import com.shotlink.model.enums.UserRole;
import com.shotlink.repository.PhotographerProfileRepository;
import com.shotlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/photographers")
@RequiredArgsConstructor
public class PhotographerController {

    private final PhotographerProfileRepository profileRepository;
    private final UserRepository userRepository;

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<PhotographerProfile>> apply(
            @AuthenticationPrincipal Long userId,
            @RequestBody Map<String, Object> request) {
        // Ensure user is a photographer
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (user.getRole() != UserRole.PHOTOGRAPHER) {
            throw new RuntimeException("只有摄影师角色可以提交入驻申请");
        }

        PhotographerProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("摄影师资料不存在"));

        // Update profile with application details
        if (request.containsKey("bio")) {
            profile.setBio((String) request.get("bio"));
        }
        if (request.containsKey("styles")) {
            @SuppressWarnings("unchecked")
            List<String> styles = (List<String>) request.get("styles");
            profile.setStyles(styles);
        }
        if (request.containsKey("shootTypes")) {
            @SuppressWarnings("unchecked")
            List<String> shootTypes = (List<String>) request.get("shootTypes");
            profile.setShootTypes(shootTypes);
        }
        if (request.containsKey("priceRangeMin")) {
            profile.setPriceRangeMin(((Number) request.get("priceRangeMin")).intValue());
        }
        if (request.containsKey("priceRangeMax")) {
            profile.setPriceRangeMax(((Number) request.get("priceRangeMax")).intValue());
        }
        if (request.containsKey("serviceArea")) {
            @SuppressWarnings("unchecked")
            List<String> serviceArea = (List<String>) request.get("serviceArea");
            profile.setServiceArea(serviceArea);
        }
        profile.setStatus(ProfileStatus.PENDING);

        profile = profileRepository.save(profile);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PhotographerProfile>> getProfile(@PathVariable Long id) {
        PhotographerProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("摄影师不存在"));
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PhotographerProfile>> getMyProfile(
            @AuthenticationPrincipal Long userId) {
        PhotographerProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("摄影师资料不存在"));
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
