import targetService from '../services/targetService.js';
import Session from '../models/Session.js';

const createTarget = async (req, res) => {
    try {
        const target = await targetService.createTarget(req.user._id, req.body);
        res.status(201).json(target);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTargets = async (req, res) => {
    try {
        const targets = await targetService.getTargets(req.user._id);

        // Calculate today's progress for each target
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const enrichedTargets = await Promise.all(targets.map(async (target) => {
            const sessionsToday = await Session.find({
                targetId: target._id,
                startTime: { $gte: startOfToday },
                isValid: true
            });
            const todayProgress = sessionsToday.reduce((acc, s) => acc + (s.duration || 0), 0);
            return {
                ...target.toObject(),
                todayProgress
            };
        }));

        res.json(enrichedTargets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTarget = async (req, res) => {
    try {
        await targetService.deleteTarget(req.user._id, req.params.id);
        res.json({ message: 'Target deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markComplete = async (req, res) => {
    try {
        const target = await targetService.updateTargetStatus(req.user._id, req.params.id, 'PENDING_APPROVAL');
        res.json(target);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    createTarget,
    getTargets,
    deleteTarget,
    markComplete
};
