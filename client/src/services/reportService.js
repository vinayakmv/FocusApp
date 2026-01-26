import api from './api';

const getUserReports = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await api.get('/reports/user', config);
    return response.data;
};

const reportService = { getUserReports };
export default reportService;
