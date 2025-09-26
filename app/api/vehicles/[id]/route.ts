import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { vehicleSchema } from '@/lib/z';

export async function GET(_: Request, { params }: any) {
  const v = await prisma.vehicle.findUnique({ where: { id: params.id } });
  if (!v) return new NextResponse('Not found', { status: 404 });
  return NextResponse.json({ vehicle: v });
}

export async function PUT(request: Request, { params }: any) {
  const json = await request.json();
  const parsed = vehicleSchema.partial().safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const v = await prisma.vehicle.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ vehicle: v });
}

export async function DELETE(_: Request, { params }: any) {
  await prisma.vehicle.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
