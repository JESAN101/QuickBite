const rateLimit = require("express-rate-limit");

/**
 * General API limiter — generous ceiling for normal app usage
 * (dashboards fire many parallel calls), while still capping abuse.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

/**
 * Strict limiter for auth endpoints — 15 attempts per 15 minutes per IP.
 * Prevents brute-force attacks on login / register.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again after 15 minutes.",
  },
});

module.exports = { apiLimiter, authLimiter };
