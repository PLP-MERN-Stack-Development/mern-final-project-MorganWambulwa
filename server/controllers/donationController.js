import Donation from '../models/Donation.js';
import Request from '../models/Request.js';

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private (Donors only)
export const createDonation = async (req, res) => {
  try {
    // Add user to body
    req.body.donor = req.user.id;

    const donation = await Donation.create(req.body);

    res.status(201).json(donation);
  } catch (error) {
    console.error("Create Donation Error:", error);
    // FIX: Send the specific error message back to the frontend
    res.status(400).json({ message: error.message || 'Failed to create donation' });
  }
};

// @desc    Get all available donations
// @route   GET /api/donations
// @access  Private
export const getDonations = async (req, res) => {
  try {
    const { foodType, status } = req.query;
    const query = {};

    if (foodType) query.foodType = foodType;
    query.status = status || 'Available';

    const donations = await Donation.find(query)
      .populate('donor', 'name organization phone email')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get donations created by logged-in user
// @route   GET /api/donations/my
// @access  Private (Donors)
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request a donation
// @route   POST /api/donations/:id/request
// @access  Private (Receivers)
export const requestDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'Available') {
      return res.status(400).json({ message: 'Donation is no longer available' });
    }

    const existingRequest = await Request.findOne({
      donation: req.params.id,
      receiver: req.user.id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested this donation' });
    }

    const request = await Request.create({
      donation: req.params.id,
      receiver: req.user.id,
      donor: donation.donor,
      message: req.body.message || "I would like to request this donation.",
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get requests received by the donor (Incoming)
// @route   GET /api/requests/received
// @access  Private (Donors)
export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ donor: req.user.id })
      .populate('receiver', 'name email phone organization')
      .populate('donation', 'title foodType images')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status (Approve/Reject)
// @route   PATCH /api/requests/:id/status
// @access  Private (Donor only)
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to manage this request' });
    }

    request.status = status;
    request.respondedAt = Date.now();
    await request.save();

    if (status === 'Approved') {
      await Donation.findByIdAndUpdate(request.donation, { status: 'Pending' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... existing code ...

// @desc    Get deliveries assigned to the logged-in driver
// @route   GET /api/donations/deliveries
// @access  Private (Drivers)
export const getMyDeliveries = async (req, res) => {
  try {
    // Find requests where this user is the delivery person and status is not rejected/cancelled
    const deliveries = await Request.find({ 
      deliveryPerson: req.user.id,
      status: { $in: ['Approved', 'In Transit', 'Completed'] }
    })
    .populate('donation')
    .populate('receiver', 'name phone address organization')
    .populate('donor', 'name phone address organization')
    .sort({ updatedAt: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'In Transit' or 'Completed'
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Delivery not found' });

    if (request.deliveryPerson.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    // Sync with Donation status
    if (status === 'In Transit') {
      await Donation.findByIdAndUpdate(request.donation, { status: 'In Transit' });
    } else if (status === 'Completed') {
      await Donation.findByIdAndUpdate(request.donation, { status: 'Delivered' });
      request.completedAt = Date.now();
      await request.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};