import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Refers to the "user" model in your system
        required: true,
      },
    ],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Refers to the "user" model in your system
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Messages", MessageSchema);
