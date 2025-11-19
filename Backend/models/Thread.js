import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: "String",
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: "String",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ThreadSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    messages: [MessageSchema],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Ensure a user cannot have duplicate threadIds (scoped uniqueness)
ThreadSchema.index({ user: 1, threadId: 1 }, { unique: true });

export default mongoose.model("Thread", ThreadSchema);
