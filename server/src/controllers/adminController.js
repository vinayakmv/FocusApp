import asyncHandler from 'express-async-handler';
import PartnerReward from '../models/PartnerReward.js';

// @desc    Add a new partner reward
// @route   POST /api/admin/partners/add
// @access  Private (Admin only - TODO: Add admin middleware, for now open/protected)
const addPartnerReward = asyncHandler(async (req, res) => {
    const {
        partnerName,
        rewardType,
        description,
        value,
        costInTokens,
        expiryDate,
        code,
        stock
    } = req.body;

    const reward = await PartnerReward.create({
        partnerName,
        rewardType,
        description,
        value,
        costInTokens,
        expiryDate,
        code,
        stock: stock || -1
    });

    res.status(201).json(reward);
});

// @desc    Get all partners (Admin view)
// @route   GET /api/admin/partners
// @access  Private
const getAdminPartners = asyncHandler(async (req, res) => {
    const rewards = await PartnerReward.find({});
    res.json(rewards);
});

export { addPartnerReward, getAdminPartners };
