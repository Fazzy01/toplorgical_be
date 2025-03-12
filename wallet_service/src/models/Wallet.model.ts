import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, required: true },
});

export default mongoose.model('Wallet', walletSchema);