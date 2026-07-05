-- V4: Create portfolios table
CREATE TABLE portfolios (
    id              BIGSERIAL PRIMARY KEY,
    photographer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    shoot_type      VARCHAR(50),                       -- WEDDING, PORTRAIT, LANDSCAPE, COMMERCIAL, etc.
    tags            VARCHAR(100)[] DEFAULT '{}',
    cover_url       VARCHAR(500),
    image_count     INTEGER DEFAULT 0,
    view_count      INTEGER DEFAULT 0,
    like_count      INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'PUBLISHED',   -- DRAFT, PUBLISHED, HIDDEN
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portfolio_photographer ON portfolios(photographer_id);
CREATE INDEX idx_portfolio_shoot_type ON portfolios(shoot_type);
CREATE INDEX idx_portfolio_status ON portfolios(status);
CREATE INDEX idx_portfolio_created ON portfolios(created_at DESC);
