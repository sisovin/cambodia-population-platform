# **PHP Service API Documentation**

## Overview

The PHP Service acts as a legacy adapter within the Cambodia Population Platform, providing backwards compatibility for existing commune systems while gradually migrating functionality to the modern Node.js API. This service bridges legacy PHP-based commune management systems with the new unified platform architecture.

## 🏗️ Project Structure

```
php-service/
├── public/
│   └── index.php          # Main entry point and router
├── src/
│   ├── Auth.php          # Authentication and JWT handling
│   ├── User.php          # User management and RBAC
│   └── config.php        # Database and service configuration
├── includes/
│   ├── Auth.php          # Legacy authentication compatibility
│   └── config.php        # Legacy configuration settings
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites

- PHP 8.1+
- Composer
- MySQL/PostgreSQL database
- JWT library support

### Installation

```bash
# Navigate to PHP service directory
cd services/php-service

# Install dependencies
composer install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Start development server
php -S localhost:8080 -t public/
```

## 🔧 Configuration

### Environment Variables

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cambodia_population_db
DB_USER=your_username
DB_PASS=your_password

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRY=3600

# API Gateway
NODE_API_URL=http://localhost:4000
API_VERSION=v1

# Commune Configuration
DEFAULT_COMMUNE_ID=1
NCDD_SYNC_ENABLED=true
```

## 📋 API Endpoints

### Base URL

```
http://localhost:8080/api/v1
```

### Authentication Endpoints

#### 1. User Login

```http
POST /api/v1/auth/login
```

**Request Body:**

```json
{
  "username": "registrar001",
  "password": "secure_password",
  "commune_id": 12345
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user_id": 123,
    "username": "registrar001",
    "commune_id": 12345,
    "role": "registrar",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires_at": "2025-09-17T10:30:00Z"
  },
  "message": "Login successful"
}
```

#### 2. Token Validation

```http
POST /api/v1/auth/validate
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "user_id": 123,
    "commune_id": 12345,
    "role": "registrar",
    "permissions": ["citizen:read", "citizen:write", "family:read"]
  }
}
```

#### 3. Logout

```http
POST /api/v1/auth/logout
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### User Management Endpoints

#### 1. Get User Profile

```http
GET /api/v1/users/profile
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user_id": 123,
    "username": "registrar001",
    "full_name": "សុខា វង្ស",
    "email": "sukha.vong@commune.gov.kh",
    "commune_id": 12345,
    "commune_name": "ឃុំអន្លង់វែង",
    "role": "registrar",
    "permissions": ["citizen:read", "citizen:write"],
    "created_at": "2025-01-01T00:00:00Z",
    "last_login": "2025-09-16T08:30:00Z"
  }
}
```

#### 2. Update User Profile

```http
PUT /api/v1/users/profile
```

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "full_name": "សុខា វង្ស",
  "email": "sukha.vong@commune.gov.kh",
  "phone": "+855-12-345-678"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user_id": 123,
    "updated_fields": ["full_name", "email", "phone"],
    "updated_at": "2025-09-16T10:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

### Legacy Data Migration Endpoints

#### 1. Import Citizens from Legacy System

```http
POST /api/v1/legacy/import/citizens
```

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body:**

```
file: citizens_export.csv
commune_id: 12345
batch_size: 100
validate_only: false
```

**Response:**

```json
{
  "success": true,
  "data": {
    "batch_id": "batch_20250916_001",
    "total_records": 1250,
    "processed": 1200,
    "successful": 1180,
    "failed": 20,
    "validation_errors": [
      {
        "row": 15,
        "field": "date_of_birth",
        "error": "Invalid date format"
      }
    ],
    "processing_time": "45.2 seconds"
  },
  "message": "Import completed with some errors"
}
```

#### 2. Export Data to New System

```http
POST /api/v1/legacy/export/{module}
```

**Parameters:**

- `module`: citizens, families, residences, deaths

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "date_range": {
    "start": "2020-01-01",
    "end": "2025-12-31"
  },
  "format": "json",
  "include_archived": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "export_id": "export_20250916_001",
    "download_url": "/api/v1/legacy/download/export_20250916_001",
    "record_count": 1180,
    "file_size": "2.4 MB",
    "expires_at": "2025-09-17T10:30:00Z"
  },
  "message": "Export ready for download"
}
```

### Bridge Endpoints (Proxy to Node.js API)

#### 1. Get Citizens (Proxied)

