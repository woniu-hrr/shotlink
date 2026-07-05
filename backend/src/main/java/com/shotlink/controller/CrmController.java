package com.shotlink.controller;

import com.shotlink.model.dto.response.ApiResponse;
import com.shotlink.model.entity.*;
import com.shotlink.service.CrmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/crm")
@PreAuthorize("hasRole('PHOTOGRAPHER')")
@RequiredArgsConstructor
public class CrmController {

    private final CrmService crmService;

    // Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(crmService.getDashboardStats(userId)));
    }

    @GetMapping("/clients")
    public ResponseEntity<ApiResponse<List<User>>> clients(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(crmService.getClientList(userId)));
    }

    // Contracts
    @PostMapping("/contracts")
    public ResponseEntity<ApiResponse<Contract>> createContract(@AuthenticationPrincipal Long userId, @RequestBody Map<String, Object> r) {
        Contract c = crmService.createContract(userId, Long.valueOf(r.get("clientId").toString()),
                r.containsKey("bookingId") ? Long.valueOf(r.get("bookingId").toString()) : null,
                (String) r.get("title"), (String) r.get("content"));
        return ResponseEntity.ok(ApiResponse.ok(c));
    }

    @GetMapping("/contracts")
    public ResponseEntity<ApiResponse<List<Contract>>> contracts(@AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(crmService.getContracts(userId, page, size)));
    }

    @PutMapping("/contracts/{id}/status")
    public ResponseEntity<ApiResponse<Contract>> updateContractStatus(@PathVariable Long id, @RequestBody Map<String, String> r) {
        return ResponseEntity.ok(ApiResponse.ok(crmService.updateContractStatus(id, r.get("status"))));
    }

    // Invoices
    @PostMapping("/invoices")
    public ResponseEntity<ApiResponse<Invoice>> createInvoice(@AuthenticationPrincipal Long userId, @RequestBody Map<String, Object> r) {
        Invoice inv = crmService.createInvoice(userId, Long.valueOf(r.get("clientId").toString()),
                r.containsKey("bookingId") ? Long.valueOf(r.get("bookingId").toString()) : null,
                (String) r.get("title"), ((Number) r.get("amount")).intValue());
        return ResponseEntity.ok(ApiResponse.ok(inv));
    }

    @GetMapping("/invoices")
    public ResponseEntity<ApiResponse<List<Invoice>>> invoices(@AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(crmService.getInvoices(userId, page, size)));
    }

    @PutMapping("/invoices/{id}/status")
    public ResponseEntity<ApiResponse<Invoice>> updateInvoiceStatus(@PathVariable Long id, @RequestBody Map<String, String> r) {
        return ResponseEntity.ok(ApiResponse.ok(crmService.updateInvoiceStatus(id, r.get("status"))));
    }

    // Deliveries
    @PostMapping("/deliveries")
    public ResponseEntity<ApiResponse<PhotoDelivery>> createDelivery(@AuthenticationPrincipal Long userId, @RequestBody Map<String, Object> r) {
        @SuppressWarnings("unchecked") List<String> photos = (List<String>) r.getOrDefault("photos", List.of());
        PhotoDelivery d = crmService.createDelivery(userId, Long.valueOf(r.get("clientId").toString()),
                r.containsKey("bookingId") ? Long.valueOf(r.get("bookingId").toString()) : null,
                (String) r.get("title"), photos);
        return ResponseEntity.ok(ApiResponse.ok(d));
    }

    @GetMapping("/deliveries")
    public ResponseEntity<ApiResponse<List<PhotoDelivery>>> deliveries(@AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(crmService.getDeliveries(userId, page, size)));
    }

    @PutMapping("/deliveries/{id}/status")
    public ResponseEntity<ApiResponse<PhotoDelivery>> updateDeliveryStatus(@PathVariable Long id, @RequestBody Map<String, String> r) {
        return ResponseEntity.ok(ApiResponse.ok(crmService.updateDeliveryStatus(id, r.get("status"), r.get("note"))));
    }
}
