import partnershipService from '../services/partnershipService.js';

const getRewards = async (req, res) => {
    try {
        const rewards = await partnershipService.getRewards();
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const redeemReward = async (req, res) => {
    try {
        const { rewardId } = req.body;
        const result = await partnershipService.redeemReward(req.user._id, rewardId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMyRedeemed = async (req, res) => {
    try {
        const rewards = await partnershipService.getMyRedeemed(req.user._id);
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    getRewards,
    getMyRedeemed,
    redeemReward
}
