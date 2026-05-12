import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import {
  uploadFileToPinata,
  uploadMetadataToPinata,
  buildGatewayUrlSync,
} from "../services/ipfs.service.js";
import type { ProjectMetadata } from "../services/ipfs.service.js";

const WalletAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

// ── Validation schemas ────────────────────────────────────────────────────────
const CreateProjectSchema = z.object({
  title:         z.string().min(3).max(100),
  description:   z.string().min(10).max(500),
  readme:        z.string().min(10),
  tags:          z.string().transform((val) => JSON.parse(val)).pipe(z.array(z.string())),
  authorAddress: WalletAddressSchema,
  fundingGoal:   z.string().regex(/^\d+$/, "Must be a string integer (USDC base units)"),
});

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/projects/upload
 * 
 * Uploads project image + metadata to IPFS via Pinata.
 * Returns: { imageCid, metadataCid, gatewayUrl }
 * 
 * Expects: multipart/form-data with:
 *   - image (file)
 *   - title, description, readme, tags (JSON string), authorAddress, fundingGoal
 */
export async function uploadProject(req: Request, res: Response) {
  try {
    const parsed = CreateProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", issues: parsed.error.issues });
    }

    const { title, description, readme, tags, authorAddress, fundingGoal } = parsed.data;

    let imageCid: string | undefined;
    if (req.file) {
      imageCid = await uploadFileToPinata(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );
    }

    const metadata: ProjectMetadata = {
      title,
      description,
      readme,
      tags,
      authorAddress,
      imageCid,
      version:   "1.0.0",
      createdAt: new Date().toISOString(),
    };

    const metadataCid = await uploadMetadataToPinata(metadata, title);

    const project = await prisma.project.create({
      data: {
        ownerAddress: authorAddress,
        metadataCid,
        imageCid:     imageCid || null,
        title,
        description,
        readme,
        tags,
        fundingGoal,
        active:       true,
      },
    });

    return res.status(201).json({
      success:     true,
      projectId:   project.id,
      metadataCid,
      imageCid:    imageCid || null,
      gatewayUrl:  buildGatewayUrlSync(metadataCid),
      imageUrl:    imageCid ? buildGatewayUrlSync(imageCid) : null,
    });
  } catch (err: any) {
    console.error("[projects/upload] Error:", err.message);
    return res.status(500).json({ error: "Failed to upload project", details: err.message });
  }
}

/**
 * GET /api/projects
 * Returns a paginated list of projects from the DB cache.
 */
export async function listProjects(req: Request, res: Response) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const rawLimit = parseInt(req.query.limit as string, 10) || 12;
    const limit = Math.min(100, Math.max(1, rawLimit));
    const skip = (page - 1) * limit;
    const tag = typeof req.query.tag === "string" ? req.query.tag : undefined;
    const ownerAddress = typeof req.query.ownerAddress === "string" ? req.query.ownerAddress.trim() : undefined;
    const onChainOnly = req.query.onChainOnly === "true";

    if (ownerAddress) {
      const parsedAddress = WalletAddressSchema.safeParse(ownerAddress);
      if (!parsedAddress.success) {
        return res.status(400).json({ error: "Invalid ownerAddress filter" });
      }
    }

    const where: Record<string, unknown> = {};

    if (tag) {
      where.tags = { has: tag };
    }

    if (ownerAddress) {
      where.ownerAddress = { equals: ownerAddress, mode: "insensitive" };
    }

    if (onChainOnly) {
      where.onChainId = { not: null };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    return res.json({
      data: projects,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err: any) {
    console.error("[projects/list] Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch projects" });
  }
}

/**
 * GET /api/projects/:id
 * Returns a single project by its DB ID.
 */
export async function getProject(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid project ID" });

    const project = await prisma.project.findUnique({
      where: { id },
      include: { contributions: { orderBy: { createdAt: "desc" }, take: 20 } },
    });

    if (!project) return res.status(404).json({ error: "Project not found" });

    return res.json(project);
  } catch (err: any) {
    console.error("[projects/get] Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch project" });
  }
}

/**
 * POST /api/projects/:id/sync
 * Syncs on-chain project data (totalFunded, currentStage) into the local DB.
 * Called after a fundProject or withdrawFunds transaction is confirmed.
 */
export async function syncProject(req: Request, res: Response) {
  try {
    const { onChainId, totalFunded, currentStage, txHash } = req.body;

    if (!onChainId) return res.status(400).json({ error: "onChainId required" });

    const updated = await prisma.project.updateMany({
      where:  { onChainId: parseInt(onChainId, 10) },
      data: {
        totalFunded:  totalFunded?.toString() || undefined,
        currentStage: currentStage !== undefined ? parseInt(currentStage, 10) : undefined,
        txHash:       txHash || undefined,
        onChainId:    parseInt(onChainId, 10),
      },
    });

    return res.json({ success: true, updated: updated.count });
  } catch (err: any) {
    console.error("[projects/sync] Error:", err.message);
    return res.status(500).json({ error: "Failed to sync project" });
  }
}
