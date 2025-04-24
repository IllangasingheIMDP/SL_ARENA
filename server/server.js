// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const db = require('./config/dbconfig');
const routes = require('./routes');
const { errorHandler } = require('./utils/errorHandler');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://16.171.12.238',
        'https://lpedu.lk',
        'http://localhost:19000',
        'http://localhost:19001',
        'http://localhost:19002',
        'exp://',
      ];
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin === 'exp://') {
          return origin.startsWith('exp://');
        }
        return origin === allowedOrigin;
      })) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Set trusted proxy if behind a proxy
// app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Request logging
app.use(morgan('dev'));

// Parse JSON request body
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'error',
    message: 'Too many requests, please try again later'
  }
});

// Apply rate limiting to all requests
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://16.171.12.238',
  'https://lpedu.lk',
  'http://localhost:19000', // Expo development
  'http://localhost:19001', // Expo development
  'http://localhost:19002', // Expo development
  'exp://', // Expo mobile client
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin === 'exp://') {
        return origin.startsWith('exp://');
      }
      return origin === allowedOrigin;
    })) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Database connection check
db.query('SELECT 1')
  .then(() => {
    console.log('✅ Database connected successfully.');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

// Mount routes with io instance
app.use('/', routes(io));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('WebSocket user connected:', socket.id);

  const token = socket.handshake.auth.token;
  if (!token) {
    console.log('No token provided, disconnecting:', socket.id);
    socket.disconnect();
    return;
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    // Join user's notification room
    const notificationRoom = `user_${user_id}`;
    socket.join(notificationRoom);
    console.log(`User ${user_id} joined room ${notificationRoom}`);

    // Handle join_notification_room event
    socket.on('join_notification_room', ({ userId }) => {
      const room = `user_${userId}`;
      socket.join(room);
      console.log(`User ${userId} joined notification room ${room}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('WebSocket user disconnected:', socket.id);
    });
  } catch (err) {
    console.error('Invalid WebSocket token:', err.message);
    socket.disconnect();
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  
  // Gracefully shut down server
  process.exit(1);
});

module.exports = { app, server, io };