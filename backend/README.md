<div align="center">
  <h1>🌾 FarmIQ (Crop Intelligence) - Backend Services</h1>
  <p><strong>Scalable, Real-Time Node.js Backend API</strong></p>

  [![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-4.x-black?style=flat-square&logo=express)](https://expressjs.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-WebSockets-black?style=flat-square&logo=socket.io)](https://socket.io/)
  [![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
</div>

<br />

This repository contains the backend micro-services and API infrastructure for the **FarmIQ (Crop Intelligence)** platform. It handles cross-role authentication, real-time Socket.io negotiations, complex Firebase Data hierarchies, and advanced Multimodal AI orchestration.

---

## 🏗 Core Architecture

1. **Role-Based API Gateway:** Separated routing for Farmers, Transporters, Buyers, and Experts secured by JWT middleware (`/api/auth`, `/api/market`, `/api/transport`, etc.).
2. **Real-time Engine (`Socket.io`):** Manages dynamic rooms for peer-to-peer negotiations. A buyer clicking on a farmer's crop instantly creates a dedicated Socket channel for transaction tracking.
3. **NoSQL Firestore Persistence:** Leveraging Google Firebase Firestore for high-velocity reads/writes of community posts, sensor data, and transport geographical coordinates.
4. **Multimodal AI Brain (Gemini 1.5 Flash):** 
   - Uses **Vision** models to parse base64 crop images and diagnose diseases.
   - Outputs highly structured, custom React Widget tags (`<WIDGET_DIAGNOSIS>`, `<WIDGET_CROP>`) for the frontend to render.
   - Employs **Natural Language Parsing** to convert loosely typed Hindi/English inputs into strict JSON crop listings.

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Firebase Firestore & Firebase Storage
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Real-Time:** Socket.io
- **AI Integration:** `@google/generative-ai`
- **External Data:** `axios` for fetching live Mandi & Weather APIs

---

## 📂 Directory Structure

```text
backend/
├── config/             # Firebase instantiation & configuration
├── controllers/        # Business logic (AI Service, Market, Transport, Chat)
├── middleware/         # JWT Verification & Role-guards
├── routes/             # Express routing mapping to controllers
├── server.js           # Express App initialization & Socket.io server
└── .env                # Environment specific variables
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Firebase Project with Firestore enabled.
- A Google Gemini API Key.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Backend-Crop-intelligence/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   # Server Port
   PORT=5001
   
   # JWT Secret Key
   JWT_SECRET=your_super_secret_jwt_key
   
   # Firebase configuration (base64 string or absolute path to serviceAccountKey.json)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   
   # Gemini API Key for FarmIQ AI Assistant
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   node server.js
   # or
   bun start
   ```
   The backend will start and socket connectivity will bind to `ws://localhost:5001`.

---
<div align="center">
  <p>Engineered for speed, scale, and intelligence.</p>
</div>
