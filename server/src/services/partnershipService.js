import PartnerReward from '../models/PartnerReward.js';
import RedeemedReward from '../models/RedeemedReward.js';
import User from '../models/User.js';
import TokenTransaction from '../models/TokenTransaction.js';

const getRewards = async () => {
    // Only return rewards with infinite stock (-1) or positive stock
    return await PartnerReward.find({
        $or: [{ stock: -1 }, { stock: { $gt: 0 } }]
    });
};

const getMyRedeemed = async (userId) => {
    return await RedeemedReward.find({ userId }).populate('rewardId', 'partnerName value description');
};

const redeemReward = async (userId, rewardId) => {
    const user = await User.findById(userId);
    const reward = await PartnerReward.findById(rewardId);

    if (!reward) throw new Error('Reward not found');
    if (reward.stock === 0) throw new Error('Out of stock');
    if (user.tokenBalance < reward.costInTokens) throw new Error('Insufficient tokens');

    // Deduct Tokens
    user.tokenBalance -= reward.costInTokens;
    await user.save();

    // Record Transaction
    await TokenTransaction.create({
        userId,
        amount: -reward.costInTokens,
        type: 'SPEND',
        description: `Redeemed ${reward.partnerName} Reward`
    });

    // Generate Voucher Code (Simple suffix for now, can be UUID)
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const voucherCode = `${reward.code}-${uniqueSuffix}`;

    // Create Redemption Record
    const redemption = await RedeemedReward.create({
        userId,
        rewardId,
        voucherCode,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
        status: 'ACTIVE'
    });

    // Decrease Stock if not infinite
    if (reward.stock > 0) {
        reward.stock -= 1;
        await reward.save();
    }

    return redemption;
};

export default {
    getRewards,
    getMyRedeemed,
    redeemReward
};
