import express from 'express';
import { 
  createDonation, 
  getDonations, 
  getMyDonations,
  updateDonation,
  deleteDonation,
  requestDonation,
  cancelRequest,
  getMySentRequests,
  getReceivedRequests,
  updateRequestStatus,
  getMyDeliveries,
  updateDeliveryStatus
} from '../controllers/donationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

router.route('/')
  .get(protect, getDonations)
  .post(protect, authorize('donor', 'admin'), upload.single('image'), createDonation);

router.get('/my', protect, getMyDonations);

router.route('/:id')
  .put(protect, authorize('donor', 'admin'), upload.single('image'), updateDonation)
  .delete(protect, authorize('donor', 'admin'), deleteDonation);

router.get('/deliveries', protect, authorize('driver'), getMyDeliveries);
router.patch('/deliveries/:id', protect, authorize('driver'), updateDeliveryStatus);

router.post('/:id/request', protect, requestDonation);
router.get('/requests/my', protect, getMySentRequests);
router.delete('/requests/:id/cancel', protect, cancelRequest);
router.get('/requests/received', protect, getReceivedRequests); 
router.patch('/requests/:id/status', protect, updateRequestStatus);

export default router;