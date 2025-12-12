import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getMe, 
  getDrivers, 
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; 

const router = express.Router();


router.post('/register', registerUser);

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  loginUser(req, res, next);
});

router.get('/me', protect, getMe);
router.get('/drivers', protect, getDrivers);

router.put('/profile', protect, upload.single('avatar'), updateProfile);

export default router;
