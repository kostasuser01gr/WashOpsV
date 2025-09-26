import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const [adminRole, managerRole, washerRole] = await Promise.all([
    prisma.role.upsert({ where: { name: 'Admin' }, create: { name: 'Admin' }, update: {} }),
    prisma.role.upsert({ where: { name: 'Manager' }, create: { name: 'Manager' }, update: {} }),
    prisma.role.upsert({ where: { name: 'Washer' }, create: { name: 'Washer' }, update: {} }),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@washopsv.dev' },
    update: {},
    create: { email: 'admin@washopsv.dev', name: 'Admin', roleId: adminRole.id },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@washopsv.dev' },
    update: {},
    create: { email: 'manager@washopsv.dev', name: 'Manager', roleId: managerRole.id },
  });

  const washer = await prisma.user.upsert({
    where: { email: 'washer@washopsv.dev' },
    update: {},
    create: { email: 'washer@washopsv.dev', name: 'Washer', roleId: washerRole.id },
  });

  const station = await prisma.station.upsert({
    where: { name: 'Main Station' },
    update: {},
    create: { name: 'Main Station', address: '123 Shine Ave' },
  });

  const vehicles = await prisma.$transaction([
    prisma.vehicle.upsert({
      where: { plate: 'WASH-001' },
      update: {},
      create: { plate: 'WASH-001', make: 'Tesla', model: 'Model 3', year: 2023 },
    }),
    prisma.vehicle.upsert({
      where: { plate: 'WASH-002' },
      update: {},
      create: { plate: 'WASH-002', make: 'BMW', model: 'i4', year: 2024 },
    }),
  ]);

  const wash1 = await prisma.washLog.create({
    data: {
      vehicleId: vehicles[0].id,
      washerId: washer.id,
      stationId: station.id,
      washDate: new Date(),
      photos: { create: [{ url: 'https://picsum.photos/seed/wash1/800/600' }] },
    },
  });

  await prisma.auditLog.create({
    data: { actorId: admin.id, action: 'SEED', entity: 'ALL', entityId: 'init' },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
