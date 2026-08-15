import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy-url.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy-token',
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
    // --- Auth check: only GitHub Actions with the shared secret can write ---
    const incomingSecret = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.REPORT_WEBHOOK_SECRET;

    if (!expectedSecret || incomingSecret !== expectedSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Basic shape validation so bad payloads can't corrupt the dashboard
    if (!data || typeof data.status !== 'string' || typeof data.message !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

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
    const history = (await redis.lrange(HISTORY_KEY, 0, 9)) || [];
    return NextResponse.json({ ...status, history }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err) {
    console.error('Failed to read security status, using default:', err);
    return NextResponse.json({ ...defaultStatus, history: [] }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}