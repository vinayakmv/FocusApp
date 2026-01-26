import WalletTransaction from '../models/WalletTransaction.js';
import User from '../models/User.js';

// Add money to wallet
const addMoney = async (userId, amount, referenceId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.walletBalance += amount;
    await user.save();

    await WalletTransaction.create({
        userId,
        amount,
        type: 'ADD',
        referenceId,
        description: 'Added money to wallet',
    });

    return user.walletBalance;
};

// Stake money (Deduct from wallet)
const stakeMoney = async (userId, amount, targetId) => {
    const user = await User.findById(userId);
    if (user.walletBalance < amount) throw new Error('Insufficient balance');

    user.walletBalance -= amount;
    await user.save();

    await WalletTransaction.create({
        userId,
        amount,
        type: 'STAKE',
        referenceId: targetId,
        description: 'Staked for target',
    });

    return user.walletBalance;
};

// Refund money (Success)
const refundStake = async (userId, amount, targetId) => {
    const user = await User.findById(userId);
    user.walletBalance += amount;
    await user.save();

    await WalletTransaction.create({
        userId,
        amount,
        type: 'REFUND',
        referenceId: targetId,
        description: 'Target completed, stake refunded',
    });
};

// Penalize (Failure - keeping funds or burning?)
// For now, if penalty is kept by platform, we don't return it.
// Log PENALTY transaction for record keeping (amount 0 or full stake?)
// Actually, money is already deducted. We just log that it was a penalty.
const applyPenalty = async (userId, amount, targetId) => {
    await WalletTransaction.create({
        userId,
        amount,
        type: 'PENALTY',
        referenceId: targetId,
        description: 'Target failed, stake forfeited',
    });
};

const donateStake = async (userId, amount, targetId) => {
    // Logic to send to charity API could go here
    await WalletTransaction.create({
        userId,
        amount,
        type: 'DONATE',
        referenceId: targetId,
        description: 'Target failed, stake donated',
    });
};

export default {
    addMoney,
    stakeMoney,
    refundStake,
    applyPenalty,
    donateStake,
};
