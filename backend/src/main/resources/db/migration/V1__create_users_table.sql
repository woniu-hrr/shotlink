-- V1: Create users table
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100),
    avatar_url      VARCHAR(500),
    phone           VARCHAR(20),
    city            VARCHAR(100),
    province        VARCHAR(100),
    role            VARCHAR(20) NOT NULL DEFAULT 'CLIENT',  -- CLIENT, PHOTOGRAPHER, ADMIN
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
