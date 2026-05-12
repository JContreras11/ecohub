-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "on_chain_id" TEXT,
    "owner_address" TEXT NOT NULL,
    "metadata_cid" TEXT NOT NULL,
    "image_cid" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "readme" TEXT,
    "funding_goal" TEXT NOT NULL,
    "total_funded" TEXT NOT NULL DEFAULT '0',
    "current_stage" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "tx_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contributions" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "contributor_address" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "tx_hash" TEXT,
    "block_number" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,
    "twitter_handle" TEXT,
    "github_handle" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "projects_on_chain_id_key" ON "projects"("on_chain_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
