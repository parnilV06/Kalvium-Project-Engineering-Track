-- CorpFlow v1.0 Database Schema
-- Standard tables for users, projects, and billing.

DROP TABLE IF EXISTS billing_details;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tenants;

CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee',
    salary DECIMAL(10,2), -- Base salary for payroll management
    UNIQUE(email, tenant_id),
    UNIQUE(tenant_id, id) -- Composite unique key to enforce tenant boundaries in child tables
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    budget DECIMAL(12,2)
);

CREATE TABLE billing_details (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    user_id INTEGER,
    card_holder_name VARCHAR(100),
    card_last4 VARCHAR(4),
    expiry_date VARCHAR(5),
    billing_address TEXT,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (tenant_id, user_id) REFERENCES users(tenant_id, id) -- Enforces user belongs to the same tenant
);

-- Indexes for performance and security (Tenant filtering)
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX idx_billing_tenant_id ON billing_details(tenant_id);
CREATE UNIQUE INDEX idx_users_tenant_email ON users(tenant_id, email);

-- Seed Initial Data
INSERT INTO tenants (name) VALUES
('Pouch.io'),
('Velocity Corp');

INSERT INTO users (tenant_id, full_name, email, password_hash, role, salary) VALUES
(1, 'Alice Johnson', 'alice@pouch.io', 'pbkdf2:sha256:600000$hasher$81726a', 'admin', 125000.00),
(1, 'Bob Smith', 'bob@pouch.io', 'pbkdf2:sha256:600000$hasher$81726b', 'manager', 95000.00),
(2, 'Charlie Davis', 'charlie@velocity.com', 'pbkdf2:sha256:600000$hasher$81726c', 'admin', 140000.00),
(2, 'David Miller', 'david@velocity.com', 'pbkdf2:sha256:600000$hasher$81726d', 'employee', 75000.00);

INSERT INTO projects (tenant_id, name, description, status, budget) VALUES
(1, 'Pouch Portal', 'Customer portal for Pouch.io', 'active', 50000.00),
(2, 'Velocity Engine', 'Back-end engine for Velocity', 'active', 120000.00),
(2, 'Secret R&D', null, 'inactive', 250000.00);

INSERT INTO billing_details (tenant_id, user_id, card_holder_name, card_last4, expiry_date, billing_address) VALUES
(1, 1, 'Alice Johnson', '4242', '12/28', '123 Tech Lane, SF'),
(2, 3, 'Charlie Davis', '9182', '08/26', '789 Velocity Rd, NY');
