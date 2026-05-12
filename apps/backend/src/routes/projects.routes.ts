import { Router } from "express";
import type { Router as ExpressRouterType } from "express";
import { upload } from "../middleware/upload.middleware.js";
import {
  uploadProject,
  listProjects,
  getProject,
  syncProject,
} from "../controllers/projects.controller.js";

const router: ExpressRouterType = Router();

// POST /api/projects/upload — Upload metadata + image to IPFS, cache in DB
router.post("/upload", upload.single("image"), uploadProject);

// GET /api/projects — List all projects (paginated)
router.get("/", listProjects);

// GET /api/projects/:id — Get a single project
router.get("/:id", getProject);

// POST /api/projects/:id/sync — Sync on-chain data into DB
router.post("/:id/sync", syncProject);

export default router;
