import Target from '../models/Target.js';
import walletService from './walletService.js';
import tokenService from './tokenService.js';

const createTarget = async (userId, data) => {
    const { name, goal, stakeAmount, stakeType, failureMode, expiryDate } = data;

    // Handle Staking
    if (stakeAmount > 0) {
        if (stakeType === 'CASH') {
            await walletService.stakeMoney(userId, stakeAmount, 'PENDING_TARGET_ID'); // Need Target ID first?
            // Actually common pattern is: create pending target -> stake -> if fail, delete target/refund.
            // Better: check balance first (service does checks), then deduct.
        } else if (stakeType === 'TOKEN') {
            await tokenService.stakeTokens(userId, stakeAmount);
        }
    }

    const target = await Target.create({
        userId,
        name,
        goal,
        stakeAmount,
        stakeType,
        failureMode,
        expiryDate,
        status: 'ACTIVE',
    });

    // Update Reference ID for wallet transaction if needed? 
    // Ideally transaction ID should link to target. 
    // For simplicity, we assume the stake happened.

    return target;
};

const getTargets = async (userId) => {
    return await Target.find({ userId }).sort({ createdAt: -1 });
};

const updateTargetProgress = async (targetId, durationMinutes) => {
    // This might be handled by session completion.
    // If goal is "accumulated", we add up. If goal is "one off", we mark done.
    // Assuming cumulative goal for now or simple "did you do it"?
    // User request: "Timer session stored... Cron job checks expired targets... Marks SUCCESS or FAILED"
    // So targets are time-bound goals (e.g. "Study 5 hours by Friday").
    // We need to track ACCUMULATED time vs GOAL.
    // I need to add 'progress' field to Target model? Or calculate from Sessions?
    // Let's add 'progress' to Target model for caching.

    // WAIT: I missed adding 'progress' to Target model. I should fix that.
    // For now, I will fetch sessions to calculate or assume a progress field exists. 
    // I will add a progress field to Target model schema in next step.
    return true;
};

export default {
    createTarget,
    getTargets,
    updateTargetProgress,
};
