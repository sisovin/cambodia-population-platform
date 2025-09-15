-- SQL Server-compatible schema
-- Note: The PostgreSQL "uuid-ossp" extension and uuid_generate_v4() are not available in SQL Server.
-- This script uses UNIQUEIDENTIFIER with NEWID() and DATETIME2 with SYSUTCDATETIME() instead.

-- Create tables
CREATE TABLE tenants (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    tenant_id UNIQUEIDENTIFIER REFERENCES tenants(id),
    role VARCHAR(50) DEFAULT 'citizen',
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

CREATE TABLE citizens (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    address TEXT NULL,
    tenant_id UNIQUEIDENTIFIER REFERENCES tenants(id),
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Insert sample data
INSERT INTO tenants (name, code) VALUES 
('Phnom Penh', 'phnom-penh'),
('Siem Reap', 'siem-reap'),
('Battambang', 'battambang');

-- Row Level Security notes
-- PostgreSQL-specific RLS statements (e.g., ALTER TABLE ... ENABLE ROW LEVEL SECURITY and CREATE POLICY)
-- are not valid in SQL Server; implement SQL Server Row-Level Security using CREATE SECURITY POLICY
-- and inline table-valued functions if needed.