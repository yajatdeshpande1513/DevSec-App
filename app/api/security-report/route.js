import { NextResponse } from 'next/server';

// This acts as our temporary "in-memory" database
let securityStatus = { 
  status: 'secure', 
  message: 'All security gates verified. System standing by.', 
  timestamp: new Date().toISOString() 
};

export async function POST(request) {
  try {
    const data = await request.json();
    securityStatus = data;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(securityStatus, {
    headers: { 'Cache-Control': 'no-store, max-age=0' }
  });
}