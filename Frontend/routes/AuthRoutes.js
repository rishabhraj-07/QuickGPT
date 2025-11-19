import express from "express";
import { register, login } from "../controllers/AuthController.js";
import { authenticateUser } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/verify", authenticateUser, (req, res) => {
  res.status(200).json({ message: "User is authenticated", user: req.user });
});
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
});

export default router;
