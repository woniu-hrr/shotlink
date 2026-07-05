package com.shotlink.service;

import com.shotlink.model.entity.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewNotificationService {

    private final EntityManager em;

    // === Reviews ===
    @Transactional
    public Review createReview(Long clientId, Long photographerId, Long bookingId, int rating, String content) {
        // Check existing review for this booking
        Long count = em.createQuery("SELECT COUNT(r) FROM Review r WHERE r.booking.id=:bid", Long.class)
                .setParameter("bid", bookingId).getSingleResult();
        if (count > 0) throw new RuntimeException("该预约已评价");

        Review review = Review.builder()
                .client(em.getReference(User.class, clientId))
                .photographer(em.getReference(User.class, photographerId))
                .booking(em.getReference(Booking.class, bookingId))
                .rating(rating).content(content).build();
        em.persist(review);

        // Update photographer average rating
        updatePhotographerRating(photographerId);

        // Notify photographer
        createNotification(photographerId, "NEW_REVIEW", "收到新评价",
                "你收到了一条 " + rating + " 星评价");

        return review;
    }

    @Transactional
    public Review replyToReview(Long reviewId, String reply) {
        Review review = em.find(Review.class, reviewId);
        review.setPhotographerReply(reply);
        em.merge(review);
        return review;
    }

    public List<Review> getPhotographerReviews(Long photographerId) {
        return em.createQuery("SELECT r FROM Review r WHERE r.photographer.id=:pid ORDER BY r.createdAt DESC", Review.class)
                .setParameter("pid", photographerId).getResultList();
    }

    private void updatePhotographerRating(Long photographerId) {
        Double avg = em.createQuery("SELECT COALESCE(AVG(r.rating),0) FROM Review r WHERE r.photographer.id=:pid", Double.class)
                .setParameter("pid", photographerId).getSingleResult();
        PhotographerProfile profile = em.createQuery("SELECT p FROM PhotographerProfile p WHERE p.user.id=:uid", PhotographerProfile.class)
                .setParameter("uid", photographerId).getSingleResult();
        if (profile != null) {
            profile.setRatingAvg(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            em.merge(profile);
        }
    }

    // === Notifications ===
    @Transactional
    public void createNotification(Long userId, String type, String title, String content) {
        Notification notif = new Notification();
        notif.setUser(em.getReference(User.class, userId));
        notif.setType(type);
        notif.setTitle(title);
        notif.setContent(content);
        em.persist(notif);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return em.createQuery("SELECT n FROM Notification n WHERE n.user.id=:uid ORDER BY n.createdAt DESC", Notification.class)
                .setParameter("uid", userId).setMaxResults(50).getResultList();
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification n = em.find(Notification.class, notificationId);
        n.setIsRead(true);
        em.merge(n);
    }
}
