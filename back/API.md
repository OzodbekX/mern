# API Reference

This service exposes a REST API for users, product types, brands, and devices.

## Base URL

```text
http://localhost:7000/api
```

The port comes from `PORT` in `.env` and defaults to `5000` when it is not set.

## Authentication

Protected endpoints expect the JWT returned by registration or login:

```http
Authorization: Bearer <token>
```

Tokens expire after 24 hours. Except where noted below, the current routes are public.

## Endpoint summary

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| POST | `/user/registration` | Public | Register a user |
| POST | `/user/login` | Public | Log in |
| GET | `/user/auth` | Bearer token | Validate/refresh a token |
| GET | `/type` | Public | List types |
| GET | `/type/:id` | Public | Get a type |
| POST | `/type` | ADMIN token | Create a type |
| PUT | `/type/:id` | Public | Placeholder type update |
| DELETE | `/type/:id` | Public | Placeholder type deletion |
| GET | `/brand` | Public | List brands |
| GET | `/brand/:id` | Public | Get a brand |
| POST | `/brand` | Public | Create a brand |
| PUT | `/brand/:id` | Public | Update a brand |
| DELETE | `/brand/:id` | Public | Delete a brand |
| GET | `/device` | Public | List and filter devices |
| GET | `/device/:id` | Public | Get a device with its info |
| POST | `/device` | Public | Create a device with an image |
| PUT | `/device/:id` | Public | Placeholder device update |
| DELETE | `/device/:id` | Public | Placeholder device deletion |
| GET | `/basket` | Bearer token | Get the current user's basket |
| POST | `/basket` | Bearer token | Add a device to the basket |
| DELETE | `/basket/:deviceId` | Bearer token | Remove a device from the basket |
| DELETE | `/basket` | Bearer token | Clear the basket |

## Users

### Register a user

```http
POST /api/user/registration
Content-Type: application/json
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "secret",
  "role": "USER"
}
```

- `email` and `password` are required.
- `role` is optional and defaults to `USER` at the database level.
- A basket is created automatically for the new user.

Success response (`200`):

```json
{
  "token": "<jwt>"
}
```

Possible error: `400` when credentials are missing or the email already exists.

### Log in

