import Session from '../models/Session.js';
import Target from '../models/Target.js';

const startSession = async (userId, targetId) => {
    // Validate target exists and is active
    if (targetId) {
        const target = await Target.findById(targetId);
        if (!target || target.status !== 'ACTIVE') throw new Error('Invalid target');
    }

    const session = await Session.create({
        userId,
        targetId,
        duration: 0, // Pending
        startTime: new Date(),
        isValid: false, // Valid only after completion
    });

    return session;
};

const endSession = async (sessionId, durationMinutes) => {
    const session = await Session.findById(sessionId);
    if (!session) throw new Error('Session not found');

    session.endTime = new Date();
    session.duration = durationMinutes;

    // Validation: Min 10 mins
    if (durationMinutes >= 1) { // Testing: 1 min. Production: 10 mins.
        session.isValid = true;

        // Update Target Progress
        if (session.targetId) {
            const target = await Target.findById(session.targetId);
            if (target) {
                target.progress += durationMinutes;
                await target.save();
            }
        }
    } else {
        session.isValid = false;
    }

    await session.save();
    return session;
};

export default {
    startSession,
    endSession,
};
