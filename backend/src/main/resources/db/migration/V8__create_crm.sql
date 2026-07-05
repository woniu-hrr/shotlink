-- V8: CRM tables — contracts, invoices, photo_deliveries
CREATE TABLE contracts (
    id              BIGSERIAL PRIMARY KEY,
    booking_id      BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
    photographer_id BIGINT NOT NULL REFERENCES users(id),
    client_id       BIGINT NOT NULL REFERENCES users(id),
    title           VARCHAR(255) NOT NULL,
    content         TEXT,
    status          VARCHAR(20) DEFAULT 'DRAFT',  -- DRAFT, SENT, SIGNED, EXPIRED
    signed_at       TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_contract_photographer ON contracts(photographer_id);

CREATE TABLE invoices (
    id              BIGSERIAL PRIMARY KEY,
    booking_id      BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
    photographer_id BIGINT NOT NULL REFERENCES users(id),
    client_id       BIGINT NOT NULL REFERENCES users(id),
    title           VARCHAR(255) NOT NULL,
    amount          INTEGER DEFAULT 0,
    tax             INTEGER DEFAULT 0,
    total           INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PAID, CANCELLED
    issued_at       TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_invoice_photographer ON invoices(photographer_id);

CREATE TABLE photo_deliveries (
    id              BIGSERIAL PRIMARY KEY,
    booking_id      BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
    photographer_id BIGINT NOT NULL REFERENCES users(id),
    client_id       BIGINT NOT NULL REFERENCES users(id),
    title           VARCHAR(255) NOT NULL,
    photos          TEXT[] DEFAULT '{}',
    delivery_url    VARCHAR(500),
    status          VARCHAR(20) DEFAULT 'SHOOTING', -- SHOOTING, SELECTION, RETOUCHING, DELIVERED
    note            TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_delivery_photographer ON photo_deliveries(photographer_id);
