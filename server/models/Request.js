import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.ObjectId,
      ref: 'Donation',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    donor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    deliveryPerson: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // Can be assigned to a driver
      default: null,
    },
    respondedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate requests from the same user for the same donation
requestSchema.index({ donation: 1, receiver: 1 }, { unique: true });

export default mongoose.model('Request', requestSchema);