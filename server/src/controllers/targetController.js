import targetService from '../services/targetService.js';

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
        res.json(targets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    createTarget,
    getTargets,
};
