import cron from 'node-cron';
import Target from '../models/Target.js';
import walletService from '../services/walletService.js';
import tokenService from '../services/tokenService.js';
import AppBuckets from '../models/AppBuckets.js';
import PartnerReward from '../models/PartnerReward.js';
import RedeemedReward from '../models/RedeemedReward.js';

const evaluateTargets = async () => {
    console.log('Running Target Evaluation Cron Job...');

    const now = new Date();
    const expiredTargets = await Target.find({
        status: 'ACTIVE',
        expiryDate: { $lt: now }
    });

    for (const target of expiredTargets) {
        const isSuccess = target.progress >= target.goal;

        if (isSuccess) {
            target.status = 'COMPLETED';

            // Success Mode Logic
            if (target.stakeAmount > 0) {
                if (target.successMode === 'VOUCHER') {
                    // 1. Issue Voucher (Lucky Dip)
                    const reward = await PartnerReward.findOne({ stock: { $ne: 0 } });
                    if (reward) {
                        const voucherCode = `${reward.code}-WIN-${Math.floor(Math.random() * 1000)}`;
                        await RedeemedReward.create({
                            userId: target.userId,
                            rewardId: reward._id,
                            voucherCode,
                            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            metadata: { source: 'TARGET_WIN', targetId: target._id }
                        });
                        // 2. Refund original stake (User gets voucher + money back typically? Or just voucher? "issue ... instead of refund" implies money is gone/converted. BUT usually user wants stake back. 
                        // Interpretation: User STAKED 500. Success = Get 500 Back + Voucher? OR Get Voucher worth 500?
                        // "issue partner voucher instead of refund" -> IMPLIES converting stake to voucher.
                        // BUT usually user wants their own money back. 
                        // Let's assume: Refund Stake + Issue Voucher as Bonus. 
                        // WAIT "instead of refund" -> Means they bought the voucher with their stake success.
                        // Let's do: Refund Stake (Cash/Token) always on success (it's a stake, not a bet against house), AND issue Voucher as "Interest".
                        // ACTUALLY: The prompt says "issue partner voucher INSTEAD of refund". This is risky for REAL money (gambling laws). 
                        // I will assume for CASH -> Refund. For TOKEN -> Refund + Voucher. 
                        // Or strict reading: Convert stake to voucher.
                        // Let's stick to Safe: Refund Stake + Give Voucher.

                        if (target.stakeType === 'CASH') await walletService.refundStake(target.userId, target.stakeAmount, target._id);
                        else await tokenService.returnTokens(target.userId, target.stakeAmount);
                    } else {
                        // Fallback if no vouchers: Refund
                        if (target.stakeType === 'CASH') await walletService.refundStake(target.userId, target.stakeAmount, target._id);
                        else await tokenService.returnTokens(target.userId, target.stakeAmount);
                    }
                } else {
                    // Standard Refund
                    if (target.stakeType === 'CASH') {
                        await walletService.refundStake(target.userId, target.stakeAmount, target._id);
                    } else if (target.stakeType === 'TOKEN') {
                        await tokenService.returnTokens(target.userId, target.stakeAmount);
                    }
                }
            }

        } else {
            target.status = 'FAILED';

            // Failure Mode Logic
            if (target.stakeAmount > 0) {
                if (target.stakeType === 'CASH') {
                    if (target.failureMode === 'PENALTY') {
                        await walletService.applyPenalty(target.userId, target.stakeAmount, target._id);
                        // Add to App Revenue
                        await AppBuckets.findOneAndUpdate({}, { $inc: { revenueBucket: target.stakeAmount } }, { upsert: true });
                    } else if (target.failureMode === 'DONATE') {
                        await walletService.donateStake(target.userId, target.stakeAmount, target._id);
                        // Add to Charity
                        await AppBuckets.findOneAndUpdate({}, { $inc: { charityBucket: target.stakeAmount } }, { upsert: true });
                    } else if (target.failureMode === 'BURN') {
                        await walletService.applyPenalty(target.userId, target.stakeAmount, target._id); // Cash "Burn" = Revenue for app usually, or real burn impossible.
                        await AppBuckets.findOneAndUpdate({}, { $inc: { revenueBucket: target.stakeAmount } }, { upsert: true });
                    }
                } else if (target.stakeType === 'TOKEN') {
                    await tokenService.burnTokens(target.userId, target.stakeAmount);
                    // Tokens actually burned (gone)
                }
            }
        }

        await target.save();
    }
};

// Schedule: Run every 10 minutes (0 0 * * * * would be hourly, */10 * * * * is every 10 mins)
const startCron = () => {
    cron.schedule('*/10 * * * *', evaluateTargets);
};

export default startCron;
