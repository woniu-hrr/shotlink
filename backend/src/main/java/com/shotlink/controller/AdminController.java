package com.shotlink.controller;

import com.shotlink.model.dto.response.ApiResponse;
import com.shotlink.model.entity.CommunityPost;
import com.shotlink.model.entity.PhotographerProfile;
import com.shotlink.model.entity.User;
import com.shotlink.model.enums.ProfileStatus;
import com.shotlink.service.PhotographerSearchService;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final EntityManager em;
    private final PhotographerSearchService searchService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", em.createQuery("SELECT COUNT(u) FROM User u").getSingleResult());
        stats.put("totalPhotographers", em.createQuery("SELECT COUNT(p) FROM PhotographerProfile p WHERE p.status='APPROVED'").getSingleResult());
        stats.put("pendingApprovals", em.createQuery("SELECT COUNT(p) FROM PhotographerProfile p WHERE p.status='PENDING'").getSingleResult());
        stats.put("totalBookings", em.createQuery("SELECT COUNT(b) FROM Booking b").getSingleResult());
        stats.put("totalPosts", em.createQuery("SELECT COUNT(p) FROM CommunityPost p").getSingleResult());
        stats.put("totalRevenue", em.createQuery("SELECT COALESCE(SUM(b.price),0) FROM Booking b WHERE b.status='DELIVERED'").getSingleResult());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> users(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<User> users = em.createQuery("SELECT u FROM User u ORDER BY u.createdAt DESC", User.class)
                .setFirstResult(page * size).setMaxResults(size).getResultList();
        users.forEach(u -> u.setPasswordHash(null));
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PutMapping("/photographers/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approvePhotographer(@PathVariable Long id) {
        searchService.approvePhotographer(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/photographers/pending")
    public ResponseEntity<ApiResponse<List<PhotographerProfile>>> pendingPhotographers() {
        List<PhotographerProfile> list = em.createQuery(
                "SELECT p FROM PhotographerProfile p WHERE p.status='PENDING'", PhotographerProfile.class)
                .getResultList();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        CommunityPost post = em.find(CommunityPost.class, id);
        if (post != null) em.remove(post);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<ApiResponse<User>> toggleUser(@PathVariable Long id) {
        User user = em.find(User.class, id);
        user.setEnabled(!user.getEnabled());
        em.merge(user);
        user.setPasswordHash(null);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
