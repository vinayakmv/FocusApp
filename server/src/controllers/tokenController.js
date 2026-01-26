import tokenService from '../services/tokenService.js';

const buyTokens = async (req, res) => {
    try {
        const { amount } = req.body;
        const newBalance = await tokenService.buyTokens(req.user._id, amount);
        res.json({ tokenBalance: newBalance });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTokenBalance = async (req, res) => {
    res.json({ tokenBalance: req.user.tokenBalance });
};

export default {
    buyTokens,
    getTokenBalance,
};
