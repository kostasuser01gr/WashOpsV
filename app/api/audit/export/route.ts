import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } });
  const lines = logs.map((l) => JSON.stringify(l)).join('\n');
  return new NextResponse(lines, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Content-Disposition': 'attachment; filename="audit.ndjson"',
    },
  });
}
