import api from './api';

const createTarget = async (targetData, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.post('/targets', targetData, config);
    return response.data;
};

const getTargets = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.get('/targets', config);
    return response.data;
};

const targetService = {
    createTarget,
    getTargets,
};

export default targetService;
