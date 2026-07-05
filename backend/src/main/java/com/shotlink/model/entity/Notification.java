package com.shotlink.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "notifications")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(nullable = false) private String type;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT") private String content;
    @Builder.Default @Column(name = "is_read") private Boolean isRead = false;
    @Column(name = "related_id") private Long relatedId;
    @Column(name = "created_at", updatable = false) @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}
