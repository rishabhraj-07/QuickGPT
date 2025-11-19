import User from "../models/User.js";

export const checkCredits = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (user.credits <= 0) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient credits." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
