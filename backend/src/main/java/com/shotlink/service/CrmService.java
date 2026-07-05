package com.shotlink.service;

import com.shotlink.model.entity.*;
import com.shotlink.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CrmService {

    private final EntityManager em;
    private final UserRepository userRepository;

    // === Contracts ===
    @Transactional
    public Contract createContract(Long photographerId, Long clientId, Long bookingId, String title, String content) {
        Contract c = Contract.builder()
            .photographer(em.getReference(User.class, photographerId))
            .client(em.getReference(User.class, clientId))
            .booking(bookingId != null ? em.getReference(Booking.class, bookingId) : null)
            .title(title).content(content).build();
        em.persist(c);
        return c;
    }

    public List<Contract> getContracts(Long photographerId, int page, int size) {
        return em.createQuery("SELECT c FROM Contract c WHERE c.photographer.id=:pid ORDER BY c.createdAt DESC", Contract.class)
                .setParameter("pid", photographerId).setFirstResult(page * size).setMaxResults(size).getResultList();
    }

    @Transactional
    public Contract updateContractStatus(Long id, String status) {
        Contract c = em.find(Contract.class, id);
        c.setStatus(status);
        if ("SIGNED".equals(status)) c.setSignedAt(LocalDateTime.now());
        em.merge(c);
        return c;
    }

    // === Invoices ===
    @Transactional
    public Invoice createInvoice(Long photographerId, Long clientId, Long bookingId, String title, Integer amount) {
        int tax = (int)(amount * 0.06);
        Invoice inv = Invoice.builder()
            .photographer(em.getReference(User.class, photographerId))
            .client(em.getReference(User.class, clientId))
            .booking(bookingId != null ? em.getReference(Booking.class, bookingId) : null)
            .title(title).amount(amount).tax(tax).total(amount + tax)
            .issuedAt(LocalDateTime.now()).build();
        em.persist(inv);
        return inv;
    }

    public List<Invoice> getInvoices(Long photographerId, int page, int size) {
        return em.createQuery("SELECT i FROM Invoice i WHERE i.photographer.id=:pid ORDER BY i.createdAt DESC", Invoice.class)
                .setParameter("pid", photographerId).setFirstResult(page * size).setMaxResults(size).getResultList();
    }

    @Transactional
    public Invoice updateInvoiceStatus(Long id, String status) {
        Invoice i = em.find(Invoice.class, id);
        i.setStatus(status);
        em.merge(i);
        return i;
    }

    // === Photo Deliveries ===
    @Transactional
    public PhotoDelivery createDelivery(Long photographerId, Long clientId, Long bookingId, String title, List<String> photos) {
        PhotoDelivery d = PhotoDelivery.builder()
            .photographer(em.getReference(User.class, photographerId))
            .client(em.getReference(User.class, clientId))
            .booking(bookingId != null ? em.getReference(Booking.class, bookingId) : null)
            .title(title).photos(photos != null ? photos : List.of()).build();
        em.persist(d);
        return d;
    }

    public List<PhotoDelivery> getDeliveries(Long photographerId, int page, int size) {
        return em.createQuery("SELECT d FROM PhotoDelivery d WHERE d.photographer.id=:pid ORDER BY d.createdAt DESC", PhotoDelivery.class)
                .setParameter("pid", photographerId).setFirstResult(page * size).setMaxResults(size).getResultList();
    }

    @Transactional
    public PhotoDelivery updateDeliveryStatus(Long id, String status, String note) {
        PhotoDelivery d = em.find(PhotoDelivery.class, id);
        d.setStatus(status);
        if (note != null) d.setNote(note);
        em.merge(d);
        return d;
    }

    // === Client List ===
    public List<User> getClientList(Long photographerId) {
        return em.createQuery(
            "SELECT DISTINCT b.client FROM Booking b WHERE b.photographer.id=:pid", User.class)
            .setParameter("pid", photographerId).getResultList();
    }

    // === Dashboard Stats ===
    public Map<String, Object> getDashboardStats(Long photographerId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", em.createQuery("SELECT COUNT(b) FROM Booking b WHERE b.photographer.id=:pid", Long.class).setParameter("pid", photographerId).getSingleResult());
        stats.put("totalClients", em.createQuery("SELECT COUNT(DISTINCT b.client) FROM Booking b WHERE b.photographer.id=:pid", Long.class).setParameter("pid", photographerId).getSingleResult());
        stats.put("pendingBookings", em.createQuery("SELECT COUNT(b) FROM Booking b WHERE b.photographer.id=:pid AND b.status='PENDING'", Long.class).setParameter("pid", photographerId).getSingleResult());
        stats.put("totalRevenue", em.createQuery("SELECT COALESCE(SUM(b.price),0) FROM Booking b WHERE b.photographer.id=:pid AND b.status='DELIVERED'", Long.class).setParameter("pid", photographerId).getSingleResult());
        return stats;
    }
}
