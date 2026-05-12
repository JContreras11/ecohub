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

  const solarOperator = await prisma.user.upsert({
    where: { walletAddress: '0xa17e0c4f5b6d2e3a1f8b9c0d1e2f3a4b5c6d7e88' },
    update: {},
    create: {
      walletAddress: '0xa17e0c4f5b6d2e3a1f8b9c0d1e2f3a4b5c6d7e88',
      displayName: 'AntioquiaSolarCoop',
      bio: 'Cooperativa de operación de techos solares en Rionegro y Oriente antioqueño.',
      twitterHandle: '@AntioquiaSolar',
      githubHandle: 'antioquia-solar',
    },
  });

  console.log(
    `✅ Usuarios creados: ${ecoWarrior.displayName}, ${greenInvestor.displayName}, ${reefBuilder.displayName}, ${solarOperator.displayName}`,
  );

  // ── Projects ────────────────────────────────────────────────────────────────
  // onChainId is a string — accepts hex ("0x65"), decimal ("101"), and full
  // sha256-style hashes. USDC amounts are base units (6 decimals).
  const ONCHAIN_REFORESTATION = '0x65';                                                                 // hex of 101
  const ONCHAIN_SOLAR         = '102';                                                                  // decimal-string
  const ONCHAIN_OCEAN         = '0x67';                                                                 // hex of 103
  const ONCHAIN_MYCELIUM      = '0x68';                                                                 // hex of 104
  const ONCHAIN_CORAL         = '0x9b1f3a8c4e2d7b6a5f0e1d2c3b4a5968778695a4b3c2d1e0f9e8d7c6b5a4938271'; // sha256-style hash
  const ONCHAIN_ANTIOQUIA     = '0x6a';                                                                 // hex of 106
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
    // ── ES — Stage 3 (advanced, fully funded, rich asset gallery) ────────────
    {
      onChainId: ONCHAIN_ANTIOQUIA,
      ownerAddress: solarOperator.walletAddress,
      title: 'Techo Solar Rionegro — Antioquia',
      description:
        'Segundo techo solar más grande de Colombia: 8,420 paneles fotovoltaicos sobre 2.1 hectáreas de cubierta industrial en Rionegro, Antioquia. Genera 4.1 GWh/año para producción local de cacao y cubre 78% de la demanda eléctrica de la planta.',
      readme:
        '# Techo Solar Rionegro — Antioquia\n\n## Resumen\n\nProyecto co-financiado entre Antioquia Solar Coop, la Alcaldía de Rionegro y backers de EcoHub. 2.1 ha de cubierta industrial en el corredor Rionegro–Marinilla convertidas en planta fotovoltaica.\n\n## Métricas verificadas on-chain\n\n- **Paneles instalados:** 8,420 (monocristalinos 550W bifaciales)\n- **Capacidad pico:** 4.63 MWp\n- **Generación anual:** 4.1 GWh\n- **CO₂ evitado:** 1,540 t/año\n- **Empleos locales:** 47 directos en construcción · 9 permanentes en O&M\n- **Cubre:** 78% de la demanda eléctrica de la planta cacaotera\n\n## Cronograma cumplido\n\n1. Estudio de viabilidad y permisos (Q4 2024 → Q1 2025)\n2. Adquisición e instalación (Q2 2025 → Q3 2025)\n3. Comisionamiento y conexión al SIN (Q4 2025)\n4. Operación y validación on-chain (Q1 2026 en curso)\n\n## Validadores comunitarios\n\nCooperativa Energética de Oriente · UPB Facultad de Ingenierías · Mesa Ambiental de Rionegro.',
      fundingGoal: '450000000000',
      totalFunded: '450000000000',
      currentStage: 3,
      tags: ['solar', 'antioquia', 'rionegro', 'cacao', 'industrial', 'colombia'],
      metadataCid: 'QmAntioquiaSolarMeta20260512',
      imageCid: 'QmAntioquiaSolarHero20260512',
      txHash: '0xe5b8c2d39f0a1b4c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
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
  const antioquiaSolar = createdProjects.find((p) => p.onChainId === ONCHAIN_ANTIOQUIA)!;

  // ── Assets — Antioquia Solar (rich stage-by-stage gallery) ──────────────────
  const ANTIOQUIA_ASSET_BASE = '/seed/solar-antioquia';
  type AssetSeed = {
    stage: number;
    kind: 'IMAGE' | 'VIDEO' | 'EMBED';
    url: string;
    thumbnailUrl?: string;
    caption: string;
    description?: string;
    capturedAt: Date;
    sortOrder: number;
  };
  const antioquiaAssets: AssetSeed[] = [
    // Stage 0 — Feasibility & permits
    {
      stage: 0,
      kind: 'IMAGE',
      // pre-funding feasibility — bucketed under contract stage 0 (Funding root)
      url: `${ANTIOQUIA_ASSET_BASE}/stage0-1-feasibility-roof.jpg`,
      caption: 'Inspección inicial de cubierta industrial',
      description: 'Drone topográfico midiendo 2.1 ha de techo apto para soportar 4.6 MWp de paneles.',
      capturedAt: new Date('2024-11-04T14:30:00Z'),
      sortOrder: 1,
    },
    {
      stage: 0,
      kind: 'IMAGE',
      url: `${ANTIOQUIA_ASSET_BASE}/stage0-2-survey-team.jpg`,
      caption: 'Equipo técnico de Antioquia Solar Coop',
      description: 'Levantamiento estructural junto a UPB Facultad de Ingenierías. Permiso URBANO #2024-RIO-0481.',
      capturedAt: new Date('2024-12-12T09:10:00Z'),
      sortOrder: 2,
    },
    {
      stage: 0,
      kind: 'EMBED',
      url: 'https://www.youtube.com/embed/6bS2fTp2_Ug',
      thumbnailUrl: 'https://img.youtube.com/vi/6bS2fTp2_Ug/maxresdefault.jpg',
      caption: 'Cobertura Hora 13 Noticias — anuncio del proyecto',
      description: 'Teleantioquia reporta el segundo techo solar más grande de Colombia tras los permisos finales.',
      capturedAt: new Date('2024-12-20T13:28:00Z'),
      sortOrder: 3,
    },

    // Stage 1 — Procurement & install
    {
      stage: 1,
      kind: 'IMAGE',
      url: `${ANTIOQUIA_ASSET_BASE}/stage1-1-panel-delivery.jpg`,
      caption: 'Llegada de los primeros 1,200 paneles',
      description: 'Lote inicial de paneles bifaciales 550W. Trazabilidad on-chain por número de serie.',
      capturedAt: new Date('2025-04-08T07:45:00Z'),
      sortOrder: 1,
    },
    {
      stage: 1,
      kind: 'IMAGE',
      url: `${ANTIOQUIA_ASSET_BASE}/stage1-2-mounting.jpg`,
      caption: 'Instalación de estructura de montaje',
      description: 'Rieles de aluminio anclados con tornillería sismo-resistente. Avance día 47 de 92.',
      capturedAt: new Date('2025-06-21T11:20:00Z'),
      sortOrder: 2,
    },
    {
      stage: 1,
      kind: 'IMAGE',
      url: `${ANTIOQUIA_ASSET_BASE}/stage1-3-wiring.jpg`,
      caption: 'Cableado DC de string boxes',
      description: 'Combinadores DC con monitoreo por string. Cumplimiento RETIE auditado por revisor independiente.',
      capturedAt: new Date('2025-07-18T15:55:00Z'),
      sortOrder: 3,
    },

    // Stage 1 — Attest & release (construction + commissioning)
    {
      stage: 1,
      kind: 'IMAGE',
      url: `${ANTIOQUIA_ASSET_BASE}/stage2-1-aerial-array.jpg`,
      caption: 'Vista aérea del arreglo terminado',
      description: '8,420 paneles desplegados cubriendo 2.1 ha. Orientación azimutal 12° este, inclinación 10°.',
      capturedAt: new Date('2025-09-30T17:05:00Z'),
      sortOrder: 4,
    },
    {
      stage: 1,
      kind: 'IMAGE',
      url: `${ANTIOQUIA_ASSET_BASE}/stage2-2-inverter-room.jpg`,
      caption: 'Sala de inversores y SCADA',
      description: '6 inversores centrales 800 kW. SCADA reporta producción cada 60s al smart contract via oráculo Chainlink.',
      capturedAt: new Date('2025-10-22T10:40:00Z'),
      sortOrder: 5,
    },
    {
      stage: 1,
      kind: 'IMAGE',
      url: `${ANTIOQUIA_ASSET_BASE}/stage2-3-grid-commissioning.jpg`,
      caption: 'Sincronización con la red de EPM',
      description: 'Pruebas de conexión al SIN. Primera inyección exitosa el 14 nov 2025 a las 11:47 GMT-5.',
      capturedAt: new Date('2025-11-14T16:47:00Z'),
      sortOrder: 6,
    },

    // Stage 2 — Final canopy (operations + community impact)
    {
      stage: 2,
      kind: 'IMAGE',
      url: `${ANTIOQUIA_ASSET_BASE}/stage3-1-operations.jpg`,
      caption: 'Operación nominal — turno diurno',
      description: 'Producción promedio 11.4 MWh/día. Performance ratio 84.3%. Datos publicados on-chain cada 24h.',
      capturedAt: new Date('2026-02-09T13:15:00Z'),
      sortOrder: 1,
    },
    {
      stage: 2,
      kind: 'IMAGE',
      url: `${ANTIOQUIA_ASSET_BASE}/stage3-2-community-event.jpg`,
      caption: 'Inauguración comunitaria en Rionegro',
      description: 'Asistieron 340 vecinos, Alcaldía, validadores y backers. Distribución de cacao financiado por excedentes.',
      capturedAt: new Date('2026-03-15T19:00:00Z'),
      sortOrder: 2,
    },
    {
      stage: 2,
      kind: 'IMAGE',
      url: `${ANTIOQUIA_ASSET_BASE}/stage3-3-night-monitoring.jpg`,
      caption: 'Monitoreo 24/7 desde el centro de control',
      description: 'Operación remota con telemetría. Validadores firman release final tras 90 días de uptime sin incidentes.',
      capturedAt: new Date('2026-04-28T22:30:00Z'),
      sortOrder: 3,
    },
    {
      stage: 2,
      kind: 'EMBED',
      url: 'https://www.youtube.com/embed/6bS2fTp2_Ug',
      thumbnailUrl: 'https://img.youtube.com/vi/6bS2fTp2_Ug/hqdefault.jpg',
      caption: 'Reportaje de cierre — Hora 13 Noticias',
      description: 'Resumen de impacto: cacao sostenible, 47 empleos, 1.540 t CO₂ evitadas en el primer año.',
      capturedAt: new Date('2026-05-02T18:00:00Z'),
      sortOrder: 4,
    },
  ];

  // Replace assets for Antioquia project (idempotent)
  await prisma.projectAsset.deleteMany({ where: { projectId: antioquiaSolar.id } });
  await prisma.projectAsset.createMany({
    data: antioquiaAssets.map((a) => ({ ...a, projectId: antioquiaSolar.id })),
  });
  console.log(`✅ Assets creados para ${antioquiaSolar.title}: ${antioquiaAssets.length}`);

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
    // ── Antioquia Solar (fully funded, multi-backer) ─────────────────────────
    {
      projectId: antioquiaSolar.id,
      contributorAddress: greenInvestor.walletAddress,
      amount: '180000000000',
      txHash: '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
      blockNumber: 19_510_220,
    },
    {
      projectId: antioquiaSolar.id,
      contributorAddress: ecoWarrior.walletAddress,
      amount: '120000000000',
      txHash: '0xad1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
      blockNumber: 19_510_408,
    },
    {
      projectId: antioquiaSolar.id,
      contributorAddress: reefBuilder.walletAddress,
      amount: '90000000000',
      txHash: '0xbe2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
      blockNumber: 19_511_103,
    },
    {
      projectId: antioquiaSolar.id,
      contributorAddress: solarOperator.walletAddress,
      amount: '60000000000',
      txHash: '0xcf3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
      blockNumber: 19_511_847,
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
