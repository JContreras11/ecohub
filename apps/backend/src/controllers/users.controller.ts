import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";

const WalletAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

const nullableTrimmedText = () =>
  z.union([z.string(), z.null(), z.undefined()]).transform((value) => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  });

const UpdateProfileSchema = z.object({
  displayName: nullableTrimmedText().refine(
    (value) => value === null || (value.length >= 2 && value.length <= 60),
    "Display name must be between 2 and 60 characters",
  ),
  avatarUrl: nullableTrimmedText().refine(
    (value) => value === null || /^https?:\/\/\S+$/i.test(value),
    "Avatar URL must be a valid http(s) URL",
  ),
  bio: nullableTrimmedText().refine(
    (value) => value === null || value.length <= 280,
    "Bio must be 280 characters or fewer",
  ),
  twitterHandle: nullableTrimmedText().refine(
    (value) => value === null || value.length <= 40,
    "Twitter handle must be 40 characters or fewer",
  ).optional(),
  githubHandle: nullableTrimmedText().refine(
    (value) => value === null || value.length <= 40,
    "GitHub handle must be 40 characters or fewer",
  ).optional(),
});

function normalizeWalletAddress(walletAddress: string): string {
  return walletAddress.toLowerCase();
}

function serializeProfile(user: {
  walletAddress: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  twitterHandle: string | null;
  githubHandle: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
} | null, walletAddress: string) {
  return {
    exists: Boolean(user),
    walletAddress: user?.walletAddress || walletAddress,
    displayName: user?.displayName || null,
    avatarUrl: user?.avatarUrl || null,
    bio: user?.bio || null,
    twitterHandle: user?.twitterHandle || null,
    githubHandle: user?.githubHandle || null,
    createdAt: user?.createdAt?.toISOString() || null,
    updatedAt: user?.updatedAt?.toISOString() || null,
  };
}

/**
 * GET /api/users/:walletAddress
 * Returns public profile data for a wallet.
 */
export async function getUserProfile(req: Request, res: Response) {
  try {
    const parsedAddress = WalletAddressSchema.safeParse(req.params.walletAddress);
    if (!parsedAddress.success) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    const walletAddress = normalizeWalletAddress(parsedAddress.data);
    const user = await prisma.user.findFirst({
      where: {
        walletAddress: {
          equals: walletAddress,
          mode: "insensitive",
        },
      },
    });

    return res.json(serializeProfile(user, walletAddress));
  } catch (err: any) {
    console.error("[users/get] Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch user profile" });
  }
}

/**
 * PUT /api/users/:walletAddress
 * Upserts public profile fields for a wallet.
 */
export async function upsertUserProfile(req: Request, res: Response) {
  try {
    const parsedAddress = WalletAddressSchema.safeParse(req.params.walletAddress);
    if (!parsedAddress.success) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    const parsedBody = UpdateProfileSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: "Validation failed", issues: parsedBody.error.issues });
    }

    const walletAddress = normalizeWalletAddress(parsedAddress.data);
    const { displayName, avatarUrl, bio, twitterHandle, githubHandle } = parsedBody.data;

    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: {
        displayName,
        avatarUrl,
        bio,
        twitterHandle: twitterHandle ?? undefined,
        githubHandle: githubHandle ?? undefined,
      },
      create: {
        walletAddress,
        displayName,
        avatarUrl,
        bio,
        twitterHandle: twitterHandle ?? null,
        githubHandle: githubHandle ?? null,
      },
    });

    return res.json(serializeProfile(user, walletAddress));
  } catch (err: any) {
    console.error("[users/upsert] Error:", err.message);
    return res.status(500).json({ error: "Failed to save user profile" });
  }
}
