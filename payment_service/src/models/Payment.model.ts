import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // ID of the user making the payment
  payment_method: { type: String, default: 'Card' }, // Payment method (e.g., Card)
  payment_status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending'
  }, // Payment status
  transaction_id: { type: String, required: true, unique: true }, // Unique transaction reference ID
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Payment', paymentSchema);