import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['ADD', 'STAKE', 'REFUND', 'PENALTY', 'DONATE'], required: true },
    description: { type: String },
    referenceId: { type: String }, // Razorpay ID or Target ID
}, { timestamps: true });

const WalletTransaction = mongoose.model('WalletTransaction', transactionSchema);
export default WalletTransaction;
