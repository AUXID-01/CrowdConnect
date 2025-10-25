import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import attendeeRoutes from './routes/attendee.routes.js';
import organiserRoutes from './routes/organiser.routes.js';
import speakerRoutes from './routes/speaker.routes.js';
import eventRoutes from "./routes/event.routes.js";

dotenv.config();
const app = express();

// ✅ CORS setup
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://crowd-connect-two.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));// ✅ Express 5 compatible

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
connectDB();

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/organiser', organiserRoutes);
app.use('/api/attendee', attendeeRoutes);
app.use('/api/speaker', speakerRoutes);
app.use('/api/events', eventRoutes);

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server running' });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.url} not found` });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
