import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  // Demo reconcile: find vehicles without recent wash and suggest action
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
  const vehicles = await prisma.vehicle.findMany({
    where: {
      OR: [{ washLogs: { none: {} } }, { washLogs: { every: { washDate: { lt: since } } } }],
    },
    take: 20,
  });
  const suggestions = vehicles.map((v) => ({
    type: 'schedule-wash',
    vehicleId: v.id,
    reason: 'No wash in last 7 days',
  }));
  return NextResponse.json({ suggestions });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { apply } = body as { apply?: Array<{ type: string; vehicleId: string }> };
  if (!Array.isArray(apply))
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  await prisma.$transaction(
    apply.map((a) =>
      prisma.auditLog.create({
        data: { action: 'APPLY_RECONCILE', entity: 'Vehicle', entityId: a.vehicleId, meta: a },
      }),
    ),
  );
  return NextResponse.json({ ok: true });
}
