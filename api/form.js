import { put, list} from '@vercel/blob';
import { NextResponse} from 'next/server';

const ALLOWED_ORIGIN = 'https://www.tax-centre.com'; // your frontend domain

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
},
});
}

export async function GET() {
  try {
    const blobs = await list({ prefix: 'forms/'});
    const submissions = [];

    for (const blob of blobs.blobs) {
      const res = await fetch(blob.url);
      const data = await res.json();
      submissions.push(data);
}

    return NextResponse.json(submissions, {
      headers: { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN},
});
} catch (error) {
    console.error("❌ GET /api/form error:", error);
    return NextResponse.json({ error: 'Server error'}, { status: 500});
}
}

export async function POST(req) {
  try {
    const formData = await req.json();
    const timestamp = Date.now();
    const filename = `forms/${timestamp}-submission.json`;

    const blob = await put(filename, JSON.stringify({...formData, timestamp}), {
      access: 'public',
});

    return NextResponse.json({ success: true, url: blob.url}, {
      headers: { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN},
});
} catch (error) {
    console.error("❌ POST /api/form error:", error);
    return NextResponse.json({ error: 'Server error'}, { status: 500});
}
}
