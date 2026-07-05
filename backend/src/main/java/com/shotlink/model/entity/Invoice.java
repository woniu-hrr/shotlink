package com.shotlink.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "invoices")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Invoice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "photographer_id") private User photographer;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "client_id") private User client;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "booking_id") private Booking booking;
    @Column(nullable = false) private String title;
    @Builder.Default private Integer amount = 0;
    @Builder.Default private Integer tax = 0;
    @Builder.Default private Integer total = 0;
    @Builder.Default private String status = "PENDING";
    @Column(name = "issued_at") private LocalDateTime issuedAt;
    @Column(name = "created_at", updatable = false) @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at") @Builder.Default private LocalDateTime updatedAt = LocalDateTime.now();
    @PreUpdate void onUpdate() { updatedAt = LocalDateTime.now(); }
}
