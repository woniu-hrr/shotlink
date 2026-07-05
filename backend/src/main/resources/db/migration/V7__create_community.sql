-- V7: Community posts + comments + likes
CREATE TABLE community_posts (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    content         TEXT NOT NULL,
    category        VARCHAR(50) DEFAULT 'GENERAL',
    tags            VARCHAR(100)[] DEFAULT '{}',
    view_count      INTEGER DEFAULT 0,
    like_count      INTEGER DEFAULT 0,
    comment_count   INTEGER DEFAULT 0,
    is_featured     BOOLEAN DEFAULT FALSE,
    status          VARCHAR(20) DEFAULT 'PUBLISHED',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_cp_user ON community_posts(user_id);
CREATE INDEX idx_cp_category ON community_posts(category);
CREATE INDEX idx_cp_created ON community_posts(created_at DESC);

CREATE TABLE community_comments (
    id              BIGSERIAL PRIMARY KEY,
    post_id         BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id       BIGINT REFERENCES community_comments(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    like_count      INTEGER DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_cc_post ON community_comments(post_id);
CREATE INDEX idx_cc_parent ON community_comments(parent_id);

CREATE TABLE likes_favorites (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type     VARCHAR(20) NOT NULL,
    target_id       BIGINT NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);
CREATE INDEX idx_lf_target ON likes_favorites(target_type, target_id);
