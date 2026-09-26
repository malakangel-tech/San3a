
-- ============================================
-- San3a Database Schema
-- ============================================

-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- VENDORS
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    rating NUMERIC,
    verified BOOLEAN,
    location VARCHAR(255),
    projects_count INTEGER,
    experience INTEGER,
    image TEXT,
    cover TEXT,
    about TEXT,
    portfolio TEXT[]
);


-- CATEGORIES
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name JSONB NOT NULL,
    description TEXT,
    image TEXT
);


-- PRODUCTS
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title JSONB NOT NULL,
    price NUMERIC NOT NULL,
    rating NUMERIC,
    reviews_count INTEGER,
    is_customizable BOOLEAN,
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


-- ORDERS
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    shipping_address TEXT NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
