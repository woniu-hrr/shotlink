package com.shotlink.service;

import com.shotlink.model.entity.PhotographerProfile;
import com.shotlink.model.entity.User;
import com.shotlink.model.enums.ProfileStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotographerSearchService {

    private final EntityManager em;

    public Page<PhotographerProfile> search(
            String province, String city,
            List<String> styles, List<String> shootTypes,
            Integer priceMin, Integer priceMax,
            String sortBy, int page, int size) {

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<PhotographerProfile> cq = cb.createQuery(PhotographerProfile.class);
        Root<PhotographerProfile> root = cq.from(PhotographerProfile.class);
        Join<PhotographerProfile, User> userJoin = root.join("user");

        List<Predicate> predicates = new ArrayList<>();

        // Only approved photographers
        predicates.add(cb.equal(root.get("status"), ProfileStatus.APPROVED));

        // Location filter (via User entity)
        if (province != null && !province.isEmpty()) {
            predicates.add(cb.equal(userJoin.get("province"), province));
        }
        if (city != null && !city.isEmpty()) {
            predicates.add(cb.equal(userJoin.get("city"), city));
        }

        // Style filter (array overlap)
        if (styles != null && !styles.isEmpty()) {
            for (String style : styles) {
                predicates.add(cb.isMember(style, root.get("styles")));
            }
        }

        // Shoot type filter
        if (shootTypes != null && !shootTypes.isEmpty()) {
            for (String st : shootTypes) {
                predicates.add(cb.isMember(st, root.get("shootTypes")));
            }
        }

        // Price range
        if (priceMin != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("priceRangeMax"), priceMin));
        }
        if (priceMax != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("priceRangeMin"), priceMax));
        }

        cq.where(predicates.toArray(new Predicate[0]));

        // Sort
        if ("rating".equals(sortBy)) {
            cq.orderBy(cb.desc(root.get("ratingAvg")));
        } else if ("bookings".equals(sortBy)) {
            cq.orderBy(cb.desc(root.get("bookingCount")));
        } else {
            cq.orderBy(cb.desc(root.get("createdAt")));
        }

        // Count
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<PhotographerProfile> countRoot = countQuery.from(PhotographerProfile.class);
        Join<PhotographerProfile, User> countJoin = countRoot.join("user");
        List<Predicate> countPredicates = new ArrayList<>();
        countPredicates.add(cb.equal(countRoot.get("status"), ProfileStatus.APPROVED));
        if (province != null && !province.isEmpty()) {
            countPredicates.add(cb.equal(countJoin.get("province"), province));
        }
        if (city != null && !city.isEmpty()) {
            countPredicates.add(cb.equal(countJoin.get("city"), city));
        }
        countQuery.select(cb.count(countRoot)).where(countPredicates.toArray(new Predicate[0]));
        long total = em.createQuery(countQuery).getSingleResult();

        // Page query
        TypedQuery<PhotographerProfile> query = em.createQuery(cq);
        query.setFirstResult(page * size);
        query.setMaxResults(size);

        return new PageImpl<>(query.getResultList(), PageRequest.of(page, size), total);
    }

    /**
     * Approve a photographer profile (admin)
     */
    public void approvePhotographer(Long profileId) {
        PhotographerProfile profile = em.find(PhotographerProfile.class, profileId);
        if (profile != null) {
            profile.setStatus(ProfileStatus.APPROVED);
            em.merge(profile);
        }
    }
}
