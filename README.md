# OfflinePay — Secure Offline-to-Online QR Payment System

A Progressive Web App (PWA) for secure QR-based digital payments that works both online and offline.

---

## 📋 Prerequisites

Before running this project, make sure you have these installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| **Java JDK** | 17 or higher | https://adoptium.net |
| **Node.js** | 18 or higher | https://nodejs.org |
| **npm** | 9 or higher | Comes with Node.js |
| **PostgreSQL** | 14+ (or Supabase cloud) | https://www.postgresql.org |
| **Git** | Any | https://git-scm.com |

> ✅ **No Python or `requirements.txt` needed** — Java dependencies are managed by `pom.xml`, and frontend dependencies by `package.json`.

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
