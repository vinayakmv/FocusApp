import api from './api';

const getTokenBalance = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.get('/tokens/balance', config);
    return response.data;
};

const buyTokens = async (amount, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.post('/tokens/buy', { amount }, config);
    return response.data;
};

const tokenService = {
    getTokenBalance,
    buyTokens,
};

export default tokenService;
