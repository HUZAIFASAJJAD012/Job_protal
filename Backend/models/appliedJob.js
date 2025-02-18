import mongoose from 'mongoose';

const jobAppliedSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User model
            ref: 'User', // Name of the user model
            required: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the Job model
            ref: 'Job', // Name of the job model
            required: true,
        },
        appliedDate: {
            type: Date,
            default: Date.now, // The date when the user applied
        },
    },
    {
        timestamps: true, // Automatically creates createdAt and updatedAt fields
    }
);

export default mongoose.model('JobApplied', jobAppliedSchema);
