import api from './api';

const inviteChild = async (childEmail, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.post('/family/invite', { childEmail }, config);
    return response.data;
};

const acceptInvite = async (inviteCode, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.post('/family/accept', { inviteCode }, config);
    return response.data;
};

const getChildren = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.get('/family/children', config);
    return response.data;
};

const assignTarget = async (data, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.post('/family/assign-target', data, config);
    return response.data;
};

const familyService = { inviteChild, acceptInvite, getChildren, assignTarget };
export default familyService;
