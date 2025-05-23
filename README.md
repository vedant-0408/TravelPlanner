# 🧳 Travel Planner – Full-Stack Trip Planning & Booking Platform

**Travel Planner** is a full-featured web application that helps users discover, plan, and book trips by scraping real-time data on destinations, flights, and hotels. It integrates secure payments and a scalable backend architecture to ensure a smooth and dynamic travel planning experience.

## 🚀 Tech Stack

| Layer              | Technology                                    |
| ------------------ | --------------------------------------------- |
| **Frontend**       | React.js 14, Tailwind CSS, TypeScript         |
| **Backend**        | Node.js, Express, Redis, BullMQ, Puppeteer    |
| **Database**       | PostgreSQL with Prisma ORM                    |
| **Authentication** | JWT-based auth with role-based authorization  |
| **Payments**       | Stripe API                                    |
| **Job Queues**     | Redis + BullMQ                                |

---

## ✨ Key Features

- 🔎 **Scraping Engine**: Fetches real-time trip, flight, and hotel data using **Puppeteer**
- ⏱️ **Queue System**: Handles scraping jobs efficiently with **Redis** and **BullMQ**
- 🔐 **Secure Authentication**: Implements JWT-based login and role-based access control
- 💳 **Payments**: Seamless and secure transactions via **Stripe Integration**
- 🧭 **Trip Planner**: Build day-wise itineraries with stay durations and destinations
- 🗃️ **Structured Storage**: Data is normalized and stored in **PostgreSQL** via **Prisma**
- 📱 **Responsive UI**: Built with TailwindCSS and React 14

---

## 📁 Project Structure

```

travel-planner/
├── client/             # React frontend
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── server/             # Node.js backend
│   ├── controllers/
│   ├── jobs/           # BullMQ job queues
│   ├── middlewares/
│   ├── puppeteer/      # Web scraping logic
│   ├── routes/
│   └── prisma/         # Prisma schemas & migrations
├── .env
├── package.json
└── README.md

````

---

## 🧪 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/travel-planner.git
cd travel-planner
````

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure Environment

Create `.env` files in both `client/` and `server/` with required variables:

**Example for `server/.env`:**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/travelplanner
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
```

---

## 📦 Run Locally

```bash
# Start Redis server (if not running)
redis-server

# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev
```

---

## 📌 Status

🛠 **Ongoing Development**
Planned features include:

* Group travel collaboration
* Real-time updates via WebSockets
* User-generated reviews & ratings
