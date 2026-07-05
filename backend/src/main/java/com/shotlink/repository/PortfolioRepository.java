package com.shotlink.repository;

import com.shotlink.model.entity.Portfolio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    Page<Portfolio> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    Page<Portfolio> findByPhotographerIdOrderByCreatedAtDesc(Long photographerId, Pageable pageable);
    Page<Portfolio> findByShootTypeAndStatusOrderByCreatedAtDesc(String shootType, String status, Pageable pageable);
    List<Portfolio> findTop10ByStatusOrderByViewCountDesc(String status);
}
