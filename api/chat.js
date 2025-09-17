import { put, list} from '@vercel/blob';
import { NextResponse} from 'next/server';

export async function GET() {
  const blobs = await list({ prefix: 'chat/'});
  const messages = [];

  for (const blob of blobs.blobs) {
    const res = await fetch(blob.url);
    const msg = await res.json();
    messages.push(msg);
}

  return NextResponse.json(messages);
}

export async function POST(req) {
  const { sender, text} = await req.json();
  const timestamp = Date.now();
  const filename = `chat/${timestamp}-${sender}.json`;

  const blob = await put(filename, JSON.stringify({ sender, text, timestamp}), {
    access: 'public',
});

  return NextResponse.json({ success: true, url: blob.url});
}
