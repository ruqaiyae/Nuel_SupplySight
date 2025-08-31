-- SupplySight Database Schema
-- PostgreSQL database schema for production use

-- Warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    warehouse VARCHAR(10) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    demand INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse) REFERENCES warehouses(code)
);

-- KPIs table for historical data
CREATE TABLE IF NOT EXISTS kpis (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    stock INTEGER NOT NULL,
    demand INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_warehouse ON products(warehouse);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_kpis_date ON kpis(date);

-- Insert sample warehouse data
INSERT INTO warehouses (code, name, city, country) VALUES
    ('BLR-A', 'Bangalore Central', 'Bangalore', 'India'),
    ('PNQ-C', 'Pune West', 'Pune', 'India'),
    ('DEL-B', 'Delhi North', 'Delhi', 'India')
ON CONFLICT (code) DO NOTHING;

-- Insert sample product data
INSERT INTO products (id, name, sku, warehouse, stock, demand) VALUES
    ('P-1001', '12mm Hex Bolt', 'HEX-12-100', 'BLR-A', 180, 120),
    ('P-1002', 'Steel Washer', 'WSR-08-500', 'BLR-A', 50, 80),
    ('P-1003', 'M8 Nut', 'NUT-08-200', 'PNQ-C', 80, 80),
    ('P-1004', 'Bearing 608ZZ', 'BRG-608-50', 'DEL-B', 24, 120)
ON CONFLICT (id) DO NOTHING;

-- Insert sample KPI data
INSERT INTO kpis (date, stock, demand) VALUES
    ('2024-01-01', 334, 400),
    ('2024-01-02', 320, 380),
    ('2024-01-03', 310, 360)
ON CONFLICT (date) DO NOTHING;
