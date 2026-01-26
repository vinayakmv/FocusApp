import mongoose from 'mongoose';

const tokenTransactionSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['BUY', 'STAKE', 'RETURN', 'BURN'], required: true },
    description: { type: String },
}, { timestamps: true });

const TokenTransaction = mongoose.model('TokenTransaction', tokenTransactionSchema);
export default TokenTransaction;
