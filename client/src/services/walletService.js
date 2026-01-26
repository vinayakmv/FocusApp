import api from './api';

const getBalance = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.get('/wallet/balance', config);
    return response.data;
};

const addMoney = async (amount, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    // 1. Create Order
    const orderResponse = await api.post('/payments/create-order', { amount }, config);
    const order = orderResponse.data;

    // 2. We return order details so component can launch Razorpay
    return order;
};

const verifyPayment = async (paymentData, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.post('/payments/verify', paymentData, config);
    return response.data;
};

const walletService = {
    getBalance,
    addMoney,
    verifyPayment,
};

export default walletService;
