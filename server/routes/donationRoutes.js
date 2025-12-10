import express from 'express';
import { 
  createDonation, 
  getDonations, 
  getMyDonations, 
  requestDonation,
  getReceivedRequests,
  updateRequestStatus,
  getMyDeliveries,
  updateDeliveryStatus
} from '../controllers/donationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getDonations)
  .post(protect, authorize('donor', 'admin'), createDonation);

router.get('/my', protect, getMyDonations);

// Driver Routes
router.get('/deliveries', protect, authorize('driver'), getMyDeliveries);
router.patch('/deliveries/:id', protect, authorize('driver'), updateDeliveryStatus);

// Request Routes
router.post('/:id/request', protect, requestDonation);
router.get('/requests/received', protect, getReceivedRequests); // Ensure this matches frontend path
router.patch('/requests/:id/status', protect, updateRequestStatus);

export default router;