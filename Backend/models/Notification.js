import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ['pending', 'approved', 'selected'], default: 'pending' },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null }, // optional
    message: { type: String, default: '' }, // optional custom message
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
