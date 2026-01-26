import api from './api';

const startSession = async (targetId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.post('/sessions/start', { targetId }, config);
    return response.data;
};

const endSession = async (data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.post('/sessions/end', data, config);
    return response.data;
};

const sessionService = {
    startSession,
    endSession,
};

export default sessionService;
