package com.shotlink.service;

import com.shotlink.model.entity.Booking;
import com.shotlink.model.entity.PhotographerSchedule;
import com.shotlink.model.entity.User;
import com.shotlink.repository.BookingRepository;
import com.shotlink.repository.PhotographerScheduleRepository;
import com.shotlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PhotographerScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    @Transactional
    public Booking createBooking(Long clientId, Long photographerId, String shootType,
                                  LocalDate shootDate, String timeSlot,
                                  String location, String description, Integer price) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("客户不存在"));
        User photographer = userRepository.findById(photographerId)
                .orElseThrow(() -> new RuntimeException("摄影师不存在"));

        Booking booking = Booking.builder()
                .client(client)
                .photographer(photographer)
                .shootType(shootType)
                .shootDate(shootDate)
                .timeSlot(timeSlot)
                .location(location)
                .description(description)
                .price(price)
                .status("PENDING")
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateStatus(Long bookingId, String newStatus, Long userId, String note) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("预约不存在"));

        // Validate status transition
        String current = booking.getStatus();
        boolean valid = switch (current) {
            case "PENDING" -> newStatus.equals("CONFIRMED") || newStatus.equals("REJECTED") ||
                              newStatus.equals("CANCELLED");
            case "CONFIRMED" -> newStatus.equals("SHOOTING") || newStatus.equals("CANCELLED");
            case "SHOOTING" -> newStatus.equals("DELIVERED");
            default -> false;
        };

        if (!valid) {
            throw new RuntimeException("无效的状态变更: " + current + " -> " + newStatus);
        }

        // Only photographer can confirm/reject/set shooting/delivered
        // Only client can cancel
        if (newStatus.equals("CANCELLED") && !booking.getClient().getId().equals(userId)) {
            throw new RuntimeException("只有客户可以取消预约");
        }
        if (List.of("CONFIRMED", "REJECTED", "SHOOTING", "DELIVERED").contains(newStatus)
                && !booking.getPhotographer().getId().equals(userId)) {
            throw new RuntimeException("只有摄影师可以执行此操作");
        }

        booking.setStatus(newStatus);

        // If confirmed, update the schedule
        if (newStatus.equals("CONFIRMED")) {
            List<PhotographerSchedule> schedules = scheduleRepository
                    .findByPhotographerIdAndScheduleDate(
                            booking.getPhotographer().getId(), booking.getShootDate());
            for (PhotographerSchedule s : schedules) {
                if (s.getTimeSlot().equals(booking.getTimeSlot()) ||
                        "FULL_DAY".equals(booking.getTimeSlot())) {
                    s.setIsAvailable(false);
                    s.setBooking(booking);
                    scheduleRepository.save(s);
                }
            }
        }

        return bookingRepository.save(booking);
    }

    public Page<Booking> getClientBookings(Long clientId, int page, int size) {
        return bookingRepository.findByClientIdOrderByCreatedAtDesc(
                clientId, PageRequest.of(page, size));
    }

    public Page<Booking> getPhotographerBookings(Long photographerId, int page, int size) {
        return bookingRepository.findByPhotographerIdOrderByCreatedAtDesc(
                photographerId, PageRequest.of(page, size));
    }

    public Booking getDetail(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("预约不存在"));
    }

    // === Schedule ===
    public List<PhotographerSchedule> getSchedule(Long photographerId, LocalDate start, LocalDate end) {
        return scheduleRepository.findByPhotographerIdAndScheduleDateBetween(
                photographerId, start, end);
    }

    @Transactional
    public void setAvailability(Long photographerId, LocalDate date, String timeSlot, boolean available) {
        User photographer = userRepository.findById(photographerId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        // Check if schedule exists
        List<PhotographerSchedule> existing = scheduleRepository
                .findByPhotographerIdAndScheduleDate(photographerId, date);

        PhotographerSchedule match = existing.stream()
                .filter(s -> s.getTimeSlot().equals(timeSlot))
                .findFirst().orElse(null);

        if (match != null) {
            match.setIsAvailable(available);
            scheduleRepository.save(match);
        } else {
            PhotographerSchedule schedule = PhotographerSchedule.builder()
                    .photographer(photographer)
                    .scheduleDate(date)
                    .timeSlot(timeSlot)
                    .isAvailable(available)
                    .build();
            scheduleRepository.save(schedule);
        }
    }
}
