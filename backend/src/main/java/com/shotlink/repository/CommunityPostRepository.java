package com.shotlink.repository;

import com.shotlink.model.entity.CommunityPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    Page<CommunityPost> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    Page<CommunityPost> findByCategoryAndStatusOrderByCreatedAtDesc(String category, String status, Pageable pageable);
    Page<CommunityPost> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
