import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ProjectDetailClient from "@/components/project-detail/ProjectDetailClient";
import type { BackendProject } from "@/components/project-detail/types";
import { brandTitle } from "@/lib/brand";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:4000";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProject(slug: string): Promise<BackendProject> {
  const response = await fetch(`${BACKEND_URL}/api/projects/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to load project ${slug}`);
  }

  return response.json();
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("ProjectDetail");

  if (!slug) {
    return {
      title: brandTitle(t("meta_title_not_found")),
    };
  }

  try {
    const project = await getProject(slug);
    return {
      title: brandTitle(project.title),
      description: project.description,
    };
  } catch {
    return {
      title: brandTitle(t("meta_title_project")),
    };
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const project = await getProject(slug);

  return <ProjectDetailClient project={project} />;
}
