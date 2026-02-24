# Offline Payment Gateway API

Base URL: `http://localhost:8080/api`

## Authentication (`/auth`)

### 1. Register User
- **Endpoint:** `POST /auth/register`
- **Description:** Creates a new user, hashes the password, and provisions a default wallet with `0.00` balance.
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "strongPassword123"
}
```
- **Response:** `200 OK`
```json
{
  "token": "jwt-token-string",
  "userId": "uuid-here",
  "message": "Success"
}
```

### 2. Login User
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticates a user and returns a valid JWT.
- **Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "strongPassword123"
}
```
- **Response:** Same as registration.

---

## Wallet Management (`/wallet`)
*Requires `Authorization: Bearer <jwt>` Header.*

### 1. Get Balance
- **Endpoint:** `GET /wallet/balance?email=user@example.com`
- **Description:** Fetches current user balance.
- **Response:** `200 OK` -> `100.50`

### 2. Add Money
- **Endpoint:** `POST /wallet/add?email=user@example.com&amount=100.00`
- **Description:** Used to simulate funding the wallet.
- **Response:** `200 OK` -> `Money added successfully`

---

## Transactions (`/transaction` and `/offline-transaction`)
*Requires `Authorization: Bearer <jwt>` Header.*

### 1. Send Money (Online)
- **Endpoint:** `POST /transaction/send`
- **Description:** Instantly deducts funds from sender and adds to receiver.
- **Request Body:**
```json
{
  "receiverId": "receiver-uuid",
  "amount": 50.00
}
```

### 2. Get User Transaction History
- **Endpoint:** `GET /transaction/history`
- **Description:** Retrieves all online and offline synchronized transactions for the authenticated user.

### 3. Verify Scanned QR (Offline mode)
- **Endpoint:** `POST /offline-transaction/verify`
- **Description:** The receiver hits this endpoint with the payload parsed from the offline sender's QR code. The server performs cryptographic signature validation and checks the `nonce` against replay attacks.
- **Request Body:**
```json
{
  "senderId": "sender-uuid",
  "receiverId": "receiver-uuid",
  "amount": 25.00,
  "nonce": "unique-uuid",
  "signature": "base64-string-from-web-crypto-api"
}
```

### 4. Background Data Sync (Offline mode)
- **Endpoint:** `POST /offline-transaction/sync`
- **Description:** Batch processes offline transactions stored in IndexedDB when the sender goes back online.
- **Request Body:** Array of the QR payload objects.
