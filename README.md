<div align="center">
  <h1>Mini Commerce API</h1>
  <p>RESTful backend API for e-commerce — built with Node.js, Express, and MongoDB.</p>

  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,js" />
</div>

---

## Tech Stack

<table>
  <tr>
    <td><img src="https://skillicons.dev/icons?i=nodejs" width="20"/> <b>Node.js</b></td>
    <td>JavaScript runtime</td>
  </tr>
  <tr>
    <td><img src="https://skillicons.dev/icons?i=express" width="20"/> <b>Express.js</b></td>
    <td>Web framework</td>
  </tr>
  <tr>
    <td><img src="https://skillicons.dev/icons?i=mongodb" width="20"/> <b>MongoDB + Mongoose</b></td>
    <td>Database & ODM</td>
  </tr>
  <tr>
    <td><img src="https://skillicons.dev/icons?i=js" width="20"/> <b>JWT</b></td>
    <td>Access + Refresh Token auth</td>
  </tr>
  <tr>
    <td><img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Swagger-logo.png" width="20"/> <b>Swagger UI</b></td>
    <td>Interactive API documentation</td>
  </tr>
  <tr>
    <td><img src="https://skillicons.dev/icons?i=postman" width="20"/> <b>Multer</b></td>
    <td>File / image upload</td>
  </tr>
</table>

---

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
