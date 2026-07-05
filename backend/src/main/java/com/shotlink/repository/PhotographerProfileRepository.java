package com.shotlink.repository;

import com.shotlink.model.entity.PhotographerProfile;
import com.shotlink.model.enums.ProfileStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PhotographerProfileRepository extends JpaRepository<PhotographerProfile, Long> {
    Optional<PhotographerProfile> findByUserId(Long userId);
    Boolean existsByUserId(Long userId);
}
