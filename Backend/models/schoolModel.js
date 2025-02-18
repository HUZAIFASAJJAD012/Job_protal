import mongoose from "mongoose";
import bcrypt from "bcrypt"; // To hash passwords

const SchoolSchema = new mongoose.Schema({
    schoolName: {type: String, required: true},
    country: {type: String, required: true},
    area: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    role: {type: String, required: true},
    password: {type: String, required: true},
    fee: {type: Number, default: 399},
    isHire: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true});

// Pre-save hook to hash password before saving
SchoolSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const School = mongoose.model('School', SchoolSchema);

export {School};
