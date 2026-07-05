package com.shotlink.model.entity;

import com.shotlink.model.enums.ProfileStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "photographer_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhotographerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "varchar(50)[]")
    @Builder.Default
    private List<String> styles = List.of();

    @Column(name = "shoot_types", columnDefinition = "varchar(50)[]")
    @Builder.Default
    private List<String> shootTypes = List.of();

    @Column(name = "price_range_min")
    @Builder.Default
    private Integer priceRangeMin = 0;

    @Column(name = "price_range_max")
    @Builder.Default
    private Integer priceRangeMax = 0;

    @Column(name = "service_area", columnDefinition = "varchar(100)[]")
    @Builder.Default
    private List<String> serviceArea = List.of();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProfileStatus status = ProfileStatus.PENDING;

    @Column(name = "rating_avg", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal ratingAvg = BigDecimal.ZERO;

    @Column(name = "booking_count")
    @Builder.Default
    private Integer bookingCount = 0;

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
