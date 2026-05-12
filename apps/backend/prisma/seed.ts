import prisma from '../src/lib/prisma.js';

async function main() {
  console.log('🌱 Iniciando el seeder de base de datos...');

  // 1. Crear Usuarios de prueba
  const user1 = await prisma.user.upsert({
    where: { walletAddress: '0x1234567890123456789012345678901234567890' },
    update: {},
    create: {
      walletAddress: '0x1234567890123456789012345678901234567890',
      displayName: 'EcoWarrior',
      bio: 'Apasionado por la reforestación y la energía solar.',
      twitterHandle: '@ecowarrior',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { walletAddress: '0x0987654321098765432109876543210987654321' },
    update: {},
    create: {
      walletAddress: '0x0987654321098765432109876543210987654321',
      displayName: 'GreenInvestor',
      bio: 'Invirtiendo en el futuro verde del planeta.',
    },
  });

  console.log(`✅ Usuarios creados: ${user1.displayName}, ${user2.displayName}`);

  // 2. Crear Proyectos de prueba
  // Nota: El ownerAddress será el de user1.
  const projectsData = [
    {
      onChainId: 101,
      ownerAddress: user1.walletAddress,
      title: 'Reforestación del Amazonas',
      description: 'Un proyecto a gran escala para replantar árboles nativos en zonas deforestadas del Amazonas.',
      readme: '# Reforestación del Amazonas\n\nEste proyecto busca restaurar 500 hectáreas de selva tropical...',
      fundingGoal: '5000000000', // $50,000 USDC (con 6 decimales usualmente, pero aquí guardamos el valor crudo en base units. Ej: 50000 * 10^6)
      totalFunded: '1500000000', // $15,000 USDC
      currentStage: 1, // En curso
      tags: ['reforestacion', 'amazonas', 'biodiversidad'],
      metadataCid: 'QmTestHashReforestacion123',
      imageCid: 'QmTestImageHashAmazonas123',
    },
    {
      onChainId: 102,
      ownerAddress: user2.walletAddress,
      title: 'Limpieza de Océanos del Pacífico',
      description: 'Implementación de redes de recolección de plástico autónomas en el océano Pacífico.',
      readme: '# Limpieza de Océanos\n\nVamos a instalar 10 drones acuáticos para recoger plástico.',
      fundingGoal: '20000000000', // $200,000 USDC
      totalFunded: '20000000000', // $200,000 USDC
      currentStage: 2, // Completado
      tags: ['oceanos', 'plastico', 'drones'],
      metadataCid: 'QmTestHashOceanos123',
      imageCid: 'QmTestImageHashOceano123',
    },
    {
      onChainId: 103,
      ownerAddress: user1.walletAddress,
      title: 'Energía Solar Comunitaria en Andes',
      description: 'Proveer paneles solares a 50 familias en comunidades aisladas de los Andes.',
      readme: '# Energía Solar Comunitaria\n\nLlevando luz a quienes más lo necesitan usando el poder del sol.',
      fundingGoal: '1000000000', // $10,000 USDC
      totalFunded: '0', // $0 USDC
      currentStage: 0, // Recién creado / Buscando fondos
      tags: ['solar', 'comunidad', 'andes'],
      metadataCid: 'QmTestHashSolar123',
      imageCid: 'QmTestImageHashSolar123',
    }
  ];

  for (const p of projectsData) {
    const project = await prisma.project.upsert({
      where: { onChainId: p.onChainId },
      update: {},
      create: p,
    });
    console.log(`✅ Proyecto creado: ${project.title}`);
  }

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
