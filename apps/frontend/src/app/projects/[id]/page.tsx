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
    id: string;
  }>;
}

async function getProject(id: number): Promise<BackendProject> {
  const response = await fetch(`${BACKEND_URL}/api/projects/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to load project ${id}`);
  }

  return response.json();
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const projectId = Number.parseInt(id, 10);
  const t = await getTranslations("ProjectDetail");

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return {
      title: brandTitle(t("meta_title_not_found")),
    };
  }

  try {
    const project = await getProject(projectId);
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
  const { id } = await params;
  const projectId = Number.parseInt(id, 10);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    notFound();
  }

  const project = await getProject(projectId);

  return <ProjectDetailClient project={project} />;
}
