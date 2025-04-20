const express = require('express');
const app = express();
const db = require('./config/dbconfig');
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://16.171.12.238',
  'https://lpedu.lk'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ DB Connection Check
db.query('SELECT 1')
  .then(() => {
    console.log('✅ Database connected successfully.');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
