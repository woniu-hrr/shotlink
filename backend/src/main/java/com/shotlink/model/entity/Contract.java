package com.shotlink.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "contracts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Contract {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "photographer_id") private User photographer;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "client_id") private User client;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "booking_id") private Booking booking;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT") private String content;
    @Builder.Default private String status = "DRAFT";
    @Column(name = "signed_at") private LocalDateTime signedAt;
    @Column(name = "created_at", updatable = false) @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at") @Builder.Default private LocalDateTime updatedAt = LocalDateTime.now();
    @PreUpdate void onUpdate() { updatedAt = LocalDateTime.now(); }
}
