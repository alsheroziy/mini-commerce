require("dotenv").config({ path: ".env.local" });
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const { setupSwagger } = require("./config/swagger");
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const favouriteRoutes = require("./routes/favourite.routes");
const { sendError } = require("./utils/response");

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Swagger docs
setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/favourites", favouriteRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Mini Commerce API is running 🚀", timestamp: new Date() });
});

// 404 handler
app.use((_req, res) => {
  sendError(res, "Route not found", 404);
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  sendError(res, err.message || "Internal server error");
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api/docs`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
});

module.exports = app;
