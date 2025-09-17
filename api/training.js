import { list} from '@vercel/blob';
import { NextResponse} from 'next/server';

export async function GET() {
  const blobs = await list({ prefix: 'training/'});
  const trainingData = [];

  for (const blob of blobs.blobs) {
    const res = await fetch(blob.url);
    const entry = await res.json();
    trainingData.push(entry);
}

  return NextResponse.json(trainingData);
}
