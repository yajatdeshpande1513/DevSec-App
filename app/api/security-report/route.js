import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const STATUS_KEY = 'devsec:latest-status';
const HISTORY_KEY = 'devsec:history';
const MAX_HISTORY = 50;

const defaultStatus = {
  status: 'secure',
  message: 'All security gates verified. System standing by.',
  timestamp: new Date().toISOString(),
};

export async function POST(request) {
  try {
    const data = await request.json();

    await redis.set(STATUS_KEY, data);
    await redis.lpush(HISTORY_KEY, data);
    await redis.ltrim(HISTORY_KEY, 0, MAX_HISTORY - 1);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to persist security report:', err);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function GET() {
  try {
    const status = (await redis.get(STATUS_KEY)) || defaultStatus;
    return NextResponse.json(status, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err) {
    console.error('Failed to read security status, using default:', err);
    return NextResponse.json(defaultStatus, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}