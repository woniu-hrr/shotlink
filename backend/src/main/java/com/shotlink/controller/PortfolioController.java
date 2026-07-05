package com.shotlink.controller;

import com.shotlink.model.dto.response.ApiResponse;
import com.shotlink.model.entity.Portfolio;
import com.shotlink.model.entity.PortfolioImage;
import com.shotlink.service.PortfolioService;
import com.shotlink.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final FileStorageService fileStorageService;

    @PostMapping
    @PreAuthorize("hasRole('PHOTOGRAPHER')")
    public ResponseEntity<ApiResponse<Portfolio>> create(
            @AuthenticationPrincipal Long userId,
            @RequestBody Map<String, Object> request) {
        String title = (String) request.get("title");
        String description = (String) request.get("description");
        String shootType = (String) request.get("shootType");
        @SuppressWarnings("unchecked")
        List<String> tags = (List<String>) request.get("tags");

        Portfolio portfolio = portfolioService.createPortfolio(userId, title, description, shootType, tags);
        return ResponseEntity.ok(ApiResponse.ok(portfolio));
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('PHOTOGRAPHER')")
    public ResponseEntity<ApiResponse<PortfolioImage>> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "sortOrder", required = false) Integer sortOrder) {
        PortfolioImage image = portfolioService.uploadImage(id, file, sortOrder);
        return ResponseEntity.ok(ApiResponse.ok(image));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Portfolio>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Portfolio> portfolios = portfolioService.getPublishedPortfolios(page, size);
        return ResponseEntity.ok(ApiResponse.ok(portfolios));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<Portfolio>>> popular() {
        List<Portfolio> portfolios = portfolioService.getPopularPortfolios();
        return ResponseEntity.ok(ApiResponse.ok(portfolios));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Portfolio>> detail(@PathVariable Long id) {
        Portfolio portfolio = portfolioService.getPortfolioDetail(id);
        return ResponseEntity.ok(ApiResponse.ok(portfolio));
    }

    @GetMapping("/photographer/{photographerId}")
    public ResponseEntity<ApiResponse<Page<Portfolio>>> byPhotographer(
            @PathVariable Long photographerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Portfolio> portfolios = portfolioService.getPhotographerPortfolios(photographerId, page, size);
        return ResponseEntity.ok(ApiResponse.ok(portfolios));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PHOTOGRAPHER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @DeleteMapping("/images/{imageId}")
    @PreAuthorize("hasRole('PHOTOGRAPHER')")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@PathVariable Long imageId) {
        portfolioService.deleteImage(imageId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
