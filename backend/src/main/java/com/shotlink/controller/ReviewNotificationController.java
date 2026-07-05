package com.shotlink.controller;

import com.shotlink.model.dto.response.ApiResponse;
import com.shotlink.model.entity.Notification;
import com.shotlink.model.entity.Review;
import com.shotlink.service.ReviewNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewNotificationController {

    private final ReviewNotificationService service;

    // === Reviews ===
    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<Review>> create(@AuthenticationPrincipal Long userId,
            @RequestBody Map<String, Object> r) {
        Review review = service.createReview(userId,
                Long.valueOf(r.get("photographerId").toString()),
                r.containsKey("bookingId") ? Long.valueOf(r.get("bookingId").toString()) : null,
                ((Number) r.get("rating")).intValue(),
                (String) r.get("content"));
        return ResponseEntity.ok(ApiResponse.ok(review));
    }

    @GetMapping("/photographers/{photographerId}/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> list(@PathVariable Long photographerId) {
        return ResponseEntity.ok(ApiResponse.ok(service.getPhotographerReviews(photographerId)));
    }

    @PostMapping("/reviews/{id}/reply")
    public ResponseEntity<ApiResponse<Review>> reply(@PathVariable Long id,
            @RequestBody Map<String, String> r) {
        return ResponseEntity.ok(ApiResponse.ok(service.replyToReview(id, r.get("reply"))));
    }

    // === Notifications ===
    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<Notification>>> listNotifs(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(service.getUserNotifications(userId)));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id) {
        service.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
