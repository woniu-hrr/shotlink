package com.shotlink.controller;

import com.shotlink.model.dto.response.ApiResponse;
import com.shotlink.model.entity.CommunityComment;
import com.shotlink.model.entity.CommunityPost;
import com.shotlink.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    // === Posts ===
    @GetMapping("/posts")
    public ResponseEntity<ApiResponse<Page<CommunityPost>>> list(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(communityService.getPosts(category, page, size)));
    }

    @PostMapping("/posts")
    public ResponseEntity<ApiResponse<CommunityPost>> create(
            @AuthenticationPrincipal Long userId,
            @RequestBody Map<String, Object> request) {
        String title = (String) request.get("title");
        String content = (String) request.get("content");
        String category = (String) request.get("category");
        @SuppressWarnings("unchecked")
        List<String> tags = (List<String>) request.get("tags");
        CommunityPost post = communityService.createPost(userId, title, content, category, tags);
        return ResponseEntity.ok(ApiResponse.ok(post));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<CommunityPost>> detail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(communityService.getPostDetail(id)));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        communityService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // === Comments ===
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<ApiResponse<List<CommunityComment>>> comments(@PathVariable Long postId) {
        return ResponseEntity.ok(ApiResponse.ok(communityService.getComments(postId)));
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<ApiResponse<CommunityComment>> addComment(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long postId,
            @RequestBody Map<String, Object> request) {
        String content = (String) request.get("content");
        Long parentId = request.containsKey("parentId") ?
                Long.valueOf(request.get("parentId").toString()) : null;
        CommunityComment comment = communityService.addComment(postId, userId, content, parentId);
        return ResponseEntity.ok(ApiResponse.ok(comment));
    }

    // === Likes ===
    @PostMapping("/likes")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleLike(
            @AuthenticationPrincipal Long userId,
            @RequestBody Map<String, String> request) {
        String targetType = request.get("targetType");
        Long targetId = Long.valueOf(request.get("targetId"));
        boolean liked = communityService.toggleLike(userId, targetType, targetId);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("liked", liked)));
    }

    @GetMapping("/likes/check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkLike(
            @AuthenticationPrincipal Long userId,
            @RequestParam String targetType,
            @RequestParam Long targetId) {
        boolean liked = communityService.isLiked(userId, targetType, targetId);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("liked", liked)));
    }
}
