package com.shotlink.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity @Table(name = "photo_deliveries")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PhotoDelivery {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "photographer_id") private User photographer;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "client_id") private User client;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "booking_id") private Booking booking;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT[]") @Builder.Default private List<String> photos = List.of();
    @Column(name = "delivery_url") private String deliveryUrl;
    @Builder.Default private String status = "SHOOTING";
    @Column(columnDefinition = "TEXT") private String note;
    @Column(name = "created_at", updatable = false) @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at") @Builder.Default private LocalDateTime updatedAt = LocalDateTime.now();
    @PreUpdate void onUpdate() { updatedAt = LocalDateTime.now(); }
}
