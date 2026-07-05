package com.shotlink.controller;

import com.shotlink.model.dto.response.ApiResponse;
import com.shotlink.model.entity.Booking;
import com.shotlink.model.entity.PhotographerSchedule;
import com.shotlink.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // === Bookings ===
    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<Booking>> create(
            @AuthenticationPrincipal Long userId,
            @RequestBody Map<String, Object> request) {
        Long photographerId = Long.valueOf(request.get("photographerId").toString());
        String shootType = (String) request.get("shootType");
        LocalDate shootDate = LocalDate.parse((String) request.get("shootDate"));
        String timeSlot = (String) request.get("timeSlot");
        String location = (String) request.get("location");
        String description = (String) request.get("description");
        Integer price = request.containsKey("price") ?
                ((Number) request.get("price")).intValue() : 0;

        Booking booking = bookingService.createBooking(
                userId, photographerId, shootType, shootDate, timeSlot,
                location, description, price);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<Page<Booking>>> list(
            @AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "client") String role, // "client" or "photographer"
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Booking> bookings = role.equals("photographer")
                ? bookingService.getPhotographerBookings(userId, page, size)
                : bookingService.getClientBookings(userId, page, size);
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<Booking>> detail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getDetail(id)));
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId,
            @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        String note = request.getOrDefault("note", "");
        Booking booking = bookingService.updateStatus(id, newStatus, userId, note);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    // === Schedules ===
    @GetMapping("/schedules/{photographerId}")
    public ResponseEntity<ApiResponse<List<PhotographerSchedule>>> getSchedule(
            @PathVariable Long photographerId,
            @RequestParam String start,
            @RequestParam String end) {
        List<PhotographerSchedule> schedules = bookingService.getSchedule(
                photographerId, LocalDate.parse(start), LocalDate.parse(end));
        return ResponseEntity.ok(ApiResponse.ok(schedules));
    }

    @PutMapping("/schedules")
    public ResponseEntity<ApiResponse<Void>> setAvailability(
            @AuthenticationPrincipal Long userId,
            @RequestBody Map<String, Object> request) {
        LocalDate date = LocalDate.parse((String) request.get("date"));
        String timeSlot = (String) request.get("timeSlot");
        boolean available = (Boolean) request.get("isAvailable");
        bookingService.setAvailability(userId, date, timeSlot, available);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
