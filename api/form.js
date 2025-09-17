import { put, list} from '@vercel/blob';
import { NextResponse} from 'next/server';

export async function GET() {
  const blobs = await list({ prefix: 'forms/'});
  const submissions = [];

  for (const blob of blobs.blobs) {
    const res = await fetch(blob.url);
    const data = await res.json();
    submissions.push(data);
}

  return NextResponse.json(submissions);
}

export async function POST(req) {
  const formData = await req.json();
  const timestamp = Date.now();
  const filename = `forms/${timestamp}-submission.json`;

  const blob = await put(filename, JSON.stringify({...formData, timestamp}), {
    access: 'public',
});

  return NextResponse.json({ success: true, url: blob.url});
}
