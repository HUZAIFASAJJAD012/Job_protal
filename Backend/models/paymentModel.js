import mongoose from 'mongoose';

const { Schema } = mongoose;

const paymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lawyerId: {
    type: Schema.Types.ObjectId,
    ref: 'Lawyer',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd', // Default to USD, but can be changed dynamically
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  receiptUrl: {
    type: String, // To store the URL for payment receipt from Stripe
  },
  transactionId: {
    type: String, // To store the unique transaction ID from Stripe
  },
  description: {
    type: String, // Description of what the payment is for
  },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
