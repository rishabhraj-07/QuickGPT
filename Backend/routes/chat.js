import express from "express";
import Thread from "../models/Thread.js";
import getGroqAPIResponse from "../utils/groqAI.js";
import { authenticateUser } from "../middleware/AuthMiddleware.js";
import { checkCredits } from "../middleware/CheckCredits.js";
import User from "../models/User.js";

const router = express.Router();

//Get all threads
router.get("/thread", authenticateUser, async (req, res) => {
  try {
    const threads = await Thread.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select("threadId title updatedAt createdAt");
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

//Get thread by ID
router.get("/thread/:threadId", authenticateUser, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId, user: req.user._id });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

//delete thread by ID
router.delete("/thread/:threadId", authenticateUser, async (req, res) => {
  const { threadId } = req.params;

  try {
    const deleteThread = await Thread.findOneAndDelete({
      threadId,
      user: req.user._id,
    });
    if (!deleteThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

//post chat messages
router.post("/chat", authenticateUser, checkCredits, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await User.findById(req.user._id);

    let thread = await Thread.findOne({ threadId, user: req.user._id });

    if (!thread) {
      // create new thread for this user
      thread = new Thread({
        threadId,
        user: req.user._id,
        title: message.slice(0, 20),
        messages: [{ role: "user", content: message }],
      });
    } else {
      // append to existing thread
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGroqAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();

    // Deduct credits for the user
    user.credits -= 1;
    await user.save();

    res.json({ reply: assistantReply, credits: user.credits });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

export default router;