```http
GET /api/v1/bridge/citizens
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

```
page: 1
limit: 50
search: សុខា
status: active
```

**Response:**

```json
{
  "success": true,
  "data": {
    "citizens": [
      {
        "citizen_id": 456,
        "first_name": "សុខា",
        "last_name": "វង្ស",
        "date_of_birth": "1990-01-15",
        "place_of_birth": "ភ្នំពេញ",
        "gender": "M",
        "status": "active",
        "commune_id": 12345,
        "family_id": 789,
        "created_at": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 50,
      "total": 1180,
      "total_pages": 24
    }
  },
  "message": "Citizens retrieved successfully"
}
```

#### 2. Create Citizen (Proxied)

```http
POST /api/v1/bridge/citizens
```

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "first_name": "សុខា",
  "last_name": "វង្ស",
  "first_name_latin": "Sokha",
  "last_name_latin": "Vong",
  "date_of_birth": "1990-01-15",
  "place_of_birth": "ភ្នំពេញ",
  "gender": "M",
  "father_name": "វង្ស ចន្ទា",
  "mother_name": "ឃិម សុផល",
  "family_id": 789,
  "commune_id": 12345
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "citizen_id": 457,
    "registration_number": "KH-12345-2025-457",
    "created_at": "2025-09-16T10:30:00Z",
    "created_by": 123
  },
  "message": "Citizen registered successfully"
}
```

### Health Check Endpoints

#### 1. Service Health

```http
GET /api/v1/health
```

**Response:**

```json
{
  "success": true,
  "data": {
    "service": "php-legacy-adapter",
    "version": "1.0.0",
    "status": "healthy",
    "uptime": "2 days, 14 hours",
    "database": {
      "status": "connected",
      "response_time": "12ms"
    },
    "node_api": {
      "status": "connected",
      "response_time": "45ms"
    },
    "last_check": "2025-09-16T10:30:00Z"
  }
}
```

#### 2. Database Status

```http
GET /api/v1/health/database
```

**Response:**

```json
{
  "success": true,
  "data": {
    "connection": "active",
    "database": "cambodia_population_db",
    "tables": {
      "legacy_citizens": 15420,
      "legacy_families": 4230,
      "migration_logs": 156
    },
    "last_migration": "2025-09-15T09:00:00Z"
  }
}
```

## 🔒 Security & Authentication

### JWT Token Structure

```json
{
  "iss": "cambodia-population-platform",
  "aud": "php-legacy-service",
  "sub": "123",
  "iat": 1694860200,
  "exp": 1694863800,
  "commune_id": 12345,
  "role": "registrar",
  "permissions": ["citizen:read", "citizen:write"]
}
```

### Role-Based Access Control

| Role        | Permissions                            | Description               |
| ----------- | -------------------------------------- | ------------------------- |
| `admin`     | All endpoints                          | System administrator      |
| `registrar` | Create, read, update citizens/families | Commune registrar         |
| `viewer`    | Read-only access                       | Report viewer             |
| `migrator`  | Legacy import/export                   | Data migration specialist |

### Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Data endpoints**: 100 requests per minute
- **Import/Export**: 1 request per 5 minutes

## 📊 Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date format",
    "details": {
      "field": "date_of_birth",
      "value": "invalid-date",
      "expected": "YYYY-MM-DD"
    }
  },
  "timestamp": "2025-09-16T10:30:00Z"
}
```

### Common Error Codes

| Code                  | HTTP Status | Description                           |
| --------------------- | ----------- | ------------------------------------- |
| `UNAUTHORIZED`        | 401         | Invalid or expired token              |
| `FORBIDDEN`           | 403         | Insufficient permissions              |
| `VALIDATION_ERROR`    | 400         | Request validation failed             |
| `NOT_FOUND`           | 404         | Resource not found                    |
| `COMMUNE_MISMATCH`    | 403         | Resource belongs to different commune |
| `LEGACY_SYSTEM_ERROR` | 502         | Legacy system unavailable             |
| `RATE_LIMIT_EXCEEDED` | 429         | Too many requests                     |

## 🔄 Migration Guide

### Phase 1: Setup (Current)

- Deploy PHP service alongside existing systems
- Configure database connections
- Test authentication bridge

### Phase 2: Data Migration

- Export legacy data using export endpoints
- Validate data integrity
- Import to new system via bridge endpoints

### Phase 3: Gradual Transition

- Route new registrations through bridge
- Maintain read access to legacy data
- Monitor system performance

### Phase 4: Deprecation

- Complete data migration
- Remove legacy system dependencies
- Archive PHP service

## 📝 Development Notes

### Code Structure

**`src/Auth.php`**

```php
<?php
class Auth {
    public static function validateJWT($token) {
        // JWT validation logic
    }

    public static function hasPermission($user, $permission) {
        // Permission checking logic
    }
}
```

**`src/User.php`**

```php
<?php
class User {
    public static function getByToken($token) {
        // User retrieval by JWT token
    }

    public static function updateProfile($userId, $data) {
        // Profile update logic
    }
}
```

**`public/index.php`**

```php
<?php
// Main router
require_once '../vendor/autoload.php';
require_once '../src/config.php';

$router = new Router();
$router->handleRequest();
```

## 🧪 Testing

### Manual Testing

```bash
# Test authentication
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","commune_id":1}'

# Test protected endpoint
curl -X GET http://localhost:8080/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Integration Tests

```bash
# Run test suite
composer test

# Test specific module
composer test -- --filter=AuthTest
```

## 📞 Support

- **Legacy Issues**: Create issue with `legacy-php` label
- **Migration Support**: Contact migration team
- **API Questions**: Check Node.js API documentation

---

**⚠️ Note**: This PHP service is in maintenance mode and will be deprecated after successful migration to the Node.js API. New features should be implemented in the Node.js service.
