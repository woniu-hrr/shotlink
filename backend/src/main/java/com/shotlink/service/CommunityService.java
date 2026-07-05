package com.shotlink.service;

import com.shotlink.model.entity.CommunityComment;
import com.shotlink.model.entity.CommunityPost;
import com.shotlink.model.entity.User;
import com.shotlink.repository.CommunityCommentRepository;
import com.shotlink.repository.CommunityPostRepository;
import com.shotlink.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityPostRepository postRepository;
    private final CommunityCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final EntityManager em;

    // === Posts ===
    public Page<CommunityPost> getPosts(String category, int page, int size) {
        if (category != null && !category.isEmpty()) {
            return postRepository.findByCategoryAndStatusOrderByCreatedAtDesc(
                    category, "PUBLISHED", PageRequest.of(page, size));
        }
        return postRepository.findByStatusOrderByCreatedAtDesc(
                "PUBLISHED", PageRequest.of(page, size));
    }

    public CommunityPost createPost(Long userId, String title, String content,
                                     String category, List<String> tags) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        CommunityPost post = CommunityPost.builder()
                .user(user).title(title).content(content)
                .category(category != null ? category : "GENERAL")
                .tags(tags != null ? tags : List.of())
                .build();
        return postRepository.save(post);
    }

    public CommunityPost getPostDetail(Long id) {
        CommunityPost post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("帖子不存在"));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return post;
    }

    @Transactional
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    // === Comments ===
    public List<CommunityComment> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    public CommunityComment addComment(Long postId, Long userId, String content, Long parentId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("帖子不存在"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        CommunityComment comment = CommunityComment.builder()
                .post(post).user(user).content(content)
                .parent(parentId != null ?
                        commentRepository.findById(parentId).orElse(null) : null)
                .build();
        comment = commentRepository.save(comment);

        // Update post comment count
        post.setCommentCount(commentRepository.countByPostId(postId));
        postRepository.save(post);

        return comment;
    }

    // === Likes ===
    @Transactional
    public boolean toggleLike(Long userId, String targetType, Long targetId) {
        boolean liked = isLiked(userId, targetType, targetId);
        if (liked) {
            Query q = em.createNativeQuery(
                    "DELETE FROM likes_favorites WHERE user_id=?1 AND target_type=?2 AND target_id=?3");
            q.setParameter(1, userId).setParameter(2, targetType).setParameter(3, targetId);
            q.executeUpdate();
            updateLikeCount(targetType, targetId, -1);
            return false;
        } else {
            Query q = em.createNativeQuery(
                    "INSERT INTO likes_favorites (user_id, target_type, target_id) VALUES (?1,?2,?3) ON CONFLICT DO NOTHING");
            q.setParameter(1, userId).setParameter(2, targetType).setParameter(3, targetId);
            q.executeUpdate();
            updateLikeCount(targetType, targetId, 1);
            return true;
        }
    }

    public boolean isLiked(Long userId, String targetType, Long targetId) {
        Query q = em.createNativeQuery(
                "SELECT COUNT(*) FROM likes_favorites WHERE user_id=?1 AND target_type=?2 AND target_id=?3");
        q.setParameter(1, userId).setParameter(2, targetType).setParameter(3, targetId);
        return ((Number) q.getSingleResult()).intValue() > 0;
    }

    private void updateLikeCount(String targetType, Long targetId, int delta) {
        if ("POST".equals(targetType)) {
            CommunityPost post = postRepository.findById(targetId).orElse(null);
            if (post != null) {
                post.setLikeCount(post.getLikeCount() + delta);
                postRepository.save(post);
            }
        }
    }
}
