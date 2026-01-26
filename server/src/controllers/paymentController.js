import paymentService from '../services/paymentService.js';
import walletService from '../services/walletService.js';

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await paymentService.createOrder(amount);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

        const isValid = paymentService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (isValid) {
            // Add money to wallet
            await walletService.addMoney(req.user._id, amount, razorpay_payment_id);
            res.json({ success: true, message: 'Payment verified and wallet updated' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    createOrder,
    verifyPayment,
};
