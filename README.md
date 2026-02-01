# Healthcare Blood Donation Service - Auth, RBAC & Donation System

A production-ready blood donation management system built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **User Profiles**: Comprehensive user records with `bloodGroup`, `dateOfBirth`, and `location`.
- **Blood Request System**: Full lifecycle management of blood requests from creation to fulfillment.
- **Admin Management**: Dedicated admin routes to view and approve blood requests.
- **Volunteer System**: Users can accept/volunteer for approved blood requests.
- **JWT Auth**: Secure implementation of Access Tokens (15m) and Refresh Tokens (7d).
- **RBAC**: Protected routes based on roles (`ADMIN`, `USER`).
- **Swagger Documentation**: Interactive API testing playground at `/api-docs`.
- **Clean Architecture**: Separation of concerns using Controller -> Service -> Repository layers.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Security**: JWT, Bcrypt
- **Documentation**: Swagger UI

## 📂 Project Structure

```text
src/
├── config/       # Database and Swagger configuration
├── controllers/  # Request handling logic
├── middlewares/  # JWT verification and RBAC
├── models/       # Mongoose schemas (User, BloodRequest)
├── repositories/ # Database abstraction layer
├── routes/       # API route definitions
├── services/     # Business logic
├── utils/        # JWT signing and helper functions
├── app.ts        # Express app setup
└── server.ts     # Entry point
```

## ⚙️ How it Works

### 1. Registration
Users register with full profile details. The system uses these profiles to match donors with blood requests.

### 2. Blood Request Lifecycle
1. **Creation**: A user creates a request via `POST /blood-requests`.
2. **Approval**: An admin reviews and approves the request via `PATCH /blood-requests/:id/approve`.
3. **Acceptance**: Another user volunteers for the request via `PATCH /blood-requests/:id/volunteer`.
4. **Fulfillment**: The request is marked as `FULFILLED` once a volunteer accepts it.

## 🏁 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally or a connection string

### Installation

1. Install dependencies: `npm install`
2. Configure `.env` (see below)
3. Build: `npm run build`
4. Start: `npm start`
5. Debug: Press F5 in VS Code (Pre-configured `launch.json`)

### Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | Register with profile details | Public |
| POST | `/auth/login` | Login and get tokens | Public |
| POST | `/auth/refresh` | Get new access token | Public |

### Blood Requests
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/blood-requests` | Create a blood request | Authenticated |
| GET | `/blood-requests` | View all requests | Public |
| PATCH | `/blood-requests/:id/volunteer` | Volunteer for a request | Authenticated |

### Admin Operations
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/admin/blood-requests` | View all requests | Admin Only |
| PATCH | `/admin/blood-requests/:id/approve` | Approve a request | Admin Only |

### User Profile
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/users/profile` | Get full user profile | Authenticated |

## 🧪 Interactive Docs
Access the Swagger UI at: `http://localhost:5000/api-docs`

