-- V2: Create photographer_profiles table
CREATE TABLE photographer_profiles (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio             TEXT,
    styles          VARCHAR(50)[] DEFAULT '{}',       -- e.g. {WEDDING,PORTRAIT,LANDSCAPE}
    shoot_types     VARCHAR(50)[] DEFAULT '{}',       -- e.g. {PRE_WEDDING,WEDDING,PERSONAL}
    price_range_min INTEGER DEFAULT 0,
    price_range_max INTEGER DEFAULT 0,
    service_area    VARCHAR(100)[] DEFAULT '{}',      -- e.g. {Beijing,Shanghai}
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    rating_avg      DECIMAL(3,2) DEFAULT 0.00,
    booking_count   INTEGER DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pp_user ON photographer_profiles(user_id);
CREATE INDEX idx_pp_status ON photographer_profiles(status);
CREATE INDEX idx_pp_service_area ON photographer_profiles USING GIN(service_area);
CREATE INDEX idx_pp_styles ON photographer_profiles USING GIN(styles);
