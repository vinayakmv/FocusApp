import sessionService from '../services/sessionService.js';

const startSession = async (req, res) => {
    try {
        const { targetId } = req.body;
        const session = await sessionService.startSession(req.user._id, targetId);
        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const endSession = async (req, res) => {
    try {
        const { sessionId, duration } = req.body;
        const session = await sessionService.endSession(sessionId, duration);
        res.json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default {
    startSession,
    endSession,
};
