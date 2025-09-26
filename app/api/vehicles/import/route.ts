import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('text/csv')) {
    const text = await request.text();
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    const [header, ...rows] = lines;
    const cols = header.split(',').map((c) => c.trim().toLowerCase());
    const plateIdx = cols.indexOf('plate');
    if (plateIdx === -1)
      return NextResponse.json({ error: 'Missing plate column' }, { status: 400 });
    const promises = rows
      .map((r) => {
        const parts = r.split(',');
        const plate = parts[plateIdx]?.trim();
        const make = (parts[cols.indexOf('make')] || '').trim() || undefined;
        const model = (parts[cols.indexOf('model')] || '').trim() || undefined;
        const yearStr = (parts[cols.indexOf('year')] || '').trim();
        const year = yearStr ? Number(yearStr) : undefined;
        if (!plate) return null;
        return prisma.vehicle.upsert({
          where: { plate },
          update: { make, model, year },
          create: { plate, make, model, year },
        });
      })
      .filter(Boolean) as Promise<unknown>[];
    const results = await Promise.all(promises);
    return NextResponse.json({ imported: results.length });
  }
  // JSON fallback
  const json = await request.json();
  if (!Array.isArray(json)) return NextResponse.json({ error: 'Expected array' }, { status: 400 });
  const tx = await prisma.$transaction(
    json.map((v) => prisma.vehicle.upsert({ where: { plate: v.plate }, update: v, create: v })),
  );
  return NextResponse.json({ imported: tx.length });
}
