package com.shotlink.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "community_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    private String category = "GENERAL";

    @Column(columnDefinition = "varchar(100)[]")
    @Builder.Default
    private List<String> tags = List.of();

    @Column(name = "view_count") @Builder.Default private Integer viewCount = 0;
    @Column(name = "like_count") @Builder.Default private Integer likeCount = 0;
    @Column(name = "comment_count") @Builder.Default private Integer commentCount = 0;
    @Column(name = "is_featured") @Builder.Default private Boolean isFeatured = false;
    @Builder.Default private String status = "PUBLISHED";

    @Column(name = "created_at", updatable = false)
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at")
    @Builder.Default private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
