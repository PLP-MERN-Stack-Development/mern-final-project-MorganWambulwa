import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';

// Controller Imports for Request handling (if no separate route file exists in your list)
import { getReceivedRequests, updateRequestStatus } from './controllers/donationController.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite Client URL
  credentials: true,
}));
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: false }));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);

// Manual Request Routes (since requestRoutes.js was not in your strict list)
const requestRouter = express.Router();
requestRouter.get('/received', protect, getReceivedRequests);
requestRouter.patch('/:id/status', protect, updateRequestStatus);
app.use('/api/requests', requestRouter);

// Base Route
app.get('/', (req, res) => {
  res.send('FoodShare API is running...');
});

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});