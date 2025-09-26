import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { vehicleSchema } from '@/lib/z';

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { plate: 'asc' } });
  return NextResponse.json({ vehicles });
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = vehicleSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const created = await prisma.vehicle.create({ data: parsed.data });
  return NextResponse.json({ vehicle: created }, { status: 201 });
}