```http
POST /api/user/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

Success response (`200`):

```json
{
  "token": "<jwt>"
}
```

Possible error: `500` when the user does not exist or a password is not supplied.

### Check authentication

```http
GET /api/user/auth
Authorization: Bearer <token>
```

Returns a new token containing the same user ID, email, and role.

Success response (`200`):

```json
{
  "token": "<new-jwt>"
}
```

Possible error: `401` when the token is absent or invalid.

## Types

### List types

```http
GET /api/type
```

Success response (`200`): an array of type records.

### Get a type

```http
GET /api/type/:id
```

Success response (`200`): the matching type record. Returns `404` with `{ "message": "Type not found" }` when it does not exist.

### Create a type

Requires a valid JWT whose `role` is `ADMIN`.

```http
POST /api/type
Authorization: Bearer <admin-token>
Content-Type: application/json
```

Request body:

```json
{
  "name": "Smartphones"
}
```

Success response (`201`):

```json
{
  "message": "Type created successfully!",
  "type": {
    "id": 1,
    "name": "Smartphones"
  }
}
```

Possible errors: `400` for a missing name, `401` for a missing/invalid token, and `403` for a non-admin user.

### Update a type (placeholder)

```http
PUT /api/type/:id
```

This endpoint does not update the database yet. It returns `200`:

```json
{
  "message": "Hello from type update!",
  "id": "1"
}
```

### Delete a type (placeholder)

```http
DELETE /api/type/:id
```

This endpoint does not delete from the database yet. It returns `200` with the requested ID.

## Brands

### List brands

```http
GET /api/brand
```

Success response (`200`): an array of brand records.

### Get a brand

```http
GET /api/brand/:id
```

Success response (`200`): the matching brand, or `null` if no record exists.

### Create a brand

```http
POST /api/brand
Content-Type: application/json
```

Request body:

```json
{
  "name": "Apple"
}
```

Returns `201` with a success message and the created brand. Possible errors are `400` for a missing name, `409` for a duplicate name, and `500` for another database error.

### Update a brand

```http
PUT /api/brand/:id
Content-Type: application/json
```

Request body:

```json
{
  "name": "Updated brand name"
}
```

Returns `200` with the updated brand, or `404` if the brand does not exist.

### Delete a brand

```http
DELETE /api/brand/:id
```

Returns `200` with `{ "message": "Brand deleted successfully!" }`, or `404` if the brand does not exist.

## Devices

### List devices

```http
GET /api/device?page=1&limit=9&brandId=1&typeId=1
```

All query parameters are optional:

| Parameter | Default | Description |
| --- | --- | --- |
| `page` | `1` | Page number |
| `limit` | `9` | Items per page |
| `brandId` | none | Filter by brand |
| `typeId` | none | Filter by type |

Success response (`200`) uses Sequelize's paginated result shape:

```json
{
  "count": 1,
  "rows": [
    {
      "id": 1,
      "name": "Example phone",
      "price": 999,
      "rating": 0,
      "img": "generated-file-name.jpg",
      "brandId": 1,
      "typeId": 1
    }
  ]
}
```

### Get a device

```http
GET /api/device/:id
```

Returns the matching device and its `info` array.

Example response (`200`):

```json
{
  "id": 1,
  "name": "Example phone",
  "price": 999,
  "rating": 0,
  "img": "generated-file-name.jpg",
  "brandId": 1,
  "typeId": 1,
  "info": [
    {
      "id": 1,
      "title": "Memory",
      "description": "256 GB",
      "deviceId": 1
    }
  ]
}
```

### Create a device

This endpoint expects `multipart/form-data`, not JSON.

```http
POST /api/device
Content-Type: multipart/form-data
```

| Field | Type | Description |
| --- | --- | --- |
| `name` | text | Unique device name |
| `price` | number/text | Device price |
| `brandId` | number/text | Existing brand ID |
| `typeId` | number/text | Existing type ID |
| `img` | file | Required image; saved as a generated `.jpg` filename |
| `info` | JSON string | Optional object containing an `array` of device details |

Example `info` value:

```json
{
  "array": [
    {
      "title": "Memory",
      "description": "256 GB"
    },
    {
      "title": "Color",
      "description": "Black"
    }
  ]
}
```

Example cURL request:

```bash
curl -X POST http://localhost:7000/api/device \
  -F "name=Example phone" \
  -F "price=999" \
  -F "brandId=1" \
  -F "typeId=1" \
  -F "img=@phone.jpg" \
  -F 'info={"array":[{"title":"Memory","description":"256 GB"}]}'
```

Success response (`200`): the created device record. The image is then publicly available at:

```text
http://localhost:7000/<generated-file-name>.jpg
```

Bad request errors are returned with status `400`.

### Update a device (placeholder)

```http
PUT /api/device/:id
```

This endpoint does not update the database yet. It returns `200` with a placeholder message and the requested ID.

### Delete a device (placeholder)

```http
DELETE /api/device/:id
```

This endpoint does not delete from the database yet. It returns `200` with a placeholder message and the requested ID.

## Basket

All basket endpoints require a valid bearer token. The user is taken from the token, so clients do not send a user or basket ID.

### Get the basket

```http
GET /api/basket
Authorization: Bearer <token>
```

Returns the current user's basket with its basket-device records and nested device details. A basket is created automatically if the user does not have one.

### Add a device

```http
POST /api/basket
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "deviceId": 1
}
```

Returns the updated basket. The response status is `201` when the device is added and `200` when it was already present. Returns `404` when the device does not exist.

### Remove a device

```http
DELETE /api/basket/:deviceId
Authorization: Bearer <token>
```

Returns the updated basket, or `404` when the basket or basket item does not exist.

### Clear the basket

```http
DELETE /api/basket
Authorization: Bearer <token>
```

Success response (`200`):

```json
{
  "message": "Basket cleared successfully!",
  "removed": 3
}
```

## Notes about current behavior

- Type and device update/delete routes are placeholders and do not mutate data.
- Brand create, update, and delete routes currently have no authentication middleware.
- Device create, update, and delete routes currently have no authentication middleware.
- The login controller calculates whether the password hash matches but currently does not reject a supplied incorrect password.
- Device filtering places `limit` and `offset` inside the `where` clause when a brand or type filter is used, so filtered or paginated requests may not behave as intended.
- The missing-device path calls an undefined `ApiError.notFound` helper and may return a `400` response instead of the intended `404`.
