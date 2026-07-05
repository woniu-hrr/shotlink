-- V5: Create portfolio_images table
CREATE TABLE portfolio_images (
    id              BIGSERIAL PRIMARY KEY,
    portfolio_id    BIGINT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    image_url       VARCHAR(500) NOT NULL,
    thumbnail_url   VARCHAR(500),
    width           INTEGER DEFAULT 0,
    height          INTEGER DEFAULT 0,
    file_size       BIGINT DEFAULT 0,
    file_name       VARCHAR(255),
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pi_portfolio ON portfolio_images(portfolio_id);
CREATE INDEX idx_pi_sort ON portfolio_images(portfolio_id, sort_order);
