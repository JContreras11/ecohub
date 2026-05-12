-- CreateEnum
CREATE TYPE "asset_kind" AS ENUM ('IMAGE', 'VIDEO', 'EMBED');

-- CreateTable
CREATE TABLE "project_assets" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "kind" "asset_kind" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "caption" TEXT,
    "description" TEXT,
    "captured_at" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_assets_project_id_stage_sort_order_idx" ON "project_assets"("project_id", "stage", "sort_order");

-- AddForeignKey
ALTER TABLE "project_assets" ADD CONSTRAINT "project_assets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
