# TripVault React Frontend

The **TripVault frontend** is a modern, responsive web application built with React and Vite. It offers an intuitive interface for both tourists and administrators, supporting trip planning, attraction browsing, event management, ticket purchasing, and real-time map interactions.

---

## 🚀 Features

-   🗺️ Interactive Google Maps integration with custom map styling
-   🧭 Filterable and sorted attraction/event discovery
-   🛒 Cart and checkout flow using Stripe
-   🎫 QR code ticket generation and download
-   🔐 JWT-based login system with role-based access (user/admin)
-   📁 Media file display from Google Cloud Storage

---

## 🛠 Requirements

-   Node.js (v16+ recommended)
-   npm

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/tripvault-frontend.git
cd tripvault-frontend
npm install
```

---

## ▶️ Running the Application

```bash
npm run dev
```

The app will start on [http://localhost:5173](http://localhost:5173) (default Vite port).

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the project with the following keys:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_MAP_ID=your_custom_map_id
VITE_SERVER_URL=https://your-node-backend-url.com
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_GOOGLE_BUCKET_URL=https://storage.googleapis.com/your-bucket-name
```

These variables enable integration with external services such as Google Maps, Stripe, and your backend server.

---

## 📄 License

This frontend is part of the **TripVault** research thesis. Usage and distribution may be subject to academic license.

---

## 👤 Author

**Alex-Matei Ignat**  
BSc Computer Science, 2025  
Babeș-Bolyai University
