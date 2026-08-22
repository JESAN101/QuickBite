const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

// =======================
// Environment Validation
// =======================
const requiredEnvVars = ["PORT", "MONGO_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvVars.join(", ")}. Check your .env file.`
  );
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error(
    "❌ JWT_SECRET must be at least 32 characters. Generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
  );
  process.exit(1);
}

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const couponRoutes = require("./routes/couponRoutes");
const riderRoutes = require("./routes/riderRoutes");
const roleRequestRoutes = require("./routes/roleRequestRoutes");
const adminRoutes = require("./routes/adminRoutes");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimiter");

// Connect Database
connectDB();

// Create Express App
const app = express();

// =======================
// Middleware
// =======================
app.use(helmet());

// CORS must run BEFORE the rate limiter, otherwise 429 responses
// are sent without CORS headers and browsers report them as CORS errors.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(apiLimiter);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api/role-request", roleRequestRoutes);
app.use("/api/admin", adminRoutes);

// =======================
// Home Route
// =======================
app.get("/", (req, res) => {
  res.send("🚀 Welcome to QuickBite API!");
});

// =======================
// Error Handling
// =======================
app.use(notFound);
app.use(errorHandler);

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

const httpServer = require("http").createServer(app);
const socket = require("./config/socket");

socket.init(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
