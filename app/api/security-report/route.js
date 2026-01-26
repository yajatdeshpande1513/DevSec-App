import { NextResponse } from 'next/server';

// Note: In production, store this in MongoDB or Redis
let reportCache = { status: 'secure', message: 'All systems clear', timestamp: new Date().toISOString() };

export async function POST(request) {
  const data = await request.json();
  reportCache = data;
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(reportCache);
}