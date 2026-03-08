<div align="center">
  <img src="/public/logo.png" alt="FarmIQ Logo" width="120" />
  <h1>🌾 FarmIQ (Crop Intelligence)</h1>
  <p><strong>A Unified, AI-Powered Agri-Tech Ecosystem</strong></p>
  
  [![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black?style=flat-square&logo=socket.io)](https://socket.io/)
</div>

<br />

FarmIQ is a comprehensive, multi-sided digital ecosystem designed to modernize the agricultural supply chain. By eliminating middlemen, the platform ensures fair pricing, connects farmers directly with buyers and transporters, and delivers cutting-edge, multimodal AI advisory directly to the farmer.

---

## ✨ Key Features & Walkthrough

Our platform caters to 4 distinct roles: **Farmers**, **Buyers**, **Transporters**, and **Experts**.

### 1. Landing & Authentication
A premium landing and auth experience establishing a modern aesthetic.
<p align="center">
  <img src="/public/landing.png" width="45%" />
  <img src="/public/login.png" width="45%" />
</p>

### 2. The Farmer Dashboard
A centralized hub for farmers to jump into crop tracking, weather, selling, and community features.
<p align="center">
  <img src="/public/dashboard.png" width="80%" />
</p>

### 3. Direct Selling & Market Intelligence
Integrated with Data.gov.in APIs, farmers see live Mandi prices, use natural language AI to create intent-to-sell, and list their crops.
<p align="center">
  <img src="/public/selling.png" width="80%" />
</p>

### 4. Buyer & Transporter Logistics
Buyers can find active listings, while Transporters get live views of freight requests to accept jobs dynamically.
<p align="center">
  <img src="/public/buyer.png" width="45%" />
  <img src="/public/driverdash.png" width="45%" />
</p>

### 5. Multilingual Vision AI & Community Experts
An intelligent RAG-model AI for disease diagnosis from images, alongside real human expert boards.
<p align="center">
  <img src="/public/expertdashboard.png" width="45%" />
  <img src="/public/community.png" width="45%" />
</p>

---

## 🛠 Tech Stack 

- **Frontend Framework:** React 18, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion (animations)
- **Icons:** Lucide React, Iconsax
- **Real-time:** Socket.io-client
- **State & Data Fetching:** React Hooks, Fetch API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn / bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Crop-Intelligence
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and configure the Backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   VITE_SOCKET_URL=http://localhost:5001
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Build for Production:
   ```bash
   npm run build
   ```

---
<div align="center">
  <p>Built with ❤️ for the agricultural community.</p>
</div>