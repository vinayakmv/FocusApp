import mongoose from 'mongoose';

const redeemedRewardSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'PartnerReward', required: true },
    voucherCode: { type: String, required: true },
    redeemedAt: { type: Date, default: Date.now },
    validUntil: { type: Date },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'USED'], default: 'ACTIVE' },
    metadata: { type: Map, of: String }
}, { timestamps: true });

const RedeemedReward = mongoose.model('RedeemedReward', redeemedRewardSchema);
export default RedeemedReward;
