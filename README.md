# Mini Commerce API

RESTful backend API for e-commerce — built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — MongoDB + Mongoose
- **Auth** — JWT (Access + Refresh Token)
- **Docs** — Swagger UI
- **Upload** — Multer

## Getting Started

```bash
git clone <repo-url>
cd mini-commerce
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

Fill in the `.env.local` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mini-commerce
JWT_ACCESS_SECRET=your_secret_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_DAYS=30
CLIENT_URL=http://localhost:3000
API_URL=http://localhost:5000
```

## API Docs

Once the server is running, open:

```
http://localhost:5000/api/docs
```

## Project Structure

```
├── config/          # DB and Swagger configuration
├── models/          # Mongoose schemas
├── middlewares/     # Auth, upload, validation
├── services/        # Business logic
├── controllers/     # Request / response handling
├── routes/          # API routes
├── utils/           # Helper functions
├── public/uploads/  # Uploaded images
└── server.js
```

## Scripts

```bash
npm run dev    # Development mode (nodemon)
npm start      # Production mode
```
