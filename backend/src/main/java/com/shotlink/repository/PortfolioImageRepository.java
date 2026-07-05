package com.shotlink.repository;

import com.shotlink.model.entity.PortfolioImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PortfolioImageRepository extends JpaRepository<PortfolioImage, Long> {
    List<PortfolioImage> findByPortfolioIdOrderBySortOrderAsc(Long portfolioId);
}
