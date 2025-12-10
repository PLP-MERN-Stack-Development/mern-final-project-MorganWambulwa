import express from 'express';
import { registerUser, loginUser, getMe, getDrivers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/drivers', protect, getDrivers); // New Route

export default router;