package com.shotlink.repository;

import com.shotlink.model.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByClientIdOrderByCreatedAtDesc(Long clientId, Pageable pageable);
    Page<Booking> findByPhotographerIdOrderByCreatedAtDesc(Long photographerId, Pageable pageable);
    List<Booking> findByPhotographerIdAndStatus(Long photographerId, String status);
    List<Booking> findByClientIdAndStatus(Long clientId, String status);
}
