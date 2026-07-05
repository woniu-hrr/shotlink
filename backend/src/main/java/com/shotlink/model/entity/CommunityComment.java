package com.shotlink.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "community_comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityComment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private CommunityComment parent;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "like_count") @Builder.Default private Integer likeCount = 0;

    @Column(name = "created_at", updatable = false)
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}
