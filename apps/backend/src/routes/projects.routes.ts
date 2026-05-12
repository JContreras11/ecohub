import { Router } from "express";
import type { Router as ExpressRouterType } from "express";
import { upload } from "../middleware/upload.middleware.js";
import {
  uploadProject,
  listProjects,
  getProject,
  syncProject,
  checkSlug,
} from "../controllers/projects.controller.js";

const router: ExpressRouterType = Router();

// POST /api/projects/upload — Upload metadata + image to IPFS, cache in DB
router.post("/upload", upload.single("image"), uploadProject);

// GET /api/projects/check-slug — Async slug availability probe
router.get("/check-slug", checkSlug);

// GET /api/projects — List all projects (paginated)
router.get("/", listProjects);

// GET /api/projects/:slug — Get a single project by slug
router.get("/:slug", getProject);

// POST /api/projects/:slug/sync — Sync on-chain data into DB
router.post("/:slug/sync", syncProject);

export default router;
