import { NextResponse } from 'next/server';

let statusStore = { 
  status: 'secure', 
  message: 'All systems clear', 
  timestamp: new Date().toLocaleTimeString() 
};

export async function POST(request) {
  const data = await request.json();
  statusStore = { 
    ...data, 
    timestamp: new Date().toLocaleTimeString() 
  };
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(statusStore, {
    headers: { 'Cache-Control': 'no-store, max-age=0' }
  });
}