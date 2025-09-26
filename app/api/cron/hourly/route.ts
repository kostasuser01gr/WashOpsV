import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const ua = request.headers.get('user-agent') || '';
  if (ua !== 'vercel-cron/1.0') {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.json({ ok: true, ran: 'hourly' });
}
