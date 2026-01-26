import mongoose from 'mongoose';

const partnerRewardSchema = mongoose.Schema({
    partnerName: { type: String, required: true },
    rewardType: { type: String, enum: ['DISCOUNT', 'VOUCHER'], required: true },
    description: { type: String, required: true },
    value: { type: String, required: true }, // e.g., "10% OFF", "500 INR"
    costInTokens: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    code: { type: String, required: true }, // The voucher code pattern (e.g. "OFF50") or base
    stock: { type: Number, default: -1 }, // -1 = infinite
    isRedeemed: { type: Boolean, default: false }, // Legacy check, better managed by RedeemedReward now
}, { timestamps: true });

const PartnerReward = mongoose.model('PartnerReward', partnerRewardSchema);
export default PartnerReward;
