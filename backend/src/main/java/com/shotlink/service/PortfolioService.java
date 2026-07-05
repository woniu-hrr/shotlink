package com.shotlink.service;

import com.shotlink.model.entity.Portfolio;
import com.shotlink.model.entity.PortfolioImage;
import com.shotlink.model.entity.User;
import com.shotlink.repository.PortfolioImageRepository;
import com.shotlink.repository.PortfolioRepository;
import com.shotlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final PortfolioImageRepository portfolioImageRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public Portfolio createPortfolio(Long photographerId, String title, String description,
                                      String shootType, List<String> tags) {
        User photographer = userRepository.findById(photographerId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        Portfolio portfolio = Portfolio.builder()
                .photographer(photographer)
                .title(title)
                .description(description)
                .shootType(shootType)
                .tags(tags != null ? tags : List.of())
                .build();

        return portfolioRepository.save(portfolio);
    }

    @Transactional
    public PortfolioImage uploadImage(Long portfolioId, MultipartFile file, Integer sortOrder) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("作品集不存在"));

        // Upload to MinIO
        String objectName = fileStorageService.uploadFile(file);
        String imageUrl = fileStorageService.getPresignedUrl(objectName);

        PortfolioImage image = PortfolioImage.builder()
                .portfolio(portfolio)
                .imageUrl(imageUrl)
                .thumbnailUrl(imageUrl)  // Using same image as thumbnail for now
                .fileName(file.getOriginalFilename())
                .fileSize(file.getSize())
                .sortOrder(sortOrder != null ? sortOrder : portfolio.getImageCount())
                .build();

        image = portfolioImageRepository.save(image);

        // Update portfolio
        portfolio.setImageCount(portfolio.getImageCount() + 1);
        if (portfolio.getCoverUrl() == null) {
            portfolio.setCoverUrl(imageUrl);
        }
        portfolioRepository.save(portfolio);

        return image;
    }

    public Page<Portfolio> getPublishedPortfolios(int page, int size) {
        return portfolioRepository.findByStatusOrderByCreatedAtDesc(
                "PUBLISHED", PageRequest.of(page, size));
    }

    public Page<Portfolio> getPhotographerPortfolios(Long photographerId, int page, int size) {
        return portfolioRepository.findByPhotographerIdOrderByCreatedAtDesc(
                photographerId, PageRequest.of(page, size));
    }

    public Portfolio getPortfolioDetail(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("作品集不存在"));
        // Increment view count
        portfolio.setViewCount(portfolio.getViewCount() + 1);
        portfolioRepository.save(portfolio);
        return portfolio;
    }

    @Transactional
    public void deletePortfolio(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("作品集不存在"));
        // Delete images from MinIO
        for (PortfolioImage image : portfolio.getImages()) {
            // Extract object name from URL
            String objectName = extractObjectName(image.getImageUrl());
            if (objectName != null) {
                fileStorageService.deleteFile(objectName);
            }
        }
        portfolioRepository.delete(portfolio);
    }

    @Transactional
    public void deleteImage(Long imageId) {
        PortfolioImage image = portfolioImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("图片不存在"));
        Portfolio portfolio = image.getPortfolio();

        String objectName = extractObjectName(image.getImageUrl());
        if (objectName != null) {
            fileStorageService.deleteFile(objectName);
        }

        portfolioImageRepository.delete(image);
        portfolio.setImageCount(portfolio.getImageCount() - 1);
        portfolioRepository.save(portfolio);
    }

    public List<Portfolio> getPopularPortfolios() {
        return portfolioRepository.findTop10ByStatusOrderByViewCountDesc("PUBLISHED");
    }

    private String extractObjectName(String url) {
        if (url != null && url.contains("portfolios/")) {
            return url.substring(url.indexOf("portfolios/"));
        }
        return null;
    }
}
