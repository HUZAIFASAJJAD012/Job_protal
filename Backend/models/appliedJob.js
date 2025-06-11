import mongoose from "mongoose";

const appliedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    status: {
      type: String,
      enum: ['applied', 'selected', 'rejected'],
      default: 'applied'
    },
    selectedAt: {
      type: Date
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate applications
appliedJobSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model("JobApplied", appliedJobSchema);
