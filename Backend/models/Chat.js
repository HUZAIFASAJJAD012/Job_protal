import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  members: [
    {
      memberId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of user or school
      memberType: { type: String, enum: ["User", "School"], required: true }, // To distinguish entity type
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", ChatSchema);
