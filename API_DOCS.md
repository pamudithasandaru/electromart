# ElectroMart API Documentation

Base URL: `http://localhost:5000` (local) or your AWS domain

## Products Endpoints

### 1. Get All Products

**Endpoint:** `GET /api/products`

**Description:** Retrieve a list of all electrical equipment products

**Response:**
```json
[
  {
    "_id": "69138dfb9baeebe6651a8bcb",
    "name": "LED Bulb 60W",
    "description": "Bright and energy-efficient LED bulb. Lasts up to 25,000 hours.",
    "price": 12.99,
    "inStock": true,
    "createdAt": "2025-11-11T19:26:51.375Z"
  },
  {
    "_id": "69138dfb9baeebe6651a8bcc",
    "name": "Circuit Breaker 20A",
    "description": "Double pole circuit breaker for household electrical systems.",
    "price": 25.50,
    "inStock": true,
    "createdAt": "2025-11-11T19:26:51.377Z"
  }
]
```

**Status Codes:**
- `200 OK` - Products retrieved successfully
- `500 Internal Server Error` - Database connection failed

**Example using curl:**
```bash
curl -X GET http://localhost:5000/api/products
```

**Example using Postman:**
1. Create new request
2. Set method to `GET`
3. Set URL to `http://localhost:5000/api/products`
4. Click Send

---

### 2. Create Product

**Endpoint:** `POST /api/products`

**Description:** Create a new electrical equipment product

**Request Body:**
```json
{
  "name": "Smart Light Switch",
  "description": "WiFi-enabled smart switch with Alexa integration",
  "price": 35.99,
  "inStock": true
}
```

**Response:**
```json
{
  "_id": "69138dfb9baeebe6651a8bd1",
  "name": "Smart Light Switch",
  "description": "WiFi-enabled smart switch with Alexa integration",
  "price": 35.99,
  "inStock": true,
  "createdAt": "2025-11-12T10:30:00.000Z",
  "__v": 0
}
```

**Status Codes:**
- `201 Created` - Product created successfully
- `400 Bad Request` - Invalid product data
- `500 Internal Server Error` - Server error

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smart Light Switch",
    "description": "WiFi-enabled smart switch",
    "price": 35.99,
    "inStock": true
  }'
```

**Example using PowerShell:**
```powershell
$body = @{
    name = "Smart Light Switch"
    description = "WiFi-enabled smart switch"
    price = 35.99
    inStock = $true
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/products" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

**Example using JavaScript (fetch):**
```javascript
fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Smart Light Switch',
    description: 'WiFi-enabled smart switch',
    price: 35.99,
    inStock: true
  })
})
.then(res => res.json())
.then(data => console.log('Created:', data))
.catch(err => console.error('Error:', err))
```

---

## Product Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | MongoDB document ID |
| `name` | String | Yes | Product name (e.g., "LED Bulb 60W") |
| `description` | String | No | Product description |
| `price` | Number | Yes | Product price in USD |
| `inStock` | Boolean | No | Availability status (default: true) |
| `createdAt` | Date | Auto | Timestamp of creation |
| `__v` | Number | Auto | Mongoose version field |

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid product data",
  "details": "Product validation failed: name: Path `name` is required."
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch products",
  "details": "connect ECONNREFUSED ::1:27017"
}
```

---

## Testing with Postman

### Setup
1. Download [Postman](https://www.postman.com/downloads/)
2. Create new collection "ElectroMart"
3. Create requests as shown below

### Request 1: Get Products
```
GET http://localhost:5000/api/products
```

### Request 2: Create Product
```
POST http://localhost:5000/api/products

Body (JSON):
{
  "name": "Solar Panel 200W",
  "description": "High efficiency monocrystalline solar panel",
  "price": 299.99,
  "inStock": false
}
```

### Request 3: Test CORS
```
OPTIONS http://localhost:5000/api/products
```

---

## Rate Limiting

Currently no rate limiting implemented. 

**Planned:** Add rate limiting (1000 req/hour per IP) using `express-rate-limit`

---

## Authentication

Currently no authentication required.

**Planned:** Add JWT token-based authentication

---

## Pagination

Currently not supported. All products returned (max 50).

**Planned:** Add pagination support with `?page=1&limit=10`

---

## Filtering & Sorting

Currently not supported.

**Planned:**
- Filter by price: `?minPrice=10&maxPrice=100`
- Filter by stock: `?inStock=true`
- Sort: `?sort=price&order=asc`

---

## CORS

CORS is enabled for all origins in development.

**Production:** Update `backend/server.js` CORS configuration:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## Changelog

### v0.1.0
- ✅ GET /api/products endpoint
- ✅ POST /api/products endpoint
- ✅ Seed database with 6 sample products
- ⏳ DELETE /api/products/:id (coming soon)
- ⏳ PUT /api/products/:id (coming soon)
- ⏳ Product search/filter (coming soon)
- ⏳ User authentication (coming soon)

---

## Support

For issues or questions:
1. Check [Troubleshooting Guide](DOCKER_JENKINS_AWS_GUIDE.md#troubleshooting)
2. Review backend logs: `npm run dev`
3. Open GitHub issue

