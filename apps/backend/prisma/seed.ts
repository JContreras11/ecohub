import prisma from '../src/lib/prisma.js';
import { slugify } from '../src/lib/slug.js';

/**
 * EcoHub Seeder
 *
 * Showcases the full feature surface:
 *   - On-chain (onChainId set) vs off-chain only projects
 *   - onChainId stored as string — hex / decimal / sha-style hashes all valid
 *   - Stages 0..3 (recruiting, funding, in-progress, completed)
 *   - Bilingual content (ES + EN)
 *   - Tags, IPFS CIDs, multiple wallets
 *   - Contributions with tx hashes & block numbers
 */
async function main() {
  console.log('🌱 Iniciando el seeder de base de datos...');

  // ── Users ───────────────────────────────────────────────────────────────────
  const ecoWarrior = await prisma.user.upsert({
    where: { walletAddress: '0x1234567890123456789012345678901234567890' },
    update: {},
    create: {
      walletAddress: '0x1234567890123456789012345678901234567890',
      displayName: 'EcoWarrior',
      bio: 'Apasionado por la reforestación y la energía solar.',
      twitterHandle: '@ecowarrior',
    },
  });

  const greenInvestor = await prisma.user.upsert({
    where: { walletAddress: '0x0987654321098765432109876543210987654321' },
    update: {},
    create: {
      walletAddress: '0x0987654321098765432109876543210987654321',
      displayName: 'GreenInvestor',
      bio: 'Invirtiendo en el futuro verde del planeta.',
    },
  });

  const reefBuilder = await prisma.user.upsert({
    where: { walletAddress: '0xabcdef0123456789abcdef0123456789abcdef01' },
    update: {},
    create: {
      walletAddress: '0xabcdef0123456789abcdef0123456789abcdef01',
      displayName: 'ReefBuilder',
      bio: 'Marine biologist turning the tide on coral bleaching.',
      twitterHandle: '@reefbuilder',
      githubHandle: 'reefbuilder',
    },
  });

  console.log(
    `✅ Usuarios creados: ${ecoWarrior.displayName}, ${greenInvestor.displayName}, ${reefBuilder.displayName}`,
  );

  // ── Projects ────────────────────────────────────────────────────────────────
  // onChainId is a string — accepts hex ("0x65"), decimal ("101"), and full
  // sha256-style hashes. USDC amounts are base units (6 decimals).
  const ONCHAIN_REFORESTATION = '0x65';                                                                 // hex of 101
  const ONCHAIN_SOLAR         = '102';                                                                  // decimal-string
  const ONCHAIN_OCEAN         = '0x67';                                                                 // hex of 103
  const ONCHAIN_MYCELIUM      = '0x68';                                                                 // hex of 104
  const ONCHAIN_CORAL         = '0x9b1f3a8c4e2d7b6a5f0e1d2c3b4a5968778695a4b3c2d1e0f9e8d7c6b5a4938271'; // sha256-style hash
  // Vertical Urban Forest: off-chain (no onChainId)

  const projectsData = [
    // ── ES — Stage 1 (funding in progress, partially funded) ─────────────────
    {
      onChainId: ONCHAIN_REFORESTATION,
      ownerAddress: ecoWarrior.walletAddress,
      title: 'Reforestación del Amazonas',
      description:
        'Replantar 500 hectáreas de selva tropical con especies nativas para restaurar la biodiversidad del Amazonas.',
      readme:
        '# Reforestación del Amazonas\n\nHitos verificables: viveros de germinación → siembra en zonas deforestadas → monitoreo satelital → certificación de carbono.',
      fundingGoal: '50000000000',
      totalFunded: '15000000000',
      currentStage: 1,
      tags: ['reforestacion', 'amazonas', 'biodiversidad', 'carbono'],
      metadataCid: 'QmTestHashReforestacion123',
      imageCid: 'QmTestImageHashAmazonas123',
      txHash: '0xa1f4e9b22d5e3f1c9d8a7b6c5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f',
    },
    // ── ES — Stage 0 (just created, seeking initial funding) ─────────────────
    {
      onChainId: ONCHAIN_SOLAR,
      ownerAddress: ecoWarrior.walletAddress,
      title: 'Energía Solar Comunitaria en los Andes',
      description:
        'Proveer paneles solares a 50 familias en comunidades aisladas de los Andes peruanos sin acceso a red eléctrica.',
      readme:
        '# Energía Solar Comunitaria\n\nFase 1: estudio energético por hogar. Fase 2: instalación de paneles 400W. Fase 3: capacitación y mantenimiento local.',
      fundingGoal: '10000000000',
      totalFunded: '0',
      currentStage: 0,
      tags: ['solar', 'comunidad', 'andes', 'energia'],
      metadataCid: 'QmTestHashSolar123',
      imageCid: 'QmTestImageHashSolar123',
    },
    // ── ES — Stage 3 (completed, fully funded, withdrawn) ────────────────────
    {
      onChainId: ONCHAIN_OCEAN,
      ownerAddress: greenInvestor.walletAddress,
      title: 'Limpieza de Océanos del Pacífico',
      description:
        'Despliegue de 10 drones acuáticos autónomos para recolectar plástico flotante en el Pacífico ecuatorial.',
      readme:
        '# Limpieza de Océanos — COMPLETADO\n\n12 toneladas de plástico recolectadas y procesadas. Validadores firmaron entrega final.',
      fundingGoal: '200000000000',
      totalFunded: '200000000000',
      currentStage: 3,
      tags: ['oceanos', 'plastico', 'drones', 'pacifico'],
      metadataCid: 'QmTestHashOceanos123',
      imageCid: 'QmTestImageHashOceano123',
      txHash: '0xb2e5f0a13c6d4e2f1a9c8b7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f',
    },
    // ── EN — Stage 2 (in development, halfway funded) ────────────────────────
    {
      onChainId: ONCHAIN_MYCELIUM,
      ownerAddress: greenInvestor.walletAddress,
      title: 'Mycelium Network Nodes',
      description:
        'Open-source soil sensors that map underground fungal networks across the Cascadia bioregion in real time.',
      readme:
        '# Mycelium Network Nodes\n\nPCB v2 manufactured. Firmware OTA updates live. Next milestone: deploy 200 nodes across 5 forests.',
      fundingGoal: '50000000000',
      totalFunded: '28000000000',
      currentStage: 2,
      tags: ['hardware', 'open-source', 'cascadia', 'biodiversity'],
      metadataCid: 'QmTestHashMycelium456',
      imageCid: 'QmTestImageHashMycelium456',
      txHash: '0xc3f6a1b24d7e5f3a2b0d9c8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a',
    },
    // ── EN — Stage 1 (almost fully funded, sha256-style onChainId) ───────────
    {
      onChainId: ONCHAIN_CORAL,
      ownerAddress: reefBuilder.walletAddress,
      title: 'Coral Reef Restoration — Mesoamerican Belt',
      description:
        'Lab-grown coral fragments transplanted across 50 hectares of bleached reef along the Mesoamerican Barrier.',
      readme:
        '# Coral Reef Restoration\n\nPartnered with 3 local dive cooperatives. Per-fragment genetic tracking via on-chain attestations.',
      fundingGoal: '75000000000',
      totalFunded: '68000000000',
      currentStage: 1,
      tags: ['ocean', 'coral', 'biodiversity', 'caribbean'],
      metadataCid: 'QmTestHashCoral789',
      imageCid: 'QmTestImageHashCoral789',
      txHash: '0xd4a7b2c35e8f6a4b3c1e0d9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b',
    },
    // ── EN — Stage 0, off-chain only (no onChainId yet) ──────────────────────
    {
      ownerAddress: reefBuilder.walletAddress,
      title: 'Vertical Urban Forest — Lisbon Pilot',
      description:
        'Modular vertical reforestation on the facades of 12 social housing blocks in Lisbon. Pre-launch, off-chain stage.',
      readme:
        '# Vertical Urban Forest — DRAFT\n\nPermits secured. Awaiting community DAO vote before on-chain deployment.',
      fundingGoal: '120000000000',
      totalFunded: '0',
      currentStage: 0,
      tags: ['urban', 'reforestation', 'lisbon', 'architecture'],
      metadataCid: 'QmTestHashVerticalForest999',
      imageCid: 'QmTestImageHashVerticalForest999',
    },
  ];

  type SeededProject = { id: string; slug: string; title: string; onChainId: string | null };
  const createdProjects: SeededProject[] = [];
  for (const p of projectsData) {
    const slug = slugify(p.title);
    const where = p.onChainId ? { onChainId: p.onChainId } : { slug };
    const project = await prisma.project.upsert({
      where,
      update: { slug },
      create: { ...p, slug },
    });
    createdProjects.push({
      id: project.id,
      slug: project.slug,
      title: project.title,
      onChainId: project.onChainId,
    });
    console.log(
      `✅ Proyecto creado: ${project.title} (/${project.slug}) [stage ${project.currentStage}] onChainId=${project.onChainId ?? 'off-chain'}`,
    );
  }

  // ── Contributions (showcase funded projects) ────────────────────────────────
  const reforestation = createdProjects.find((p) => p.onChainId === ONCHAIN_REFORESTATION)!;
  const mycelium = createdProjects.find((p) => p.onChainId === ONCHAIN_MYCELIUM)!;
  const coral = createdProjects.find((p) => p.onChainId === ONCHAIN_CORAL)!;
  const oceanCleanup = createdProjects.find((p) => p.onChainId === ONCHAIN_OCEAN)!;

  const contributionRows = [
    {
      projectId: reforestation.id,
      contributorAddress: greenInvestor.walletAddress,
      amount: '5000000000',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      blockNumber: 19_482_103,
    },
    {
      projectId: reforestation.id,
      contributorAddress: reefBuilder.walletAddress,
      amount: '10000000000',
      txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      blockNumber: 19_482_577,
    },
    {
      projectId: mycelium.id,
      contributorAddress: ecoWarrior.walletAddress,
      amount: '8000000000',
      txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
      blockNumber: 19_490_812,
    },
    {
      projectId: mycelium.id,
      contributorAddress: reefBuilder.walletAddress,
      amount: '20000000000',
      txHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
      blockNumber: 19_491_044,
    },
    {
      projectId: coral.id,
      contributorAddress: ecoWarrior.walletAddress,
      amount: '18000000000',
      txHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      blockNumber: 19_495_321,
    },
    {
      projectId: coral.id,
      contributorAddress: greenInvestor.walletAddress,
      amount: '50000000000',
      txHash: '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
      blockNumber: 19_495_889,
    },
    {
      projectId: oceanCleanup.id,
      contributorAddress: ecoWarrior.walletAddress,
      amount: '100000000000',
      txHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
      blockNumber: 19_400_111,
    },
    {
      projectId: oceanCleanup.id,
      contributorAddress: reefBuilder.walletAddress,
      amount: '100000000000',
      txHash: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
      blockNumber: 19_401_443,
    },
  ];

  for (const row of contributionRows) {
    const existing = await prisma.contribution.findFirst({
      where: { projectId: row.projectId, txHash: row.txHash },
    });
    if (!existing) {
      await prisma.contribution.create({ data: row });
    }
  }

  console.log(`✅ Contribuciones creadas: ${contributionRows.length}`);
  console.log('🎉 Seeder completado satisfactoriamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
