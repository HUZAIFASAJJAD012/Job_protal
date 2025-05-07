// models/paymentModel.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['school', 'job_application'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'qar'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  stripeSessionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['completed', 'failed', 'refunded'],
    default: 'completed'
  },
  metadata: {
    type: Object
  }
}, { timestamps: true });

// Method to check if subscription is expired
paymentSchema.methods.isExpired = function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;