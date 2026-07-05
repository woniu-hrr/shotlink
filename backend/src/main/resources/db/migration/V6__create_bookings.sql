-- V6: Create bookings + photographer_schedules tables

-- Booking status enum: PENDING -> CONFIRMED -> SHOOTING -> DELIVERED (or CANCELLED/REJECTED)
CREATE TABLE bookings (
    id              BIGSERIAL PRIMARY KEY,
    client_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    photographer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shoot_type      VARCHAR(50) NOT NULL,
    shoot_date      DATE NOT NULL,
    time_slot       VARCHAR(20),                        -- MORNING, AFTERNOON, EVENING, FULL_DAY
    location        VARCHAR(500),
    description     TEXT,
    price           INTEGER DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    client_note     TEXT,
    photographer_note TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_booking_client ON bookings(client_id);
CREATE INDEX idx_booking_photographer ON bookings(photographer_id);
CREATE INDEX idx_booking_status ON bookings(status);
CREATE INDEX idx_booking_date ON bookings(shoot_date);

-- Photographer availability schedule
CREATE TABLE photographer_schedules (
    id              BIGSERIAL PRIMARY KEY,
    photographer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    schedule_date   DATE NOT NULL,
    time_slot       VARCHAR(20) NOT NULL,               -- MORNING, AFTERNOON, EVENING
    is_available    BOOLEAN NOT NULL DEFAULT TRUE,
    booking_id      BIGINT REFERENCES bookings(id),
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(photographer_id, schedule_date, time_slot)
);

CREATE INDEX idx_ps_photographer ON photographer_schedules(photographer_id);
CREATE INDEX idx_ps_date ON photographer_schedules(schedule_date);
