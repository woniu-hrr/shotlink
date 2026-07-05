package com.shotlink.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photographer_id", nullable = false)
    private User photographer;

    @Column(name = "shoot_type", nullable = false)
    private String shootType;

    @Column(name = "shoot_date", nullable = false)
    private LocalDate shootDate;

    @Column(name = "time_slot")
    private String timeSlot;  // MORNING, AFTERNOON, EVENING, FULL_DAY

    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer price;

    @Builder.Default
    private String status = "PENDING";
    // PENDING -> CONFIRMED -> SHOOTING -> DELIVERED
    // PENDING -> REJECTED
    // PENDING -> CANCELLED (by client)

    @Column(name = "client_note", columnDefinition = "TEXT")
    private String clientNote;

    @Column(name = "photographer_note", columnDefinition = "TEXT")
    private String photographerNote;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
