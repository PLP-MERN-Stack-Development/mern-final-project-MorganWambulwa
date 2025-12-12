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
    deliveryPerson: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      default: null,
    },
    message: {
      type: String,
      default: "I would like to request this donation.",
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'In Transit', 'Completed'],
      default: 'Pending',
    },
    respondedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Request', requestSchema);