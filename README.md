# EcoHub Monorepo

## Directory Structure
```
ecohub/
├── .agents/                  # AI context documents
├── apps/
│   ├── frontend/             # Next.js 16 + TailwindCSS + wagmi
│   └── backend/              # Express.js + Prisma + Pinata
├── packages/
│   └── contracts/            # Hardhat + Solidity
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json              # npm workspaces root
```

## Quick Start

### Prerequisites
- Node.js 24 LTS (recommended)
- Docker & Docker Compose v2
- MetaMask or any EVM wallet

### Local Development (Docker)
```bash
cp .env.example .env
# Edit .env with your secrets

docker compose up --build -d

# First time: run DB migrations
docker compose exec backend npm run migrate
```

### Local Development (Native)
```bash
pnpm install

# Terminal 1: Start backend
pnpm run dev:backend

# Terminal 2: Start frontend
pnpm run dev:frontend
```

### Smart Contracts
```bash
# Compile
pnpm run contracts:compile

# Deploy to Sepolia testnet
pnpm run contracts:deploy:sepolia

# Deploy to Polygon Amoy testnet
pnpm run contracts:deploy:amoy
```

## Environment Variables
Create a local `.env` file (and avoid committing it) with your secrets. See `/.agents/04-devops.md` for full documentation.
