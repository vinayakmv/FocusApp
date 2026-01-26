import mongoose from 'mongoose';

const familyLinkSchema = mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null if pending invite
    childEmail: { type: String, required: true }, // To send invite
    inviteCode: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'ACTIVE', 'REJECTED'], default: 'PENDING' },
    permissions: [{ type: String, enum: ['viewReports', 'assignTargets', 'rewardTokens'] }],
}, { timestamps: true });

const FamilyLink = mongoose.model('FamilyLink', familyLinkSchema);
export default FamilyLink;
