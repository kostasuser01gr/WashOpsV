import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { washCreateSchema } from '@/lib/z';

function hashBody(body: unknown): string {
  return JSON.stringify(body);
}

export async function GET() {
  const items = await prisma.washLog.findMany({ include: { vehicle: true, washer: true } });
  return NextResponse.json({ washes: items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = washCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const { idempotencyKey } = parsed.data;
  const requestHash = hashBody(parsed.data);
  const existing = await prisma.idempotencyKey.findUnique({ where: { key: idempotencyKey } });
  if (existing) {
    return NextResponse.json(existing.responseBody ?? { ok: true, reused: true }, {
      status: existing.status ?? 200,
    });
  }
  try {
    const created = await prisma.$transaction(async (tx) => {
      const wash = await tx.washLog.create({
        data: {
          vehicleId: parsed.data.vehicleId,
          washerId: parsed.data.washerId,
          stationId: parsed.data.stationId,
          washDate: new Date(parsed.data.washDate),
        },
      });
      return wash;
    });
    const responseJson = { wash: created };
    await prisma.idempotencyKey.create({
      data: {
        key: idempotencyKey,
        method: 'POST',
        path: '/api/washes',
        requestHash,
        responseBody: responseJson,
        status: 201,
      },
    });
    return NextResponse.json(responseJson, { status: 201 });
  } catch (_e) {
    await prisma.idempotencyKey.create({
      data: {
        key: idempotencyKey,
        method: 'POST',
        path: '/api/washes',
        requestHash,
        status: 500,
      },
    });
    return NextResponse.json({ error: 'Failed to create wash' }, { status: 500 });
  }
}
