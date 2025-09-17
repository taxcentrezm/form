import { del} from '@vercel/blob';
import { NextResponse} from 'next/server';

export async function DELETE(req) {
  const { searchParams} = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) return NextResponse.json({ error: 'Missing blob name'}, { status: 400});

  await del(name);
  return NextResponse.json({ success: true});
}
