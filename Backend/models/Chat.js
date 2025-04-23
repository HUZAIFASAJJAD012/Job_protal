import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }, { type: mongoose.Schema.Types.ObjectId, ref: "School" }], // Supports Users & Schools
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", ChatSchema);
