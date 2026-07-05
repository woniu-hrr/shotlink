package com.shotlink.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "reviews")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "booking_id") private Booking booking;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "client_id") private User client;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "photographer_id") private User photographer;
    @Column(nullable = false) private Integer rating;
    @Column(columnDefinition = "TEXT") private String content;
    @Column(name = "photographer_reply", columnDefinition = "TEXT") private String photographerReply;
    @Column(name = "created_at", updatable = false) @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}
