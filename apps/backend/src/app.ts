import express from "express";
import type { Express } from "express";
import cors from "cors";
import projectRoutes from "./routes/projects.routes.js";
import userRoutes from "./routes/users.routes.js";

const app: Express = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: frontendUrl,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "ecohub-backend" });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Error handler ────────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Error]", err.message);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

export default app;
