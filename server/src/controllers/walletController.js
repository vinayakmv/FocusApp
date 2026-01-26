import walletService from '../services/walletService.js';

const addMoney = async (req, res) => {
    try {
        const { amount, referenceId } = req.body;
        const balance = await walletService.addMoney(req.user._id, amount, referenceId);
        res.json({ balance });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getBalance = async (req, res) => {
    res.json({ balance: req.user.walletBalance });
};

export default {
    addMoney,
    getBalance,
};
