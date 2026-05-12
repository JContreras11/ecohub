import { Router } from "express";
import type { Router as ExpressRouterType } from "express";
import { getUserProfile, upsertUserProfile } from "../controllers/users.controller.js";

const router: ExpressRouterType = Router();

router.get("/:walletAddress", getUserProfile);
router.put("/:walletAddress", upsertUserProfile);

export default router;
