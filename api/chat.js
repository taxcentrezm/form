import { put, list} from '@vercel/blob';
import { NextResponse} from 'next/server';

export async function GET() {
  try {
    const blobs = await list({ prefix: 'chat/'});
    const messages = [];

    for (const blob of blobs.blobs) {
      const res = await fetch(blob.url);
      const msg = await res.json();
      messages.push(msg);
}

    return NextResponse.json(messages);
} catch (error) {
    console.error("❌ Error in GET /api/chat:", error);
    return NextResponse.json({ error: 'Failed to load chat messages'}, { status: 500});
}
}

export async function POST(req) {
  try {
    const { sender, text} = await req.json();
    if (!sender ||!text) {
      return NextResponse.json({ error: 'Missing sender or text'}, { status: 400});
}

    const timestamp = Date.now();
    const filename = `chat/${timestamp}-${sender}.json`;

    const blob = await put(filename, JSON.stringify({ sender, text, timestamp}), {
      access: 'public',
});

    return NextResponse.json({ success: true, url: blob.url});
} catch (error) {
    console.error("❌ Error in POST /api/chat:", error);
    return NextResponse.json({ error: 'Failed to save chat message'}, { status: 500});
}
}
