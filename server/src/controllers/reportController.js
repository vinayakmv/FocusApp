import asyncHandler from 'express-async-handler';
import Session from '../models/Session.js';
import Target from '../models/Target.js';
import mongoose from 'mongoose';

// @desc    Get user productivity reports
// @route   GET /api/reports/user
// @access  Private
const getUserReports = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Weekly Focus Hours (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklySessions = await Session.find({
        userId,
        startTime: { $gte: sevenDaysAgo },
        isValid: true
    });

    const dailyData = Array(7).fill(0);
    weeklySessions.forEach(session => {
        const day = new Date(session.startTime).getDay(); // 0-6
        dailyData[day] += (session.duration || 0);
    });

    // 2. Target Success Rate
    const totalTargets = await Target.countDocuments({ userId });
    const completedTargets = await Target.countDocuments({ userId, status: 'COMPLETED' });
    const failedTargets = await Target.countDocuments({ userId, status: 'FAILED' });
    const activeTargets = await Target.countDocuments({ userId, status: 'ACTIVE' });

    // 3. Effort Distribution
    const effortStats = await Session.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: "$effortRating", count: { $sum: 1 } } }
    ]);

    // 4. Distraction Analysis (if available) - Simple count of distracted sessions
    // const distractedSessions = await Session.countDocuments({ userId, effortRating: 'DISTRACTED' }); 

    res.json({
        weeklyFocus: dailyData, // Array of minutes [Sun, Mon, ...]
        targets: {
            total: totalTargets,
            completed: completedTargets,
            failed: failedTargets,
            active: activeTargets
        },
        effort: effortStats // Array of { _id: 'EASY', count: 5 }
    });
});

export { getUserReports };
