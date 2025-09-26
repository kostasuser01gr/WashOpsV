import { NextResponse } from 'next/server';
import { createUploadUrl } from '@/lib/blob';

export async function POST(request: Request) {
  const { hint } = await request.json().catch(() => ({ hint: 'wash-photo' }));
  const url = await createUploadUrl(hint || 'wash-photo');
  return NextResponse.json({ url });
}
