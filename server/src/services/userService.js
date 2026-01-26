import User from '../models/User.js';

const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    return user;
};

const updateUserProfile = async (userId, data) => {
    const user = await User.findByIdAndUpdate(userId, data, { new: true }).select('-password');
    return user;
};

export default {
    getUserProfile,
    updateUserProfile,
};
