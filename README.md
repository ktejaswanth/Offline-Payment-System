# 🚀 Offline Payment System (Full Stack PWA)

A full-stack Progressive Web Application (PWA) that enables secure wallet-based digital payments with support for offline transaction capability and later synchronization.

---

# 📌 Problem Statement

In many rural and low-network areas, digital payments fail due to unstable internet connectivity. Traditional payment systems require continuous online verification, making them unreliable in low-connectivity regions.

There is a need for a secure digital wallet system that:

- Allows transactions even when offline
- Syncs transactions once internet is available
- Maintains financial integrity
- Provides a smooth mobile-friendly experience

---

# 💡 Solution

Offline Payment System is a wallet-based digital payment platform that:

- Enables secure user authentication
- Provides wallet balance management
- Supports offline transaction storage
- Syncs pending transactions when back online
- Works as a Progressive Web App (PWA)

---

# 🏗️ System Architecture

Frontend (React PWA)
        ↓
REST API
        ↓
Backend (Spring Boot)
        ↓
Supabase PostgreSQL (Session Pooler)

---

# 🛠️ Tech Stack

## Frontend
- React.js
- PWA (Service Worker)
- IndexedDB / Local Storage
- Axios
- QR Code Scanner

## Backend
- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate

## Database
- Supabase PostgreSQL
- Session Pooler (IPv4 compatible)

## Deployment
- Frontend: Vercel / Netlify
- Backend: Render (Dockerized)
- Database: Supabase Cloud

---

# 🔐 Authentication Module

## Features:
- User Registration
- User Login
- JWT Token Generation
- Secure Password Hashing (BCrypt)

## Endpoints:

POST `/api/auth/register`  
POST `/api/auth/login`

---

# 👤 User Module

## Features:
- Unique user account
- Email-based identification
- Automatic wallet creation

---

# 💰 Wallet Module

## Features:
- Wallet balance tracking
- Add money functionality
- Secure transaction updates

## Endpoints:

GET `/api/wallet/balance`  
POST `/api/wallet/add`

---

# 🔄 Offline Transaction Module (PWA Feature)

## Flow:

1. User initiates payment
2. If offline:
   - Transaction stored locally
   - Marked as "Pending"
3. When internet is restored:
   - Sync service pushes transactions to backend
   - Wallet balances updated
   - Transaction marked "Completed"

---

# 📦 Modules Overview

## 1️⃣ Authentication Module
Handles user identity and security.

## 2️⃣ Wallet Module
Manages balance and updates.

## 3️⃣ Transaction Module
Records transfers and maintains transaction history.

## 4️⃣ Offline Sync Engine
Handles:
- Local storage
- Sync queue
- Conflict resolution

## 5️⃣ QR Payment Module
Allows quick wallet transfers using QR codes.

---

# 🔄 Working Flow

## 🧍 User Registration Flow
1. User enters name, email, password
2. Backend creates user
3. Wallet auto-created
4. JWT token returned

---

## 🔑 Login Flow
1. User enters credentials
2. Password verified
3. JWT token generated
4. Token used for future requests

---

## 💸 Online Payment Flow
1. User scans QR / enters receiver ID
2. Backend validates balance
3. Deduct sender balance
4. Add receiver balance
5. Save transaction

---

## 📴 Offline Payment Flow
1. User initiates transaction offline
2. Transaction saved in IndexedDB
3. Status = Pending
4. Service Worker monitors network
5. On reconnect:
   - Sync pending transactions
   - Update database
   - Mark as completed

---

# 🔒 Security Features

- JWT Authentication
- Password encryption
- Role-based access (optional)
- HTTPS enforced
- Secure DB session pooling

---

# 🌍 Real World Impact

- Enables payments in rural areas
- Reduces dependency on continuous internet
- Enhances digital financial inclusion
- Useful for transportation, small vendors, events

---

# 🚀 Deployment Guide

## Backend (Render)
- Connect GitHub repo
- Use Docker runtime
- Set environment variables:
  - DB_URL
  - DB_USERNAME
  - DB_PASSWORD
  - JWT_SECRET
  - SPRING_PROFILES_ACTIVE=prod

## Frontend (Vercel)
- Connect frontend folder
- Enable PWA service worker
- Set API base URL

---

# 🔮 Future Enhancements

- NFC Payments
- AI Fraud Detection
- Multi-wallet support
- Admin Dashboard
- Payment Analytics
- UPI Integration
- Blockchain audit trail

---

# 📊 Project Status

✅ Authentication  
✅ Wallet System  
✅ Supabase Integration  
✅ JWT Security  
⏳ Offline Sync Optimization  
⏳ QR Scanner Enhancement  

---

# 👨‍💻 Author

Tejaswanth  
Offline Payment System – Full Stack PWA Project

---

# 📄 License

MIT License
---

## 🗂️ Project Structure

```
ops/
├── offline-payment-backend/     # Spring Boot Java backend
│   ├── src/main/java/com/offlinepay/backend/
│   │   ├── controller/          # REST API Controllers
│   │   ├── service/             # Business logic
│   │   ├── entity/              # JPA database entities
│   │   ├── repository/          # Spring Data JPA repositories
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── security/            # JWT + Spring Security config
│   │   └── config/              # CORS, Security config
│   ├── src/main/resources/
│   │   └── application.properties   # DB + JWT configuration
│   └── pom.xml                  # Java dependency manager (like requirements.txt)
│
├── offline-pay-frontend/        # React + Vite frontend (PWA)
│   ├── src/
│   │   ├── pages/               # Dashboard, Login, Register, SendPayment, ReceivePayment, Profile
│   │   ├── components/          # AddMoneyModal, WithdrawModal
│   │   ├── services/            # authService.js, offlinePaymentService.js
│   │   └── App.jsx              # Main router
│   ├── package.json             # Node.js dependency manager
│   └── vite.config.js
│
├── api_docs.md                  # Full API documentation
├── postman_collection.json      # Postman API collection for testing
├── schema.sql                   # Database schema reference
└── README.md                    # This file
```

