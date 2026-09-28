
-- ============================================
-- San3a Database Schema
-- Full Database Schema
-- ============================================


-- ============================================
-- USERS
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- VENDORS / CRAFTSMEN
-- ============================================

CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,

    user_id INTEGER UNIQUE,

    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),

    rating NUMERIC DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,

    location VARCHAR(255),

    projects_count INTEGER DEFAULT 0,
    experience INTEGER DEFAULT 0,

    image TEXT,
    cover TEXT,
    about TEXT,

    portfolio TEXT[],

    latitude NUMERIC,
    longitude NUMERIC,

    CONSTRAINT fk_vendor_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,

    name JSONB NOT NULL,
    description TEXT,
    image TEXT
);


-- ============================================
-- PRODUCTS
-- ============================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,

    title JSONB NOT NULL,

    price NUMERIC NOT NULL,

    rating NUMERIC DEFAULT 0,

    reviews_count INTEGER DEFAULT 0,

    is_customizable BOOLEAN DEFAULT FALSE,

    description TEXT,

    dimensions VARCHAR(255),

    material VARCHAR(255),

    images TEXT[],

    colors JSONB,

    category_id INTEGER,

    vendor_id INTEGER,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_product_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE SET NULL
);


-- ============================================
-- PORTFOLIO
-- ============================================

CREATE TABLE portfolio (
    id SERIAL PRIMARY KEY,

    vendor_id INTEGER NOT NULL,

    title VARCHAR(255) NOT NULL,

    price NUMERIC,

    images TEXT[],

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_portfolio_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE CASCADE
);


-- ============================================
-- ORDERS
-- ============================================

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    items JSONB NOT NULL,

    total_amount NUMERIC NOT NULL,

    shipping_address TEXT NOT NULL,

    status VARCHAR(50) DEFAULT 'processing',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================
-- CUSTOM ORDERS
-- ============================================

CREATE TABLE custom_orders (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    vendor_id INTEGER,

    furniture_type VARCHAR(255) NOT NULL,

    wood_type VARCHAR(255) NOT NULL,

    size VARCHAR(255) NOT NULL,

    details TEXT,

    estimated_price NUMERIC NOT NULL,

    design_url TEXT,

    status VARCHAR(50) DEFAULT 'new',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_custom_order_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_custom_order_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE SET NULL
);


-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    rating INTEGER NOT NULL,

    comment TEXT,

    image TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);


-- ============================================
-- WALLETS
-- ============================================

CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL UNIQUE,

    balance NUMERIC(12,2) DEFAULT 0,

    total_earnings NUMERIC(12,2) DEFAULT 0,

    total_expenses NUMERIC(12,2) DEFAULT 0,

    total_commission NUMERIC(12,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wallet_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================
-- WALLET TRANSACTIONS
-- ============================================

CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,

    wallet_id INTEGER NOT NULL,

    type VARCHAR(50) NOT NULL,

    amount NUMERIC(12,2) NOT NULL,

    description TEXT,

    reference_type VARCHAR(50),

    reference_id INTEGER,

    status VARCHAR(50) DEFAULT 'completed',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wallet_transaction_wallet
        FOREIGN KEY (wallet_id)
        REFERENCES wallets(id)
        ON DELETE CASCADE
);


-- ============================================
-- WITHDRAWALS
-- ============================================

CREATE TABLE withdrawals (
    id SERIAL PRIMARY KEY,

    wallet_id INTEGER NOT NULL,

    amount NUMERIC(12,2) NOT NULL,

    status VARCHAR(50) DEFAULT 'pending',

    payment_method VARCHAR(100),

    account_details TEXT,

    note TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_withdrawal_wallet
        FOREIGN KEY (wallet_id)
        REFERENCES wallets(id)
        ON DELETE CASCADE
);


-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    type VARCHAR(50),

    is_read BOOLEAN DEFAULT FALSE,

    reference_type VARCHAR(50),

    reference_id INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================
-- VERIFICATION REQUESTS
-- ============================================

CREATE TABLE verification_requests (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    official_id_number VARCHAR(255) NOT NULL,

    workshop_name VARCHAR(255) NOT NULL,

    documents_image TEXT,

    payment_status VARCHAR(50) DEFAULT 'pending',

    payment_amount NUMERIC(12,2) DEFAULT 50.00,

    status VARCHAR(50) DEFAULT 'pending',

    admin_note TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_verification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_vendors_user
    ON vendors(user_id);

CREATE INDEX idx_products_category
    ON products(category_id);

CREATE INDEX idx_products_vendor
    ON products(vendor_id);

CREATE INDEX idx_portfolio_vendor
    ON portfolio(vendor_id);

CREATE INDEX idx_orders_user
    ON orders(user_id);

CREATE INDEX idx_custom_orders_user
    ON custom_orders(user_id);

CREATE INDEX idx_custom_orders_vendor
    ON custom_orders(vendor_id);

CREATE INDEX idx_reviews_product
    ON reviews(product_id);

CREATE INDEX idx_reviews_user
    ON reviews(user_id);

CREATE INDEX idx_notifications_user
    ON notifications(user_id);

CREATE INDEX idx_wallet_transactions_wallet
    ON wallet_transactions(wallet_id);

CREATE INDEX idx_withdrawals_wallet
    ON withdrawals(wallet_id);

CREATE INDEX idx_verification_user
    ON verification_requests(user_id);
