import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Add a title for the donation'],
      trim: true,
      maxlength: [100, 'Title can not be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    foodType: {
      type: String,
      required: [true, 'Please specify the food type'],
      enum: [
        'Cooked Meal',
        'Vegetables',
        'Fruits',
        'Canned Goods',
        'Baked Goods',
        'Dairy',
        'Beverages',
        'Grains',
        'Other',
      ],
    },
    quantity: {
      type: String,
      required: [true, 'Please specify the quantity (e.g., 5kg, 10 boxes)'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Add a pickup address'],
    },
    // GeoJSON Point for Mapbox integration
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere', // For geospatial queries
        default: [0, 0],
      },
      formattedAddress: String,
    },
    bestBefore: {
      type: Date,
      // Optional: Food might be non-perishable
    },
    status: {
      type: String,
      enum: ['Available', 'Pending', 'Confirmed', 'In Transit', 'Delivered', 'Expired'],
      default: 'Available',
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    allergens: {
      type: [String],
      default: [],
    },
    dietaryInfo: {
      type: [String], // e.g., Halal, Vegan
      default: [],
    },
    donor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Donation', donationSchema);