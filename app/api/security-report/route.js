import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { timingSafeEqual } from 'crypto';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const STATUS_KEY = 'devsec:latest-status';
const HISTORY_KEY = 'devsec:history';
const MAX_HISTORY = 50;
const MAX_MESSAGE_LENGTH = 500;

const defaultStatus = {
  status: 'secure',
  message: 'All security gates verified. System standing by.',
  timestamp: new Date().toISOString(),
};

function isRedisConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function safeCompare(a, b) {
  const bufA = Buffer.from(a ?? '');
  const bufB = Buffer.from(b ?? '');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request) {
  if (!isRedisConfigured()) {
    console.error('Missing Upstash Redis configuration');
    return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 });
  }
  try {
    const incomingSecret = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.REPORT_WEBHOOK_SECRET;
    if (!expectedSecret || !safeCompare(incomingSecret, expectedSecret)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    if (
      !data ||
      typeof data.status !== 'string' ||
      typeof data.message !== 'string' ||
      data.message.length > MAX_MESSAGE_LENGTH ||
      (data.gates !== undefined && (typeof data.gates !== 'object' || data.gates === null))
    ) {
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
  if (!isRedisConfigured()) {
    console.error('Missing Upstash Redis configuration');
    return NextResponse.json({ ...defaultStatus, history: [] }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  }
  try {
    const status = (await redis.get(STATUS_KEY)) || defaultStatus;
    const history = (await redis.lrange(HISTORY_KEY, 0, 9)) || [];
    return NextResponse.json({ ...status, history }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (err) {
    console.error('Failed to read security status, using default:', err);
    return NextResponse.json({ ...defaultStatus, history: [] }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  }
}
