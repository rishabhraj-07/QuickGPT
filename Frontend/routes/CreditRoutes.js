import exprss from "express";
import { purchasePlan, getPlans } from "../controllers/CreditController.js";
import { authenticateUser } from "../middleware/AuthMiddleware.js";

const creditRouter = exprss.Router();

creditRouter.get("/plans", getPlans);
creditRouter.post("/purchase", authenticateUser, purchasePlan);

export default creditRouter;
