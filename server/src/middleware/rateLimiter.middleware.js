import rateLimit from "express-rate-limit";

// Keeps 429 responses in the same shape as the rest of your API
const rateLimitHandler = (req, res) => {
    res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later."
    });
};

// Stricter limiter for login/register — guards against brute-force
// credential stuffing and mass account creation.
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                   // 10 attempts per IP per window
    standardHeaders: true,     // adds RateLimit-* headers
    legacyHeaders: false,
    handler: rateLimitHandler
});

// Looser limiter for the public contact form — enough room for a real
// person to retry a typo, but stops scripted spam floods.
export const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler
});