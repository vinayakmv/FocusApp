import mongoose from 'mongoose';

const appBucketsSchema = mongoose.Schema({
    charityBucket: { type: Number, default: 0 },
    revenueBucket: { type: Number, default: 0 },
}, { timestamps: true });

const AppBuckets = mongoose.model('AppBuckets', appBucketsSchema);
export default AppBuckets;
