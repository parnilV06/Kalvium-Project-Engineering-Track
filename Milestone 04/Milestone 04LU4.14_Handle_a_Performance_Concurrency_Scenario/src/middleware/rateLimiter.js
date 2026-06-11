const rateLimit = require('express-rate-limit');

const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 10, // 10 requests per IP
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
});

module.exports = { bookingLimiter };
