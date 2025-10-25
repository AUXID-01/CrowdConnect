import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import attendeeRoutes from './routes/attendee.routes.js';
import organiserRoutes from './routes/organiser.routes.js';
import speakerRoutes from './routes/speaker.routes.js';
import eventRoutes from "./routes/event.routes.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// ---------------- CORS CONFIGURATION ----------------
const corsOptions = {
  origin: [
    'http://localhost:5173',                  // Local dev
    'https://crowd-connect-delta.vercel.app'  // ✅ Your production frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ✅ Apply CORS first (before any other middleware)
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
  // Handle preflight requests
// ----------------------------------------------------

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- DATABASE CONNECTION ----------------
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/crowdconnect'
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to database
connectDB();
// ----------------------------------------------------

// ---------------- ROUTES ----------------
app.use('/api/auth', authRoutes);
app.use('/api/organiser', organiserRoutes);
app.use('/api/attendee', attendeeRoutes);
app.use('/api/speaker', speakerRoutes);
app.use('/api/events', eventRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CrowdConnect API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        getProfile: 'GET /api/auth/me'
      }
    }
  });
});
// ----------------------------------------------------

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
