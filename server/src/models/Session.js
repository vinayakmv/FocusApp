import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Target' },
    duration: { type: Number, required: true }, // in minutes
    startTime: { type: Date, required: true },
    validUntil: { type: Date },
    isValid: { type: Boolean, default: true },
    distractionReason: { type: String }, // Module 4
    effortRating: { type: String, enum: ['EASY', 'NORMAL', 'HARD', 'DISTRACTED'] }, // Module 5
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
