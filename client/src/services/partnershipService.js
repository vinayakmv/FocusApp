import api from './api';

const getRewards = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.get('/partnerships', config);
    return response.data;
};

const redeemReward = async (rewardId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.post('/partnerships/redeem', { rewardId }, config);
    return response.data;
};

const getMyRedeemed = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.get('/partnerships/redeemed', config);
    return response.data;
};

const partnershipService = {
    getRewards,
    getMyRedeemed,
    redeemReward,
};

export default partnershipService;
