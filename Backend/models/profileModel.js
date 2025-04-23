import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User model
            ref: 'User', // Name of the user model (assuming it is named 'User')
            required: true,
        },
        location: {
            type: String,
            trim: true,
            default: null, // Set to null initially
        },
        bio: {
            type: String,
            trim: true,
            default: null, // Set to null initially
        },
        skills: {
            type: [String], // Array of strings to list multiple skills
            default: [], // Empty array initially
        },
        education: [
            {
                degree: { type: String, trim: true, default: null },
                institution: { type: String, trim: true, default: null },
                year: { type: Number, default: null },
            },
        ],
        workHistory: [
            {
                position: { type: String, trim: true, default: null },
                company: { type: String, trim: true, default: null },
                startDate: { type: Date, default: null },
                endDate: { type: Date, default: null }, // Nullable for ongoing work
            },
        ],
        availability: {
            availableDays: {
                type: [String], // Array of days, e.g., ["Monday", "Wednesday"]
                default: [], // Empty array initially
            },
        },
        profilePicture: {
            type: String, // URL of the uploaded profile picture
            trim: true,
            default: null, // Set to null initially
        },
    },
    {
        timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
    }
);

export default mongoose.model('Profile', profileSchema);
