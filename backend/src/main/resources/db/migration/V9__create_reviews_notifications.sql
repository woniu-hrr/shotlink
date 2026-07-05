-- V9: Reviews + Notifications
CREATE TABLE reviews (
    id              BIGSERIAL PRIMARY KEY,
    booking_id      BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
    client_id       BIGINT NOT NULL REFERENCES users(id),
    photographer_id BIGINT NOT NULL REFERENCES users(id),
    rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content         TEXT,
    photographer_reply TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_review_photographer ON reviews(photographer_id);

CREATE TABLE notifications (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            VARCHAR(50) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    content         TEXT,
    is_read         BOOLEAN DEFAULT FALSE,
    related_id      BIGINT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notif_user ON notifications(user_id, is_read);
