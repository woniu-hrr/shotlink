package com.shotlink.repository;

import com.shotlink.model.entity.PhotographerSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface PhotographerScheduleRepository extends JpaRepository<PhotographerSchedule, Long> {
    List<PhotographerSchedule> findByPhotographerIdAndScheduleDateBetween(
            Long photographerId, LocalDate start, LocalDate end);
    List<PhotographerSchedule> findByPhotographerIdAndScheduleDate(Long photographerId, LocalDate date);
}
