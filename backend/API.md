# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "Ahmed",
  "displayNameAr": "أحمد",
  "city": "Tripoli",
  "language": "ar"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "displayName": "Ahmed",
      "role": "USER"
    },
    "token": "jwt-token"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Update Profile
```http
PATCH /auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "New Name",
  "city": "Benghazi"
}
```

---

## Products

### List Products
```http
GET /products?page=1&limit=20&category=<id>&verdict=AVOID
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (max: 100) |
| category | string | Filter by category ID |
| verdict | string | AVOID, CAUTION, PREFERRED, UNKNOWN |
| brandId | string | Filter by brand ID |

### Get Product by ID
```http
GET /products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nameEn": "Coca-Cola Classic 330ml",
    "nameAr": "كوكا كولا كلاسيك 330مل",
    "barcode": "5449000000996",
    "verdictLabel": "AVOID",
    "confidence": "HIGH",
    "brand": {
      "nameEn": "Coca-Cola",
      "company": {
        "id": "uuid",
        "nameEn": "The Coca-Cola Company",
        "verdictLabel": "AVOID"
      }
    },
    "alternatives": [...],
    "claims": [...]
  }
}
```

### Get Product by Barcode
```http
GET /products/barcode/:barcode
```

### Get Trending Products
```http
GET /products/trending?limit=10
```

### Get Global Statistics
```http
GET /products/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 35,
    "avoidProducts": 30,
    "preferredProducts": 5,
    "totalAlternatives": 15,
    "totalCompanies": 15,
    "avoidCompanies": 12
  }
}
```

### Record Product Scan
```http
POST /products/:id/scan
Content-Type: application/json

{
  "sessionId": "anonymous-session-id"  // Optional, for non-logged users
}
```

---

## Companies

### List Companies
```http
GET /companies?page=1&limit=20&verdict=AVOID&search=coca
```

### Get Company by ID
```http
GET /companies/:id
```

**Response includes:**
- Company details
- Parent company (if any)
- Subsidiaries
- Brands with products
- Claims with evidence

### Get Company Ownership Chain
```http
GET /companies/:id/ownership
```

### Get Company Brands
```http
GET /companies/:id/brands
```

### Get Company Products
```http
GET /companies/:id/products?page=1&limit=20
```

---

## Alternatives

### Get Alternatives for Product
```http
GET /alternatives/product/:productId?city=Tripoli
```

### Get Alternatives by Category
```http
GET /alternatives/category/:categoryId?city=Tripoli&page=1&limit=20
```

### Get Top Alternatives
```http
GET /alternatives/top?city=Tripoli&limit=10
```

Returns alternatives sorted by store availability.

### Get Recent Alternatives
```http
GET /alternatives/recent?limit=10
```

---

## Stores

### List Stores
```http
GET /stores?page=1&limit=20&city=Tripoli&tags=supermarket
```

### Get Store by ID
```http
GET /stores/:id
```

### Get Stores by City
```http
GET /stores/city/:city?area=Downtown&tags=pharmacy
```

### Get Stores for Alternative
```http
GET /stores/product/:alternativeId?city=Tripoli&sortBy=price
```

### Confirm Availability
```http
POST /stores/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "storeId": "uuid",
  "alternativeId": "uuid",
  "isAvailable": true
}
```

### Update Price
```http
POST /stores/price
Authorization: Bearer <token>
Content-Type: application/json

{
  "storeId": "uuid",
  "alternativeId": "uuid",
  "priceMin": 3.5,
  "priceMax": 4.5,
  "currency": "LYD"
}
```

---

## Search

### Search All
```http
GET /search?q=coca&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "companies": [...],
    "brands": [...],
    "query": "coca",
    "isBarcode": false
  }
}
```

### Search Products
```http
GET /search/products?q=cola&category=<id>&verdict=AVOID&page=1&limit=20
```

### Search Companies
```http
GET /search/companies?q=pepsi&verdict=AVOID&page=1&limit=20
```

### Search Brands
```http
GET /search/brands?q=fanta&companyId=<id>&page=1&limit=20
```

### Get Categories
```http
GET /search/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nameEn": "Beverages",
      "nameAr": "مشروبات",
      "icon": "🥤",
      "children": [...],
      "_count": { "products": 15 }
    }
  ]
}
```

---

## Submissions

### List Submissions
```http
GET /submissions?page=1&limit=20&status=PENDING&targetType=PRODUCT
```

**Status values:** PENDING, APPROVED, REJECTED, NEEDS_INFO

### Get Submission by ID
```http
GET /submissions/:id
```

### Get My Submissions
```http
GET /submissions/user/mine?page=1&limit=20
Authorization: Bearer <token>
```

### Create Submission
```http
POST /submissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetType": "PRODUCT",
  "targetId": null,  // null for new items
  "proposedData": {
    "nameEn": "New Product",
    "nameAr": "منتج جديد",
    "barcode": "1234567890123",
    "verdictLabel": "AVOID"
  },
  "evidenceSources": [
    "https://example.com/source1",
    "https://example.com/source2"
  ]
}
```

**Target Types:** PRODUCT, COMPANY, BRAND, STORE, CLAIM

### Vote on Submission
```http
POST /submissions/:id/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "voteType": "APPROVE",  // or "REJECT", "NEEDS_INFO"
  "note": "Verified with source"
}
```

---

## Users

### Get Leaderboard
```http
GET /users/leaderboard?limit=10&period=all
```

**Period values:** all, month, week

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "displayName": "Ahmed",
      "scoreTotal": 1500,
      "reputationLevel": 5,
      "_count": {
        "submissions": 25
      }
    }
  ]
}
```

### Get User Profile
```http
GET /users/:id
```

### Get User Stats
```http
GET /users/:id/stats
```

### Get User Badges
```http
GET /users/:id/badges
```

### Get User Activity
```http
GET /users/:id/activity?limit=20
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

In production, implement rate limiting:
- Anonymous: 100 requests/minute
- Authenticated: 300 requests/minute
- Search: 30 requests/minute

---

## Pagination

Paginated endpoints return:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

