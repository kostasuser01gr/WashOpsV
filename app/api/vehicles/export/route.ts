import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { plate: 'asc' } });
  const header = 'plate,make,model,year\n';
  const rows = vehicles
    .map((v) => [v.plate, v.make ?? '', v.model ?? '', v.year?.toString() ?? ''].join(','))
    .join('\n');
  return new NextResponse(header + rows, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="vehicles.csv"',
    },
  });
}
