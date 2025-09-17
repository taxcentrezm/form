import { put, list} from '@vercel/blob';

const ALLOWED_ORIGIN = 'https://www.tax-centre.com'; // your frontend domain

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
},
});
}

export async function POST(req) {
  try {
    const formData = await req.json();
    const timestamp = Date.now();
    const filename = `forms/${timestamp}-submission.json`;

    const blob = await put(filename, JSON.stringify({...formData, timestamp}), {
      access: 'public',
});

    return new Response(JSON.stringify({ success: true, url: blob.url}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
},
});
} catch (error) {
    console.error("❌ POST error:", error);
    return new Response(JSON.stringify({ error: 'Server error'}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
},
});
}
}
