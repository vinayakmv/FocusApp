import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 0 },
    tokenBalance: { type: Number, default: 0 },
    ageGroup: { type: String, enum: ['CHILD', 'TEEN', 'ADULT'], default: 'ADULT' }, // Module 8
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Quick ref for Child
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
