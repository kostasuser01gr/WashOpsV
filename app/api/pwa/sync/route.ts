import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Very minimal exactly-once semantics using idempotency keys stored in DB
export async function POST(request: Request) {
  const body = await request.json();
  const { idempotencyKey, type, payload } = body ?? {};
  if (!idempotencyKey || typeof idempotencyKey !== 'string') {
    return NextResponse.json({ error: 'Missing idempotencyKey' }, { status: 400 });
  }
  const exists = await prisma.idempotencyKey.findUnique({ where: { key: idempotencyKey } });
  if (exists) return NextResponse.json(exists.responseBody ?? { ok: true, reused: true });

  let result: unknown = { ok: true } as const;
  if (type === 'vehicle:create') {
    result = await prisma.vehicle.create({ data: payload });
  }
  await prisma.idempotencyKey.create({
    data: {
      key: idempotencyKey,
      method: 'POST',
      path: '/api/pwa/sync',
      requestHash: JSON.stringify(body),
      responseBody: result as unknown as import('@prisma/client').Prisma.InputJsonValue,
      status: 200,
    },
  });
  return NextResponse.json(result);
}
