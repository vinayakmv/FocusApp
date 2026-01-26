import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import FamilyLink from '../models/FamilyLink.js';
import Target from '../models/Target.js';
import generateToken from '../utils/jwt.js'; // Assuming utility exists or just standard JWT

// @desc    Invite a child
// @route   POST /api/family/invite
// @access  Private
const inviteChild = asyncHandler(async (req, res) => {
    const { childEmail } = req.body;
    const parentId = req.user._id;

    if (!childEmail) {
        res.status(400);
        throw new Error('Child email is required');
    }

    if (childEmail === req.user.email) {
        res.status(400);
        throw new Error('You cannot invite yourself');
    }

    // Check if link already exists
    const existingLink = await FamilyLink.findOne({ parentId, childEmail });
    if (existingLink) {
        res.status(400);
        throw new Error('Invite already sent to this email');
    }

    // Generate 6-digit code
    const inviteCode = Math.floor(100000 + Math.random() * 900000).toString();

    const link = await FamilyLink.create({
        parentId,
        childEmail,
        inviteCode,
        permissions: ['viewReports', 'assignTargets', 'rewardTokens']
    });

    // In a real app, we would send an email here.
    // For now, return the code to the parent to share manually.
    res.status(201).json({
        message: 'Invite created',
        inviteCode: link.inviteCode,
        childEmail: link.childEmail
    });
});

// @desc    Accept invite
// @route   POST /api/family/accept
// @access  Private (Child)
const acceptInvite = asyncHandler(async (req, res) => {
    const { inviteCode } = req.body;
    const childId = req.user._id;
    const childEmail = req.user.email;

    const link = await FamilyLink.findOne({ inviteCode, status: 'PENDING' });

    if (!link) {
        res.status(404);
        throw new Error('Invalid or expired invite code');
    }

    if (link.parentId.toString() === childId.toString()) {
        res.status(400);
        throw new Error('You cannot link to your own account');
    }

    // Optional: Verify email matches if strict
    // if (link.childEmail !== childEmail) ...

    link.childId = childId;
    link.status = 'ACTIVE';
    await link.save();

    // Link parent in User model for quick access (Module 8 logic)
    const user = await User.findById(childId);
    user.parentId = link.parentId;
    user.ageGroup = 'CHILD'; // Auto-set to child on accept? Or keep existing.
    await user.save();

    res.json({ message: 'Linked to parent successfully' });
});

// @desc    Get linked children
// @route   GET /api/family/children
// @access  Private (Parent)
const getChildren = asyncHandler(async (req, res) => {
    const links = await FamilyLink.find({ parentId: req.user._id, status: 'ACTIVE' })
        .populate('childId', 'name email walletBalance tokenBalance');

    res.json(links.map(link => link.childId));
});

// @desc    Assign target to child
// @route   POST /api/family/assign-target
// @access  Private (Parent)
const assignTarget = asyncHandler(async (req, res) => {
    const { childId, name, goal, stakeAmount, expiryDate } = req.body;

    const link = await FamilyLink.findOne({
        parentId: req.user._id,
        childId,
        status: 'ACTIVE'
    });

    if (!link) {
        res.status(403);
        throw new Error('Not authorized to assign targets to this user');
    }

    const target = await Target.create({
        userId: childId,
        name: `(Assigned) ${name}`,
        goal,
        stakeAmount: stakeAmount || 0,
        stakeType: 'TOKEN', // Parents usually reward/stake tokens, real money complex
        expiryDate,
        status: 'ACTIVE'
    });

    res.status(201).json(target);
});

export { inviteChild, acceptInvite, getChildren, assignTarget };
