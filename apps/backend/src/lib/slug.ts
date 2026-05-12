import prisma from "./prisma.js";

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  const existing = await prisma.project.findUnique({ where: { slug } });
  return existing === null;
}
