import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  materialType: {
    type: String,
    enum: ['plastic', 'metal', 'paper', 'glass', 'ewaste'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.1
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  pickupAddress: {
    type: String,
    required: true
  },
  pickupCoordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  history: [{
    status: String,
    updatedBy: mongoose.Schema.Types.ObjectId,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Indexes for performance optimization
requestSchema.index({ vendor: 1, status: 1 });
requestSchema.index({ user: 1, createdAt: -1 });

const Request = mongoose.model('Request', requestSchema);

export default Request;