---

## ⚙️ Configuration

### Backend — `application.properties`

Located at: `offline-payment-backend/src/main/resources/application.properties`

```properties
# Database (Supabase PostgreSQL)
spring.datasource.url=jdbc:postgresql://<host>:5432/postgres?sslmode=require
spring.datasource.username=<username>
spring.datasource.password=<password>
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=<your-secret-key-min-32-chars>
jwt.expiration=86400000   # 24 hours in milliseconds
```

> ⚠️ Never commit real credentials. Use environment variables in production.

---

## 🚀 Running the Project

### Step 1 — Start the Backend

```powershell
cd offline-payment-backend
.\mvnw spring-boot:run
```

Wait for this message:
```
Started OfflinePaymentBackendApplication in X seconds
```

The backend will be available at: **http://localhost:8080**

---

### Step 2 — Start the Frontend

Open a new terminal:

```powershell
cd offline-pay-frontend
npm install       # First time only — installs all Node.js dependencies
npm run dev
```

The frontend will be available at: **http://localhost:5173**

---

## 📦 Dependency Management

### Backend (Java) — `pom.xml`

All Java libraries are declared in `pom.xml`. Maven handles downloading them automatically.

Key dependencies:
| Library | Purpose |
|---------|---------|
| `spring-boot-starter-web` | REST API |
| `spring-boot-starter-security` | Authentication/Authorization |
| `spring-boot-starter-data-jpa` | ORM / Database access |
| `postgresql` | PostgreSQL JDBC driver |
| `jjwt-api` | JWT token generation & validation |
| `lombok` | Reduces boilerplate Java code |
| `jackson-databind` | JSON serialization |

To add a new Java dependency, add it to `pom.xml` and run:
```powershell
.\mvnw dependency:resolve
```

---

### Frontend (JavaScript) — `package.json`

Key dependencies:
| Library | Purpose |
|---------|---------|
| `react` + `react-dom` | UI framework |
| `react-router-dom` | Page navigation |
| `axios` | HTTP requests to backend |
| `qrcode.react` | QR Code generation |
| `@zxing/library` + `@zxing/browser` | QR Code scanning via camera |
| `recharts` | Charts & analytics graphs |
| `lucide-react` | Icon library |
| `idb` | IndexedDB for offline data storage |
| `uuid` | Unique transaction ID generation |
| `vite` | Dev server + build tool |

To install all frontend dependencies after cloning:
```powershell
cd offline-pay-frontend
npm install
```

To add a new frontend package:
```powershell
npm install <package-name>
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT token |
| `GET`  | `/api/wallet/balance?email=` | ✅ | Get wallet balance |
| `POST` | `/api/wallet/add?email=&amount=` | ✅ | Add money to wallet |
| `POST` | `/api/wallet/withdraw?email=&amount=` | ✅ | Withdraw money |
| `POST` | `/api/transaction/send` | ✅ | Send money to another user |
| `GET`  | `/api/transaction/history` | ✅ | Get transaction history |
| `POST` | `/api/offline-transaction/verify` | ✅ | Verify offline QR transaction |
| `GET`  | `/api/user/profile` | ✅ | Get user profile |
| `PUT`  | `/api/user/profile` | ✅ | Update user profile & bank details |

> ✅ Auth = Requires `Authorization: Bearer <JWT_TOKEN>` header

---

## 🔐 Security Features

- **JWT Authentication** — Stateless token-based auth (24hr expiry)
- **BCrypt Password Hashing** — All passwords hashed before storing
- **ECDSA P-256 Signing** — Offline transactions signed with a private key stored in browser
- **Signature Verification** — Backend verifies signature before crediting offline payments
- **Replay Attack Prevention** — Nonce-based tracking for offline transactions
- **CORS Protection** — Only `http://localhost:5173` is whitelisted

---

## 🌐 Key Features

- ✅ **Online Payments** — Real-time transfers between users
- ✅ **Offline QR Payments** — Generate signed QR codes without internet
- ✅ **Wallet Management** — Add money, withdraw to bank account
- ✅ **Transaction History** — Live feed of all transactions
- ✅ **Profile & Bank Details** — Save bank info for quick withdrawals
- ✅ **QR Scanner** — Scan another user's UUID QR to send payment
- ✅ **PWA Support** — Installable as a mobile app, works offline via Service Worker
- ✅ **Dark/Light Mode** — Theme toggle across all pages

---

## 🧪 Testing the API

Import `postman_collection.json` into [Postman](https://www.postman.com/) for a ready-made collection of all API calls.

Or use the `test_api_curl.bat` script located in `offline-payment-backend/`.

---

## 🏗️ Build for Production

### Backend
```powershell
cd offline-payment-backend
.\mvnw clean package -DskipTests
# JAR file will be in: target/backend-0.0.1-SNAPSHOT.jar
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```powershell
cd offline-pay-frontend
npm run build
# Output will be in: dist/ folder — deploy to any static host (Vercel, Netlify, etc.)
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|---------|
| `403 Forbidden` after login | Check CORS config in `SecurityConfig.java`. Ensure backend is running. |
| `Camera not opening` in scanner | Allow camera permissions in browser settings |
| Backend won't start | Check PostgreSQL connection in `application.properties` |
| `npm install` fails | Delete `node_modules/` folder and run `npm install` again |
| Port already in use | Kill the process: `netstat -ano | findstr :8080` then `taskkill /PID <id> /F` |
