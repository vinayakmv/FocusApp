import mongoose from 'mongoose';

const targetSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  goal: { type: String, required: true }, // goal in minutes/hours OR task description
  stakeAmount: { type: Number, default: 0 },
  stakeType: { type: String, enum: ['CASH', 'TOKEN'], default: 'CASH' },
  successMode: { type: String, enum: ['REFUND', 'VOUCHER'], default: 'REFUND' }, // Module 3
  failureMode: { type: String, enum: ['PENALTY', 'DONATE', 'BURN'], default: 'PENALTY' },
  status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'FAILED'], default: 'ACTIVE' },
  progress: { type: Number, default: 0 }, // minutes accumulated
  expiryDate: { type: Date, required: true },
}, { timestamps: true });

const Target = mongoose.model('Target', targetSchema);
export default Target;
